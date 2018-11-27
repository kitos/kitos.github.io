import React from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import { ThemeProvider } from 'styled-components'

import Header from './header'

let theme = {
  pageWidth: '800px',
}

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

        <ThemeProvider theme={theme}>
          <>
            <Header />

            <div
              css={`
                max-width: ${({ theme }) => theme.pageWidth};
                margin: 0 auto;
              `}
            >
              {children}
            </div>
          </>
        </ThemeProvider>
      </>
    )}
  />
)

export default Layout
