module.exports = {
  content: [
    "./src/main/jte/**/*.jte",
    "./src/main/resources/static/js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        secondary: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        dark: '#1f2937',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
