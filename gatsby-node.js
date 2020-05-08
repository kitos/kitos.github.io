const { fmImagesToRelative } = require('gatsby-remark-relative-images')
const webpack = require('webpack')

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    plugins: [
      new webpack.IgnorePlugin({
        resourceRegExp: /^netlify-identity-widget$/,
      }),
    ],
  })
}

exports.createSchemaCustomization = ({ actions: { createTypes } }) =>
  createTypes(`
    type MarkdownRemark implements Node @infer {
      frontmatter: Frontmatter!
    }

    type Frontmatter @infer {
      tweet_id: String
    }
  `)

exports.createResolvers = ({ createResolvers }) =>
  createResolvers({
    Frontmatter: {
      tweet_id: {
        resolve(source, args, context, info) {
          let tweetId = context.defaultFieldResolver(
            source,
            args,
            context,
            info
          )

          // at some point gatsby cast tweet id to number which results in integer overflow
          // so I had add 't' prefix and remove it here
          return tweetId ? tweetId.substr(1) : null
        },
      },
    },
  })

exports.onCreateNode = ({ node }) => fmImagesToRelative(node)
exports.sourceNodes = require('./src/gatsby/source-nodes')
exports.createPages = require('./src/gatsby/create-pages')
