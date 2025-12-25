/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['Roboto Slab', 'serif'],
        'raleway': ['Raleway', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
