/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'energy-good': "url('/background/energy-good.jpg')"
      }
    },
  },
  plugins: [],
}

