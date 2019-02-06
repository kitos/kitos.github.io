import { css } from 'styled-components'

export let isMobile =
  typeof window !== 'undefined' && typeof window.orientation !== 'undefined'

let sizes = {
  phone: '40em',
  tablet: '52em',
  desktop: '64em',
}

export let breakpoints = Object.values(sizes)

export let media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media screen and (min-width: ${sizes[label]}) {
      ${css(...args)}
    }
  `

  return acc
}, {})

export let toQueryString = obj =>
  Object.keys(obj)
    .map(k => `${k}=${obj[k]}`)
    .join('&')
