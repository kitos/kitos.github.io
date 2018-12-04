import React from 'react'
import Layout from '../components/layout'
import { graphql } from 'gatsby'

let ChangelogPage = ({ data: { changelog } }) => (
  <Layout>
    <div dangerouslySetInnerHTML={{ __html: changelog.html }} />
  </Layout>
)

export let query = graphql`
  {
    changelog: markdownRemark(fileAbsolutePath: { regex: "/CHANGELOG.md/" }) {
      html
    }
  }
`

export default ChangelogPage
