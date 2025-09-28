/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        britannia: {
          navy: '#1B365D',
          gold: '#D4AF37',
          cream: '#F5F5DC',
        }
      }
    },
  },
  plugins: [],
}
