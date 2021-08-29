import path from 'path'
import fs from 'fs'
import got from 'got'
import { ILang } from './posts'

let _domain
let getDomain = async () =>
  (_domain ??= await fs.promises
    .readFile(path.join(process.cwd(), 'package.json'))
    .then((f) => JSON.parse(f.toString()).homepage))

let getJson = <R>(path: string) =>
  got(`https://webmention.io/api${path}`).json<R>()

let getPageUrl = async (slug: string, lang: ILang) =>
  `${await getDomain()}/${lang}/blog/${slug}/`

export interface IWebMentionsCount {
  like?: number
  mention?: number
  repost?: number
}

export let count = async (slug: string, lang: ILang) => {
  let { type } = await getJson<{ type: IWebMentionsCount }>(
    `/count.json?target=${await getPageUrl(slug, lang)}`
  )
  return type
}

export interface IWebMention {
  id: number
  source: string
  verified: boolean
  verified_date: string
  private: false
  data: {
    author: {
      name: string
      url: string
      photo: string
    }
    url: string
    name: null
    content: null
    published: null
    published_ts: null
  }
  activity: {
    type: 'like'
    sentence: string
    sentence_html: string
  }
  target: string
}

export let comments = async (slug: string, lang: ILang) => {
  let { links } = await getJson<{ links: IWebMention[] }>(
    `/mentions.json?target=${await getPageUrl(
      slug,
      lang
    )}&wm-property=in-reply-to`
  )
  return links
}
