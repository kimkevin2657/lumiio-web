/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f172a', // Dark slate for headers
        accent: '#0ea5e9', // Medical blue
        'medical-bg': '#f8fafc',
        'border-color': '#e2e8f0',
      }
    },
  },
  plugins: [],
}