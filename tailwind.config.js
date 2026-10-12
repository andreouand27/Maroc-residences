/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      screens: {
        // Short screens: phones held sideways, small laptop windows.
        short: { raw: '(max-height: 640px)' },
      },
      colors: {
        // Taupe from the Maroc Residences logo.
        taupe: '#b8aa98',
      },
    },
  },
  plugins: [],
}
