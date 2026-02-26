import type { UserConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { vitePlugin as remix } from '@remix-run/dev';
import stylex from '@stylexjs/unplugin';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  base: '/',
  build: {
    cssMinify: 'lightningcss',
  },
  clearScreen: false,
  css: {
    transformer: 'lightningcss',
  },
  plugins: [
    stylex.vite({
      devMode: 'full',
      useCSSLayers: true,
      unstable_moduleResolution: {
        type: 'commonJS',
        rootDir: resolve(__dirname, './app'),
      },
      lightningcssOptions: { minify: true },
    }),
    remix({
      ssr: false,
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '~/color': resolve(__dirname, './app/features/color'),
      '~/browser': resolve(__dirname, './app/features/browser'),
      '~/color-picker': resolve(__dirname, './app/features/color-picker'),
      '~': resolve(__dirname, './app'),
    },
  },
  server: {
    cors: true,
  },
} satisfies UserConfig;
