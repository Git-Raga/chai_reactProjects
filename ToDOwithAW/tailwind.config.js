
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        titillium: ['"Titillium Web"', 'sans-serif'],
        bonaNovaSC: ['"Bona Nova SC"', 'serif'],
        poppins: ['"Poppins"', 'sans-serif'], // Added Poppins
        teko: ['Teko', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
