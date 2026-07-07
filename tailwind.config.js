/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        'primary-dark': '#4f46e5',
        accent: '#06b6d4',
        surface: '#0f172a',
        'surface-light': '#1e293b',
        text: '#f1f5f9',
        'text-muted': '#94a3b8',
      },
    },
  },
  plugins: [],
}
