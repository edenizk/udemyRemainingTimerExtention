const colors = require('tailwindcss/colors')

module.exports = {
    content: ['./dist/*.html'],
    theme: {
      extend: {},
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'white': '#ffffff',
        'shark': '#2D2F31',
        'capeCod': '#3D3F41',
        'porcelain': '#E3E7EA',
        black: colors.black,
        white: colors.white,
        gray: colors.slate,
        green: colors.emerald,
        purple: colors.violet,
        yellow: colors.amber,
        pink: colors.fuchsia,
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
  }