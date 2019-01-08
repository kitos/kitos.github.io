import React from 'react'
import { graphql } from 'gatsby'
import { Box, Flex } from '@rebass/grid'

import Layout from '../components/layout'
import VideoCard from '../components/video-card'

let PublicActivityPage = ({
  data: { resp: { edges: videos = [] } = {} } = {},
}) => (
  <Layout pageTitle="Public activity">
    <h2>Talks</h2>

    <Flex as="ul" m={'0 -20px'} flexWrap="wrap" css={{ listStyle: 'none' }}>
      {videos
        .map(v => ({
          ...v.node,
          ...v.node.fields.snippet,
        }))
        .map(v => (
          <Box as="li" key={v.id} width={[1, 'calc(50% - 20px)']} m={10}>
            <VideoCard video={v} />
          </Box>
        ))}
    </Flex>
  </Layout>
)

export let query = graphql`
  query PublicActivityQuery {
    resp: allContentfulPublicActivity {
      edges {
        node {
          title
          url
          tags

          fields {
            snippet {
              id
              snippet {
                publishedAt
                title
                tags
                thumbnails {
                  medium {
                    url
                    width
                    height
                  }
                  high {
                    url
                    width
                    height
                  }
                  maxres {
                    url
                    width
                    height
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export default PublicActivityPage
