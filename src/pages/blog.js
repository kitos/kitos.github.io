import React from 'react'
import { Box } from '@rebass/grid'
import VisuallyHidden from '@reach/visually-hidden'

import Layout from '../components/layout'
import BlogPostSnippet from '../components/blog-post-snippet'

let posts = []

let BlogPage = () => (
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
        posts.map(post => <BlogPostSnippet key={post.id} post={post} />)
      )}
    </Box>
  </Layout>
)

export default BlogPage
