import React from 'react'
import { graphql } from 'gatsby'
import { format } from 'date-fns/fp'

import Layout from '../components/layout'

let formatDate = format('MMMM yyyy')

let PastProjectsPage = ({
  data: { allProjectsYaml: { edges: projects = [] } = {} } = {},
}) => (
  <Layout>
    <ul>
      {projects
        .map(p => p.node)
        .map(project => (
          <li key={project.id}>
            <article>
              <header>
                <h2>
                  {project.id} ({formatDate(project.start)} -{' '}
                  {formatDate(project.end)})
                </h2>
              </header>

              <h3>Customer</h3>

              <p>{project.customer}</p>

              <h3>Description</h3>

              <p>{project.description}</p>

              <h3>Participation</h3>

              <ul>
                {project.participation.map(p => (
                  <li key={p}>{p}</li>
                ))}
              </ul>

              <h3>Technologies</h3>

              <ul>
                {project.technologies.map(t => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
          </li>
        ))}
    </ul>
  </Layout>
)

export let query = graphql`
  query ProjectsPageQuery {
    allProjectsYaml {
      edges {
        node {
          id
          customer
          start
          end
          description
          participation
          technologies
        }
      }
    }
  }
`

export default PastProjectsPage
