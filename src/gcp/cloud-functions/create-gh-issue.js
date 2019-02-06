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

let createBug = ({ message, stack, userAgent }) => ({
  title: `Bug! "${message}"`,
  body: `
*This issue was automatically generated.*

### Stack:

\`\`\`
${stack}
\`\`\`

### User agent:

\`\`\`
${userAgent}
\`\`\``,
  assignees: ['kitos'],
  labels: ['bug'],
})

exports.createIssue = async (request, response) => {
  response.set('Access-Control-Allow-Origin', 'https://www.nikitakirsanov.com')
  response.set('Access-Control-Allow-Methods', 'GET')

  try {
    let userAgent = request.headers['user-agent']
    let { type = 'typo', ...payload } = request.query
    let issue =
      type === 'typo'
        ? createTypoIssue(payload)
        : createBug({ ...payload, userAgent })
    let {
      data: { html_url },
    } = await github.post('/repos/kitos/kitos.github.io/issues', issue)

    response.status(200).send({ url: html_url })
  } catch (e) {
    console.error(e.message)
    response.status(500).send(e.message)
  }
}
