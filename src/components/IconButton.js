import * as React from 'react'
import styled from 'styled-components'
import VisuallyHidden from '@reach/visually-hidden'

let Button = styled.button`
  border: none;
  margin: 8px;
  padding: 0;
  width: auto;
  background: transparent;
  outline: none;
  cursor: ${(p) => (p.disabled ? 'cursor' : 'pointer')};
  height: 20px;
  position: relative;

  &:active {
    transition: transform 200ms;
    transform: scale(${(p) => (p.disabled ? 1 : 0.9)});
  }

  &:hover:before,
  &:focus:before {
    opacity: 1;
    margin: -8px;
  }

  &:before {
    content: ' ';
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    border-radius: 50%;
    background-color: ${(p) => p.$hoverBackground};
    margin: 0;
    opacity: 0;
    transition: opacity 200ms, margin 300ms;
  }
`

export let IconButton = ({
  as = 'button',
  icon,
  disabled,
  hoverBackground = 'pink',
  children,
  ...props
}) => (
  <Button
    // @reach/menu-button ignores disabled
    as={disabled ? 'button' : as}
    $hoverBackground={disabled ? 'transparent' : hoverBackground}
    disabled
    {...props}
  >
    <i aria-hidden="true" style={{ position: 'relative' }}>
      {icon}
    </i>
    <VisuallyHidden>{children}</VisuallyHidden>
  </Button>
)
