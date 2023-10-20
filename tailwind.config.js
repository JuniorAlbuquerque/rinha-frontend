/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        key: "#4E9590",
        indicator: "#F2CAB8",
        line: "#BFBFBF",
        error: "#BF0E0E",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        wiggle: "wiggle 250ms ease-in-out",
      },
    },
  },
  plugins: [],
};
