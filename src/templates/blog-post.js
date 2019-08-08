import React from 'react'
import { graphql, Link } from 'gatsby'
import { differenceInWeeks, format } from 'date-fns/fp'
import { Box, Flex } from '@rebass/grid'
import { Like } from 'react-facebook'
import { DiscussionEmbed } from 'disqus-react'

import { BlogPostContent, BlogTags } from '../components/blog'
import { SEO } from '../components'

let formatDate = d => format('MMMM dd, yyyy', new Date(d))

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
    similarPosts,
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

      {differenceInWeeks(new Date(createdAt), new Date(updatedAt)) > 1 && (
        <small> (Last update at {formatDate(updatedAt)})</small>
      )}

      <BlogTags tags={tags} />

      <BlogPostContent
        post={{ title, postUrl, html: content.childContentfulRichText.html }}
      />

      <Box my={20}>
        <Like href={postUrl} colorScheme="dark" showFaces share />
      </Box>

      <h2>Read next</h2>

      {similarPosts.edges.length > 0 && (
        <Flex
          as="ul"
          my={[2, 4]}
          mx={[0, -2]}
          flexDirection={['column', 'row']}
          justifyContent="space-between"
          css={`
            list-style: none;
          `}
        >
          {similarPosts.edges.map(({ node: p }) => (
            <Flex
              as="li"
              key={p.slug}
              flex={1}
              flexDirection="column"
              mx={[0, 2]}
            >
              <Link to={`/blog/${p.slug}/`}>{p.title}</Link>

              <Box as="small" mt={2}>
                {formatDate(p.createdAt)} •{' '}
                {p.content.childContentfulRichText.timeToRead} min read
              </Box>
            </Flex>
          ))}
        </Flex>
      )}

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
  query($slug: String!, $similarPosts: [String!]!) {
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

    similarPosts: allContentfulBlog(filter: { slug: { in: $similarPosts } }) {
      edges {
        node {
          slug
          title
          createdAt
          updatedAt
          content {
            childContentfulRichText {
              timeToRead
            }
          }
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
