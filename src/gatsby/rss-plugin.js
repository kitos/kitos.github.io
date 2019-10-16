let rssPlugin = {
  resolve: `gatsby-plugin-feed`,
  options: {
    query: `
        {
          site {
            siteMetadata {
              siteUrl
            }
          }
        }
      `,
    feeds: [
      {
        serialize: ({ query: { site, posts } }) => {
          return posts.nodes.map(
            ({ frontmatter: { slug, lang, title, date, tags }, excerpt }) => {
              let path = `/${lang}/blog/${slug}/`

              return {
                title,
                description: excerpt,
                date,
                author: 'Nikita Kirsanov',
                url: `${site.siteMetadata.siteUrl}${path}`,
                guid: path,
                categories: tags,
              }
            }
          )
        },
        query: `
            {
              posts: allMarkdownRemark(filter: {fileAbsolutePath: {regex: "_content/blog/"}}, sort: {fields: frontmatter___date, order: DESC}) {
                nodes {
                  frontmatter {
                    slug
                    lang
                    title
                    date
                    tags
                  }
                  excerpt(pruneLength: 500)
                }
              }
            }
          `,
        output: 'blog/rss.xml',
        title: 'Personal blog of software engineer - Nikita Kirsanov',
      },
    ],
  },
}

module.exports = rssPlugin
