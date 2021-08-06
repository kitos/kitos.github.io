import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import intersection from 'lodash.intersection'
import readingTime from 'reading-time'

const BLOG_DIR = 'src/_content/blog'
let cwd = process.cwd()

export type ILang = 'en' | 'ru'

export interface IPost {
  slug: string
  lang: ILang
  date: string
  title: string
  preface: ILang
  tags: string[]
  thumbnail: {
    img: string
    author?: string
    src?: string
  }
  content: string
  nextReads?: IPost[]
  readingTime?: string
}

let readPost = async (fileName: string) => {
  let file = await fs.readFile(path.join(cwd, BLOG_DIR, fileName), 'utf8')
  let {
    data: { date, ...meta },
    content,
  } = matter(file)

  return {
    ...meta,
    date: date.toISOString(),
    content,
    readingTime: readingTime(content).text,
  } as IPost
}

let getAllPosts = async () =>
  Promise.all((await fs.readdir(path.join(cwd, BLOG_DIR))).map(readPost))

let getRelatedPosts = (
  { slug, lang, tags }: IPost,
  allPosts: IPost[]
): IPost[] =>
  allPosts
    .filter((p) => p.slug !== slug || p.lang !== lang)
    .map((p) => ({
      ...p,
      similarity: intersection(p.tags, tags).length,
    }))
    .filter(({ similarity }) => similarity !== 0)
    .sort((a, b) => b.similarity - a.similarity || b.date.localeCompare(a.date))
    .slice(0, 3)

export let getPosts = async ({
  lang,
  tags = [],
}: { lang?: ILang; tags?: string[] } = {}) =>
  (await getAllPosts())
    .filter(
      (p) => (!lang || p.lang === lang) && tags.every((t) => p.tags.includes(t))
    )
    .sort((a, b) => b.date.localeCompare(a.date))

export let getPostBySlug = async (slug: string, lang: ILang) => {
  let allPosts = await getPosts({ lang })
  let post = allPosts.find((p) => p.slug === slug)

  if (post) {
    return {
      ...post,
      get nextReads() {
        let relatedPosts = getRelatedPosts(post!, allPosts)

        return relatedPosts.length === 3
          ? relatedPosts
          : [
              ...relatedPosts,
              ...allPosts
                .filter((p) => p !== post && !relatedPosts.includes(p))
                .slice(0, 3 - relatedPosts.length),
            ]
      },
    }
  }
}
