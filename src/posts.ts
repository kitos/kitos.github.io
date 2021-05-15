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

let readPost = async (fileName: string) => {
  let file = await fs.readFile(path.join(cwd, BLOG_DIR, fileName), 'utf8')
  let { data, content } = matter(file)

  return { ...data, content } as IPost
}

let getAllPosts = async () =>
  Promise.all((await fs.readdir(path.join(cwd, BLOG_DIR))).map(readPost))

export let getPosts = async ({
  lang,
  tags = [],
}: { lang?: ILang; tags?: string[] } = {}) =>
  (await getAllPosts())
    .filter(
      (p) => (!lang || p.lang === lang) && tags.every((t) => p.tags.includes(t))
    )
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())

export let getPostBySlug = async (slug: string, lang: ILang) =>
  (await getAllPosts()).find((p) => p.slug === slug && p.lang === lang)
