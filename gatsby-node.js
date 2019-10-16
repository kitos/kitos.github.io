const { fmImagesToRelative } = require('gatsby-remark-relative-images')

exports.onCreateNode = ({ node }) => fmImagesToRelative(node)
exports.sourceNodes = require('./src/gatsby/source-nodes')
exports.createPages = require('./src/gatsby/create-pages')
