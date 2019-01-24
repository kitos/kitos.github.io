import React from 'react'
import { graphql, StaticQuery } from 'gatsby'

import Skills from './skills'

let append = mapOfArrays => (key, value) =>
  mapOfArrays.has(key)
    ? mapOfArrays.set(key, [...mapOfArrays.get(key), value])
    : mapOfArrays.set(key, [value])

let flatMap = (cb, arr) =>
  arr.reduce((result, item, i) => result.concat(cb(item, i, arr)), [])

let SkillsContainer = () => (
  <StaticQuery
    query={graphql`
      query Skills {
        portfolio: allContentfulPortfolio {
          edges {
            node {
              fields {
                slug
              }
              name
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
                slug
                snippet {
                  snippet {
                    publishedAt
                  }
                }
              }
              title
              tags
            }
          }
        }
      }
    `}
    render={({ portfolio, talks }) => {
      let projectsBySkill = new Map()
      let appendToProjects = append(projectsBySkill)

      let projectTechnologies = flatMap(
        ({ node }) =>
          node.technologies.map(name => {
            appendToProjects(name, node)

            return {
              name,
              lastUsed: node.startDate || node.endDate,
            }
          }),
        portfolio.edges
      )

      let talksBySkill = new Map()
      let appendToTalks = append(talksBySkill)

      let talkTags = flatMap(
        ({ node }) =>
          node.tags.map(name => {
            appendToTalks(name, node)

            return {
              name,
              lastUsed: node.fields.snippet.snippet.publishedAt,
            }
          }),
        talks.edges
      )

      let skillsMap = projectTechnologies
        .concat(talkTags)
        .reduce((map, skill) => {
          let { name } = skill

          return map.has(name)
            ? map.set(name, {
                ...map.get(name),
                mentions: map.get(name).mentions + 1,
              })
            : map.set(name, {
                ...skill,
                mentions: 1,
                projects: projectsBySkill.get(name),
                talks: talksBySkill.get(name),
              })
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
