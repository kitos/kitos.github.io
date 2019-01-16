import React, { useRef } from 'react'
import styled from 'styled-components'
import { Flex } from '@rebass/grid'
import { Transition } from 'react-spring'
import { DialogContent, DialogOverlay } from '@reach/dialog'
import VisuallyHidden from '@reach/visually-hidden'

import '@reach/dialog/styles.css'
import { Popover, Header, Footer } from './popover'
import Button, { UnstyledButton } from './button'

let CloseButton = styled(UnstyledButton)`
  font-size: 20px;
  color: gray;

  &:hover {
    color: #000;
  }
`

let StyledOverlay = styled(DialogOverlay)`
  display: flex;
  align-items: center;
  justify-content: center;
`

let Dialog = ({ isOpen, onDismiss, initialFocusRef, title, children }) => (
  <Transition
    items={isOpen}
    from={{ transform: 'translateY(-30px) scale(0.9)', opacity: 0 }}
    enter={{ transform: 'translateY(0) scale(1)', opacity: 1 }}
    leave={{ transform: 'translateY(-30px) scale(0.9)', opacity: 0 }}
  >
    {transitionIsOpen =>
      transitionIsOpen &&
      (({ opacity, ...transitionStyles }) => (
        <StyledOverlay
          style={{ opacity }}
          isOpen={isOpen}
          onDismiss={onDismiss}
          initialFocusRef={initialFocusRef}
        >
          <Popover
            as={DialogContent}
            style={{ ...transitionStyles, opacity, padding: 10 }}
          >
            <Flex
              as={Header}
              justifyContent="space-between"
              alignItems="center"
            >
              <span>{title}</span>

              <CloseButton onClick={onDismiss}>
                <VisuallyHidden>Close dialog</VisuallyHidden>
                <span aria-hidden>×</span>
              </CloseButton>
            </Flex>

            {children}
          </Popover>
        </StyledOverlay>
      ))
    }
  </Transition>
)

let ConfirmationDialog = ({
  title,
  buttonText = 'Ok!',
  isOpen,
  onDismiss,
  children,
}) => {
  let initialFocusRef = useRef(null)

  return (
    <Dialog initialFocusRef={initialFocusRef} {...{ title, isOpen, onDismiss }}>
      {children}

      <Flex as={Footer} justifyContent="flex-end">
        <Button ref={initialFocusRef} onClick={onDismiss}>
          {buttonText}
        </Button>
      </Flex>
    </Dialog>
  )
}

export default Dialog
export { Dialog, Footer, ConfirmationDialog }
