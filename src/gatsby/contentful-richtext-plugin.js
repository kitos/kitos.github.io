const { BLOCKS, INLINES, MARKS } = require('@contentful/rich-text-types')
const he = require('he')
const Prism = require('prismjs')

let renderCodesandboxIframe = ({ data: { uri } }) => `
  <iframe
    src="${uri}"
    style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
    sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin">
  </iframe>`

let renderAnchor = ({ data: { uri }, content }, next) =>
  `<a href="${uri}" target="_blank" rel="noopener noreferrer">${next(
    content
  )}</a>`

let renderCode = code =>
  `<pre class="language-javascript"><code class="language-javascript">${Prism.highlight(
    he.decode(code),
    Prism.languages.javascript,
    'javascript'
  )}</code></pre>`

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
        [INLINES.HYPERLINK]: (node, next) =>
          node.data.uri.includes('codesandbox.io')
            ? renderCodesandboxIframe(node, next)
            : renderAnchor(node, next),
      },
      renderMark: {
        [MARKS.CODE]: renderCode,
      },
    },
  },
}
