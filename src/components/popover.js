import styled from 'styled-components'

let Popover = styled.div`
  border-radius: 4px;
  border: 1px solid rgba(27, 31, 35, 0.15);
  background: #fff;
  box-shadow: 0 3px 12px rgba(27, 31, 35, 0.15);
  padding: 10px;
`

let Header = styled.header`
  background: #f6f8fa;
  border-bottom: 1px solid #e1e4e8;
  padding: 0 10px;
  margin: -10px -10px 10px -10px;
  line-height: 32px;
  font-size: 14px;
  font-weight: bold;
`

let Footer = styled.footer`
  border-top: 1px solid #e1e4e8;
  padding: 10px;
  margin: 10px -10px -10px;
`

export default Popover
export { Popover, Header, Footer }
