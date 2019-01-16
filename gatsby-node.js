const path = require('path')
const { createFilePath } = require(`gatsby-source-filesystem`)
const axios = require('axios')
const sanitizeHtml = require('sanitize-html')
const words = require('lodash.words')

const { YOUTUBE_KEY } = process.env

let youtube = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
  params: {
    key: YOUTUBE_KEY,
  },
})

let enrichPublicActivityVideosWithYouTubeSnippets = async ({
  actions: { createNodeField },
  getNodes,
}) => {
  let videos = getNodes().filter(
    n => n.internal.type === 'ContentfulPublicActivity' && n.type === 'video'
  )

  let videoMap = videos.reduce((map, video) => {
    let [_, id] = video.url.match(/v=(.*)/)

    return map.set(id, video)
  }, new Map())

  let videoIds = Array.from(videoMap.keys())

  let {
    data: { items: youtubeSnippets },
  } = await youtube.get('videos', {
    params: { part: 'snippet,contentDetails', id: videoIds.join(',') },
  })

  videoMap.forEach((video, id) => {
    let snippet = youtubeSnippets.find(s => s.id === id)

    createNodeField({
      node: video,
      name: 'snippet',
      value: snippet,
    })
  })
}

exports.sourceNodes = (...args) =>
  Promise.all([enrichPublicActivityVideosWithYouTubeSnippets(...args)])

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

let timeToRead = html => {
  let plainText = sanitizeHtml(html, {
    allowedTags: false,
  })
  let wordCount = words(plainText).length
  let avgWPM = 200

  return Math.floor(wordCount / avgWPM) || 1
}

exports.createPages = ({ graphql, actions: { createPage } }) =>
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
                html
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
        // we do not need heavy content on blog post list pages
        content: undefined,
        // it should word out of the box one day...
        // https://github.com/contentful/rich-text/pull/60
        timeToRead: timeToRead(n.content.childContentfulRichText.html),
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
        path: `/blog/${tag ? `tag/${tag}` : ''}/`,
        component: path.resolve('./src/templates/blog-post-list.js'),
        context: {
          tag,
          posts,
        },
      })
    )
  })
