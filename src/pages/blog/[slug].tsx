import type { GetStaticProps } from 'next'

import { getPostBySlug, getPosts, ILang, IPost } from '../../posts'
import { markdownToHtml } from '../../markdownRender'
import { PostCard } from '../../PostCard'

interface Props {
  post: IPost
}

let BlogPost = ({ post: { title, content, relatedPosts = [] } }: Props) => (
  <div>
    <article className="prose lg:prose-xl">
      <h1>{title}</h1>

      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>

    {relatedPosts?.length > 0 && (
      <>
        <h2 className="text-4xl font-bold mb-8">Related reads</h2>

        <div className="flex gap-8">
          {relatedPosts?.map((p) => (
            <PostCard key={p.slug} post={p} className="max-w-sm" />
          ))}
        </div>
      </>
    )}
  </div>
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

  return {
    props: {
      post: {
        ...p,
        content: await markdownToHtml(content),
      },
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
