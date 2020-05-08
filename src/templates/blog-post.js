import React from 'react'
import { graphql, Link } from 'gatsby'
import Img from 'gatsby-image'
import { format } from 'date-fns/fp'
import styled from 'styled-components'
import css from '@styled-system/css'
import { Box, Flex } from '@rebass/grid'
import { DiscussionEmbed } from 'disqus-react'

import { BlogPostContent, BlogTags } from '../components/blog'
import { SEO } from '../components'
import { buildPostLink, langToEmoji } from '../components/blog/utils'
import RelatedReads from '../components/blog/RelatedReads.re'
import { UnsplashBadge } from '../components/unsplash-badge'
import { WMLikes } from '../components/blog/WMLikes'
import { Stack } from '../components/Stack'
import { WMReposts } from '../components/blog/WMReposts'

let formatDate = (d) => format('MMMM dd, yyyy', new Date(d))

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

let FullWidthGrayBlock = styled.div`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  background: ${({ theme }) => theme.colors.pale};
`

let BlogPost = ({
  data: {
    post: {
      frontmatter: {
        slug,
        lang,
        tweet_id,
        title,
        date,
        thumbnail,
        preface,
        tags,
      },
      timeToRead,
      headings,
      html,
      likes,
      reposts,
      relatedReads,
    },
    translations,
    site,
  },
}) => {
  let postLink = buildPostLink({ slug, lang })
  let absolutePostLink = `${site.meta.siteUrl}${postLink}`
  let thumbnailSrc = thumbnail.img.childImageSharp.fluid.src
  let localizations = translations.nodes.map(({ frontmatter: { lang } }) => ({
    lang,
    href: buildPostLink({ slug, lang }),
  }))

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
        <p style={{ textAlign: 'center', marginTop: 8 }}>
          Photo by{' '}
          {/unsplash/.test(thumbnail.src) ? (
            <UnsplashBadge link={thumbnail.src} author={thumbnail.author} />
          ) : (
            <a href={thumbnail.src} target="_blank" rel="noopener">
              {thumbnail.author}
            </a>
          )}
        </p>
      )}

      <Stack columnGap={6}>
        <BlogPostContent
          post={{ title, postUrl: absolutePostLink, headings, html }}
        />

        <Flex as={Stack} rowGap={5} justifyContent="flex-end">
          <WMLikes tweetId={tweet_id} items={likes} />
          <WMReposts tweetId={tweet_id} items={reposts} />
        </Flex>

        {relatedReads.length > 0 && (
          <Box as={FullWidthGrayBlock} px={[20, 20, 0]}>
            <div
              css={css({ margin: '0 auto', maxWidth: [800, null, null, 1200] })}
            >
              <RelatedReads
                posts={relatedReads.map(
                  ({ frontmatter: { thumbnail, ...f }, ...p }) => ({
                    ...f,
                    ...p,
                    img: thumbnail.img.childImageSharp,
                  })
                )}
              />
            </div>
          </Box>
        )}

        <DiscussionEmbed
          shortname={process.env.GATSBY_DISQUS_SHORTNAME}
          config={{
            url: absolutePostLink,
            identifier: postLink,
            title,
          }}
        />
      </Stack>
    </>
  )
}

export default BlogPost

export const query = graphql`
  query($id: String!, $slug: String) {
    post: markdownRemark(id: { eq: $id }) {
      frontmatter {
        slug
        lang
        tweet_id
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

      likes {
        author {
          name
          url
          photo
        }
      }

      reposts {
        author {
          name
          url
          photo
        }
      }

      relatedReads(limit: 3) {
        frontmatter {
          slug
          lang
          title
          date
          tags

          thumbnail {
            img {
              childImageSharp {
                fluid(maxHeight: 240) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
        timeToRead
      }
    }

    translations: allMarkdownRemark(
      filter: { id: { ne: $id }, frontmatter: { slug: { eq: $slug } } }
    ) {
      nodes {
        frontmatter {
          lang
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
