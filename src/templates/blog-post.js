import React from 'react'
import { graphql, Link } from 'gatsby'
import { BLOCKS } from '@contentful/rich-text-types'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { differenceInWeeks, format } from 'date-fns/fp'
import { Box, Flex } from '@rebass/grid'

import Tag from '../components/tag'
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
}) => (
  <>
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

    <Flex
      as="ul"
      m={0}
      css={`
        list-style: none;
      `}
    >
      {tags.map(t => (
        <Box as="li" key={t} mr="5px">
          <Link to={`/blog/tag/${t}`}>
            <Tag>#{t}</Tag>
          </Link>
        </Box>
      ))}
    </Flex>

    <div
      dangerouslySetInnerHTML={{
        __html: documentToHtmlString(JSON.parse(content.content), {
          renderNode: {
            [BLOCKS.EMBEDDED_ASSET]: node =>
              `<img src="${
                node.data.target.fields.file['en-US'].url
              }" style="max-width: 250px" />`,
          },
        }),
      }}
    />
  </>
)

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
