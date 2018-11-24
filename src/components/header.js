import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'
import { Box, Flex } from '@rebass/grid'

import { rhythm, scale } from '../utils/typography'

let H = styled.header`
  background: #fafbfc;
  border-bottom: 1px solid #e1e4e7;
`

let Nav = styled.nav`
  max-width: 42rem;
  margin: 0 auto;
  position: relative;
  bottom: -1px;

  li {
    margin: 0;
  }
`

let MenuLink = styled(Box)`
  display: block;
  padding: 5px 15px;

  border: 1px solid transparent;
  border-top-width: 3px;
  border-radius: 3px 3px 0 0;

  &.active {
    background: #fff;
    border-top-color: #d4692b;
    border-left-color: #e1e4e7;
    border-right-color: #e1e4e7;
  }

  border-bottom: none;
`

let NavLink = ({ className, ...props }) => (
  <Link
    className={className}
    getProps={({ isCurrent }) =>
      isCurrent ? { className: `${className} active` } : null
    }
    {...props}
  />
)

let Header = () => (
  <H>
    <Nav>
      <h1 style={{ ...scale(3 / 4), margin: 0, paddingTop: rhythm(1) }}>
        Nikita Kirsanov / Software Engineer
      </h1>

      <Flex as="ul" m={0} p={0} pt={20} css={{ listStyle: 'none' }}>
        <li>
          <MenuLink as={NavLink} to="/">
            About
          </MenuLink>
        </li>
        <li>
          <MenuLink as={NavLink} to="/portfolio">
            Portfolio
          </MenuLink>
        </li>
        <li>
          <MenuLink as={NavLink} to="/blog">
            Blog
          </MenuLink>
        </li>
      </Flex>
    </Nav>
  </H>
)

export default Header
