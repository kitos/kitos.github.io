import React from 'react'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { BLOCKS } from '@contentful/rich-text-types'

let RichtextDocumentRenderer = ({ content, ...rest }) => (
  <div
    {...rest}
    dangerouslySetInnerHTML={{
      __html: documentToHtmlString(JSON.parse(content), {
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
      }),
    }}
  />
)

export default RichtextDocumentRenderer
export { RichtextDocumentRenderer }
