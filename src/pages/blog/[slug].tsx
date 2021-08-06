import type { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import format from 'date-fns/format'

import { getPostBySlug, getPosts, ILang, IPost } from '../../posts'
import { markdownToHtml } from '../../markdownRender'
import { PostCard } from '../../PostCard'
import { Tags } from '../../Tags'

interface Props {
  post: IPost
}

let BlogPost = ({
  post: {
    lang,
    title,
    date,
    readingTime,
    thumbnail,
    content,
    nextReads = [],
    tags,
  },
}: Props) => (
  <>
    <Head>
      <title>{title}</title>
      <link rel="preconnect" href="https://unpkg.com" />
      <link
        rel="stylesheet"
        href="https://unpkg.com/prismjs@1.23.0/themes/prism-tomorrow.css"
      />
    </Head>

    <div className="my-12 h-96 w-full relative">
      <Image src={thumbnail.img} layout="fill" objectFit="cover" />
    </div>

    <div className="flex flex-col items-center">
      <header className="w-full max-w-prose lg:text-lg mb-8">
        <h1 className="text-5xl font-extrabold">{title}</h1>

        <div className="text-lg mt-4 mb-2 text-gray-500">
          {format(new Date(date), 'PP')} • {readingTime}
        </div>

        <Tags locale={lang} tags={tags} />
      </header>

      <article
        className="prose lg:prose-lg"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>

    {nextReads?.length > 0 && (
      <div className="page">
        <h2 className="text-4xl font-bold my-8">Next reads</h2>

        <div className="flex gap-8">
          {nextReads?.map((p) => (
            <PostCard key={p.slug} post={p} className="max-w-sm" />
          ))}
        </div>
      </div>
    )}
  </>
)

export let getStaticProps: GetStaticProps<Props> = async ({
  params,
  locale,
}) => {
  let post = await getPostBySlug(params?.slug as string, locale as ILang)

  if (!post) {
    return { notFound: true }
  }

  let { content, ...p } = post

  return { props: { post: { ...p, content: await markdownToHtml(content) } } }
}

export let getStaticPaths = async () => {
  let posts = await getPosts()

  return {
    paths: posts.map((p) => ({ params: { slug: p.slug }, locale: p.lang })),
    fallback: false,
  }
}

export default BlogPost
