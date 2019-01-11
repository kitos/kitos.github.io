import React from 'react'
import { graphql, Link } from 'gatsby'
import { format, differenceInWeeks } from 'date-fns/fp'
import { Box, Flex } from '@rebass/grid'

import Layout from '../components/layout'
import Tag from '../components/tag'

let formatDate = format('MMMM dd, yyyy')

let BlogPost = ({
  data: {
    post: { title, createdAt, updatedAt, tags, content },
  },
}) => (
  <Layout>
    <h1>{title}</h1>

    <small>{formatDate(createdAt)}</small>

    {differenceInWeeks(createdAt, updatedAt) > 1 && (
      <small> (Last update at {formatDate(updatedAt)})</small>
    )}

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
            <Tag>#{t}</Tag>
          </Link>
        </Box>
      ))}
    </Flex>

    <div
      dangerouslySetInnerHTML={{ __html: content.childContentfulRichText.html }}
    />
  </Layout>
)

export default BlogPost

export const query = graphql`
  query($slug: String!) {
    post: contentfulBlog(slug: { eq: $slug }) {
      title
      createdAt
      updatedAt
      tags
      content {
        childContentfulRichText {
          html
        }
      }
    }
  }
`
