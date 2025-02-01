// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lavender: "#B8B5E1",    // Light purple/lavender
        softBlue: "#ADD8E6",     // Soft blue
        paleYellow: "#F5E6CA",   // Pale yellow/cream
        deeperPurple: "#9370DB", // Deeper purple (in corners)
        mintAqua: "#A7E8D0",     // Mint/aqua blue
      },
    },
  },
  plugins: [],
};