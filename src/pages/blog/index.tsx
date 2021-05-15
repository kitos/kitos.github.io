import type { FC } from 'react'
import type { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import groupBy from 'lodash.groupby'

import { getPosts, ILang, IPost } from '../../posts'
import { PostCard } from '../../PostCard'

let IndexPage: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  postsByYear,
}) => (
  <div className="flex flex-col gap-8">
    <h1 className="text-6xl font-bold">Blog</h1>

    {postsByYear.map(([year, posts]) => (
      <div key={year}>
        <h2 className="text-4xl font-bold mb-4">{year}</h2>

        <div className="flex flex-wrap gap-8">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} className="max-w-sm" />
          ))}
        </div>
      </div>
    ))}
  </div>
)

export let getStaticProps = async ({ locale }: GetStaticPropsContext) => {
  let posts = await getPosts({ lang: locale as ILang })
  let postsByYear = groupBy(posts, (p) => new Date(p.date).getFullYear())

  return {
    props: {
      postsByYear: (
        Object.entries(postsByYear) as unknown as [number, IPost[]][]
      ).sort(([y1], [y2]) => y2 - y1),
    },
  }
}

export default IndexPage
