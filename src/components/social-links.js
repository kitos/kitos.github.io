import React from 'react'
import styled from 'styled-components/macro'
import { Flex } from '@rebass/grid'
import VisuallyHidden from '@reach/visually-hidden'

import { FacebookIcon, GitHubIcon, LinkedinIcon, TwitterIcon } from './icons'

let SocialItem = styled.li`
  margin: 0 0 0 5px;
`
let SocialLinks = () => (
  <Flex as="ul" m="0" ml="auto" style={{ listStyle: 'none' }}>
    <SocialItem>
      <a
        href="https://github.com/kitos"
        target="_blank"
        rel="noreferrer noopener"
      >
        <VisuallyHidden>GitHub</VisuallyHidden>
        <GitHubIcon />
      </a>
    </SocialItem>

    <SocialItem>
      <a href="https://www.facebook.com/kitos.kirsanov">
        <VisuallyHidden>Facebook</VisuallyHidden>
        <FacebookIcon />
      </a>
    </SocialItem>

    <SocialItem>
      <a
        href="https://twitter.com/kitos_kirsanov"
        target="_blank"
        rel="noreferrer noopener"
      >
        <VisuallyHidden>Twitter</VisuallyHidden>
        <TwitterIcon />
      </a>
    </SocialItem>

    <SocialItem>
      <a
        href="https://www.linkedin.com/in/%D0%BD%D0%B8%D0%BA%D0%B8%D1%82%D0%B0-%D0%BA%D0%B8%D1%80%D1%81%D0%B0%D0%BD%D0%BE%D0%B2-08b307b9/"
        target="_blank"
        rel="noreferrer noopener"
      >
        <VisuallyHidden>Linkedin</VisuallyHidden>
        <LinkedinIcon />
      </a>
    </SocialItem>
  </Flex>
)

export { SocialLinks }
export default SocialLinks
