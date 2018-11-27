import React from 'react'
import styled from 'styled-components/macro'

let F = styled.footer`
  max-width: ${({ theme }) => theme.pageWidth};
  margin: 20px auto 0 auto;
  padding: 20px;
  text-align: center;
  background: ${({ theme }) => theme.colors.pale};
  border: 1px solid ${({ theme }) => theme.colors.lightgray};
  border-bottom: none;
  border-radius: ${({ theme: { borderRadius: br } }) => `${br} ${br} 0 0`};
`

let Footer = () => (
  <F>
    © Nikita Kirsanov - {new Date().getFullYear()}. Build with{' '}
    <a
      href="https://www.gatsbyjs.org/"
      target="_blank"
      rel="noreferrer noopener"
    >
      gatsbyjs
    </a>{' '}
    ❤️
  </F>
)

export default Footer
