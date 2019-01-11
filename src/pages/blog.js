import React from 'react'
import { graphql } from 'gatsby'
import { Box } from '@rebass/grid'
import VisuallyHidden from '@reach/visually-hidden'

import Layout from '../components/layout'
import BlogPostSnippet from '../components/blog-post-snippet'

let BlogPage = ({
  data: {
    posts: { edges: posts },
  },
}) => {
  posts = [] || posts
    .map(p => p.node)
    .map(p => ({
      ...p,
      preface: p.preface.childContentfulRichText.html,
      // TODO: time to read in gatsby-transformer-contentful-richtext
      timeToRead: 5,
    }))

  return (
    <Layout pageTitle="Blog">
      <VisuallyHidden>
        <h2>Blog</h2>
      </VisuallyHidden>

      <Box mt={10}>
        {posts.length === 0 ? (
          <Box as="b" style={{ display: 'block', textAlign: 'center' }}>
            Some posts might be here...
          </Box>
        ) : (
          posts.map(post => <BlogPostSnippet key={post.slug} post={post} />)
        )}
      </Box>
    </Layout>
  )
}

export default BlogPage

export let query = graphql`
  {
    posts: allContentfulBlog {
      edges {
        node {
          slug
          title
          createdAt
          updatedAt
          preface {
            childContentfulRichText {
              html
            }
          }
          tags
          content {
            childContentfulRichText {
              html
            }
          }
        }
      }
    }
  }
`
