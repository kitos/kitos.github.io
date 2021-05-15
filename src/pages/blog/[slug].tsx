import type { FC } from 'react'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'

import { getPost, getPosts, IPost } from '../../posts'
import remark from 'remark'
import html from 'remark-html'

let BlogPost: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  post: { title, content },
}) => (
  <article className="prose lg:prose-xl">
    <h1>{title}</h1>

    <div dangerouslySetInnerHTML={{ __html: content }}></div>
  </article>
)

let markdownToHtml = async (markdown: string) => {
  let result = await remark().use(html).process(markdown)
  return result.toString()
}

export let getStaticProps = async ({ params: { slug }, locale }) => {
  let { date, content, ...p } = await getPost(`${slug}_${locale}.md`)

  return {
    props: {
      post: {
        ...p,
        date: date.toISOString(),
        content: await markdownToHtml(content),
      },
    },
  }
}

export let getStaticPaths = async () => {
  let posts = await getPosts()

  return {
    paths: posts.map((p) => `/blog/${p.slug}`),
    fallback: false,
  }
}

export default BlogPost
