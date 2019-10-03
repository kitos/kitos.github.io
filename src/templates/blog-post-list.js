import React from 'react'
import { graphql } from 'gatsby'
import groupBy from 'lodash.groupby'
import { Box } from '@rebass/grid'
import VisuallyHidden from '@reach/visually-hidden'

import { BlogPostSnippet } from '../components/blog'
import { SEO } from '../components'

let BlogPage = ({ pageContext: { tag }, data: { posts } }) => {
  posts = posts.edges.map(({ node: { frontmatter, ...post } }) => ({
    ...frontmatter,
    ...post,
  }))

  let unknowns = Object.values(groupBy(posts, 'slug'))

  let gropedPosts = unknowns.map(posts => ({
    ...(posts.find(({ lang }) => lang === 'en') || posts[0]),
    translations: posts.map(({ lang }) => lang),
  }))

  return (
    <>
      <SEO title="Blog" />

      <VisuallyHidden>
        <h2>Blog</h2>
      </VisuallyHidden>

      <Box mt={10}>
        {posts.length === 0 ? (
          <Box as="b" style={{ display: 'block', textAlign: 'center' }}>
            Some posts might be here...
          </Box>
        ) : (
          gropedPosts.map(post => (
            <BlogPostSnippet key={post.slug} post={post} selectedTag={tag} />
          ))
        )}
      </Box>
    </>
  )
}

export default BlogPage

export const pageQuery = graphql`
  query BlogPostList($slugs: [String!]!) {
    posts: allMarkdownRemark(
      filter: { frontmatter: { slug: { in: $slugs } } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            slug
            title
            date
            lang
            tags
            preface
          }
          timeToRead
        }
      }
    }
  }
`
