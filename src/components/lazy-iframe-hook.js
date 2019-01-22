import { useEffect } from 'react'

let useLazyIframe = () =>
  useEffect(() => {
    let observer = new IntersectionObserver(
      entries => {
        entries
          .filter(e => e.isIntersecting)
          .forEach(({ target: $el }) => {
            $el.setAttribute('src', $el.getAttribute('data-src'))
            observer.unobserve($el)
          })
      },
      {
        rootMargin: '10%',
      }
    )

    document
      .querySelectorAll('iframe[data-src]')
      .forEach($el => observer.observe($el))

    return () => observer.disconnect()
  }, [])

export default useLazyIframe
export { useLazyIframe }
