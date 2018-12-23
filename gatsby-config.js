const pkg = require('./package')

module.exports = {
  siteMetadata: {
    title: 'Nikita Kirsanov',
    version: pkg.version,
    siteUrl: 'https://www.nikitakirsanov.com/',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-styled-components',
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
        path: `${__dirname}/src/pages`,
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
    'gatsby-transformer-yaml',
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: `6dybdba3jdxv`,
        accessToken:
          process.env.CONTENTFUL_ACCESS_TOKEN,
        plugins: ['@contentful/gatsby-transformer-contentful-richtext'],
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
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GOOGLE_TRACKING_ID,
      },
    },
  ],
}
