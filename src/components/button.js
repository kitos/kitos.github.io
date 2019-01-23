import styled from 'styled-components'

// TODO: only primary styles are used
let Button = styled.button`
  border: 1px solid rgba(27, 31, 35, 0.2);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  padding: 6px 12px;
  outline: 0;

  &:hover {
    background-color: #e6ebf1;
    background-image: linear-gradient(-180deg, #f0f3f6, #e6ebf1 90%);
    background-position: -0.5em;
    border-color: rgba(27, 31, 35, 0.35);
  }

  &:active {
    background-color: #e9ecef;
    background-image: none;
    border-color: rgba(27, 31, 35, 0.35);
    box-shadow: inset 0 0.15em 0.3em rgba(27, 31, 35, 0.15);
  }

  &:focus {
    box-shadow: 0 0 0 0.2em rgba(3, 102, 214, 0.3);
  }

  background-color: #28a745;
  background-image: linear-gradient(-180deg, #34d058, #28a745 90%);
  color: #fff;

  &:hover {
    background-color: #269f42;
    background-image: linear-gradient(-180deg, #2fcb53, #269f42 90%);
    background-position: -0.5em;
    border-color: rgba(27, 31, 35, 0.5);
  }

  &:active {
    background-color: #279f43;
    background-image: none;
    border-color: rgba(27, 31, 35, 0.5);
    box-shadow: inset 0 0.15em 0.3em rgba(27, 31, 35, 0.15);
  }

  &:focus {
    box-shadow: 0 0 0 0.2em rgba(52, 208, 88, 0.4);
  }
`

let UnstyledButton = styled.button`
  border: none;
  background: none;
  outline: none;
  padding: 0;
  cursor: pointer;
`

export default Button
export { Button, UnstyledButton }
