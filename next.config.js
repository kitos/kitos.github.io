const withPreact = require('next-plugin-preact')

module.exports = withPreact({
  i18n: {
    localeDetection: false,
    locales: ['en', 'ru'],
    defaultLocale: 'en',
  },
})
