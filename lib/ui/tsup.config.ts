import { defineConfig } from "tsup";
import stylexPlugin from "@stylexjs/babel-plugin";

import { transformAsync } from "@babel/core";
import presetReact from "@babel/preset-react";
import presetTypescript from "@babel/preset-typescript";

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import type { Plugin, PluginBuild, OnLoadArgs, OnLoadResult } from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stylexEsbuildPlugin: Plugin = {
  name: "stylex",
  setup(build: PluginBuild) {
    build.onLoad({ filter: /\.[jt]sx?$/ }, async (args: OnLoadArgs): Promise<OnLoadResult | undefined> => {
      if (args.path.includes("node_modules")) {
        return;
      }

      const source = await readFile(args.path, "utf8");

      const res = await transformAsync(source, {
        filename: args.path,
        presets: [
          [presetTypescript, { isTSX: true, allExtensions: true }],
          [presetReact, { runtime: "automatic" }],
        ],
        plugins: [
          [
            stylexPlugin,
            {
              dev: false,
              genConditionalClasses: true,
              runtimeInjection: true,
              treeshakeCompensation: true,
              unstable_moduleResolution: {
                type: "haste",
                rootDir: path.resolve(__dirname),
              },
              useCSSLayers: true,
            },
          ],
        ],
        babelrc: false,
        configFile: false,
      });

      if (!res || !res.code) {
        return;
      }

      return {
        contents: res.code,
        loader: "js",
      };
    });
  },
};

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  clean: true,
  shims: true,
  esbuildPlugins: [stylexEsbuildPlugin],
});
