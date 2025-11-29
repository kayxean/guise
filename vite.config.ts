import type { UserConfig } from "vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import stylex from "@stylexjs/unplugin";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  base: "/",
  build: {
    cssMinify: "lightningcss",
  },
  clearScreen: false,
  css: {
    transformer: "lightningcss",
  },
  plugins: [
    stylex.vite({
      useCSSLayers: true,
      unstable_moduleResolution: { type: "commonJS", rootDir: resolve(__dirname, "./src") },
      lightningcssOptions: { minify: true },
    }),
    react(),
  ],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
    },
  },
} satisfies UserConfig;
