/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          25: "#e6f8fa",
          50: "#ddf6f9",
          200: "#99dfe8",
          500: "#42a9b8",
          600: "#368a96",
        },
        ruby: {
          300: "#f15c86",
          400: "#ed1752",
          500: "#b81040",
        },
        paper: {
          primary: "#ffffff",
          secondary: "#fbf6f2",
          tertiary: "#fafafa",
        },
        text: {
          primary: "#3e3f40",
          secondary: "#808284",
          disabled: "#d9d9da",
          border: "#eeeeee",
        },
      },
      fontFamily: {
        display: ['"Crimson Pro"', "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
