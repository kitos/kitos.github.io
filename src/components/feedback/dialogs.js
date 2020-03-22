import React, { useRef, useState } from 'react'
import { Box, Flex } from '@rebass/grid'

import { Footer } from '../popover'
import { ConfirmationDialog, Dialog } from '../dialog'
import Input from '../input'
import Button from '../button'
import { createGHIssue } from '../create-gh-issue'

let SuccessDialog = ({ issueUrl, isOpen, onDismiss }) => (
  <ConfirmationDialog
    title="Success!"
    buttonText="You are welcome!"
    {...{ isOpen, onDismiss }}
  >
    <p>Thanks for the help!</p>
    <p>
      You can find tracking issue{' '}
      <a href={issueUrl} target="_blank" rel="noopener noreferrer">
        here
      </a>
      . I'll fix it as soon as possible!
    </p>
  </ConfirmationDialog>
)

let FailDialog = ({ isOpen, onDismiss }) => (
  <ConfirmationDialog
    title="Something went wrong :-("
    buttonText="You are welcome!"
    {...{ isOpen, onDismiss }}
  >
    <p>Submission failed, but still thank you for taking care!</p>
    <p>
      You can create issue manually{' '}
      <a
        href="https://github.com/kitos/kitos.github.io/issues/new"
        target="_blank"
        rel="noopener noreferrer"
      >
        here
      </a>
      , if you have a GitHub account.
    </p>
  </ConfirmationDialog>
)

let FeedbackDialog = ({ type, payload, onDismiss }) => {
  let [feedbackType, setFeedbackType] = useState(type)
  let [typoSource, setTypoSource] = useState(payload.typo)
  let [content, setContent] = useState(payload.typo)
  let initialDialogFocusRef = useRef(null)
  let [{ dialogType, issueUrl }, toggleDialog] = useState({ dialogType: null })

  let handleSubmit = async () => {
    try {
      let { url } = await createGHIssue({
        // common fields
        type: feedbackType,
        content,

        // typos only
        source: typoSource,
        ...payload.post, // title, link
      })

      toggleDialog({ dialogType: 'success', issueUrl: url })
    } catch (e) {
      toggleDialog({ dialogType: 'fail' })
    }
  }

  return dialogType === 'success' ? (
    <SuccessDialog isOpen issueUrl={issueUrl} onDismiss={onDismiss} />
  ) : dialogType === 'fail' ? (
    <FailDialog isOpen onDismiss={onDismiss} />
  ) : (
    <Dialog
      title="Leave feedback"
      isOpen
      onDismiss={onDismiss}
      initialFocusRef={initialDialogFocusRef}
    >
      <Flex as="label" flexDirection="column" mb={10}>
        <Box mb={10}>Type</Box>

        <select
          style={{ height: 36 }}
          value={feedbackType}
          onChange={e => setFeedbackType(e.target.value)}
        >
          <option value="typo">✏️ Typo</option>
          <option value="bug">🐛 Bug</option>
          <option value="feedback">📫 Feedback</option>
        </select>
      </Flex>

      {feedbackType === 'typo' && (
        <Flex as="label" flexDirection="column" mb={10}>
          <Box mb={10}>Source</Box>

          <Input
            type="text"
            value={typoSource}
            onChange={e => setTypoSource(e.target.value)}
            placeholder="Tell me what I've messed up..."
          />
        </Flex>
      )}

      <Flex as="label" flexDirection="column">
        <Box mb={10}>
          {feedbackType === 'typo'
            ? 'Suggestion'
            : feedbackType === 'bug'
            ? 'Description'
            : 'Text'}
        </Box>

        <Input
          as="textarea"
          value={content}
          onChange={e => setContent(e.target.value)}
          ref={initialDialogFocusRef}
          rows="3"
          placeholder="I appreciate you feedback :-)"
        />
      </Flex>

      <Flex as={Footer} justifyContent="flex-end">
        <Button onClick={handleSubmit}>Submit</Button>
      </Flex>
    </Dialog>
  )
}

export default FeedbackDialog
export { FeedbackDialog }
