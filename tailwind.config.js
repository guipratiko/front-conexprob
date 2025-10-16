/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        darkGray: '#0a0a0a',
        lightText: '#e0e0e0',
        accent: '#FF00FF',
        neonPurple: '#9B30FF',
        neonPink: '#FF1493',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 20px rgba(155, 48, 255, 0.5)',
        'neon-pink': '0 0 20px rgba(255, 0, 255, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          'from': { boxShadow: '0 0 10px rgba(155, 48, 255, 0.5)' },
          'to': { boxShadow: '0 0 20px rgba(255, 0, 255, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}

