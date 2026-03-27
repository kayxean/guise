import type { UserConfig } from 'vite-plus';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { vitePlugin as remix } from '@remix-run/dev';
import stylex from '@stylexjs/unplugin';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  appType: 'mpa',
  base: '/',
  build: {
    cssMinify: 'lightningcss',
  },
  css: {
    transformer: 'lightningcss',
  },
  clearScreen: false,
  plugins: [
    stylex.vite({
      devMode: 'full',
      useCSSLayers: true,
      unstable_moduleResolution: {
        type: 'commonJS',
        rootDir: resolve(__dirname, './app'),
      },
      aliases: {
        '~/*': [resolve(__dirname, './app/*')],
      },
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
  lint: {
    ignorePatterns: ['dist/**'],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    ignorePatterns: ['dist/**'],
    singleQuote: true,
    semi: true,
    experimentalSortPackageJson: true,
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './app'),
    },
  },
  server: {
    cors: true,
  },
  optimizeDeps: {
    include: ['@kayxean/chromatrix', '@stylexjs/unplugin', '@stylexjs/stylex'],
  },
} satisfies UserConfig;
