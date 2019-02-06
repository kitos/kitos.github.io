import React, { useRef, useState } from 'react'
import { Box, Flex } from '@rebass/grid'

import { Footer } from '../popover'
import { ConfirmationDialog, Dialog } from '../dialog'
import Input from '../input'
import Button from '../button'
import { toQueryString } from '../../utils'

let submitTypo = ({ title, link, source, suggestion }) =>
  fetch(
    `${process.env.GATSBY_CLOUD_FUNCTION_CREATE_GH_ISSUE}?${toQueryString({
      title,
      link,
      source,
      suggestion,
    })}`
  ).then(resp => resp.json())

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

let ReportTypoDialog = ({ post, typo, isOpen, onDismiss }) => {
  if (!isOpen) {
    return null
  }

  let [source, setSource] = useState(typo)
  let [suggestion, setSuggestion] = useState(typo)
  let initialDialogFocusRef = useRef(null)
  let [{ dialogType, issueUrl }, toggleDialog] = useState({ dialogType: null })

  let handleSubmit = async () => {
    try {
      let { url } = await submitTypo({ ...post, source, suggestion })

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
      title="Report a typo / mistake"
      isOpen
      onDismiss={onDismiss}
      initialFocusRef={initialDialogFocusRef}
    >
      <Flex as="label" flexDirection="column" mb={10}>
        <Box mb={10}>Source</Box>

        <Input
          type="text"
          value={source}
          onChange={e => setSource(e.target.value)}
          placeholder="Tell me what I've messed up..."
        />
      </Flex>

      <Flex as="label" flexDirection="column">
        <Box mb={10}>Suggestion</Box>

        <Input
          as="textarea"
          value={suggestion}
          onChange={e => setSuggestion(e.target.value)}
          ref={initialDialogFocusRef}
          rows="3"
          placeholder="I appreciate you help :-)"
        />
      </Flex>

      <Flex as={Footer} justifyContent="flex-end">
        <Button onClick={handleSubmit}>Submit</Button>
      </Flex>
    </Dialog>
  )
}

export default ReportTypoDialog
export { ReportTypoDialog }
