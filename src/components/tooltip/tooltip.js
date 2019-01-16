import React from 'react'
import styled, { css } from 'styled-components/macro'
import { Popper } from 'react-popper'
import { Transition } from 'react-spring'
import Popover from '../popover'

let arrowSize = 6

let Arrow = styled.div`
  position: absolute;
  ${props =>
    props.placement === 'bottom'
      ? css`
          margin: -${arrowSize}px 0 0 0;
          top: 0;
          bottom: auto;
        `
      : css`
          transform: rotate(180deg);
          margin: 0 0 -${arrowSize}px 0;
          top: auto;
          bottom: 0;
        `};
  width: 20px;
  height: 10px;

  margin-top: -${arrowSize - 1}px;

  &::before,
  &::after {
    content: '';
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
  }

  &::before {
    border-width: 0 ${arrowSize}px ${arrowSize}px ${arrowSize}px;
    border-color: transparent transparent #000 transparent;
  }

  &::after {
    border-width: 0 ${arrowSize}px ${arrowSize}px ${arrowSize}px;
    border-color: transparent transparent #fff transparent;
  }
`

let Tooltip = ({ isOpen, className, children }) => (
  <Transition
    items={isOpen}
    from={{ transform: 'translateY(20px)', opacity: 0 }}
    enter={{ transform: 'translateY(0)', opacity: 1 }}
    leave={{ transform: 'translateY(20px)', opacity: 0 }}
  >
    {transitionIsOpen =>
      transitionIsOpen &&
      (transitionStyle => (
        <Popper>
          {({ ref, style, placement, arrowProps }) => (
            <div
              ref={ref}
              style={style}
              data-placement={placement}
              className={className}
            >
              <Popover style={transitionStyle}>{children}</Popover>

              <Arrow
                {...arrowProps}
                style={{
                  ...arrowProps.style,
                  opacity: transitionStyle.opacity,
                }}
                placement={placement}
              />
            </div>
          )}
        </Popper>
      ))
    }
  </Transition>
)

export default Tooltip
export { Tooltip }
