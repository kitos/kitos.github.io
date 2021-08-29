import type { FC } from 'react'
import type { InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import { useRouter } from 'next/router'
import groupBy from 'lodash.groupby'

import { getPosts, ILang, IPost } from '../../posts'
import { Tags } from '../../Tags'
import { PostLink } from '../../PostLink'

let IndexPage: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  postsByYear,
  allTags,
}) => {
  let { locale } = useRouter()

  return (
    <div className="page flex flex-col gap-8">
      <h1 className="text-6xl font-bold">Blog</h1>

      <div>
        <h2 className="text-2xl font-bold mb-4">By tag</h2>
        <Tags tags={allTags} locale={locale!} />
      </div>

      {postsByYear.map(([year, posts]) => (
        <div key={year}>
          <h2 className="text-2xl font-bold mb-4">{year}</h2>

          <div className="flex flex-col gap-6">
            {posts.map((p) => (
              <PostLink key={p.slug} {...p} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export let getStaticProps = async ({ locale }: GetStaticPropsContext) => {
  let posts = await getPosts({ lang: locale as ILang })
  let postsByYear = groupBy(posts, (p) => new Date(p.date).getFullYear())

  return {
    props: {
      postsByYear: (
        Object.entries(postsByYear) as unknown as [number, IPost[]][]
      ).sort(([y1], [y2]) => y2 - y1),
      allTags: Array.from(new Set(posts.flatMap((p) => p.tags))),
    },
  }
}

export default IndexPage
