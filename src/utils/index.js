import { css } from 'styled-components'

let sizes = {
  phone: '40em',
  tablet: '52em',
  desktop: '64em',
  wide: '80em',
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
