/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bit: {
          navy: '#0A2540',
          blue: '#1E40AF',
          gold: '#F59E0B',
          teal: '#0D9488',
          maroon: '#881337',
          gray: '#F8FAFC'
        }
      }
    },
  },
  plugins: [],
}
