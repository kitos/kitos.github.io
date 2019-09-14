import React from 'react'
import { graphql, Link } from 'gatsby'
import { format } from 'date-fns/fp'
import styled from 'styled-components'
import { Box, Flex } from '@rebass/grid'
import { DiscussionEmbed } from 'disqus-react'

import { BlogPostContent, BlogTags } from '../components/blog'
import { SEO } from '../components'
import TableOfContent from '../components/blog/TableOfContent.bs'

let TocWrapper = styled.div`
  position: absolute;
  height: 100%;
  min-width: 200px;
  top: 30px;
  left: calc(100% + 70px);
`

let StyledToc = styled(TableOfContent)`
  position: sticky;
  top: 50px;
`

let formatDate = d => format('MMMM dd, yyyy', new Date(d))

let buildSchemaOrg = ({ title, date, tags }) => ({ author }) => [
  {
    '@context': 'http://schema.org',
    '@type': 'BlogPosting',
    datePublished: date,
    headline: title,
    keywords: tags.join(', '),
    author,
  },
]

let BlogPost = ({
  data: {
    post: {
      frontmatter: { slug, title, date, tags },
      headings,
      html,
    },
    similarPosts,
    site,
  },
}) => {
  let postUrl = `${site.meta.siteUrl}/blog/${slug}/`

  return (
    <>
      <SEO
        title={title}
        isBlogPost
        schemaOrgItems={buildSchemaOrg({ title, date, tags })}
      />

      <h1>{title}</h1>

      <small>{formatDate(date)}</small>

      <BlogTags tags={tags} />

      <div style={{ position: 'relative' }}>
        <TocWrapper>
          <StyledToc headings={headings} />
        </TocWrapper>

        <BlogPostContent post={{ title, postUrl, html }} />
      </div>

      <h2>Read next</h2>

      {similarPosts.edges.length > 0 && (
        <Flex
          as="ul"
          my={[2, 4]}
          mx={[0, -2]}
          flexDirection={['column', 'row']}
          justifyContent="space-between"
          css={`
            list-style: none;
          `}
        >
          {similarPosts.edges
            .map(({ node: { frontmatter, ...p } }) => ({
              ...frontmatter,
              ...p,
            }))
            .map(p => (
              <Flex
                as="li"
                key={p.slug}
                flex={1}
                flexDirection="column"
                mx={[0, 2]}
              >
                <Link to={`/blog/${p.slug}/`}>{p.title}</Link>

                <Box as="small" mt={2}>
                  {formatDate(p.date)} • {p.timeToRead} min read
                </Box>
              </Flex>
            ))}
        </Flex>
      )}

      <DiscussionEmbed
        shortname={process.env.GATSBY_DISQUS_SHORTNAME}
        config={{
          url: postUrl,
          identifier: slug,
          title,
        }}
      />
    </>
  )
}

export default BlogPost

export const query = graphql`
  query($id: String!, $similarPosts: [String!]!) {
    post: markdownRemark(id: { eq: $id }) {
      frontmatter {
        slug
        title
        date
        tags
      }

      headings {
        value
        depth
      }
      html
    }

    similarPosts: allMarkdownRemark(filter: { id: { in: $similarPosts } }) {
      edges {
        node {
          frontmatter {
            slug
            title
            date
            tags
          }
          timeToRead
        }
      }
    }

    site {
      meta: siteMetadata {
        siteUrl
      }
    }
  }
`
