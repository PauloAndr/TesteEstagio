/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arvo', 'ui-sans-serif', 'system-ui'],
        serif: ['Arvo', 'ui-serif', 'Georgia'],
      },
    },
  },
  plugins: [],
}
