import React, { createContext, useState, lazy, Suspense } from 'react'

let FeedbackDialog = lazy(
  /* webpackChunkName: "dialogs" */ () => import('./dialogs')
)

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
        <Suspense fallback={null}>
          <FeedbackDialog
            type={type}
            isOpen={isDialogOpen}
            payload={feedback}
            onDismiss={() => toggleDialog(false)}
          />
        </Suspense>
      )}
    </Provider>
  )
}

export { feedbackContext, FeedbackProvider, Consumer as FeedbackConsumer }
