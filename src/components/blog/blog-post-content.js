import React, { useState } from 'react'
import 'styled-components/macro'
import { Flex } from '@rebass/grid'
import { Manager } from 'react-popper'

import { SelectionReference, Tooltip } from '../tooltip'
import { TwitterIcon } from '../icons'
import { UnstyledButton } from '../button'
import { useOuterClickHandler } from '../outer-click-hook'
import RichtextDocumentRenderer from '../richtext-document-renderer'
import ReportTypoDialog from './report-typo-dialog'

let BlogPostContent = ({ post: { title, content } }) => {
  let postUrl =
    typeof window !== 'undefined' && window.location.href.split('?')[0]
  let tooltipClassname = 'tooltip'
  let [selectedText, setSelectedText] = useState(null)
  let [showDialog, toggleDialog] = useState(false)

  useOuterClickHandler(() => setSelectedText(null), `.${tooltipClassname}`)

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
          <RichtextDocumentRenderer {...getProps()} content={content.content} />
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
            onClick={() => toggleDialog(true)}
          >
            ✏️
          </UnstyledButton>
        </Flex>
      </Tooltip>

      <ReportTypoDialog
        post={{ title, link: postUrl }}
        typo={selectedText}
        isOpen={showDialog}
        onDismiss={() => toggleDialog(false)}
      />
    </Manager>
  )
}

export default BlogPostContent
export { BlogPostContent }
