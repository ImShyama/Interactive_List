/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "var(--main-color)",
        second: "var(--second-color)",
        primary: "var(--primary-color)", // Custom color referencing CSS variable
        secondary: "var(--secondary-color)",
        text: "var(--text-color)", // Custom text color
      },
    },
  },
  plugins: [],
}