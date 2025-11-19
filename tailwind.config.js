/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './pages/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-1': '#001021',
        'deep-2': '#001b3a',
        'neon': '#66f6ff'
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'Inter', 'sans-serif']
      },
      keyframes: {
        gradientShift: {
          '0%': { transform: 'translateX(-10%) translateY(0)' },
          '50%': { transform: 'translateX(10%) translateY(5%)' },
          '100%': { transform: 'translateX(-10%) translateY(0)' }
        }
      },
      animation: {
        'grad-move': 'gradientShift 20s linear infinite'
      }
    }
  },
  plugins: [],
}