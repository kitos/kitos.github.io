import type { FC } from 'react'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'

import { getPostBySlug, getPosts, ILang } from '../../posts'
import { markdownToHtml } from '../../markdownRender'

let BlogPost: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  post: { title, content },
}) => (
  <article className="prose lg:prose-xl">
    <h1>{title}</h1>

    <div dangerouslySetInnerHTML={{ __html: content }} />
  </article>
)

export let getStaticProps: GetStaticProps = async ({ params, locale }) => {
  let post = await getPostBySlug(params?.slug as string, locale as ILang)

  if (!post) {
    return { notFound: true }
  }

  let { date, content, ...p } = post

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
