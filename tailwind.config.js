/** @type {import('tailwindcss').Config} */
import tokens from "@db-ui/foundations/build/tailwind/tailwind-tokens.json";

export default {
  safelist: [
    {
      pattern: /./, // all but colors
    },
  ],
  theme: {
    colors: [],
    fontFamily: [],
    fontSize: [],
    screens: tokens.screens,
    spacing: tokens.spacing,
    boxShadow: tokens.elevation,
    gap: ({ theme }) => ({
      ...theme("spacing"),
    }),
    space: ({ theme }) => ({
      ...theme("spacing"),
    }),
  },
};
