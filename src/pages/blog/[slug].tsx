import type { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Image from 'next/image'
import format from 'date-fns/format'

import { getPostBySlug, getPosts, ILang, IPost } from '../../posts'
import { markdownToHtml } from '../../markdownRender'
import { PostCard } from '../../PostCard'
import { Tags } from '../../Tags'
import { count, IWebMentionsCount } from '../../webmentions'

let WebMentionsButtons = dynamic(
  () => import('../../webmentions/WebMentionsButtons')
)

interface Props {
  post: IPost
  webMentions: IWebMentionsCount
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
    tweetId,
  },
  webMentions,
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

    <div className="mb-12 h-96 w-screen relative -mx-8 2xl:m-0">
      <Image
        src={thumbnail.img}
        placeholder="blur"
        blurDataURL={thumbnail.base64}
        layout="fill"
        objectFit="cover"
      />
    </div>

    <div className="flex flex-col items-center">
      <header className="w-full max-w-prose lg:text-lg mb-8">
        <h1 className="text-5xl font-extrabold dark:text-gray-100">{title}</h1>

        <div className="text-lg mt-4 mb-2 text-gray-500">
          {format(new Date(date), 'PP')} • {readingTime}
        </div>

        <Tags locale={lang} tags={tags} />
      </header>

      <article
        className="prose lg:prose-lg dark:prose-light"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {tweetId && (
        <section className="w-full max-w-prose lg:text-lg mt-8 flex justify-end">
          <WebMentionsButtons tweetId={tweetId} {...webMentions} />
        </section>
      )}
    </div>

    {nextReads?.length > 0 && (
      <section className="page">
        <h2 className="text-4xl font-bold my-8 dark:text-gray-300">
          Next reads
        </h2>

        <div className="flex flex-col sm:flex-row gap-8 justify-between">
          {nextReads?.map((p) => (
            <PostCard key={p.slug} post={p} className="max-w-sm" />
          ))}
        </div>
      </section>
    )}
  </>
)

export let getStaticProps: GetStaticProps<Props, { slug: string }> = async ({
  params,
  locale,
}) => {
  let [post, webMentions] = await Promise.all([
    getPostBySlug(params?.slug!, locale as ILang),
    count(params?.slug!, locale as ILang),
  ])

  if (!post) {
    return { notFound: true }
  }

  let { content, ...p } = post

  return {
    props: {
      post: { ...p, content: await markdownToHtml(content) },
      webMentions,
    },
  }
}

export let getStaticPaths = async () => {
  let posts = await getPosts()

  return {
    paths: posts.map((p) => ({ params: { slug: p.slug }, locale: p.lang })),
    fallback: false,
  }
}

export default BlogPost
