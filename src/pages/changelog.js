import React from 'react'
import Layout from '../components/layout'
import { graphql } from 'gatsby'

let ChangelogPage = ({
  data: {
    changelog: {
      edges: [
        {
          node: { html },
        },
      ],
    },
  },
}) => (
  <Layout>
    <div dangerouslySetInnerHTML={{ __html: html }} />
  </Layout>
)

export let query = graphql`
  query Changelog {
    changelog: allMarkdownRemark {
      edges {
        node {
          html
        }
      }
    }
  }
`

export default ChangelogPage
