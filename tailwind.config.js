/** @type {import('tailwindcss').Config} */
import tokens from "@db-ui/foundations/build/tailwind/tailwind-tokens.json";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    {
      pattern: /./, // all but colors
    },
  ],
  theme: {
    colors: [],
    fontFamily: [],
    fontSize: [],
    screens: {
      xs: "360px",
      sm: "720px",
      md: "1024px",
      lg: "1440px",
      xl: "1920px",
    },
    spacing: { 0: 0, ...tokens.spacing },
    boxShadow: tokens.elevation,
    gap: ({ theme }) => ({
      ...theme("spacing"),
    }),
    space: ({ theme }) => ({
      ...theme("spacing"),
    }),
  },
};
