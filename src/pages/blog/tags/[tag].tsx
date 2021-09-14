import type { GetStaticProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getPosts, ILang, IPost } from '../../../posts'
import { PostLink } from '../../../PostLink'

interface Props {
  posts: IPost[]
}

let BlogPost = ({ posts }: Props) => {
  let {
    locale,
    query: { tag },
  } = useRouter()

  return (
    <div className="mt-8 page flex flex-col gap-8">
      <h1 className="text-6xl font-bold dark:text-gray-300">
        Blog{' '}
        <Link href={`/blog/tags/${tag}`} locale={locale}>
          <a className="text-violet-900 dark:text-violet-400 hover:underline">
            #{tag}
          </a>
        </Link>
      </h1>

      <div className="flex flex-col gap-6">
        {posts.map((p) => (
          <PostLink key={p.slug} {...p} />
        ))}
      </div>
    </div>
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
