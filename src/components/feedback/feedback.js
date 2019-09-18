import React, { createContext, useState } from 'react'

import FeedbackDialog from './dialogs'

let feedbackContext = createContext(null)
let { Provider, Consumer } = feedbackContext

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

      {isDialogOpen && (
        <FeedbackDialog
          type={type}
          isOpen={isDialogOpen}
          payload={feedback}
          onDismiss={() => toggleDialog(false)}
        />
      )}
    </Provider>
  )
}

export { feedbackContext, FeedbackProvider, Consumer as FeedbackConsumer }
