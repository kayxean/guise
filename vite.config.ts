import react from "@vitejs/plugin-react";
import stylex from "@stylexjs/unplugin"
import type { UserConfig } from "vite";

export default {
  plugins: [stylex.vite(), react()],
  base: "/",
} satisfies UserConfig;
