/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Typography
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
        mono: ['JetBrains Mono', 'monospace'],
      },
      // Color Palette
      colors: {
        brand: {
          DEFAULT: '#2563EB', // Primary Blue
          hover:   '#1D4ED8', // Primary Dark (Standard Blue-700)
          deep:    '#0F172A', // Brand Black / Header
          soft:    '#EFF6FF', // Light Blue Accents
        },
        pos: {
          bg:      '#F8FAFC', // Background Surface
          success: '#22C55E', // Success/Online
          danger:  '#EF4444', // Error/Void
          warning: '#F97316', // Warning/Action
          highlight: '#FACC15', // Discount/Highlight
          text:    '#0F172A', // Primary Text
          muted:   '#94A3B8', // Muted Text
        }
      }
    },
  },
  plugins: [],
}