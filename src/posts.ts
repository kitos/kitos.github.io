import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = 'src/_content/blog'
let cwd = process.cwd()

export type ILang = 'en' | 'ru'

export interface IPost {
  slug: string
  lang: ILang
  date: Date
  title: string
  preface: ILang
  tags: string[]
  thumbnail: {
    img: string
    author?: string
    src?: string
  }
  content: string
}

export let getPost = async (slug: string) => {
  let file = await fs.readFile(path.join(cwd, BLOG_DIR, slug), 'utf8')
  let { data, content } = matter(file)

  return { ...data, content } as IPost
}

export let getPosts = async ({
  lang,
  tags = [],
}: { lang?: ILang; tags?: string[] } = {}) => {
  let postFileNames = await fs.readdir(path.join(cwd, BLOG_DIR))
  let allPosts = await Promise.all(postFileNames.map(getPost))

  return allPosts
    .filter(
      (p) => (!lang || p.lang === lang) && tags.every((t) => p.tags.includes(t))
    )
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())
}
