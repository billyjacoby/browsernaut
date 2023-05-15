/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html',],
  theme: {
    extend: {
      colors: {
        'BN-green': '#61E97F',
        'BN-purple': '#5B0FBC',
      }
    },
  },
  plugins: [],
}

