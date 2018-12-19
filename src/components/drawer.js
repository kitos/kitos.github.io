import React from 'react'
import styled from 'styled-components/macro'
import { Transition } from 'react-spring'

let Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 60%;
  background: #fff;

  will-change: transform;
`

let Overlay = styled(Container)`
  width: 100%;
  background: #141a28a8;
`

let Drawer = ({ open, children, onOuterClick }) => (
  <Transition
    items={open}
    from={{ transform: 'translateX(100%)', opacity: 0 }}
    enter={{ transform: 'translateX(0)', opacity: 1 }}
    leave={{ transform: 'translateX(100%)', opacity: 0 }}
  >
    {animatedOpen =>
      animatedOpen &&
      (({ transform, opacity }) => (
        <Overlay style={{ opacity }} onClick={onOuterClick}>
          <Container style={{ transform }} onClick={e => e.stopPropagation()}>
            {children}
          </Container>
        </Overlay>
      ))
    }
  </Transition>
)

export { Drawer }
export default Drawer
