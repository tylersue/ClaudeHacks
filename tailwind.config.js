/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.jsx"
  ],
  theme: {
    extend: {
      colors: {
        'uw-red': '#C5050C',
        'uw-dark-red': '#9B0000',
      },
    },
  },
  plugins: [],
}
