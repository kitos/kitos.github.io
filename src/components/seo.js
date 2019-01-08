import React from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

let SEO = ({ title }) => (
  <StaticQuery
    query={graphql`
      query SiteSeoQuery {
        site {
          siteMetadata {
            title
            description
            img
            keywords
          }
        }
      }
    `}
    render={({ site: { siteMetadata: meta } }) => (
      <Helmet
        title={(title ? `${title} | ` : '') + meta.title}
        meta={[
          {
            name: 'keywords',
            content: meta.keywords.join(', '),
          },
          {
            name: `description`,
            content: meta.description,
          },
          {
            property: `og:title`,
            content: title,
          },
          {
            property: `og:description`,
            content: meta.description,
          },
          {
            name: 'og:image',
            content: meta.img,
          },
          {
            property: `og:type`,
            content: `website`,
          },
          {
            name: `twitter:card`,
            content: `summary`,
          },
          {
            name: `twitter:creator`,
            content: meta.title,
          },
          {
            name: `twitter:title`,
            content: title,
          },
          {
            name: `twitter:description`,
            content: meta.description,
          },
        ]}
      >
        <html lang="en" />
      </Helmet>
    )}
  />
)

export default SEO
export { SEO }
