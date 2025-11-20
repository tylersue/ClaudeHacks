/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./BadgerResearchGraph.jsx"
  ],
  theme: {
    extend: {
      colors: {
        'uw-red': '#C5050C',
      }
    },
  },
  plugins: [],
}
