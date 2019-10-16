import React from 'react'
import { graphql, Link } from 'gatsby'
import Img from 'gatsby-image'
import { format } from 'date-fns/fp'
import { Box, Flex } from '@rebass/grid'
import { DiscussionEmbed } from 'disqus-react'

import { BlogPostContent, BlogTags } from '../components/blog'
import { SEO } from '../components'
import { buildPostLink, langToEmoji } from '../components/blog/utils'

let formatDate = d => format('MMMM dd, yyyy', new Date(d))

let buildSchemaOrg = ({ title, date, tags, thumbnail, timeToRead }) => ({
  author,
}) => [
  {
    '@context': 'http://schema.org',
    '@type': 'BlogPosting',
    datePublished: date,
    headline: title,
    keywords: tags.join(', '),
    thumbnailUrl: thumbnail,
    timeRequired: `00:${timeToRead < 10 ? `0${timeToRead}` : timeToRead}`,
    author,
  },
]

let BlogPost = ({
  data: {
    post: {
      frontmatter: { slug, lang, title, date, thumbnail, preface, tags },
      timeToRead,
      headings,
      html,
    },
    translations,
    similarPosts,
    site,
  },
}) => {
  let postLink = buildPostLink({ slug, lang })
  let absolutePostLink = `${site.meta.siteUrl}${postLink}`
  let thumbnailSrc = thumbnail.img.childImageSharp.fluid.src
  let localizations = translations.edges.map(
    ({
      node: {
        frontmatter: { lang },
      },
    }) => ({ lang, href: buildPostLink({ slug, lang }) })
  )

  return (
    <>
      <SEO
        lang={lang}
        title={title}
        description={preface}
        thumbnail={thumbnailSrc}
        keywords={tags}
        isBlogPost
        localizations={localizations}
        schemaOrgItems={buildSchemaOrg({
          title,
          date,
          tags,
          desctiption: preface,
          thumbnail: thumbnailSrc,
          timeToRead,
        })}
      />

      <h1>{title}</h1>

      <Flex justifyContent="space-between">
        <small>{formatDate(date)}</small>

        {localizations.length > 0 && (
          <Flex>
            <Box mr={1}>Also available in:</Box>

            <Flex as="ul" m={0} style={{ listStyle: 'none' }}>
              {localizations.map(({ lang }) => (
                <li key={lang}>
                  <Link
                    to={buildPostLink({ slug, lang })}
                    style={{ textDecoration: 'none' }}
                  >
                    {langToEmoji(lang)}
                  </Link>
                </li>
              ))}
            </Flex>
          </Flex>
        )}
      </Flex>

      <BlogTags tags={tags} />

      <Img {...thumbnail.img.childImageSharp} />
      {thumbnail.author && (
        <p style={{ textAlign: 'center' }}>
          Photo by{' '}
          <a href={thumbnail.src} target="_blank" rel="noopener">
            {thumbnail.author}
          </a>
        </p>
      )}

      <BlogPostContent
        post={{ title, postUrl: absolutePostLink, headings, html }}
      />

      {similarPosts.edges.length > 0 && (
        <>
          <h2>Read next</h2>

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
              .map(({ slug, lang, title, date, timeToRead }) => (
                <Flex
                  as="li"
                  key={slug}
                  flex={1}
                  flexDirection="column"
                  mx={[0, 2]}
                >
                  <Link to={buildPostLink({ slug, lang })}>{title}</Link>

                  <Box as="small" mt={2}>
                    {formatDate(date)} • {timeToRead} min read
                  </Box>
                </Flex>
              ))}
          </Flex>
        </>
      )}

      <DiscussionEmbed
        shortname={process.env.GATSBY_DISQUS_SHORTNAME}
        config={{
          url: absolutePostLink,
          identifier: postLink,
          title,
        }}
      />
    </>
  )
}

export default BlogPost

export const query = graphql`
  query($id: String!, $slug: String, $similarPosts: [String!]!) {
    post: markdownRemark(id: { eq: $id }) {
      frontmatter {
        slug
        lang
        title
        date
        preface
        thumbnail {
          author
          src
          img {
            childImageSharp {
              fluid(maxWidth: 800, maxHeight: 450) {
                ...GatsbyImageSharpFluid_withWebp_tracedSVG
              }
            }
          }
        }
        tags
      }
      timeToRead

      headings {
        value
        depth
      }
      html
    }

    translations: allMarkdownRemark(
      filter: { id: { ne: $id }, frontmatter: { slug: { eq: $slug } } }
    ) {
      edges {
        node {
          frontmatter {
            lang
          }
        }
      }
    }

    similarPosts: allMarkdownRemark(filter: { id: { in: $similarPosts } }) {
      edges {
        node {
          frontmatter {
            slug
            lang
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
