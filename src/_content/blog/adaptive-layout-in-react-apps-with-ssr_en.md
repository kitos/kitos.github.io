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

While working on migration of part our [main web-site](https://tourlane.de) to [gatsby](http://gatsbyjs.org), we faced really weird problem: one of a links in navigation menu wasn't styled on initial load. It was reproducible only on the desktop.

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

## Verdict

Do you see a problem here?

* [react-media](https://github.com/ReactTraining/react-media) is used is used to make serve different markup for desktop and mobile
* we are migrating our app to _gatsby_, which means all our pages are statically built (SSR is happening during build time). And on this stage, we obviously do not have any information about _width_ of the screen. By default `react-media` matches all media queries, so in our case we build mobile layout.

This results in next workflow:

1. desktop browser requests page and receive mobile html (user sees it on first contentful paint)
2. react messes up DOM during _hydration_ (absolutely legally, since we produced 2 different trees on the _"server"_ and client)

## How to fix this?

To avoid such problems we can:

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
