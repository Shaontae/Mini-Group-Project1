/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/*.{html,js}"],
  theme: {
    fontFamly: {
      'body': ['Kanit', 'sans-serif',],
    },
    extend: {},
    colors:{
      custom: {
        50: '#b4e8b4',
        100: '#1f1f7c',
          200: '#fc8eac',
          300: '#rgb(0,0,0,0.5)',
          'black': '#000000'
      },
      boxShadow: {
        'custom': '2px 7px 5px 5px rgb(0,0,0,0.5)',
        'cutsom1': '0 5px 5px 3px rgb(0,0,0,0.5)',
        'custom2': '0 3px 5px 2px rgb(0,0,0,0.5)',
      },
    }
  },
  plugins: [],
}

