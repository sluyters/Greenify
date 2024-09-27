/** @type {import('tailwindcss').Config} */
import tailwindScrollbar from 'tailwind-scrollbar';

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
  plugins: [
    tailwindScrollbar
  ],
}

