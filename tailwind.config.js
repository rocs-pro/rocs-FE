/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      // RESTORE THIS SECTION:
      colors: {
        brand: {
          DEFAULT: '#2563EB', // Primary Blue [cite: 5]
          hover:   '#1D4ED8', // Primary Dark [cite: 7]
          deep:    '#0F172A', // Brand Black [cite: 10]
          soft:    '#EFF6FF', 
        },
        pos: {
          bg:      '#F8FAFC', // Background Surface [cite: 12]
          success: '#22C55E', // Success/Online [cite: 14]
          danger:  '#EF4444', // Error [cite: 18]
          warning: '#F97316', // Warning [cite: 19]
          text:    '#0F172A', // POS Text [cite: 34]
        }
      }
    },
  },
  plugins: [],
}