import React from 'react'
import { graphql } from 'gatsby'
import { Box } from '@rebass/grid'
import VisuallyHidden from '@reach/visually-hidden'

import { BlogPostSnippet } from '../components/blog'
import { SEO } from '../components'

let BlogPage = ({ pageContext: { tag }, data: { posts } }) => (
  <>
    <SEO title="Blog" />

    <VisuallyHidden>
      <h2>Blog</h2>
    </VisuallyHidden>

    <Box mt={10}>
      {posts.edges.length === 0 ? (
        <Box as="b" style={{ display: 'block', textAlign: 'center' }}>
          Some posts might be here...
        </Box>
      ) : (
        posts.edges
          .map(({ node: { id, frontmatter, ...post } }) => ({
            ...frontmatter,
            ...post,
          }))
          .map(post => (
            <BlogPostSnippet key={post.slug} post={post} selectedTag={tag} />
          ))
      )}
    </Box>
  </>
)

export default BlogPage

export const pageQuery = graphql`
  query BlogPostList($ids: [String!]!) {
    posts: allMarkdownRemark(
      filter: { id: { in: $ids } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            slug
            title
            date
            tags
            preface
          }
          timeToRead
        }
      }
    }
  }
`
