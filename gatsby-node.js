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

exports.onCreateNode = ({ node }) => fmImagesToRelative(node)
exports.sourceNodes = require('./src/gatsby/source-nodes')
exports.createPages = require('./src/gatsby/create-pages')
