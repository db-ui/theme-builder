import tokens from "@db-ui/foundations/build/tailwind/tailwind-tokens.json";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [],
  theme: {
    ...tokens,
    gap: ({ theme }) => ({
      ...theme("spacing"),
    }),
    space: ({ theme }) => ({
      ...theme("spacing"),
    }),
  },
};
