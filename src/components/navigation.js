import React from 'react'
import { Box, Flex } from '@rebass/grid'
import styled from 'styled-components/macro'
import { Link } from 'gatsby'

let MenuItem = styled.li`
  margin: 0;
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

let Navigation = () => (
  <nav>
    <Flex as="ul" m={0} p="10px 10px 0" css={{ listStyle: 'none' }}>
      <MenuItem>
        <MenuLink as={NavLink} to="/">
          About
        </MenuLink>
      </MenuItem>
      <MenuItem>
        <MenuLink as={NavLink} to="/portfolio/">
          Portfolio
        </MenuLink>
      </MenuItem>
      <MenuItem>
        <MenuLink as={NavLink} to="/public-activity/">
          Public activity
        </MenuLink>
      </MenuItem>
      <MenuItem>
        <MenuLink as={NavLink} to="/blog/">
          Blog
        </MenuLink>
      </MenuItem>
    </Flex>
  </nav>
)

export default Navigation
