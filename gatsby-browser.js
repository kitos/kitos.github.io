import { createBlockingRoot } from 'react-dom'

export const onClientEntry = async () => {
  if (typeof IntersectionObserver === 'undefined') {
    await import('intersection-observer');
  }
}

export const replaceHydrateFunction = () => (element, container, callback) => createBlockingRoot(container).render(element, callback)
