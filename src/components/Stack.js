import styled from 'styled-components'
import { system } from '@styled-system/core'

const createGap = (prop) => ({
  property: '& > * + *',
  scale: 'space',
  transform: (value, scale) => ({ [prop]: scale?.[value] ?? value }),
})

export const Stack = styled.div(
  system({
    columnGap: createGap('marginTop'),
    rowGap: createGap('marginLeft'),
  })
)
