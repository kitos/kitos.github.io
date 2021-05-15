import remark from 'remark'
import html from 'remark-html'
const markdown = require('remark-parse')
// @ts-ignore
import highlight from 'remark-highlight.js'
import hljs from 'highlight.js'
// @ts-ignore
import hljsDefineGraphQL from 'highlightjs-graphql'

hljsDefineGraphQL(hljs)

export let markdownToHtml = async (md: string) => {
  let result = await remark().use(markdown).use(highlight).use(html).process(md)
  return result.toString()
}
