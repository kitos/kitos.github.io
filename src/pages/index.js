import React from 'react'
import { graphql } from 'gatsby'
import { Box, Flex } from '@rebass/grid'

import { SEO, Shield } from '../components'
import Skills from '../components/about/skills'

const IndexPage = ({ data: { about, portfolio, talks } }) => {
  let projectTechnologies = portfolio.edges.reduce(
    (arr, { node }) =>
      arr.concat(
        node.technologies.map(name => ({
          name,
          lastUsed: node.startDate || node.endDate,
        }))
      ),
    []
  )
  let talkTags = talks.edges.reduce(
    (arr, { node }) =>
      arr.concat(
        node.tags.map(name => ({
          name,
          lastUsed: node.fields.snippet.snippet.publishedAt,
        }))
      ),
    []
  )

  let skillsMap = projectTechnologies.concat(talkTags).reduce((map, skill) => {
    let { name } = skill

    return map.has(name)
      ? map.set(name, {
          ...skill,
          mentions: map.get(name).mentions + 1,
        })
      : map.set(name, { ...skill, mentions: 1 })
  }, new Map())

  let skills = Array.from(skillsMap.values()).sort(
    (s1, s2) =>
      s2.mentions - s1.mentions || s2.lastUsed.localeCompare(s1.lastUsed)
  )

  return (
    <>
      <SEO title="About" />

      <Flex my="30px" flexWrap="wrap">
        {about.shields.map(s => {
          let [label, value] = s.split('|')

          return (
            <Box key={label} mr={[0, 10]} mb={['5px', 0]}>
              <Shield {...{ label, value }} />
            </Box>
          )
        })}
      </Flex>

      <h2>Skills</h2>

      <Skills skills={skills} />

      <div
        dangerouslySetInnerHTML={{
          __html:
            about.childContentfulAboutContentRichTextNode
              .childContentfulRichText.html,
        }}
      />
    </>
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
          startDate
          endDate
          technologies
        }
      }
    }

    talks: allContentfulPublicActivity {
      edges {
        node {
          fields {
            snippet {
              snippet {
                publishedAt
              }
            }
          }
          tags
        }
      }
    }
  }
`

export default IndexPage
