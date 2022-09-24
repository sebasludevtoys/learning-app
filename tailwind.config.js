/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Anybody: ["Anybody", "cursive"],
        Grotesk: ["Darker Grotesque", "sans-serif"],
        Rubik: ["Rubik Mono One", "sans-serif"],
      },
    },
  },
  plugins: [],
};
