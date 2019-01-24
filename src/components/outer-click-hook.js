import { useEffect } from 'react'

let useOuterClickHandler = (fn, innerRootSelector, inputs = []) => {
  useEffect(() => {
    let onMouseUp = e => {
      if (!e.target.closest(innerRootSelector)) {
        fn()
      }
    }

    document.addEventListener('mouseup', onMouseUp, true)

    return () => document.removeEventListener('mouseup', onMouseUp, true)
  }, inputs)
}

export default useOuterClickHandler
export { useOuterClickHandler }
