import { Feed } from 'feed'
import { getAllPosts, ILang } from './posts'
import { getAuthor, getDescription, getDomain, getKeywords } from './package'

export let generate = async (locale: ILang) => {
  let [posts, domain, author, description, keywords] = await Promise.all([
    getAllPosts(),
    getDomain(),
    getAuthor(),
    getDescription(),
    getKeywords(),
  ])

  const feed = new Feed({
    title: description,
    description: `¯\\_(ツ)_/¯`,
    id: domain,
    link: `${domain}/${locale}/blog/`,
    language: locale,
    image: `${domain}/avatar.jpg`,
    favicon: `${domain}/icon.png`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${author}`,
    // updated: new Date(2013, 6, 14), // optional, default = today
    feedLinks: {
      json: `${domain}/json`,
      atom: `${domain}/blog/atom.xml`,
    },
    author: {
      name: author,
      email: '@kitos_kirsanov',
      link: domain,
    },
  })

  posts
    .filter((p) => locale == 'en' || p.lang == locale)
    .forEach((post) => {
      let link = `${domain}/${post.lang}/blog/${post.slug}/`

      feed.addItem({
        title: post.title,
        id: link,
        link,
        description: post.preface,
        // content: post.content,
        author: [
          {
            name: author,
            email: '@kitos_kirsanov',
            link: domain,
          },
        ],
        date: new Date(post.date),
        image: domain + post.thumbnail.img,
      })
    })

  keywords.forEach((k: string) => feed.addCategory(k))

  return feed
}
