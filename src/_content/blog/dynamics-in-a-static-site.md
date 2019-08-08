---
title: Dynamics in a static site
date: 2019-01-28T22:38:57.492Z
thumbnail: /images/uploads/blog-tech-stack.jpg
preface: >-
  In this article I want to extend functionality of tooltip we've previously
  developed. And to figure out if it is possible to deal with something dynamic
  in statically build web app.
tags:
  - cloud-functions
  - gcp
  - github-api
  - reach-ui
  - reactjs
  - CORS
  - JAMStack
---
## Decompose it!

To tell the truth, [medium like tooltip](https://www.nikitakirsanov.com/blog/implementing-medium-like-tooltip/) was implemented not to allow you to quote me in twitter (I can hardly believe somebody would ever do that). But to provide functionality for reporting typos/mistakes (at least it is useful for me).

"Why did you even created_ tweet feature_ thought it wasn't you original goal?" you might ask.

Well it's because of my passion to introduce everything very gradually. E.g. I prefer creating several small commits to single bigger one. And I encourage you to do the same, cause it'll make it much easier:

- for others to review your code 
- to explore git history eventually 

But small commits doesn't mean you won't get any benefits until the last commit. And they shouldn't break anything, leaving you codebase in some intermediate state. Quite the opposite, every single commit should make you app/lib/whatever better: extend api (new feature), fix and issue, etc.

The same thing with features you implement. Try to decompose them as much as possible: the smaller increment you produce, the faster you deliver it, the faster you get feedback, the better quality of product you build.

## Let's get down to business

So what I mean by "functionality for reporting typos/mistakes": I want to add an action to tooltip developed in [previous article](https://www.nikitakirsanov.com/blog/implementing-medium-like-tooltip/), that will open dialog with form for submitting mistake.

1. The easiest part would be to just append button to tooltip. That is how it'll look:

 [published Actions  typo-action    ](/spaces/6dybdba3jdxv/assets/3p2iUwaftzIvxgkQrewaMm)   
2. Now we should implement dialog. There is plenty of ready solutions for dialogs (like [react-modal](https://github.com/reactjs/react-modal), also lots of UI libraries offer them), but I would like to give a try to the one from [reach-ui](https://ui.reach.tech/) developed by [Ryan Florence](https://twitter.com/ryanflorence).
Its api is pretty straightforward, so I won't show an example with it (you can easily find [it on its site](https://ui.reach.tech/dialog)). But I'd like to mentioned that to animate it I used [react-spring](http://react-spring.surge.sh), as I did for tooltip (and you can also find [an example of using them together](https://ui.reach.tech/dialog#animation-example)). Here is [source code](https://github.com/kitos/kitos.github.io/blob/develop/src/components/dialog.js) of my dialog and result:

 [published Actions  typo-dialog    ](/spaces/6dybdba3jdxv/assets/kIffpltUXt1cKf2TOmnRa)   
3. The last but not least thing we should implement is backend which will receive out submissions and put it somewhere . 

## 

A in JAMStack stands for...

Wait... How static site should deal with dynamic data? Is it even possible?

Sure! Nothing stops me from using some database and **A**PI (service) to communicate with it, but:

- I don't want to complicate infrastructure of my site
Currently I am using only github pages 
- I don't want to pay for infrastructure
Moreover it mostly won't be used 
- I don't want to develop back office to manage submissions 
- I want to be fancy 

So I decided to use [github issues](https://github.com/kitos/kitos.github.io/issues) as a storage and [google cloud functions](https://cloud.google.com/functions/) as a service. This allows me to address all issues above:

- The only new thing I'll introduce is GCP function which is created in a couple of clicks 
- Unlike VMs or any other platform types, you pay only while your code runs
Also GCP [offers 2 million calls for free](https://cloud.google.com/free/), and I probably won't be able to go beyond this limit 
- GitHub has a neat way to manage issues 
- 😎 

Time to share some code, here is my cloud function:

```js
const axios = require('axios')
const querystring = require('querystring')

const github = axios.create({
  baseURL: 'https://api.github.com',
  headers: { 'User-Agent': 'blog-typo-issue-creator' },
  auth: {
    username: 'kitos',
    // always use environment variables for sensitive data
    password: process.env.GH_TOKEN
  },
});

exports.createIssue = async (request, response) =&gt; {
  let { title, link, source, suggestion } = request.query

  try {
    let { data: { html_url } } = await github.post('/repos/kitos/kitos.github.io/issues', {
      title: `Typo in blog post "${title}"`,
      body: `
There is a typo post [${title}](${link}).
### Source:
${source}
### Suggestion:
${suggestion}	
      `,
      assignees: ["kitos"],
      labels: ["blog:typo"]
  	})
    
    response.status(200).send({ url: html_url })
  } catch(e) {
    console.error(e.message)
    response.status(500).send(e.message)
  }
};
```

Pretty straightforward, right?

But you might wondering why I decided to use github api via cloud function instead of direct call. Well, I expect that not all my readers have github account and they wouldn't like to create one to submit a typo. Also later this functionality might become a part of something bigger (remember my passion to decomposition? 😏).

## Integration

The last thing we should accomplish is to call our function when user submits form. It shouldn't cause any difficulties except [same origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy): gcp function domain is like 

_https://gcpRegion-your-app-id.cloudfunctions.net/function-name_ and browser would allow to make such request.

Fortunately we have [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) mechanism which allows us to tell browser that it can use our resource (cloud function) from a different domain (

_www.nikitakirsanov.com_). And it's to implement it using GCP ([official docs](https://cloud.google.com/functions/docs/writing/http#handling_cors_requests)): you should add special response headers:

```js
exports.createIssue = async (request, response) =&gt; {
  ...
  response.set('Access-Control-Allow-Origin', "https://www.nikitakirsanov.com")
  response.set('Access-Control-Allow-Methods', 'GET')
  ...
}
```

That's it! Here is a demo:
