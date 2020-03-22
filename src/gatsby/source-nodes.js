const axios = require('axios')
const slugify = require('@sindresorhus/slugify')

let enrichPublicActivityVideos = async ({
  actions: { createNodeField },
  getNodes,
}) => {
  let videos = getNodes().filter(n => n.internal.type === 'TalksYaml')

  let videoMap = videos.reduce((map, video) => {
    let [_, id] = video.url.match(/v=(.*)/)

    return map.set(id, video)
  }, new Map())

  let videoIds = Array.from(videoMap.keys())

  let {
    data: { items: youtubeSnippets },
  } = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
    params: {
      key: process.env.YOUTUBE_KEY,
      part: 'snippet,contentDetails',
      id: videoIds.join(','),
    },
  })

  videoMap.forEach((video, id) => {
    let snippet = youtubeSnippets.find(s => s.id === id)

    createNodeField({
      node: video,
      name: 'snippet',
      value: snippet,
    })

    createNodeField({
      node: video,
      name: 'slug',
      value: slugify(video.title),
    })
  })
}

module.exports = (...args) => Promise.all([enrichPublicActivityVideos(...args)])
