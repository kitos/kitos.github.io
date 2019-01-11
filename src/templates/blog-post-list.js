import React from 'react'
import { Box } from '@rebass/grid'
import VisuallyHidden from '@reach/visually-hidden'

import BlogPostSnippet from '../components/blog-post-snippet'
import SEO from '../components/seo'

let BlogPage = ({ pageContext: { posts, tag } }) => (
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
        posts.map(post => (
          <BlogPostSnippet key={post.slug} post={post} selectedTag={tag} />
        ))
      )}
    </Box>
  </>
)

export default BlogPage
