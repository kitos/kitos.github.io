import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components/macro'
import { Box, Flex } from '@rebass/grid'
import { format } from 'date-fns/fp'

import BlogTags from './blog-tags'
import { media } from '../../utils'
import { buildPostLink, langToEmoji } from './utils'

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

let formatDate = d => format('MMMM dd, yyyy', new Date(d))

let BlogPostSnippet = ({
  post: { slug, title, lang, date, preface, timeToRead, tags, translations },
  selectedTag,
}) => (
  <Flex as="section" alignItems="stretch">
    <DateWithTimeline>{formatDate(date)}</DateWithTimeline>

    <Box pl={[0, 20]}>
      <h2>
        <Link to={buildPostLink({ slug, lang })}>{title}</Link>
      </h2>

      <small>
        <Flex alignItems="center">
          {translations.map(lang => (
            <Link
              key={lang}
              to={buildPostLink({ slug, lang })}
              style={{ textDecoration: 'none', fontSize: 16 }}
            >
              <span
                key={lang}
                role="img"
                title={lang === 'en' ? 'Read in English' : 'Read in Russian'}
              >
                {langToEmoji(lang)}
              </span>
            </Link>
          ))}

          <Box ml={2}>{timeToRead} min read </Box>
        </Flex>

        <span css={media.tablet`display: none;`}>• {formatDate(date)}</span>
      </small>

      <p>{preface}</p>

      <BlogTags tags={tags} selectedTag={selectedTag} />
    </Box>
  </Flex>
)

export default BlogPostSnippet
export { BlogPostSnippet }
