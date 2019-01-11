import React from 'react'
import { graphql } from 'gatsby'

let ChangelogPage = ({ data: { changelog } }) => (
  <div dangerouslySetInnerHTML={{ __html: changelog.html }} />
)

export let query = graphql`
  {
    changelog: markdownRemark(fileAbsolutePath: { regex: "/CHANGELOG.md/" }) {
      html
    }
  }
`

export default ChangelogPage
