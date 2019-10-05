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

* prefer regular css media queries to [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)\
  \
  Even if you cannot style same piece of html to fit your adaptive design, you can _"duplicate"_ it (html) and display one _"copy"_ per breakpoint.

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
  In this case not only you will avoid problems with _hydration_, but also end-user will get better experience: there will be no layout flickering during page load, since browser will render the page according to your html/css, and hydration will give it life.

* only in case the approach above doesn't work for you, use `react-media` (or similar solutions). E.g.:
  * SEO might suffer (I haven't faced such problems, but I assume that duplication of content, its growth... can influence it 💁‍♂️. Write a comment if you are aware of such cases)
  * performance might suffer, in case you render some complex element only for the desktop.

    **ATTENTION PLEASE!** Do not optimize prematurely! Always measure performance before you introduce any improvements. The fact that _react_ will have to render 50 more html elements shouldn't bother you.
  * something else might suffer 🤷‍♂️

But what about problems with hydration we experienced using second approach?

Well, as I mentioned at the beginning, such issue shouldn't have been left out, so it has a solution - two-pass rendering:

* choose a default layout you'd like to use by default:
  * if you are using runtime SSR, you can do it based on _User Agent_
  * for static sites based on usage statistics (in most cases it should be mobile, since devices are less performant, and it doesn't make sense to make them render tree twice)
  * render three using this default during SSR and client hydration
  * run an extra render in case actual layout didn't match default one

Official documentation [suggests](https://ru.reactjs.org/docs/react-dom.html#hydrate) to use state variable to implement this and `react-media` also [supports this](https://github.com/ReactTraining/react-media#server-side-rendering-ssr) via `defaultMatches` prop:

```jsx{3-6}
export const NavBar = () => (
  <Media
    queries={{ mobile: { maxWidth: 599 } }}
    defaultMatches={{ mobile: true }}>
    {matches =>
      matches.mobile
        ? <MobileNav />
        : <DesktopNav />
    }
  </Media>
)
```

### P.S.

"Why didn't you experience the same issue in your old app?" - a careful reader might wonder 🤨. Indeed we use SSR there as well and do not use knowledge about browser (_User Agent_). To be honest, I didn't dig into legacy project in order to learn its secrets. But I guess it's about some extra render initiated by parent components 😬.
