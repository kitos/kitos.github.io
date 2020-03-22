import React from 'react'
import styled from 'styled-components/macro'
import GHSlugger from 'github-slugger'
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

let slugger = new GHSlugger()

export let BlogPostContent = ({ post: { headings, html } }) => {
  let currentHeading = useCurrentHeading('h2,h3')

  slugger.reset()
  useLazyIframe()

  return (
    <div style={{ position: 'relative' }}>
      <TocWrapper>
        <StyledToc
          headings={headings}
          active={currentHeading}
          slugify={s => slugger.slug(s, false)}
        />
      </TocWrapper>

      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
