import type { FC } from 'react'
import type { InferGetStaticPropsType } from 'next'

import { getPosts } from '../posts'
import { PostCard } from '../PostCard'

let IndexPage: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  posts,
}) => (
  <div>
    <h2 className="text-4xl font-bold mb-8">Recent posts</h2>

    <div className="flex gap-8">
      {posts.map((p) => (
        <PostCard key={p.slug} post={p} className="max-w-sm" />
      ))}
    </div>
  </div>
)

export let getStaticProps = async ({ locale }) => {
  let posts = await getPosts({ lang: locale })
  return {
    props: {
      posts: posts
        .slice(0, 3)
        .map((p) => ({ ...p, date: p.date.toISOString() })),
    },
  }
}

export default IndexPage
