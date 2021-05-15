const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    colors: {
      white: colors.white,
      gray: colors.gray,
      violet: colors.violet,
    },
    extend: {},
  },
  variants: {
    extend: {
      textDecoration: true,
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
