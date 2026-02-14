/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#1F3C88",
          secondary: "#2563EB",
          sidebar: "#0F172A",
          bg: "#F5F6FA",
          text: "#1E293B",
          muted: "#64748B",
          border: "#E5E7EB",
          success: "#16A34A",
          warning: "#F59E0B",
          danger: "#DC2626"
        }
      }
    }
  },
  plugins: []
};
