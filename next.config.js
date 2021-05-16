const withPreact = require('next-plugin-preact')

module.exports = withPreact({
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
  },
})
