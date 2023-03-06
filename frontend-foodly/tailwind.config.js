/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.tsx',
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 4s linear infinite',
      }
    },
  },
  plugins: [
    require('tailwindcss-animate')
  ],
};
