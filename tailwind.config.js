const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      white: colors.white,
      gray: colors.gray,
      violet: colors.violet,
      red: colors.red,
      green: colors.green,
      blue: colors.blue,
    },
    extend: {
      typography: (theme) => ({
        light: {
          css: {
            color: theme('colors.gray.200'),
            a: {
              color: theme('colors.blue.200'),
              '&:hover': {
                color: theme('colors.blue.100'),
              },
            },

            '[class~="lead"]': {
              color: theme('colors.gray.300'),
            },
            strong: {
              color: theme('colors.gray.200'),
            },
            'ol > li::before': {
              color: theme('colors.gray.400'),
            },
            'ul > li::before': {
              backgroundColor: theme('colors.gray.600'),
            },
            hr: {
              borderColor: theme('colors.gray.700'),
            },
            blockquote: {
              color: theme('colors.gray.200'),
              borderLeftColor: theme('colors.gray.700'),
            },
            h1: {
              color: theme('colors.gray.200'),
            },
            h2: {
              color: theme('colors.gray.200'),
            },
            h3: {
              color: theme('colors.gray.200'),
            },
            h4: {
              color: theme('colors.gray.200'),
            },
            'figure figcaption': {
              color: theme('colors.gray.400'),
            },
            code: {
              color: theme('colors.gray.200'),
            },
            'a code': {
              color: theme('colors.gray.200'),
            },
            pre: {
              color: theme('colors.gray.700'),
            },
            thead: {
              color: theme('colors.gray.200'),
              borderBottomColor: theme('colors.gray.600'),
            },
            'tbody tr': {
              borderBottomColor: theme('colors.gray.700'),
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {
      textDecoration: true,
      typography: ['responsive', 'dark'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
