import React from 'react'
import styled, {
  ThemeProvider,
  createGlobalStyle,
} from 'styled-components/macro'
import { Box } from '@rebass/grid'

import Header from './header'
import Footer from './footer'
import SEO from './seo'

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
  <>
    <SEO title={pageTitle} />

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
          <Footer />
        </FooterWrapper>
      </>
    </ThemeProvider>
  </>
)

export default Layout
