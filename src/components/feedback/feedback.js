import React, { createContext, useState } from 'react'
import FeedbackDialog from './dialogs'

let { Provider, Consumer } = createContext(null)

let FeedbackProvider = ({ children }) => {
  let [isDialogOpen, toggleDialog] = useState(false)
  let [feedback, setFeedback] = useState({})

  return (
    <Provider
      value={payload => {
        setFeedback(payload)
        toggleDialog(true)
      }}
    >
      {children}

      <FeedbackDialog
        post={feedback}
        typo={feedback.typo}
        isOpen={isDialogOpen}
        onDismiss={() => toggleDialog(false)}
      />
    </Provider>
  )
}

export { FeedbackProvider, Consumer as FeedbackConsumer }
