const path = require('path')

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

module.exports = ({ graphql, actions: { createPage } }) =>
  graphql(`
    {
      posts: allContentfulBlog(sort: { fields: [createdAt], order: DESC }) {
        edges {
          node {
            slug
            draft
            title
            createdAt
            updatedAt
            preface {
              childContentfulRichText {
                html
              }
            }
            tags
            content {
              childContentfulRichText {
                timeToRead
              }
            }
          }
        }
      }
    }
  `).then(({ data }) => {
    let posts = data.posts.edges
      .filter(e => !e.node.draft)
      .map(({ node: n }) => ({
        ...n,
        preface: n.preface.childContentfulRichText.html,
        timeToRead: n.content.childContentfulRichText.timeToRead,
      }))

    // create blog post pages
    posts.forEach(({ slug }) =>
      createPage({
        path: `/blog/${slug}/`,
        component: path.resolve('./src/templates/blog-post.js'),
        context: {
          slug,
        },
      })
    )

    let postsByTag = groupPostsByTag(posts)

    postsByTag.set('', posts)

    // create blog tag root pages
    postsByTag.forEach((posts, tag) =>
      createPage({
        path: `/blog/${tag ? `tag/${tag}/` : ''}`,
        component: path.resolve('./src/templates/blog-post-list.js'),
        context: {
          tag,
          posts,
        },
      })
    )
  })
