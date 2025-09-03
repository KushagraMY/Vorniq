/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/react-app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3A2496',
        accent: '#7B3A7E',
        background: '#FFFFFF',
        'background-light': '#F7F7FA',
      },
      gradientColorStops: {
        'primary-accent': ['#3A2496', '#7B3A7E'],
      },
    },
  },
  plugins: [],
};
