import React from 'react'
import styled from 'styled-components/macro'
import { Flex } from '@rebass/grid'
import VisuallyHidden from '@reach/visually-hidden'

import { FacebookIcon, GitHubIcon, LinkedinIcon, TwitterIcon } from './icons'

let SocialItem = styled.li`
  margin: 0 0 0 5px;
  transition: 0.15s;
  line-height: 0;

  & > a {
    display: block;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: rgba(20, 26, 40, 0.25) 0 2px 5px;
  }
`
let SocialLinks = () => (
  <Flex as="ul" m="0" style={{ listStyle: 'none' }}>
    {[
      { href: 'https://github.com/kitos', text: 'GitHub', icon: GitHubIcon },
      {
        href: 'https://twitter.com/kitos_kirsanov',
        text: 'Twitter',
        icon: TwitterIcon,
      },
    ].map(({ href, text, icon: I }) => (
      <SocialItem key={href}>
        <a href={href} target="_blank" rel="noreferrer noopener">
          <VisuallyHidden>{text}</VisuallyHidden>
          <I />
        </a>
      </SocialItem>
    ))}
  </Flex>
)

export { SocialLinks }
export default SocialLinks
