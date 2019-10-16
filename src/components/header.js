import React from 'react'
import { graphql, Link, useStaticQuery } from 'gatsby'
import Img from 'gatsby-image'
import styled from 'styled-components/macro'
import { Flex } from '@rebass/grid'
import VisuallyHidden from '@reach/visually-hidden'

import Navigation from './navigation'
import SocialLinks from './social-links'

let H = styled.header`
  background: ${({ theme }) => theme.colors.pale};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightgray};
`

let StyledNavigation = styled(Navigation)`
  align-self: flex-end;
  position: relative;
  bottom: -11px;
  margin-left: 20px;
`

let Header = () => {
  let { avatar } = useStaticQuery(graphql`
    query HeaderImages {
      avatar: file(relativePath: { eq: "avatar.jpg" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed_withWebp_tracedSVG
          }
        }
      }
    }
  `)

  return (
    <Flex as={H} p="10px 20px" justifyContent="space-between" alignItems="center">
      <Link to="/" title="Nikita Kirsanov">
        <h1 style={{ margin: 0, padding: 0, fontSize: 0, border: 'none' }}>
          <Img style={{ borderRadius: '50%' }} {...avatar.childImageSharp} />

          <VisuallyHidden>Nikita Kirsanov</VisuallyHidden>
        </h1>
      </Link>

      <StyledNavigation />

      <SocialLinks />
    </Flex>
  )
}

export default Header
