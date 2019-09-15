import React from 'react'
import styled, {
  createGlobalStyle,
  ThemeProvider,
} from 'styled-components/macro'
import { Box } from '@rebass/grid'

import Header from './header'
import Footer from './footer'
import { breakpoints } from '../utils'
import { ErrorBoundary } from './error-boundary'
import { FeedbackProvider } from './feedback'

let theme = {
  pageWidth: '800px',
  borderRadius: '3px',
  colors: {
    lightgray: '#e1e4e7',
    pale: '#fafbfc',
  },
  breakpoints,
}

let PageWrapper = styled(Box)`
  max-width: ${({ theme }) => theme.pageWidth};
  margin: 0 auto;
`

let HeaderWrapper = styled.div``
let FooterWrapper = styled.div``

// https://philipwalton.github.io/solved-by-flexbox/demos/sticky-footer/
let GlobalStyle = createGlobalStyle`
  html {
    scroll-behavior: smooth;
  }

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
  
  .twitter-tweet {
    margin: 10px auto;
  }
`

const Layout = ({ children }) => (
  <ThemeProvider theme={theme}>
    <ErrorBoundary>
      <FeedbackProvider>
        <GlobalStyle />

        <HeaderWrapper>
          <Header />
        </HeaderWrapper>

        <PageWrapper as="main" px={[20, 20, 0]}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </PageWrapper>

        <FooterWrapper>
          <Footer />
        </FooterWrapper>
      </FeedbackProvider>
    </ErrorBoundary>
  </ThemeProvider>
)

export default Layout
