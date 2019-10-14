import React, { useContext } from 'react'
import styled from 'styled-components/macro'
import { graphql, Link, useStaticQuery } from 'gatsby'
import { feedbackContext } from './feedback'

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

let BottomLink = styled.a`
  font-size: 14px;
  color: #4078c0;
  background: transparent;
  cursor: pointer;
  padding: 0 5px;

  border-right: solid 1px ${({ theme }) => theme.colors.lightgray};
  &:last-child {
    border: none;
  }
`

let Footer = () => {
  let openFeedbackDialog = useContext(feedbackContext)
  let {
    site: { siteMetadata: meta },
  } = useStaticQuery(graphql`
    query SiteFooterQuery {
      site {
        siteMetadata {
          siteUrl
          version
        }
      }
    }
  `)

  return (
    <F>
      <div>
        © Nikita Kirsanov - <Link to="/changelog/">v{meta.version}</Link> (
        {new Date().getFullYear()}). Build with{' '}
        <a
          href="https://www.gatsbyjs.org/"
          target="_blank"
          rel="noreferrer noopener"
        >
          gatsbyjs
        </a>{' '}
        ❤️
      </div>

      <div>
        <BottomLink
          href="https://github.com/kitos/kitos.github.io"
          target="_blank"
          rel="noreferrer noopener"
        >
          source
        </BottomLink>

        <BottomLink as={Link} to="/changelog/">
          changelog
        </BottomLink>

        <BottomLink
          as="button"
          onClick={() => openFeedbackDialog({ type: 'feedback' })}
        >
          feedback
        </BottomLink>
      </div>
    </F>
  )
}

export default Footer
