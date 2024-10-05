/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react");
export default {
  content: [
    "./index.html",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  
  darkMode: "class",
  plugins: [nextui()]
}
module.exports = {
  content: [
    // Example content paths...
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
}