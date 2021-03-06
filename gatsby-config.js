const pkg = require('./package')

require('dotenv').config({
  path: `.env.development`,
})

const rssPlugin = require('./src/gatsby/rss-plugin')

module.exports = {
  siteMetadata: {
    title: 'Nikita Kirsanov',
    description: 'Personal blog of software engineer - Nikita Kirsanov',
    img: 'https://www.nikitakirsanov.com/icons/icon-512x512.png',
    keywords: ['blog', 'personal', 'software engineer', 'CV', 'portfolio'],
    version: pkg.version,
    siteUrl: 'https://www.nikitakirsanov.com',
    social: {
      twitter: '@kitos_kirsanov',
    },
  },
  plugins: [
    // local
    'related-reads',
    'webmentiones',
    // node_modules
    'gatsby-plugin-reason',
    'gatsby-plugin-preact',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-netlify-cms',
    'gatsby-plugin-twitter',
    rssPlugin,
    {
      resolve: `gatsby-plugin-webmention`,
      options: {
        username: 'nikitakirsanov.com',
        identity: {
          github: 'kitos',
          twitter: 'kitos_kirsanov',
        },
        mentions: true,
        pingbacks: false,
        // forwardPingbacksAsWebmentions: 'https://example.com/endpoint',
        domain: 'nikitakirsanov.com',
        fetchLimit: 10000, // number of webmentions to fetch
        token: process.env.WEBMENTIONS_TOKEN,
      },
    },
    {
      resolve: 'gatsby-plugin-layout',
      options: {
        component: require.resolve('./src/components/layout.js'),
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `uploads`,
        path: `${__dirname}/static/images/uploads`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/_content`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/CHANGELOG.md`,
      },
    },
    {
      resolve: 'gatsby-transformer-yaml',
      options: {
        path: `${__dirname}/src/_content`,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-emoji',
          'gatsby-remark-relative-images',
          'gatsby-remark-copy-linked-files',
          {
            resolve: 'gatsby-remark-autolink-headers',
            options: {
              offsetY: 0,
              maintainCase: false,
              removeAccents: true,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              withWebp: true,
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: { inlineCodeMarker: `±` },
          },
          {
            resolve: `gatsby-remark-embedded-codesandbox`,
            options: {
              directory: `${__dirname}/src/_content/codesandbox`,
              getIframe: (url) =>
                `<iframe
                    data-src="${url}"
                    class="embedded-codesandbox"
                    style="border: none"
                    width="600"
                    height="300"
                    sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin">
                 </iframe>`,
            },
          },
          `gatsby-remark-responsive-iframe`,
        ],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Nikita Kirsanov',
        short_name: 'kitos',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/icon.png',
      },
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
  ],
}
