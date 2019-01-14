import { useEffect } from 'react'

let useOuterClickHandler = (fn, innerRootSelector) => {
  useEffect(() => {
    let onMouseUp = e => {
      if (!e.target.closest(innerRootSelector)) {
        fn()
      }
    }

    document.addEventListener('mouseup', onMouseUp, true)

    return () => document.removeEventListener('mouseup', onMouseUp, true)
  }, [])
}

export default useOuterClickHandler
export { useOuterClickHandler }
