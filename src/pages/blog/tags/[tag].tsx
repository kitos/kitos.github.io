import type { GetStaticProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getPosts, ILang, IPost } from '../../../posts'
import { PostCard } from '../../../PostCard'

interface Props {
  posts: IPost[]
}

let BlogPost = ({ posts }: Props) => {
  let {
    locale,
    query: { tag },
  } = useRouter()

  return (
    <main className="page flex flex-col gap-8">
      <h1 className="text-6xl font-bold">
        Blog{' '}
        <Link href={`/blog/tags/${tag}`} locale={locale}>
          <a className="text-violet-900 hover:underline">#{tag}</a>
        </Link>
      </h1>

      <div className="flex flex-wrap gap-8">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} className="max-w-sm" />
        ))}
      </div>
    </main>
  )
}

export let getStaticProps: GetStaticProps<Props> = async ({
  params,
  locale,
}) => {
  let posts = await getPosts({
    lang: locale as ILang,
    tags: [params?.tag as string],
  })

  if (!posts) {
    return { notFound: true }
  }

  return { props: { posts } }
}

export let getStaticPaths = async () => {
  let posts = await getPosts()
  let allTags = posts.flatMap(({ lang, tags }) =>
    tags.map((t) => [lang, t] as const)
  )

  return {
    paths: allTags.map(([locale, tag]) => ({ params: { tag }, locale })),
    fallback: false,
  }
}

export default BlogPost
