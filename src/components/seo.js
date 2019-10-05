import React from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

let SEO = ({
  lang = 'en',
  title,
  description,
  thumbnail,
  keywords,
  isBlogPost,
  schemaOrgItems = () => [],
  localizations = [],
}) => (
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
      description = description || seo.description
      keywords = keywords || seo.keywords
      thumbnail = thumbnail ? `${url}/${thumbnail}` : seo.img

      return (
        <Helmet>
          <html lang={lang} />

          <title>{(title ? `${title} | ` : '') + seo.title}</title>
          <meta name="description" content={description} />
          <meta name="image" content={thumbnail} />
          <meta name="keywords" content={keywords.join(', ')} />

          {/* OpenGraph tags */}
          <meta property="og:url" content={url} />
          {isBlogPost ? <meta property="og:type" content="article" /> : null}
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={thumbnail} />

          {/* Twitter Card tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:creator" content={seo.social.twitter} />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={thumbnail} />

          {localizations.map(({ lang, href }) => (
            <link rel="alternate" hrefLang={lang} href={`${url}/${href}`} />
          ))}

          {/* Schema.org tags */}
          <script type="application/ld+json">
            {JSON.stringify([
              baseSchema,
              ...schemaOrgItems({
                url,
                author: {
                  '@type': 'Person',
                  name: 'Nikita Kirsanov',
                },
              }),
            ])}
          </script>
        </Helmet>
      )
    }}
  />
)

export default SEO
export { SEO }
