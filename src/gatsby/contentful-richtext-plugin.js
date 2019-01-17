const { BLOCKS } = require('@contentful/rich-text-types')

module.exports = {
  resolve: '@contentful/gatsby-transformer-contentful-richtext',
  options: {
    renderOptions: {
      renderNode: {
        [BLOCKS.EMBEDDED_ASSET]: ({
          data: {
            target: { fields },
          },
        }) =>
          `<img src="${fields.file['en-US'].url}" alt="${
            fields.description['en-US']
          }" style="max-width: 250px" />`,
      },
    },
  },
}
