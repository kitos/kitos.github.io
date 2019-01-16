import React from 'react'
import { Link } from 'gatsby'
import { Box, Flex } from '@rebass/grid'

import Tag from '../tag'

let BlogTags = ({ tags, selectedTag }) => (
  <Flex
    as="ul"
    m={0}
    css={`
      list-style: none;
    `}
  >
    {tags.map(t => (
      <Box as="li" key={t} mr="5px">
        <Link to={`/blog/tag/${t}`}>
          <Tag active={t === selectedTag}>#{t}</Tag>
        </Link>
      </Box>
    ))}
  </Flex>
)

export default BlogTags
export { BlogTags }
