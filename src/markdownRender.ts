import remark from 'remark'
import html from 'remark-html'
// @ts-ignore
import remark_prism from 'remark-prism'

export let markdownToHtml = async (md: string) => {
  let result = await remark().use(remark_prism).use(html).process(md)
  return result.toString()
}
