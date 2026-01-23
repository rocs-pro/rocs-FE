/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2563EB', // Blue-600
          secondary: '#1D4ED8', // Blue-700
          border: '#E2E8F0', // Slate-200
          muted: '#64748B', // Slate-500
        }
      },
      animation: {
        'button-scale': 'buttonScale 0.2s ease-out',
        'button-pulse': 'buttonPulse 0.6s ease-in-out',
        'button-glow': 'buttonGlow 0.3s ease-out forwards',
        'modal-blur': 'modalBlur 0.3s ease-out forwards',
      },
      keyframes: {
        buttonScale: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.98)' },
        },
        buttonPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        buttonGlow: {
          '0%': { boxShadow: '0 0 0 0 rgba(37, 99, 235, 0.4)' },
          '100%': { boxShadow: '0 0 0 6px rgba(37, 99, 235, 0)' },
        },
        modalBlur: {
          '0%': { backdropFilter: 'blur(0px)' },
          '100%': { backdropFilter: 'blur(8px)' },
        },
      },
    },
  },
  plugins: [],
}
