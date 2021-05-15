import type { FC } from 'react'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'

import { getPosts, ILang } from '../posts'
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

export let getStaticProps = async ({ locale }: GetStaticPropsContext) => ({
  props: { posts: (await getPosts({ lang: locale as ILang })).slice(0, 3) },
})

export default IndexPage