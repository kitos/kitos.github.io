import React from 'react'
import { graphql } from 'gatsby'
import { format } from 'date-fns/fp'
import { Box, Flex } from '@rebass/grid'

import Layout from '../components/layout'
import Badge from '../components/badge'

let formatDate = format('MMMM, yyyy')

let PortfolioPage = ({
  data: { portfolios: { edges: projects = [] } = {} } = {},
}) => (
  <Layout>
    {projects
      .map(p => p.node)
      .map(project => (
        <article key={project.name}>
          <header>
            <h2>
              {project.name} ({formatDate(project.startDate)} -{' '}
              {project.endDate ? formatDate(project.endDate) : 'Till Now'})
            </h2>
          </header>

          <h3>Customer</h3>

          <p>{project.customer}</p>

          <h3>Description</h3>

          <div
            dangerouslySetInnerHTML={{
              __html: project.description.childContentfulRichText.html,
            }}
          />

          <h3>Participation</h3>

          <ul>
            {project.participation.map(p => (
              <li key={p}>{p}</li>
            ))}
          </ul>

          <h3>Technologies</h3>

          <Flex as="ul" flexWrap="wrap" m={0} css={{ listStyle: 'none' }}>
            {project.technologies.map(t => (
              <Box as="li" key={t} ml="5px">
                <Badge>{t}</Badge>
              </Box>
            ))}
          </Flex>
        </article>
      ))}
  </Layout>
)

export let query = graphql`
  query PortfolioQuery {
    portfolios: allContentfulPortfolio(
      sort: { fields: [endDate, startDate], order: DESC }
    ) {
      edges {
        node {
          name
          customer
          startDate
          endDate
          description {
            childContentfulRichText {
              html
            }
          }
          participation
          technologies
        }
      }
    }
  }
`

export default PortfolioPage
