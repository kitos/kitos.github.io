import React from 'react'
import { graphql } from 'gatsby'
import { differenceInWeeks, format } from 'date-fns/fp'

import { BlogTags, BlogPostContent } from '../components/blog'
import { SEO } from '../components'

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

    <BlogPostContent post={{ title, html: content.childContentfulRichText.html }} />
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
        childContentfulRichText {
          html
        }
      }
    }
  }
`
