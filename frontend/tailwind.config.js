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
      keyframes: {
        scanLine: {
          "0%":   { top: "4px",   opacity: "1" },
          "48%":  { top: "calc(100% - 4px)", opacity: "1" },
          "50%":  { opacity: "0" },
          "52%":  { top: "4px",   opacity: "0" },
          "54%":  { opacity: "1" },
          "100%": { top: "calc(100% - 4px)", opacity: "1" },
        },
        popIn: {
          "0%":   { transform: "scale(0) rotate(-10deg)", opacity: "0" },
          "70%":  { transform: "scale(1.2) rotate(4deg)" },
          "100%": { transform: "scale(1) rotate(0deg)",  opacity: "1" },
        },
        fadeUp: {
          "0%":   { transform: "translateY(14px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0"  },
        },
        countUp: {
          "0%":   { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "scan-line": "scanLine 2s ease-in-out infinite",
        "pop-in":    "popIn 0.45s cubic-bezier(0.175,0.885,0.32,1.275) forwards",
        "fade-up":   "fadeUp 0.4s ease-out forwards",
        shimmer:     "shimmer 1.6s linear infinite",
        "count-up":  "countUp 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
