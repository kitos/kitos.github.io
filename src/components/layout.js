import React from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import styled, {
  ThemeProvider,
  createGlobalStyle,
} from 'styled-components/macro'
import { Box } from '@rebass/grid'

import Header from './header'
import Footer from './footer'

let theme = {
  pageWidth: '800px',
  borderRadius: '3px',
  colors: {
    lightgray: '#e1e4e7',
    pale: '#fafbfc',
  },
}

let PageWrapper = styled(Box)`
  max-width: ${({ theme }) => theme.pageWidth};
  margin: 0 auto;
`

let HeaderWrapper = styled.div``
let FooterWrapper = styled.div``

// https://philipwalton.github.io/solved-by-flexbox/demos/sticky-footer/
let GlobalStyle = createGlobalStyle`
  #___gatsby > * {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  ${HeaderWrapper} {
    width: 100%;
  }
  
  ${PageWrapper} {
    width: 100%;
    flex: 1;
  }
  ${FooterWrapper} {
    width: 100%;
    flex-shrink: 0;
  }
`

const Layout = ({ pageTitle, children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
            description
            img
            keywords
            version
          }
        }
      }
    `}
    render={({ site: { siteMetadata: meta } }) => (
      <>
        <Helmet
          title={(pageTitle ? `${pageTitle} | ` : '') + meta.title}
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
              content: pageTitle,
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
              content: pageTitle,
            },
            {
              name: `twitter:description`,
              content: meta.description,
            },
          ]}
        >
          <html lang="en" />
        </Helmet>

        <ThemeProvider theme={theme}>
          <>
            <GlobalStyle />

            <HeaderWrapper>
              <Header />
            </HeaderWrapper>

            <PageWrapper as="main" px={[20, 0]}>
              {children}
            </PageWrapper>

            <FooterWrapper>
              <Footer version={meta.version} />
            </FooterWrapper>
          </>
        </ThemeProvider>
      </>
    )}
  />
)

export default Layout
