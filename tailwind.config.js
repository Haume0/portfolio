/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        body: "#292929",
        grey: "#22252A",
        main: "#3737C3",
        works: "#7C71DB",
        about: "#3F1FF1",
        milk: "#E8E4F5",
      },
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        lato: ["Lato", "sans-serif"],
      },
    },
  },
  plugins: [],
};
