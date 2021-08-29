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
    <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-16 my-8 md:my-16 dark:text-gray-100">
      <div>
        <h2 className="text-5xl font-bold mb-8">Hi, I'm Nikita!</h2>

        <p className="text-xl mb-8">
          I am software engineer based in Berlin.
          <br />
          You can find me lol
        </p>
      </div>

      <div className="h-40 w-40 md:h-60 md:w-60 self-center relative rounded-full overflow-hidden">
        <Image
          src={avatarSrc}
          placeholder="blur"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>

    <h2 className="text-4xl font-bold mb-8 dark:text-gray-200">Recent posts</h2>

    <div className="flex flex-col md:flex-row gap-8">
      {posts.map((p) => (
        <PostCard key={p.slug} post={p} className="flex-1 md:max-w-sm" />
      ))}
    </div>
  </div>
)

export let getStaticProps = async ({ locale }: GetStaticPropsContext) => ({
  props: { posts: (await getPosts({ lang: locale as ILang })).slice(0, 3) },
})

export default IndexPage
