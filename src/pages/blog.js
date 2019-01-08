import React from 'react'
import { Box } from '@rebass/grid'
import Layout from '../components/layout'
import VisuallyHidden from '@reach/visually-hidden'

let BlogPage = () => (
  <Layout pageTitle="Blog">
    <VisuallyHidden>
      <h2>Portfolio</h2>
    </VisuallyHidden>

    <Box as="b" mt="50px" style={{ display: 'block', textAlign: 'center' }}>
      Some posts might be here...
    </Box>
  </Layout>
)

export default BlogPage
