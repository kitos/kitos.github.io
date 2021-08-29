import type { FC } from 'react'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Image from 'next/image'

import { getPosts, ILang } from '../posts'
import { PostCard } from '../PostCard'

import avatarSrc from '../../public/avatar.jpg'

let IndexPage: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  posts,
}) => (
  <div className="page">
    <div className="flex gap-16 mb-24">
      <div>
        <h2 className="text-5xl font-bold mb-8">Hi, I'm Nikita!</h2>

        <p className="text-xl mb-8">
          I am software engineer based in Berlin.
          <br />
          You can find me lol
        </p>
      </div>

      <div className="h-60 w-60 relative rounded-full overflow-hidden">
        <Image
          src={avatarSrc}
          height={60}
          width={60}
          placeholder="blur"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>

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
