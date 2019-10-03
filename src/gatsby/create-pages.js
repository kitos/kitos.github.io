const path = require('path')
const intersection = require('lodash.intersection')
const groupBy = require('lodash.groupby')

let groupPostsByTag = posts =>
  posts.reduce(
    (map, post) =>
      post.tags.reduce((map, tag) => {
        let tagPosts = [post]

        if (map.has(tag)) {
          tagPosts = [...map.get(tag), ...tagPosts]
        }

        return map.set(tag, tagPosts)
      }, map),
    new Map()
  )

let getSimilarPost = ({ slug, tags }, posts) =>
  posts
    .map(p => ({ ...p, similarity: intersection(p.tags, tags).length }))
    .filter(p => p.slug !== slug && p.similarity !== 0)
    .sort((a, b) => b.similarity - a.similarity || b.date.localeCompare(a.date))
    .slice(0, 3)
    .map(({ id }) => id)

module.exports = ({ graphql, actions: { createPage, createRedirect } }) =>
  graphql(`
    {
      posts: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "_content/blog/" } }
      ) {
        edges {
          node {
            id
            frontmatter {
              slug
              lang
              date
              tags
            }
          }
        }
      }
    }
  `).then(({ data }) => {
    let posts = data.posts.edges.map(
      ({
        node: {
          frontmatter: { tags = [], ...f },
          ...post
        },
      }) => ({
        tags,
        ...post,
        ...f,
      })
    )

    // create blog post pages
    posts.forEach(post => {
      let { id, lang, slug } = post

      createPage({
        path: `/${lang}/blog/${slug}/`,
        component: path.resolve('./src/templates/blog-post.js'),
        context: {
          id,
          slug,
          similarPosts: getSimilarPost(post, posts),
        },
      })
    })

    let postMapsByLang = Object.values(groupBy(posts, 'slug')).map(posts => ({
      ...(posts.find(({ lang }) => lang === 'en') || posts[0]),
      tags: [...new Set(posts.flatMap(({ tags }) => tags))],
    }))

    let postsByTag = groupPostsByTag(postMapsByLang)

    postsByTag.set('', postMapsByLang)

    // create blog tag root pages
    postsByTag.forEach((posts, tag) =>
      createPage({
        path: `/blog/${tag ? `tag/${tag}/` : ''}`,
        component: path.resolve('./src/templates/blog-post-list.js'),
        context: {
          tag,
          slugs: posts.map(({ slug }) => slug),
        },
      })
    )
  })
