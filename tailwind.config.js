/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        claude: {
          50: '#fef5ee',
          100: '#fce8d6',
          200: '#f8cdac',
          300: '#f3aa77',
          400: '#ed7c40',
          500: '#e95a1a',
          600: '#da4110',
          700: '#b52f10',
          800: '#902715',
          900: '#752314',
        },
      },
    },
  },
  plugins: [],
}
