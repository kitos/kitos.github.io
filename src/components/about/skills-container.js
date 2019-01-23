import React from 'react'
import { graphql, StaticQuery } from 'gatsby'
import Skills from './skills'

let SkillsContainer = () => (
  <StaticQuery
    query={graphql`
      query Skills {
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
    `}
    render={({ portfolio, talks }) => {
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

      let skillsMap = projectTechnologies
        .concat(talkTags)
        .reduce((map, skill) => {
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

      return <Skills skills={skills} />
    }}
  />
)

export default SkillsContainer
export { SkillsContainer }
