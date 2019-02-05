const axios = require('axios')

const github = axios.create({
  baseURL: 'https://api.github.com',
  headers: { 'User-Agent': 'blog-typo-issue-creator' },
  auth: {
    username: 'kitos',
    password: process.env.GH_TOKEN,
  },
})

let createTypoIssue = ({ title, link, source, suggestion }) => ({
  title: `Typo in blog post "${title}"`,
  body: `
There is a typo post [${title}](${link}).

### Source:

${source}

### Suggestion:

${suggestion}`,
  assignees: ['kitos'],
  labels: ['blog:typo'],
})

exports.createIssue = async (request, response) => {
  let payload = request.query

  response.set('Access-Control-Allow-Origin', 'https://www.nikitakirsanov.com')
  response.set('Access-Control-Allow-Methods', 'GET')

  try {
    let {
      data: { html_url },
    } = await github.post(
      '/repos/kitos/kitos.github.io/issues',
      createTypoIssue(payload)
    )

    response.status(200).send({ url: html_url })
  } catch (e) {
    console.error(e.message)
    response.status(500).send(e.message)
  }
}
