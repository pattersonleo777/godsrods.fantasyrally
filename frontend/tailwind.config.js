/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        header: ['Orbitron', 'sans-serif'],
        body: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        neon: {
          blue: '#00d4ff',
          pink: '#ff00ff',
          green: '#00ff88',
        }
      }
    },
  },
  plugins: [],
}
