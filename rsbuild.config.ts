import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import pluginStylex from "@stylexjs/unplugin";

export default defineConfig({
  html: {
    title: "Guise",
    meta: {
      description: "implies masking or theming the underlying tool",
      charset: { charset: "utf-8" },
      viewport: "width=device-width, initial-scale=1",
      "color-scheme": "dark",
    },
    tags: [
      { tag: "link", attrs: { rel: "canonical", href: "/" } },
      { tag: "link", attrs: { rel: "preconnect", href: "https://fonts.googleapis.com" } },
      { tag: "link", attrs: { rel: "preconnect", href: "https://fonts.gstatic.com" } },
      {
        tag: "link",
        attrs: {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap",
        },
      },
    ],
    scriptLoading: "module",
  },
  plugins: [pluginReact()],
  tools: {
    rspack: {
      plugins: [
        pluginStylex.rspack({
          useCSSLayers: true,
          unstable_moduleResolution: { type: "commonJS" },
          lightningcssOptions: { minify: true },
        }),
      ],
    },
  },
  source: {
    entry: { index: "./src/app/page.tsx" },
  },
});
