/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rkg: {
          crimson: '#890022',
          'crimson-dark': '#650019',
          'crimson-light': '#b2283b',
          pink: '#ff69b4',
          'pink-deep': '#ac2471',
          'pink-light': '#ffe4e1',
          'pink-bg': '#fff0f5',
          surface: '#fff8f8',
          gold: '#d4af37',
          'east-blue': '#1e40af',
          'west-green': '#047857'
        }
      },
      boxShadow: {
        'pink-glow': '0 10px 25px -5px rgba(255, 105, 180, 0.2), 0 8px 10px -6px rgba(255, 105, 180, 0.15)',
        'card-soft': '0 4px 20px -2px rgba(172, 36, 113, 0.08)',
        'elevated': '0 20px 30px -10px rgba(137, 0, 34, 0.12)'
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
