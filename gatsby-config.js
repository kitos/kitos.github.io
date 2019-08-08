const pkg = require('./package')

require('dotenv').config({
  path: `.env.development`,
})

const rssPlugin = require('./src/gatsby/rss-plugin')
const contentfulRichtextPlugin = require('./src/gatsby/contentful-richtext-plugin')

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
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-netlify-cms',
    rssPlugin,
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
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: ['gatsby-remark-emoji'],
      },
    },
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: `6dybdba3jdxv`,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      },
    },
    contentfulRichtextPlugin,
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
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GOOGLE_TRACKING_ID,
      },
    },
  ],
}
