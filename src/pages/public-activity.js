import React from 'react'
import { graphql } from 'gatsby'
import { Box, Flex } from '@rebass/grid'

import { VideoCard, SEO } from '../components'

let buildSchemaOrg = videos => () => [
  {
    '@context': 'http://schema.org',
    '@type': 'CollectionPage',
    mainEntity: {
      '@type': 'ItemList',
      name: 'Videos',
      itemListOrder: 'http://schema.org/ItemListOrderDescending',
      itemListElement: videos.map(
        ({ title, url, snippet, contentDetails }) => ({
          '@type': 'VideoObject',
          name: title,
          contentUrl: url,
          uploadDate: snippet.publishedAt,
          duration: contentDetails.duration,
          thumbnailUrl: snippet.thumbnails.maxres.url,
        })
      ),
    },
  },
]

let PublicActivityPage = ({
  data: { resp: { nodes: videos = [] } = {} } = {},
}) => {
  videos = videos.map(v => ({
    ...v,
    ...v.fields.snippet,
    slug: v.fields.slug,
  }))

  return (
    <>
      <SEO title="Public activity" schemaOrgItems={buildSchemaOrg(videos)} />

      <h2>Talks</h2>

      <Flex as="ul" m={'0 -20px'} flexWrap="wrap" css={{ listStyle: 'none' }}>
        {videos.map(v => (
          <Box
            as="li"
            id={v.slug}
            key={v.id}
            width={[1, 'calc(50% - 20px)']}
            m={10}
          >
            <VideoCard video={v} />
          </Box>
        ))}
      </Flex>
    </>
  )
}

export let query = graphql`
  query PublicActivityQuery {
    resp: allTalksYaml {
      nodes {
        title
        url
        tags

        fields {
          slug
          snippet {
            id
            contentDetails {
              duration
            }
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
`

export default PublicActivityPage
