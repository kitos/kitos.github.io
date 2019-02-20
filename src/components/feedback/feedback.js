import React, { createContext, useState } from 'react'
import styled from 'styled-components'

import FeedbackDialog from './dialogs'

let FeedbackButton = styled.button`
  position: fixed;
  right: -1px;
  bottom: 20%;
  background: #5eba5c;
  border-color: #5eba5c;
  color: #fff;
  cursor: pointer;

  transition: transform 200ms;
  transform: translateX(80px);
  &:hover {
    transform: translateX(0);
  }
`

let { Provider, Consumer } = createContext(null)

let FeedbackProvider = ({ children }) => {
  let [isDialogOpen, toggleDialog] = useState(false)
  let [{ type, ...feedback }, setFeedback] = useState({})

  const openFeedbackDialog = payload => {
    setFeedback(payload)
    toggleDialog(true)
  }
  return (
    <Provider value={openFeedbackDialog}>
      {children}

      <FeedbackDialog
        type={type}
        isOpen={isDialogOpen}
        payload={feedback}
        onDismiss={() => toggleDialog(false)}
      />

      <FeedbackButton onClick={() => openFeedbackDialog({ type: 'feedback' })}>
        📫 Feedback
      </FeedbackButton>
    </Provider>
  )
}

export { FeedbackProvider, Consumer as FeedbackConsumer }
