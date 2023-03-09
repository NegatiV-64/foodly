/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.tsx',
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 4s linear infinite',
      },
      boxShadow: {
        'elevation-1': 'rgba(149, 157, 160, 0.2) 0px 6px 10px',
        'elevation-2': 'rgba(100, 100, 111, 0.2) 0px 7px 20px 0px',
      }
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
  ],
};
