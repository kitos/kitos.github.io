import { useEffect, useState } from 'react'

export const useCurrentHeading = (selector = 'h1,h2,h3,h4,h5,h6') => {
  let [activeHeading, setActiveHeading] = useState(null)

  useEffect(() => {
    let inView = []

    let observer = new IntersectionObserver(
      elements => {
        let [enteredView, leftView] = elements.reduce(
          ([entered, left], { isIntersecting, intersectionRatio, target }) => {
            if (isIntersecting && intersectionRatio >= 0.9) {
              entered.push(target)
            } else {
              left.add(target.id)
            }

            return [entered, left]
          },
          [[], new Set()]
        )

        inView = [
          ...inView.filter(({ id }) => !leftView.has(id)),
          ...enteredView,
        ].sort(({ offsetTop: a }, { offsetTop: b }) => a - b)

        if (inView.length > 0) {
          setActiveHeading(inView[0].id)
        }
      },
      { threshold: 1.0 }
    )

    document.querySelectorAll(selector).forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return activeHeading
}
