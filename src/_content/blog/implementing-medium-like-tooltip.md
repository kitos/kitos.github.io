---
slug: implementing-medium-like-tooltip
lang: en
title: Implementing medium like tooltip
date: 2019-01-20T21:52:08.746Z
thumbnail:
  author: Markus Spiske
  img: /uploads/reflection-unsplash.jpg
  src: 'https://unsplash.com/@markusspiske'
tags:
  - reactjs
  - render-props
  - web-api
preface: >-
  Do you know that if you select post text on medium a tooltip with several
  options (tweet, highlight...) will appear? Have you used it? I would like to
  tell you how to create similar one and about DOM API I've learned during
  implementation.
---

It might (and should) look like quite a trivial thing to implement. But still there are some pitfalls, so I want to tell how to avoid them, what libraries and patterns can help. And again to strengthen my English 😁

## Positioning is not easy

Here is a list of problems commonly faced when dealing with popups:

- how to position element relative to some other one
- how to position element over everything else aka _z-index: 999;_
- take into account viewport borders
- handle scrolling

Fortunately we live in open source era, so there is plenty of ready solutions. E.g. [react-popper](https://github.com/FezVrasta/react-popper) - library that takes care about all positioning issues. I've already used it in my previous projects and was satisfied. So I'll use it here as well.

Let's try to create simple popup using it:

[popper-example](embedded-codesandbox://implementing-medium-like-tooltip/popper)

By the way, its api should be more neat [with hooks](https://github.com/FezVrasta/react-popper/issues/241).

As you can see, _react-popper_ solved all problems I've mentioned above:

- calculated position of popup relative to input
- positioned it using _translate3d _(you can also use position fixed or even [portals](https://reactjs.org/docs/portals.html) in case you are using overflow...)
- took into account viewport and handles scrolling

## Let's make it bit more complex

To tell the truth, it is not the end of our positioning journey: the tooltip should appear next to the selected text, not its DOM node (cause it might be huge paragraph).

Any ideas how we can accomplish that? A couple of questions to google and boom - browser has a [selection api](https://developer.mozilla.org/en-US/docs/Web/API/Selection). With its help we can get access to parts of text nodes - [Ranges](https://developer.mozilla.org/en-US/docs/Web/API/Range).

Let's look at how we can apply this api:

```jsx
let handleMouseUp = () => {
  let selection = window.getSelection()

  // we do not need "empty" selection
  if (!selection.isCollapsed) {
    let range = selection.getRangeAt(0)

    // now we know where to render tooltip
    range.getBoundingClientRect()
  }
}
```

Here is a demo:

[selection-api](embedded-codesandbox://implementing-medium-like-tooltip/selection-api)

Well looks cool, but how can we attach that to _react-popper_? It expects to get a ref to DOM node...

Its documentation has an answer - [we should create "virtual" DOM node](https://github.com/FezVrasta/react-popper#usage-without-a-reference-htmlelement):

```js
// we are implementing methods required for react-popper
class VirtualSelectionReference {
  constructor(selection) {
    this.selection = selection
  }

  getBoundingClientRect() {
    return this.selection.getRangeAt(0).getBoundingClientRect()
  }

  get clientWidth() {
    return this.getBoundingClientRect().width
  }

  get clientHeight() {
    return this.getBoundingClientRect().height
  }
}
```

It's time to bring everything together:

```jsx
let SelectionReference = ({ onSelect, children }) => (
  <Reference>
    {({ ref }) =>
      // 1. more handy api
      children(function getProps({ onMouseUp, ...rest } = {}) ({
        ...rest,
        onMouseUp: (...args) => {
          let selection = window.getSelection()

          if (!selection.isCollapsed) {
            // 2. feed it to react-popper
            ref(new VirtualSelectionReference(selection))
            // 3. handy method
            onSelect && onSelect(selection, ...args)
          }

          // 1. user of our component might want to use this event too
          onMouseUp && onMouseUp(...args)
        },
      }))
    }
  </Reference>
)
```

Let's review the solution step by step:

1. We've created special _SelectionReference_ component by wrapping original one.
   It has same signature with one exception: children function (aka [render prop](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce)) will receive function instead of object - it is known as [get props pattern](https://blog.kentcdodds.com/how-to-give-rendering-control-to-users-with-prop-getters-549eaef76acf). The main benefit of it here is that our component taking care of merging its own props (_onMouseUp_ handler) with props we might want to provide when outside.
2. We've fed our "fake" DOM node to original _Reference \_component_.\_
3. We've created handy _onSelect_ event, which we'll use later.

That's it! now we can use our component to position tooltip:

[medium-like-tooptip_popper+selection-api](embedded-codesandbox://implementing-medium-like-tooltip/all-together)

## Cherry on top

This guide would be incomplete if we won't animate appearance of tooltip. And again I will use proven solution - [react-spring](https://github.com/react-spring/react-spring).

All we need is to wrap our tooltip into _Transition_ (it animates component lifecycles). So we'll get composition of 2 _render prop_ components:

```jsx
// our component should be totally reusable so
// 1. we manage its state (isOpen) outside
// 2. we receive content (children) from outside as well
let Tooltip = ({ isOpen, children }) => (
  <Popper>
    {/* Popper provides styles for positioning */}
    {({ ref, style }) => (
      <Transition
        items={isOpen}
        from={{ transform: `translateY(30px) scale(0.9)`, opacity: 0 }}
        enter={{ transform: `translateY(0) scale(1)`, opacity: 1 }}
        leave={{ transform: `translateY(30px) scale(0.9)`, opacity: 0 }}
      >
        {/* we should use flag provided by Transition to make animation work */}
        {transitionIsOpen =>
          transitionIsOpen &&
          (transitionStyle => (
            // and here is styles provided by react-spring to animate appearance
            <div ref={ref} style={style}>
              <SomeStyledTooltip style={transitionStyle}>
                {children}
              </SomeStyledTooltip>
            </div>
          ))
        }
      </Transition>
    )}
  </Popper>
)
```

It is a bit simplified code, full version of it you can find [here](https://github.com/kitos/kitos.github.io/blob/develop/src/components/tooltip/tooltip.js). And, by the way, you can see the demo by selecting any text in this (any any other) blog post 😏.

That is all I wanted to share for now. I hope you found this article useful.
