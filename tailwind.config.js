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
      colors: {
        brand: {
          DEFAULT: '#2563EB', // Primary Blue
          hover:   '#1D4ED8', // Darker Blue (Hover)
          deep:    '#0F172A', // Dark Slate (Header/Login BG)
          soft:    '#EFF6FF', // Light Blue
        },
        pos: {
          bg:      '#F1F5F9', // Workspace Grey
          success: '#22C55E', // Green Indicators
          danger:  '#DC2626', // Red/Exit
          warning: '#FACC15', // Yellow/Alerts
          text:    '#1E293B', // Main Text
        }
      }
    },
  },
  plugins: [],
}