import react from "@vitejs/plugin-react";
import stylex from "@stylexjs/unplugin";
import type { UserConfig } from "vite";

export default {
  plugins: [
    stylex.vite({
      useCSSLayers: true,
      unstable_moduleResolution: {
        type: "commonJS",
      },
      lightningcssOptions: {
        minify: true,
      },
    }),
    react(),
  ],
  base: "/",
} satisfies UserConfig;
