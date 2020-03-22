import React, { useState, useEffect, memo } from 'react'
import { render } from 'react-dom'
import { animated, useTransition } from 'react-spring'

let Waterfall = ({ children }) => {
  let transitions = useTransition(children, null, {
    from: {
      position: 'absolute',
      top: 0,
      left: 0,
      transform: 'translate3d(0,-100%,0) scale(0.9)',
      opacity: 0,
    },
    enter: { transform: 'translate3d(0,0,0) scale(1)', opacity: 1 },
    leave: { transform: 'translate3d(0,60%,0) scale(0.7)', opacity: 0 },
  })

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ visibility: 'hidden' }}>{children}</div>

      {transitions.map(({ key, item, props }) => (
        <animated.div key={key} style={props}>
          {item}
        </animated.div>
      ))}
    </div>
  )
}

let emojiDigits = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']

let AnimatedEmojiNumber = memo(({ value }) => (
  <div style={{ display: 'flex' }}>
    {value
      .toString()
      .split('')
      .map((n, i) => (
        <Waterfall key={i} children={emojiDigits[n]} />
      ))}
  </div>
))

// some magic alignment
let Separator = () => <b style={{ margin: '0 5px 0 2px' }}>:</b>

let padTime = (t, l = 2) => t.toString().padStart(l, '0')

let Time = ({ value }) => (
  <div style={{ display: 'flex', alignItems: 'baseline' }}>
    <AnimatedEmojiNumber value={padTime(value.getHours())} />
    <Separator />
    <AnimatedEmojiNumber value={padTime(value.getMinutes())} />
    <Separator />
    <AnimatedEmojiNumber value={padTime(value.getSeconds())} />
    <Separator />
    <AnimatedEmojiNumber value={padTime(value.getMilliseconds(), 3)} />
  </div>
)

let useIntervalValue = (factory, interval) => {
  let [value, set] = useState(factory)

  useEffect(() => {
    let tid = setInterval(() => set(factory), interval)

    return () => clearInterval(tid)
  }, [interval])

  return value
}

let CurrentTime = () => {
  // just use some odd value as an interval so all ms digits change
  let now = useIntervalValue(() => new Date(), 193)

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
      <Time value={now} />
    </div>
  )
}

render(<CurrentTime />, document.getElementById('root'))
