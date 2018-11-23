import React from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import Header from './header'

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            { name: 'description', content: 'Sample' },
            { name: 'keywords', content: 'sample, something' },
          ]}
        >
          <html lang="en" />
        </Helmet>

        <Header />

        <div
          style={{
            maxWidth: '42rem',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '1.5rem 1.125rem',
            paddingTop: '1.5rem',
          }}
        >
          {children}
        </div>
      </>
    )}
  />
)

export default Layout
