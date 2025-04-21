/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1E1E1E',
        'dark-text': '#E0E0E0',
        'dark-primary': '#4CAF50',
        'dark-secondary': '#2196F3',
        'dark-surface': '#2C2C2C',
        'light-bg': '#F5F5F5',
        'light-text': '#2C2C2C',
        'light-primary': '#2E7D32',
        'light-secondary': '#1565C0',
        'light-surface': '#FFFFFF',
      },
    },
  },
  plugins: [],
}
