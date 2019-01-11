import React, { useState } from 'react'
import { graphql } from 'gatsby'
import { format } from 'date-fns/fp'
import { Box, Flex } from '@rebass/grid'
import VisuallyHidden from '@reach/visually-hidden'

import Badge from '../components/badge'
import Drawer from '../components/drawer'
import SEO from '../components/seo'

let formatDate = format('MMMM, yyyy')

let isMobile =
  typeof window !== 'undefined' && typeof window.orientation !== 'undefined'

let buildSchemaOrg = projects => () => [
  {
    '@context': 'http://schema.org',
    '@type': 'CollectionPage',
    mainEntity: {
      '@type': 'ItemList',
      name: 'Projects',
      itemListOrder: 'http://schema.org/ItemListOrderDescending',
      itemListElement: projects.map(
        ({ name, url, description, technologies, customer }) => {
          let author = {
            '@type': 'Person',
            name: 'Nikita Kirsanov',
          }

          return {
            '@type': url ? 'WebSite' : 'CreativeWork',
            name,
            url: url || undefined,
            description: description || undefined,
            author,
            creator: author,
            keywords: technologies.join(','),
            funder: {
              '@type': 'Organization',
              name: customer,
            },
          }
        }
      ),
    },
  },
]

let PortfolioPage = ({
  data: { portfolios: { edges: projects = [] } = {} } = {},
}) => {
  let [demo, setDemo] = useState(false)
  projects = projects.map(p => p.node)

  return (
    <>
      <SEO title="Portfolio" schemaOrgItems={buildSchemaOrg(projects)} />

      <VisuallyHidden>
        <h2>Portfolio</h2>
      </VisuallyHidden>

      <Drawer open={!!demo} onOuterClick={() => setDemo(false)}>
        <iframe
          src={demo}
          title="Demo"
          frameBorder="0"
          height="100%"
          width="100%"
        />
      </Drawer>

      {projects.map(project => (
        <article key={project.name}>
          <header>
            <h2>
              {project.url ? (
                <a
                  href={project.url}
                  onClick={e => {
                    if (!isMobile) {
                      e.preventDefault()
                      setDemo(project.url)
                    }
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.name}
                </a>
              ) : (
                project.name
              )}{' '}
              ({formatDate(project.startDate)} -{' '}
              {project.endDate ? formatDate(project.endDate) : 'Till Now'})
            </h2>
          </header>

          {project.customer && (
            <>
              <h3>Customer</h3>

              <p>{project.customer}</p>
            </>
          )}

          {project.description && (
            <>
              <h3>Description</h3>

              <div
                dangerouslySetInnerHTML={{
                  __html: project.description.childContentfulRichText.html,
                }}
              />
            </>
          )}

          {project.participation && (
            <>
              <h3>Participation</h3>

              <ul>
                {project.participation.map(p => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </>
          )}

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
    </>
  )
}

export let query = graphql`
  query PortfolioQuery {
    portfolios: allContentfulPortfolio(
      sort: { fields: [endDate, startDate], order: DESC }
    ) {
      edges {
        node {
          name
          url
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
