/** @type {import('tailwindcss').Config} */
import tailwindScrollbar from 'tailwind-scrollbar';
import plugin from 'tailwindcss/plugin'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'energy-good': "url('/background/energy-good.jpg')",
      },
      textShadow: {
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        sm: '0 1px 2px var(--tw-shadow-color)',
        md: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 4px 8px var(--tw-shadow-color)',
        xl: '0 8px 16px var(--tw-shadow-color)',
      },
    },
  },
  plugins: [
    tailwindScrollbar,
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],
}

