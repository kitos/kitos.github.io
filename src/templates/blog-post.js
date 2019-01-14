import React from 'react'
import { graphql } from 'gatsby'
import { BLOCKS } from '@contentful/rich-text-types'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { differenceInWeeks, format } from 'date-fns/fp'

import SEO from '../components/seo'
import BlogTags from '../components/blog-tags'

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

    <BlogTags tags={tags} />

    <div
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
