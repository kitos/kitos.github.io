import React from 'react'

import Layout from '../components/layout'
import { graphql } from 'gatsby'

const IndexPage = ({ data: { about } }) => (
  <Layout>
    <div
      dangerouslySetInnerHTML={{ __html: about.childContentfulRichText.html }}
    />
  </Layout>
)

export let query = graphql`
  query IndexQuery {
    about: contentfulAboutContentRichTextNode {
      childContentfulRichText {
        html
      }
    }
  }
`

export default IndexPage
