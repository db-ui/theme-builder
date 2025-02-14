import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: `/theme-builder${process.env.VITE_FEATURE_BRANCH ?? ""}`,
  plugins: [react()],
  define: {
    global: {},
  }
});
