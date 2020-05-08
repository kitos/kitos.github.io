let queryWebMentions = (nodeModel, { slug, lang, type }) =>
  nodeModel.runQuery({
    firstOnly: false,
    type: 'WebMentionEntry',
    query: {
      filter: {
        wmTarget: {
          eq: `https://nikitakirsanov.com/${lang}/blog/${slug}/`,
        },
        wmProperty: { eq: type },
      },
    },
  })

exports.createResolvers = ({ createResolvers }) =>
  createResolvers({
    MarkdownRemark: {
      likes: {
        type: '[WebMentionEntry!]!',

        async resolve({ frontmatter: { slug, lang } }, _, { nodeModel }) {
          let likes = await queryWebMentions(nodeModel, {
            slug,
            lang,
            type: 'like-of',
          })

          return likes || []
        },
      },
      reposts: {
        type: '[WebMentionEntry!]!',

        async resolve({ frontmatter: { slug, lang } }, _, { nodeModel }) {
          let reposts = await queryWebMentions(nodeModel, {
            slug,
            lang,
            type: 'repost-of',
          })

          return reposts || []
        },
      },
    },
  })
