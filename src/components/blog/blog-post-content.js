import React, { useContext, useState } from 'react'
import styled from 'styled-components/macro'
import { Flex } from '@rebass/grid'
import { Manager } from 'react-popper'
import GHSlugger from 'github-slugger'

import { SelectionReference, Tooltip } from '../tooltip'
import { TwitterIcon } from '../icons'
import { UnstyledButton } from '../button'
import { useOuterClickHandler } from '../outer-click-hook'
import { feedbackContext } from '../feedback'
import { useLazyIframe } from '../lazy-iframe-hook'
import { media } from '../../utils'
import TableOfContent from './TableOfContent.bs'

import './prismjs-dan-abramov-theme.css'
import { useCurrentHeading } from '../current-heading.hook'

let TocWrapper = styled.div`
  display: none;
  ${media.wide`
    display: block;
  `};

  position: absolute;
  height: 100%;
  min-width: 200px;
  top: 30px;
  left: calc(100% + 50px);
`

let StyledToc = styled(TableOfContent)`
  position: sticky;
  top: 50px;
`

let tooltipClassname = 'tooltip'
let slugger = new GHSlugger()

export let BlogPostContent = ({ post: { title, postUrl, headings, html } }) => {
  let shareFeedback = useContext(feedbackContext)
  let [selectedText, setSelectedText] = useState(null)
  let currentHeading = useCurrentHeading('h2,h3')

  slugger.reset()

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
          <div style={{ position: 'relative' }}>
            <TocWrapper>
              <StyledToc
                headings={headings}
                active={currentHeading}
                slugify={s => slugger.slug(s, false)}
              />
            </TocWrapper>

            <div {...getProps()} dangerouslySetInnerHTML={{ __html: html }} />
          </div>
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
