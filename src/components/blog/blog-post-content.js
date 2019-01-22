import React, { useState } from 'react'
import 'styled-components/macro'
import { Flex } from '@rebass/grid'
import { Manager } from 'react-popper'
import 'prismjs/themes/prism-coy.css'

import { SelectionReference, Tooltip } from '../tooltip'
import { TwitterIcon } from '../icons'
import { UnstyledButton } from '../button'
import { useOuterClickHandler } from '../outer-click-hook'
import ReportTypoDialog from './report-typo-dialog'

let BlogPostContent = ({ post: { title, postUrl, html } }) => {
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
