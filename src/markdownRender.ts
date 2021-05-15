import remark from 'remark'
import html from 'remark-html'

export let markdownToHtml = async (markdown: string) => {
  let result = await remark().use(html).process(markdown)
  return result.toString()
}
