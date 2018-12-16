import React from 'react'
import { graphql, StaticQuery } from 'gatsby'
import Img from 'gatsby-image'
import styled from 'styled-components/macro'
import { Box, Flex } from '@rebass/grid'

import Navigation from './navigation'
import SocialLinks from './social-links'

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
  background: ${({ theme }) => theme.colors.pale};
  border: 1px solid ${({ theme }) => theme.colors.lightgray};
  border-top: none;
  border-radius: ${({ theme: { borderRadius: br } }) => `0 0 ${br} ${br}`};
  max-width: ${({ theme }) => theme.pageWidth};
  margin: 0 auto;
`

let NavWrapper = styled.nav`
  padding: 20px 20px 0;
  position: relative;
  bottom: -1px;
`

let ImagesWrapper = styled.div`
  position: relative;
  margin-bottom: 70px;

  @media screen and (min-width: 52em) {
    margin-bottom: 60px;
  }
`

let AvatarWrapper = styled.div`
  position: absolute;
  bottom: -70px;

  @media screen and (min-width: 52em) {
    bottom: -50px;
  }

  padding: 0 20px;
  width: 100%;
`

let Avatar = styled(Img)`
  background: #fff;
  border: 3px solid #fff;
`

let Header = () => (
  <H>
    <QueryImages>
      {({ avatar, background }) => (
        <ImagesWrapper>
          <Img fluid={background} style={{ height: 250 }} />

          <Flex as={AvatarWrapper} alignItems="flex-end">
            <Box as={Avatar} fluid={avatar} width={[100, 150]} />

            <Flex
              flexDirection={['column', 'row']}
              justifyContent="space-between"
              alignItems="flex-end"
              flex={1}
            >
              <Box
                as="h1"
                m={0}
                ml={20}
                fontSize={24}
                css={`
                  white-space: nowrap;
                `}
              >
                Nikita Kirsanov
              </Box>

              <Box mt={[10, 0]}>
                <SocialLinks />
              </Box>
            </Flex>
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
