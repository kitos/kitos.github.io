import React from 'react'
import { graphql, StaticQuery } from 'gatsby'
import Img from 'gatsby-image'
import styled from 'styled-components/macro'
import { Box, Flex } from '@rebass/grid'

import Navigation from './navigation'

let QueryImages = ({ children }) => (
  <StaticQuery
    query={graphql`
      query HeaderImages {
        avatar: file(relativePath: { eq: "avatar.jpg" }) {
          childImageSharp {
            fluid(maxWidth: 250) {
              ...GatsbyImageSharpFluid_tracedSVG
            }
          }
        }

        background: file(relativePath: { eq: "header-bg.jpg" }) {
          childImageSharp {
            fluid(maxWidth: 672) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={({ avatar, background }) =>
      children({
        avatar: avatar.childImageSharp.fluid,
        background: background.childImageSharp.fluid,
      })
    }
  />
)

let H = styled.header`
  background: #fafbfc;
  border: 1px solid #e1e4e7;
  border-top: none;
  border-radius: 0 0 3px 3px;
  max-width: 42rem;
  margin: 0 auto;
`

let NavWrapper = styled.nav`
  position: relative;
  bottom: -1px;
`

let ImagesWrapper = styled.div`
  position: relative;
  margin-bottom: 60px;
`

let AvatarWrapper = styled.div`
  position: absolute;
  bottom: -50px;
  left: 40px;
`

let Avatar = styled(Img)`
  background: #fff;
  border: 3px solid #fff;
  width: 150px;
`

let Header = () => (
  <H>
    <QueryImages>
      {({ avatar, background }) => (
        <ImagesWrapper>
          <Img fluid={background} style={{ height: 250 }} />

          <Flex as={AvatarWrapper} alignItems="flex-end">
            <Avatar fluid={avatar} />

            <Box as="h1" m={0} ml={20} fontSize={24}>
              Nikita Kirsanov / Software Engineer
            </Box>
          </Flex>
        </ImagesWrapper>
      )}
    </QueryImages>

    <NavWrapper>
      <Navigation />
    </NavWrapper>
  </H>
)

export default Header
