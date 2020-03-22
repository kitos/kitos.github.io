import { useEffect, useState } from 'react'
import { useBoundingClientRect } from './bounding-client-rect-hook'

export let useRotation = ({
  shadowColor = 'rgba(20, 26, 40, 0.25)',
  shadowK = 5,
  rotationK = 7,
} = {}) => {
  let initialRotation = [0, 0]
  let [elRect, ref] = useBoundingClientRect()
  let [[x, y], setPosition] = useState(initialRotation)

  useEffect(() => {
    let element = ref.current
    let { left, top, width, height } = elRect

    let onMouseMove = e => {
      let relativeX = ((e.clientX - left) / width - 0.5) * 2
      let relativeY = ((e.clientY - top) / height - 0.5) * 2

      setPosition([relativeX, relativeY])
    }

    let onMouseOut = () => {
      setPosition(initialRotation)
    }

    element.addEventListener('mousemove', onMouseMove)
    element.addEventListener('mouseout', onMouseOut)

    return () => {
      element.removeEventListener('mousemove', onMouseMove)
      element.removeEventListener('mouseout', onMouseOut)
    }
  }, [elRect])

  let rotateX = `rotateX(${-y * rotationK}deg)`
  let rotateY = `rotateY(${x * rotationK}deg)`

  let shadowOffsetX = -x * shadowK
  let shadowOffsetY = -y * shadowK

  return {
    ref,
    style: {
      willChange: 'transform',
      boxShadow: `${shadowColor} ${shadowOffsetX}px ${shadowOffsetY}px 30px`,
      transform: `perspective(1000px) ${rotateX} ${rotateY}`,
    },
  }
}
