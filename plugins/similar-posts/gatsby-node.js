const intersection = require('lodash.intersection')

exports.createResolvers = ({ createResolvers }) =>
  createResolvers({
    MarkdownRemark: {
      similarPosts: {
        type: '[MarkdownRemark!]',
        args: { limit: 'Int' },

        async resolve(
          { frontmatter: { slug, lang, tags } },
          { limit = Number.MAX_SAFE_INTEGER },
          ctx
        ) {
          let otherPosts = await ctx.nodeModel.runQuery({
            firstOnly: false,
            type: 'MarkdownRemark',
            query: {
              filter: {
                fileAbsolutePath: { regex: '_content/blog/' }, // only posts
                frontmatter: {
                  slug: { ne: slug }, // not current article or translation
                  lang: { eq: lang }, // same lang
                },
              },
            },
          })

          return otherPosts
            .map((p) => ({
              ...p,
              similarity: intersection(p.frontmatter.tags, tags).length,
            }))
            .filter(({ similarity }) => similarity !== 0)
            .sort(
              (a, b) =>
                b.similarity - a.similarity ||
                b.frontmatter.date.localeCompare(a.frontmatter.date)
            )
            .slice(0, limit)
        },
      },
    },
  })
