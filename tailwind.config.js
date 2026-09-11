/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { neon: "#04F06A", space: "#020604" },
      fontFamily: { display: ["Space Grotesk", "sans-serif"] }
    }
  },
  plugins: []
};