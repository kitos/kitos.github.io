import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'
import { Box, Flex } from '@rebass/grid'

let H = styled.header`
  background: #fafbfc;
`

let Nav = styled.nav`
  max-width: 42rem;
  margin: 0 auto;

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
      <Box as="h1" m={0} py={20}>
        <Link to="/">Nikita Kirsanov</Link>
      </Box>

      <Flex as="ul" m={0} p={0} pt={20} css={{ listStyle: 'none' }}>
        <li>
          <MenuLink as={NavLink} to="/">
            About
          </MenuLink>
        </li>
        <li>
          <MenuLink as={NavLink} to="/past-projects">
            Past projects
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
