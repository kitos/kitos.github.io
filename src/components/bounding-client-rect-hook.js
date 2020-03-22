import { useEffect, useRef, useState } from 'react'

export let useBoundingClientRect = element => {
  let ref = useRef(null)
  let [rect, setRect] = useState({})

  useEffect(() => {
    let el = element || ref.current
    let updateRect = () => setRect(el.getBoundingClientRect())
    let onScroll = () => requestAnimationFrame(updateRect)

    updateRect()

    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [element])

  return [rect, ref]
}
