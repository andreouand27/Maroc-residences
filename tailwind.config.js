/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Taupe from the Maroc Residences logo.
        taupe: '#b8aa98',
      },
    },
  },
  plugins: [],
}
