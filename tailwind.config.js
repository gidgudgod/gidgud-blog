/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#000',
          light: '#fff',
        },
        highlight: {
          dark: '#ffffff',
          light: '#1f1f1f',
        },
        secondary: {
          dark: '#707070',
          light: '#e6e6e6',
        },
        action: '#3b82f6',
      },
    },
    backgroundImage: {
      'png-pattern': "url('/empty-bg.jpg')",
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
