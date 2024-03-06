const tailwindcss = require('tailwindcss');
module.exports = {
  plugins: [
    'postcss-preset-env',
    tailwindcss,
    ...(process.env.TAIL_ENV === 'production' ? { cssnano: {} } : {})
  ],
};