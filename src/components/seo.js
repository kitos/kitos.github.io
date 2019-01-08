import React from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

let SEO = ({ title, isBlogPost, schemaOrgItems = () => [] }) => (
  <StaticQuery
    query={graphql`
      query SiteSeoQuery {
        site {
          siteMetadata {
            title
            description
            siteUrl
            img
            keywords

            social {
              twitter
            }
          }
        }
      }
    `}
    render={({ site: { siteMetadata: seo } }) => {
      let url = seo.siteUrl
      let baseSchema = {
        '@context': 'http://schema.org',
        '@type': 'WebSite',
        url,
        name: title,
      }

      return (
        <Helmet>
          <html lang="en" />

          <title>{(title ? `${title} | ` : '') + seo.title}</title>
          <meta name="description" content={seo.description} />
          <meta name="image" content={seo.img} />
          <meta name="keywords" content={seo.keywords.join(', ')} />

          {/* OpenGraph tags */}
          <meta property="og:url" content={url} />
          {isBlogPost ? <meta property="og:type" content="article" /> : null}
          <meta property="og:title" content={title} />
          <meta property="og:description" content={seo.description} />
          <meta property="og:image" content={seo.img} />

          {/* Twitter Card tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:creator" content={seo.social.twitter} />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={seo.description} />
          <meta name="twitter:image" content={seo.img} />

          {/* Schema.org tags */}
          <script type="application/ld+json">
            {JSON.stringify([baseSchema, ...schemaOrgItems({ url })])}
          </script>
        </Helmet>
      )
    }}
  />
)

export default SEO
export { SEO }
