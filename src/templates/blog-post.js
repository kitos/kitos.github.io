import React from 'react'
import { graphql } from 'gatsby'
import { differenceInWeeks, format } from 'date-fns/fp'
import { Box } from '@rebass/grid'
import { Like } from 'react-facebook'
import { DiscussionEmbed } from 'disqus-react'

import { BlogPostContent, BlogTags } from '../components/blog'
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
  pageContext: { slug },
  data: {
    post: { title, createdAt, updatedAt, tags, content },
    site,
  },
}) => {
  let postUrl = `${site.meta.siteUrl}/blog/${slug}/`

  return (
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

      <BlogPostContent
        post={{ title, postUrl, html: content.childContentfulRichText.html }}
      />

      <Box mt={20}>
        <Like href={postUrl} colorScheme="dark" showFaces share />
      </Box>

      <DiscussionEmbed
        shortname={process.env.GATSBY_DISQUS_SHORTNAME}
        config={{
          url: postUrl,
          identifier: slug,
          title,
        }}
      />
    </>
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
        childContentfulRichText {
          html
        }
      }
    }

    site {
      meta: siteMetadata {
        siteUrl
      }
    }
  }
`
