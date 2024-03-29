---
slug: build-related-reads-for-your-gatsby-blog
lang: en
tweet_id: t1255879654927413250
title: Build "Related Reads" for your gatsby blog
date: 2020-04-30T09:32:32.760Z
thumbnail:
  author: israel palacio
  src: https://unsplash.com/@othentikisra?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
  img: /uploads/connection.jpg
tags:
  - gatsbyjs
  - plugin
  - blog
  - JAMStack
preface: In this article I will tell how to build "Related Reads" section for a
  Gatsby blog, like the one you can find at the bottom of this page.
---
In this article I will tell how to build "Related Reads" section for a [gatsby](https://www.gatsbyjs.org/) blog, like the one you can find at the bottom of this page.

As a prerequisite I expect, that you are already familiar with gatsby or even have an app with some source `[-plugin]`where you pull your articles from.

I use [netlify cms](https://www.netlifycms.org/) and store all my articles next to the source code [in git](https://github.com/kitos/kitos.github.io/tree/develop/src/_content/blog) as markdown files. So `gatsby-source-filesystem` and `gatsby-transformer-remark` plugins are responsible for making them available in graphql. E.g. here is how I can query all articles:

```graphql
query BlogPostList {
  allMarkdownRemark {
    nodes {
      frontmatter {
        title
      }
    }
  }
}
```

But enough about me, let's get back to business.

## Setup local plugin

First of all, I want to implement this feature as a local plugin (instead of root `gatsby-node.js`). I find this approach more idiomatic and clear. Creating one is a piece of cake and gatsby has [a decent documentation about it](https://www.gatsbyjs.org/docs/creating-a-local-plugin/), so check it out if you haven't yet.

As a result, we should have `/plugins/related-reads/gatsby-node.js` along with empty `package.json` and name (equal to name of the folder!) of our plugin listed in `gatsby-config.js`.

## Extend graphql

The next step would be extending graphql schema, generated by `gatsby-transformer-remark`. So along with a content of an article, we can also request a list of articles about similar topic[s]. Like this:

```graphql
query BlogPostList {
  allMarkdownRemark {
    nodes {
      frontmatter {
        title
      }

      // highlight-start
      relatedReads {
        slug
        title
      }
      // highlight-end
    }
  }
}
```

[A while ego](https://www.gatsbyjs.org/blog/2019-03-04-new-schema-customization/) gatsby team provided very nice way to achieve this - [schema customization API](https://www.gatsbyjs.org/docs/schema-customization). And we are going to leverage it, particularly `createResolvers`:

```js
exports.createResolvers = ({ createResolvers }) =>
  createResolvers({
    // node type we want to extend
    MarkdownRemark: {
      // name of the field we want to add
      relatedReads: {
        // we return an array of other articles
        type: '[MarkdownRemark!]',
        // let's allow to specify number of articles returned
        args: { limit: 'Int' },

        async resolve(
          source, // the node we extend
          args,
          // collection of helpers
          // including access to internal store - nodeModel
          ctx

        ) {
          return []
        },
      },
    },
  })
```

No we can implement the last bit - the logic of _Relative Reads_. In my blog each post have a list of tags, so I gonna use it to measure similarity.

```js
const intersection = require('lodash.intersection')

// I've extracted the resolve function just to get rid of extra noise
let resolve = async (source, args, ctx) {
  let { frontmatter: { slug, lang, tags } } = source
  let { limit = Number.MAX_SAFE_INTEGER } = args

  // request all other posts
  let otherPosts = await ctx.nodeModel.runQuery({
    firstOnly: false, // we want to get an array
    type: 'MarkdownRemark',
    query: {
      filter: {
        frontmatter: {
          slug: { ne: slug }, // not current article or translation
          lang: { eq: lang }, // same lang
        },
      },
    },
  })

  return otherPosts
    .map((p) => ({
      ...p,
      // measure the similarity by the size of tags intersection
      similarity: intersection(p.frontmatter.tags, tags).length,
    }))
    .filter(({ similarity }) => similarity !== 0)
    .sort(
      (a, b) =>
        b.similarity - a.similarity ||
        b.frontmatter.date.localeCompare(a.frontmatter.date)
    )
    .slice(0, limit)
}
```

That is it! Pretty easy implementation and zero runtime cost - everything is requested ahead of time and build into your html pages, that is the strongest point if gatsby and JAMStack.

Did you like this post? Want to hear more stories about gatby? Please leave comment about things you'd like to know about.
