/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#1E2D3E" },   // كحلي راكز
        secondary: { DEFAULT: "#AEA597" }, // بيج/ذهبي راكز
        neutralText: { DEFAULT: "#4B5563" }, // رمادي للنصوص
      },
    },
  },
  plugins: [],
};
