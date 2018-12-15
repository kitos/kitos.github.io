import React from 'react'
import { graphql } from 'gatsby'
import { Box, Flex } from '@rebass/grid'

import Layout from '../components/layout'
import { Shield } from '../components/shield'

const IndexPage = ({ data: { about } }) => (
  <Layout>
    <Flex mt="30px" flexWrap="wrap">
      {about.shields.map(s => {
        let [label, value] = s.split('|')

        return (
          <Box mr="10px">
            <Shield {...{ label, value }} />
          </Box>
        )
      })}
    </Flex>

    <div
      dangerouslySetInnerHTML={{
        __html:
          about.childContentfulAboutContentRichTextNode.childContentfulRichText
            .html,
      }}
    />
  </Layout>
)

export let query = graphql`
  query IndexQuery {
    about: contentfulAbout {
      shields

      childContentfulAboutContentRichTextNode {
        childContentfulRichText {
          html
        }
      }
    }
  }
`

export default IndexPage
