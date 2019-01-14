import React, { useEffect, useState } from 'react'
import { graphql } from 'gatsby'
import { BLOCKS } from '@contentful/rich-text-types'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { differenceInWeeks, format } from 'date-fns/fp'
import { Manager } from 'react-popper'

import BlogTags from '../components/blog-tags'
import { SelectionReference, Tooltip } from '../components/tooltip'
import { TwitterIcon } from '../components/icons'
import SEO from '../components/seo'

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
  let [tooltipText, setTooltipText] = useState(null)

  useEffect(() => {
    let closeTooltip = e => {
      if (!e.target.closest('.tooltip')) {
        setTooltipText(null)
      }
    }

    document.addEventListener('mouseup', closeTooltip, true)

    return () => document.removeEventListener('mouseup', closeTooltip, true)
  }, [])

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
            setTooltipText(selection.toString())
          }
        }}
      >
        {getProps => (
          <div
            {...getProps()}
            dangerouslySetInnerHTML={{
              __html: documentToHtmlString(JSON.parse(content.content), {
                renderNode: {
                  [BLOCKS.EMBEDDED_ASSET]: ({
                    data: {
                      target: { fields },
                    },
                  }) =>
                    `<img src="${fields.file['en-US'].url}" alt="${
                      fields.description['en-US']
                    }" style="max-width: 250px" />`,
                },
              }),
            }}
          />
        )}
      </SelectionReference>

      <Tooltip isOpen={!!tooltipText}>
        <a
          href={`https://twitter.com/intent/tweet?text=“${tooltipText}” — @kitos_kirsanov&url=${
            window.location.href.split('?')[0]
          }`}
          target="_blank"
          title="tweet"
          aria-label="tweet"
          style={{ lineHeight: 0, display: 'block' }}
        >
          <TwitterIcon width={30} mode="blueOnWhite" />
        </a>
      </Tooltip>
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
