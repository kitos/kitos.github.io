import React from 'react'
import { graphql } from 'gatsby'
import { Box, Flex } from '@rebass/grid'

import Layout from '../components/layout'
import { Shield } from '../components/shield'
import Badge from '../components/badge'

const IndexPage = ({ data: { about, portfolio, talks } }) => {
  let projectTechnologies = portfolio.edges.reduce(
    (arr, { node }) => arr.concat(node.technologies),
    []
  )
  let talkTags = talks.edges.reduce(
    (arr, { node }) => arr.concat(node.tags),
    []
  )

  let skillsMap = projectTechnologies
    .concat(talkTags)
    .reduce(
      (map, skill) =>
        map.has(skill) ? map.set(skill, map.get(skill) + 1) : map.set(skill, 1),
      new Map()
    )

  let skills = Array.from(skillsMap.entries()).sort(
    ([, count2], [, count1]) => count1 - count2
  )

  return (
    <Layout>
      <Flex my="30px" flexWrap="wrap">
        {about.shields.map(s => {
          let [label, value] = s.split('|')

          return (
            <Box mr={[0, 10]} mb={['5px', 0]}>
              <Shield {...{ label, value }} />
            </Box>
          )
        })}
      </Flex>

      <h2>Skills</h2>

      <Flex flexWrap="wrap">
        {skills.map(([t, count]) => (
          <Box as={Badge} key={t} mr="5px" mb="5px">
            {t}
          </Box>
        ))}
      </Flex>

      <div
        dangerouslySetInnerHTML={{
          __html:
            about.childContentfulAboutContentRichTextNode
              .childContentfulRichText.html,
        }}
      />
    </Layout>
  )
}

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

    portfolio: allContentfulPortfolio {
      edges {
        node {
          technologies
        }
      }
    }

    talks: allContentfulPublicActivity {
      edges {
        node {
          tags
        }
      }
    }
  }
`

export default IndexPage
