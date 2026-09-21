/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tg: {
          bg: "var(--tg-theme-bg-color, #f0f4f1)",
          secondaryBg: "var(--tg-theme-secondary-bg-color, #ffffff)",
          text: "var(--tg-theme-text-color, #1e293b)",
          hint: "var(--tg-theme-hint-color, #64748b)",
          link: "var(--tg-theme-link-color, #16a34a)",
          button: "var(--tg-theme-button-color, #16a34a)",
          buttonText: "var(--tg-theme-button-text-color, #ffffff)",
        },
        garden: {
          50: "#f2fcf5",
          100: "#e1f9e8",
          200: "#c4f2d3",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          darkBg: "#0d1f14",
        }
      },
    },
  },
  plugins: [],
};
