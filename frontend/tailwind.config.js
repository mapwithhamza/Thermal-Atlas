/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heat: {
          low: '#3b82f6',
          medium: '#f59e0b',
          high: '#f97316',
          extreme: '#ef4444',
        },
        vegetation: {
          low: '#78350f',
          medium: '#84cc16',
          high: '#22c55e',
        },
      },
    },
  },
  plugins: [],
}
