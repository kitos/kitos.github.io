const crypto = require('crypto')
const axios = require('axios')

const { YOUTUBE_KEY } = process.env

let youtube = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
  params: {
    key: YOUTUBE_KEY,
  },
})

let videoIds = ['WXojma0u_o4', 'QLXWhxd85Lc', 'o2svfxi1Rdg', 'q5EU1R2M574']

exports.sourceNodes = async ({ actions: { createNode } }) => {
  let {
    data: { items: videos },
  } = await youtube.get('videos', {
    params: { part: 'snippet', id: videoIds.join(',') },
  })

  videos
    .map(video => ({
      ...video,
      parent: null,
      children: [],
      internal: {
        type: 'YouTubeVideo',
        contentDigest: crypto
          .createHash(`md5`)
          .update(JSON.stringify(video))
          .digest(`hex`),
      },
    }))
    .forEach(v => createNode(v))
}
