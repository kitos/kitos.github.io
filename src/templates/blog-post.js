import React, { useState } from 'react'
import { graphql } from 'gatsby'
import 'styled-components/macro'
import { differenceInWeeks, format } from 'date-fns/fp'
import { Manager } from 'react-popper'
import { Flex } from '@rebass/grid'

import BlogTags from '../components/blog/blog-tags'
import { SelectionReference, Tooltip } from '../components/tooltip'
import { TwitterIcon } from '../components/icons'
import SEO from '../components/seo'
import RichtextDocumentRenderer from '../components/richtext-document-renderer'
import { useOuterClickHandler } from '../components/outer-click-hook'
import ReportTypoDialog from '../components/blog/report-typo-dialog'
import { UnstyledButton } from '../components/button'

let formatDate = format('MMMM dd, yyyy')

let buildSchemaOrg = ({ title, createdAt, updatedAt, tags }) => ({
  author,
}) => [
  {
    '@context': 'http://schema.org',
    '@type': 'BlogPosting',
    dateModified: updatedAt,
    datePublished: createdAt,
    headline: title,
    keywords: tags.join(', '),
    author,
  },
]

let BlogPost = ({
  data: {
    post: { title, createdAt, updatedAt, tags, content },
  },
}) => {
  let postUrl =
    typeof window !== 'undefined' && window.location.href.split('?')[0]
  let tooltipClassname = 'tooltip'
  let [selectedText, setSelectedText] = useState(null)
  let [showDialog, toggleDialog] = useState(false)

  useOuterClickHandler(() => setSelectedText(null), `.${tooltipClassname}`)

  return (
    <Manager>
      <SEO
        title={title}
        isBlogPost
        schemaOrgItems={buildSchemaOrg({ title, createdAt, updatedAt, tags })}
      />

      <h1>{title}</h1>

      <small>{formatDate(createdAt)}</small>

      {differenceInWeeks(createdAt, updatedAt) > 1 && (
        <small> (Last update at {formatDate(updatedAt)})</small>
      )}

      <BlogTags tags={tags} />

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

export default BlogPost

export const query = graphql`
  query($slug: String!) {
    post: contentfulBlog(slug: { eq: $slug }) {
      title
      createdAt
      updatedAt
      tags
      content {
        content
      }
    }
  }
`
