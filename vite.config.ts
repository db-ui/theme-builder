import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as url from "url";

// https://vitejs.dev/config/
export default defineConfig({
  base: `/theme-builder${process.env.VITE_FEATURE_BRANCH ?? ""}`,
  plugins: [react()],
  define: {
    global: {},
  },
  resolve: {
    alias: {
      "@db-ux": url.fileURLToPath(
        new URL("./node_modules/@db-ux", import.meta.url),
      ),
    },
  },
});
