import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components/macro'
import { Box, Flex } from '@rebass/grid'
import { format } from 'date-fns/fp'

import BlogTags from './blog-tags'
import { media } from '../../utils'

let DateWithTimeline = styled.small`
  position: relative;
  padding-right: 20px;
  min-width: 150px;

  display: none;
  align-items: center;
  justify-content: flex-end;

  ${media.tablet`
    display: flex;
    border-right: 2px solid #e1e4e8;
  `}

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
  <Flex as="section" alignItems="stretch">
    <DateWithTimeline>{format('MMMM dd, yyyy', createdAt)}</DateWithTimeline>

    <Box pl={[0, 20]}>
      <h2>
        <Link to={`/blog/${slug}/`}>{title}</Link>
      </h2>

      <small>
        {timeToRead} min read{' '}
        <span css={media.tablet`display: none;`}>
          • {format('MMMM dd, yyyy', createdAt)}
        </span>
      </small>

      <div dangerouslySetInnerHTML={{ __html: preface }} />

      <BlogTags tags={tags} selectedTag={selectedTag} />
    </Box>
  </Flex>
)

export default BlogPostSnippet
export { BlogPostSnippet }
