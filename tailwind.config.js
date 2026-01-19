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
      }
    },
  },
  plugins: [],
}
