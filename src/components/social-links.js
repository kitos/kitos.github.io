import React from 'react'
import styled from 'styled-components/macro'
import { Flex } from '@rebass/grid'
import VisuallyHidden from '@reach/visually-hidden'

import { GitHubIcon, TwitterIcon, RSSIcon } from './icons'

let SocialItem = styled.li`
  margin: 0 0 0 8px;
  transition: 0.15s;
  line-height: 0;

  & > a {
    display: block;
  }

  & svg path {
    fill: #555;

    &:hover {
      fill: #333;
    }
  }
`
let SocialLinks = () => (
  <Flex as="ul" m="0" style={{ listStyle: 'none' }}>
    {[
      {
        href: 'https://twitter.com/kitos_kirsanov',
        text: 'Twitter',
        icon: TwitterIcon,
      },
      { href: 'https://github.com/kitos', text: 'GitHub', icon: GitHubIcon },
      { href: '/blog/rss.xml', text: 'RSS Feads', icon: RSSIcon },
    ].map(({ href, text, icon: I }) => (
      <SocialItem key={href}>
        <a href={href} title={text} target="_blank" rel="noreferrer noopener">
          <VisuallyHidden>{text}</VisuallyHidden>
          <I />
        </a>
      </SocialItem>
    ))}
  </Flex>
)

export { SocialLinks }
export default SocialLinks
