const sanitizeHtml = require('sanitize-html')

let rssPlugin = {
  resolve: `gatsby-plugin-feed`,
  options: {
    query: `
        {
          site {
            siteMetadata {
              title
              description
              siteUrl
            }
          }
        }
      `,
    feeds: [
      {
        serialize: ({ query: { site, posts } }) => {
          return posts.edges.map(({ node }) => ({
            title: node.title,
            description: sanitizeHtml(
              node.preface.childContentfulRichText.html,
              {
                allowedTags: false,
              }
            ),
            date: node.createdAt,
            author: 'Nikita Kirsanov',
            url: `${site.siteMetadata.siteUrl}/blog/${node.slug}/`,
            guid: `${site.siteMetadata.siteUrl}/blog/${node.slug}/`,
            categories: node.tags,
          }))
        },
        query: `
            {
              posts: allContentfulBlog(sort: { fields: [createdAt], order: DESC }) {
                edges {
                  node {
                    slug
                    title
                    createdAt
                    preface {
                      childContentfulRichText {
                        html
                      }
                    }
                    tags
                  }
                }
              }
            }
          `,
        output: '/rss.xml',
        title: 'Personal blog of software engineer - Nikita Kirsanov',
      },
    ],
  },
}

module.exports = rssPlugin
