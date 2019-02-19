const { BLOCKS, INLINES, MARKS } = require('@contentful/rich-text-types')
const he = require('he')
const Prism = require('prismjs')

let renderCodesandboxIframe = ({ data: { uri } }) => `
  <iframe
    data-src="${uri}"
    style="width:100%; height:400px; border:0; border-radius: 4px; overflow:hidden;"
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
          }" style="display: block; width: 100%; max-width: 450px; margin: 0 auto" />`,
        [INLINES.HYPERLINK]: (node, next) =>
          node.data.uri.includes('codesandbox.io/embed')
            ? renderCodesandboxIframe(node, next)
            : renderAnchor(node, next),
      },
      renderMark: {
        [MARKS.CODE]: renderCode,
      },
    },
  },
}
