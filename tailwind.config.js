/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mana-bg': '#000000',
        'mana-text': '#ffffff',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'cursive': ['La Belle Aurore', 'cursive'],
      },
      letterSpacing: {
        'premium': '0.3em',
      }
    },
  },
  plugins: [],
}
