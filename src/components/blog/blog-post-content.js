import React, { useContext, useState } from 'react'
import 'styled-components/macro'
import { Flex } from '@rebass/grid'
import { Manager } from 'react-popper'
import './prismjs-dan-abramov-theme.css'

import { SelectionReference, Tooltip } from '../tooltip'
import { TwitterIcon } from '../icons'
import { UnstyledButton } from '../button'
import { useOuterClickHandler } from '../outer-click-hook'
import { feedbackContext } from '../feedback'
import { useLazyIframe } from '../lazy-iframe-hook'

let tooltipClassname = 'tooltip'

export let BlogPostContent = ({ post: { title, postUrl, html } }) => {
  const shareFeedback = useContext(feedbackContext)
  let [selectedText, setSelectedText] = useState(null)

  useOuterClickHandler(() => setSelectedText(null), `.${tooltipClassname}`)
  useLazyIframe()

  return (
    <Manager>
      <SelectionReference
        onSelect={selection => {
          if (selection && !selection.isCollapsed) {
            setSelectedText(selection.toString())
          }
        }}
      >
        {getProps => (
          <div {...getProps()} dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </SelectionReference>

      <Tooltip isOpen={!!selectedText} className={tooltipClassname}>
        <Flex>
          <a
            href={`https://twitter.com/intent/tweet?text=“${selectedText}” — @kitos_kirsanov&url=${postUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            title="tweet"
            aria-label="tweet"
            css={`
              display: block;
              line-height: 0;
              padding-right: 5px;
              margin-right: 10px;
              border-right: 1px solid lightgray;
            `}
            style={{ lineHeight: 0, display: 'block' }}
          >
            <TwitterIcon width={30} mode="blueOnWhite" />
          </a>

          <UnstyledButton
            title="Report typo/mistake"
            aria-label="Report typo/mistake"
            onClick={() =>
              shareFeedback({
                type: 'typo',
                post: { title, link: postUrl },
                typo: selectedText,
              })
            }
          >
            ✏️
          </UnstyledButton>
        </Flex>
      </Tooltip>
    </Manager>
  )
}
