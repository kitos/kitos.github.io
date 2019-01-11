import styled from 'styled-components'

let Tag = styled.small`
  text-decoration: underline;
  color: grey;
  &:hover {
    color: #4078c0;
  }
  ${({ active }) => (active ? 'color: #4078c0;' : '')}
`

export default Tag
export { Tag }
