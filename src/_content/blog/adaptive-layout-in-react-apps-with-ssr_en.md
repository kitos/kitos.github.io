---
slug: adaptive-layout-in-react-apps-with-ssr
lang: en
title: React SSR pitfalls in building adaptive layouts
date: 2019-10-06T09:40:47.668Z
thumbnail: /images/uploads/tourlane-ssr.jpg
tags:
  - reactjs
  - SSR
  - gatsbyjs
  - adaptive-layout
  - css-media-queries
preface: >-
  Небольшая история о том, с какими проблемами мы столкнулись при использовании
  адаптивной раскладки в статическом приложении. И какие практики стоит
  использовать для их избежания.
---
## Mystique

While working on migration of part our [main web-site](https://tourlane.de) to [gatsby](http://gatsbyjs.org), we faced really weird problem: one of a links in navigation menu wasn't styled on initial load.

![Navigation menu with unstyled link](/images/uploads/broken-link.jpg "Unstyled link")

Once you opened some other page (using client-side routing), styles get in place 🤯.

The fact that component, responsible for this menu, worked absolutely fine in the old app (which is using _nextjs_), made everything even more weird 👻.

## Investigation

Without a second thought I opened DOM inspector and discovered that this link had css-classes related to mobile menu, while I was obviously on the desktop 🤪.

_"React messes up DOM during_ [_hydration_](https://ru.reactjs.org/docs/react-dom.html#hydrate)_"_ - I thought to myself. It was hard to believe: such crucial issue should have been discovered long time ago, and everything is fine IN THE OLD APP.

I revised hydration contract:

> React expects that the rendered content is identical between the server and the client.

I dig into source code of the component 🕵️‍♂️:

```jsx
// simplified NavBar.js
import React from 'react'
import Media from 'react-media'

export const NavBar = () => (
  <Media queries={{ maxWidth: 599 }}>
    {matches =>
      matches
        ? <MobileNav />
        : <DesktopNav />
    }
  </Media>
)
```

## Вердикт

Видите здесь проблему?

* В компоненте используется [react-media](https://github.com/ReactTraining/react-media) за счёт которого для мобильных и десктопных экранов отдаётся разная разметка
* Мы переходим на статическую генерацию страниц (используем _gatsby_), т.е. SSR у нас происходит во время сборки сайта. И на этом этапе мы, конечно, не знаем на каком устройстве будет отображаться страница, а `react-media` при SSR по умолчанию считает все медиа запросы истинными (в нашем случае отдаст мобильную разметку).
* Ну и получается, что пользователь с большим экраном:
  1. открывает страницу и получает с сервера html c мобильной вёрсткой (непродолжительное время видит её)
  2. видит десктопный лейаут с нестилизованной ссылкой, т.к. во время _гидрации_ react генерирует кашу из 2-х разных лейаутов

## Как быть?

Чтобы избежать таких проблем нужно:

* Отдавать предпочтение обычным css медиа выражениям.\
  \
  Даже если с помощью CSS не получается привести одну и ту же разметку к необходимому виду на разных устройствах, можно разделить и DOM под разные разрешения/устройства и одновременно выдать все варианты, а с помощью медиа выражений отображать нужные:
  ```jsx
    let DesktopOnly = styled.div`
      @media (max-width: 599px) {
        display: none;
      }
    `

    let MobileOnly = styled.div`...`

    export const NavBar = () => (
      <>
        <MobileOnly>
          <MobileNav />
        </MobileOnly>

        <DesktopOnly>
          <DesktopNav />
        </DesktopOnly>
      </>
  )
  ```
    В этом случае вы сможете не только избежать проблем с гидрацией, но и пользователь получит лучший опыт при работе с вашим сайтом: разметка не будет прыгать при загрузке. Т.к. браузер ещё до исполнения JavaScript отрисует сайт согласно CSS и HTML, а гидрация лишь вдохнёт в него жизнь.
* В случае когда прибегнуть к вышеупомянутому подходу нельзя - прибегнуть к использованию `react-media` и аналогичных решений. Например когда:
  * может пострадать SEO (не сталкивался с подобной проблемой, но подозреваю что дублирование контента, увеличение размера страницы... может к этому привести. напишите в комментариях, если знаете кейсы)
  * может пострадать производительность (например для десктопа вы отображаете какой-то сложный элемент)
    **ВНИМАНИЕ!** Обязательно измеряйте производительность перед тем как делать подобные оптимизации. Факт того, что react'у придётся отрисовать на 50 html-блоков, не должен вас пугать.
  * может пострадать что-то ещё 🤷‍♂️

А как же проблема с гидрацией при использовании второго подхода?

Как я заметил в начале, эта проблема не могла остаться незамеченной и решение у неё есть - отрисовка в 2 прохода:

* выберете раскладку которую хотите использовать по умолчанию:
  * если вы используете не статический сайт, то можете выбрать его на основе _User Agent_
  * для статических сайтов можете отталкиваться от статистики использования вашего сайта
* рендерите это состояние во время серверной отрисовки и гидрации
* запускаете дополнительную перерисовку на клиенте, если актуальное состояние отличается от того, что предполагали

Официальная документация [предлагает](https://ru.reactjs.org/docs/react-dom.html#hydrate) использовать для этого флаг в стейте, и `react-media` [такое умеет](https://github.com/ReactTraining/react-media#server-side-rendering-ssr), нужно лишь указать свойство `defaultMatches`:

```jsx{3-8}
export const NavBar = () => (
  <Media
    queries={{ mobile: { maxWidth: 599 } }}
    // мы знаем что большинство наших пользователей
    // используют мобильные устройства
    defaultMatches={{ mobile: true }}>
    {matches =>
      matches.mobile
        ? <MobileNav />
        : <DesktopNav />
    }
  </Media>
)
```

### З.Ы.

"А почему же мы не столкнулись с этой проблемой в старом приложении?" - заметит внимательный читатель. Действительно, ведь оно тоже использует SSR и не использует знание о браузере (_User Agent_). Если честно, я не стал тревожить легаси проект, чтобы познать его тайну 💀. Но полагаю, что дело в какой-нидь лишней перерисовке которая инициируется вышележащими компонентами.
