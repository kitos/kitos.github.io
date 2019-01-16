import styled from 'styled-components/macro'

let Badge = styled.span`
  white-space: nowrap;
  color: #2369cf;
  background: #ecf5fe;
  border-radius: 4px;
  padding: 5px 10px;

  &:hover {
    background: #def;
  }
`

export default Badge
export { Badge }
