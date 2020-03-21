---
slug: enjoy-the-little-things
lang: en
title: Enjoy the little things
date: 2020-03-20T17:30:51.536Z
thumbnail:
  author: Mats Speicher
  img: /images/uploads/enjoy.jpg
  src: 'https://unsplash.com/photos/FxGoXaib51Q'
tags:
  - reactjs
  - preact
  - react-spring
  - emoji
  - animation
  - fun
preface: >-
  Well, looks like now, with all this self isolation caused by COVID-19, I'll
  have some time to code and maybe even to write a couple of articles about it.
  This one will be the first one. In it I'm gonna play with react-spring to
  create simple digital clock animation.
---
Well, looks like now, during self isolation caused by COVID-19 🦠, I'll have some time to code and maybe even to write a couple of articles about it (code). This one is the first one, in it I'm gonna play with `react-spring` to create simple digital clock animation like this:

![Animated digital clock](/images/uploads/digital-clock.gif "Animated digital clock")

## Small things matter

How did I come up with this idea? I was just bored, started to check my pet projects, settled on [my game of life](https://kitos.github.io/game-of-life/), considered its UI to be uneventful and decided that it might be good idea to add some emojis, cause everybody like them 😋!

Implementation of this small component doesn't sound like a rocket science, but I will do my best to touch some interesting topics here, and after all I enjoined the process. And it is actually funny to realise that after more than 6 years of coding, participating in pretty complex projects and trying different technologies I still can take pleasure in things event smaller than this clock. I hope everyone can find a field where they can do it as well.

## First building blocks

Let's start with something really simple lets build a component which can render a numeral using emojis like this: 4️⃣2️⃣:

```jsx
let emojiDigits = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

let EmojiNumber = ({ value }) => (
  <div>
    {value
      .toString()
      .split('')
      .map((n, i) => (
        <span key={i}>{emojiDigits[n]}</span>
      ))}
  </div>
);
```

Nothing special except maybe they *key*: most of the time we [use some *id* as *key*](https://reactjs.org/docs/lists-and-keys.html#keys) and [trying to avoid using index](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318) cause it kinda kills the idea - react won't be able to optimize DOM update, e.g. by moving element instead of deletition and constructing new one in another place. But in our example order/index is the only thing that matters - the order of digits in numbers is important, isn't it?

Having this small component we can already render current time:

```jsx
// expect value to be an instance of Date
let Time = ({ value }) => (
  <div style={{ display: 'flex' }}>
    <EmojiNumber value={value.getHours()} />
    :
    <EmojiNumber value={value.getMinutes()} />
    :
    <EmojiNumber value={value.getSeconds()} />
    :
    <EmojiNumber value={value.getMilliseconds()} />
  </div>
)
```

Easy, but the implementation has a bug 🐛, did you notice it?

For time `03:05:09` it will render 3️⃣: 5️⃣: 9️⃣, while I would expect 0️⃣3️⃣: 0️⃣5️⃣: 0️⃣9️⃣ . Let's fix it with `padTime` *function*:

```jsx
// highlight-next-line
let padTime = (t, l = 2) => t.toString().padStart(l, '0')

let Time = ({ value }) => (
  <div style={{ display: 'flex' }}>
    // highlight-next-line
    <EmojiNumber value={padTime(value.getHours())} />
    :
    // highlight-next-line
    <EmojiNumber value={padTime(value.getMinutes())} />
    :
    // highlight-next-line
    <EmojiNumber value={padTime(value.getSeconds())} />
  </div>
)
```

Time to make it dynamic:

```jsx
let CurrentTime = () => {
  let [now, setNow] = useState(new Date())

  useEffect(() => {
    let tid = setInterval(() => setNow(new Date()), 1000)

    return () => clearInterval(tid)
  }, [setNow])

  return <Time value={now} />
}
```

Since we are trying to make some take-away out of this article, let's extract custom hook out of `jsx±<CurrentTime/>`:

```jsx
 // highlight-start
let useIntervalValue = (factory, interval) => {
  let [value, set] = useState(factory)

  useEffect(() => {
    let tid = setInterval(() => set(factory), interval)

    return () => clearInterval(tid)
  },
  // ⚠️ we intententionally ignored 'factory' in dependencies array (for the sake of simplicity)
  // so it won't be updated with rerenders (simular to useState initializer)
  // while we could add deps argument to this hook to be able to update 'factory'
  [interval])

  return value
}
 // highlight-end

let CurrentTime = () => {
  // highlight-next-line
  let now = useIntervalValue(() => new Date(), 1000)

  return <Time value={now} />
}
```

Power of composition! So far we've built so simple *"app"*, yet it consists of 5 blocks (components/functions). Composition is definitely one of the strongest part of *react* especially after *hooks* were released.

Let's look at the result:

![Digital clock with emoji](/images/uploads/no-animation-digital-clock.gif "Digital clock with emoji")

## Time to animate

Event though our clock already looks pretty decent, we was going to add a fancy animation to it. So let's do it!

The best library for animation in react I know is [react-spring](https://github.com/react-spring/react-spring), and I already have [an example with it](/blog/implementing-medium-like-tooltip/). And I am gonna use it again.

Here we are going to animate update of every emoji separately using [useTransition](https://www.react-spring.io/docs/hooks/use-transition) hook. Time for a new component?

```jsx
// children can be any react element
let Waterfall = ({ children }) => {
  let transitions = useTransition(children, null, {
    from: {
      position: 'absolute',
      top: 0,
      left: 0,
      transform: 'translate3d(0,-100%,0)',
      opacity: 0
    },
    enter: { transform: 'translate3d(0,0,0)', opacity: 1 },
    leave: { transform: 'translate3d(0,60%,0)', opacity: 0 }
  })

  return (
    /* we will render animated blocks relative to this container */
    <div style={{ position: 'relative' }}>
      {/* we need one hidden extra block in normal flow to preserve space */}
      <div style={{ visibility: 'hidden' }}>{children}</div>

      {transitions.map(({ key, item, props }) => (
        <animated.div key={key} style={props}>
          {item}
        </animated.div>
      ))}
    </div>
  )
}
```

Now we can animate our emoji number using this component 🎉:

```jsx
// highlight-next-line
let AnimatedEmojiNumber = ({ value }) => (
  <div style={{ display: 'flex' }}>
    {value
      .toString()
      .split('')
      .map((n, i) => (
        // highlight-next-line
        <Waterfall key={i} children={emojiDigits[n]} />
      ))}
  </div>
)
```

And full result you can find here:

codesandbox expample
