---
slug: load-everything-lazily-with-intersectionobserver
lang: en
title: Load everything lazily with IntersectionObserver
date: 2019-01-23T21:52:08.746Z
thumbnail:
  author: Erik-Jan Leusink
  img: /images/uploads/lazy.jpg
  src: 'https://unsplash.com/@ejleusink'
tags:
  - reactjs
  - react-hooks
  - web-api
preface: >-
  I believe it is clear for every web developer that we should care about size
  and amount of resources we load to a client (browser). Let's have a look at a
  simple technique we can use to improve initial load of web pages.
---

Just after I've released [1.8](https://www.nikitakirsanov.com/changelog/) version of site and published post [Implementing medium like tooltip](https://www.nikitakirsanov.com/blog/implementing-medium-like-tooltip/), I had understood its page loads 6 mb! And it is absolutely inappropriate for my blazing fast site. The most significant change of this release was integration with [codesandbox](https://codesandbox.io): all embedded links to it are transformed to iframes. Results I've got in _network_ tab of chrome dev tools also had met my expectations: most of resources were loaded by iframes.

Obvious solution is to load iframes lazily - when they appear in the viewport. So here is a code I came up with:

First of all rename src attribute of iframe to something else (e.g. data-src), so it won't load anything during initial render.

```html{2}
<iframe data-src="https://nikitakirsanov.com"> </iframe>
```

And insert src when iframe intersects with viewport:

```js
// react hooks fits perfect for extracting
// such type (not only) of reusable logic
let useLazyIframe = () =>
  // we need to register our observer after our component mounted
  useEffect(
    () => {
      let observer = new IntersectionObserver(
        entries => {
          entries
            // filter only visible iframes
            .filter(e => e.isIntersecting)
            .forEach(({ target: $el }) => {
              // iframe will start loading now
              $el.setAttribute('src', $el.getAttribute('data-src'))
              // no need to observe it anymore
              observer.unobserve($el)
            })
        },
        {
          // we'll load iframe a bit beforehand
          rootMargin: '10%',
        }
      )

      document
        .querySelectorAll('iframe[data-src]')
        .forEach($el => observer.observe($el))

      // do not forget to clean up on component unmount
      return () => observer.disconnect()
    },
    [
      /* we need to register observer once */
    ]
  )
```

That's it!

**Read more:**

[Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

[IntersectionObserver’s Coming into View](https://developers.google.com/web/updates/2016/04/intersectionobserver)

[React hooks overview](https://reactjs.org/docs/hooks-overview.html)
