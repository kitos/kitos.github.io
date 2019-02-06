const axios = require('axios')
const crypto = require('crypto')

const github = axios.create({
  baseURL: 'https://api.github.com',
  headers: { 'User-Agent': 'blog-typo-issue-creator' },
  auth: {
    username: 'kitos',
    password: process.env.GH_TOKEN,
  },
})

const ISSUES_ROOT = '/repos/kitos/kitos.github.io/issues'

let createTypoIssue = ({ title, link, source, suggestion }) =>
  github.post(ISSUES_ROOT, {
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

const hash = obj =>
  crypto
    .createHash('md5')
    .update(JSON.stringify(obj))
    .digest('hex')
    .substr(0, 6)

let createBug = async ({ message, stack, userAgent }) => {
  let issueHash = hash({ message, stack })
  let hashLabel = `hash:${issueHash}`
  let { data: existingIssues } = await github.get(ISSUES_ROOT, {
    params: { labels: hashLabel },
  })

  if (existingIssues.length !== 0) {
    return { data: existingIssues[0] }
  }

  return github.post(ISSUES_ROOT, {
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
    labels: ['bug', hashLabel],
  })
}

exports.createIssue = async (request, response) => {
  response.set('Access-Control-Allow-Origin', 'https://www.nikitakirsanov.com')
  response.set('Access-Control-Allow-Methods', 'GET')

  try {
    let userAgent = request.headers['user-agent']
    let { type = 'typo', ...payload } = request.query
    let {
      data: { html_url },
    } = await (type === 'typo'
      ? createTypoIssue(payload)
      : createBug({ ...payload, userAgent }))

    response.status(200).send({ url: html_url })
  } catch (e) {
    console.error(e.message)
    response.status(500).send(e.message)
  }
}
