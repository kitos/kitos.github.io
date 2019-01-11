import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'
import { Box, Flex } from '@rebass/grid'
import { format } from 'date-fns/fp'

import Tag from './tag'

let DateWithTimeline = styled.small`
  position: relative;
  padding-right: 20px;
  min-width: 150px;
  text-align: right;

  &:after {
    margin-top: -6px;
    position: absolute;
    right: -7px;
    top: 50%;
    height: 12px;
    width: 12px;

    background-color: #e1e4e8;
    border: 2px solid #fff;
    border-radius: 6px;
    box-sizing: border-box;
    content: ' ';
    display: block;
  }
`

let BlogPostSnippet = ({
  post: { slug, title, createdAt, preface, timeToRead, tags },
  selectedTag,
}) => (
  <Flex as="section" alignItems="center">
    <DateWithTimeline>{format('MMMM dd, yyyy', createdAt)}</DateWithTimeline>
    <Box
      pl={20}
      css={`
        border-left: 2px solid #e1e4e8;
      `}
    >
      <h2>
        <Link to={`/blog/${slug}/`}>{title}</Link>
      </h2>

      <small>{timeToRead} min read</small>

      <div dangerouslySetInnerHTML={{ __html: preface }} />

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
    </Box>
  </Flex>
)

export default BlogPostSnippet
export { BlogPostSnippet }
