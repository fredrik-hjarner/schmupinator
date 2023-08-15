/// <reference types="vitest" />

import { defineConfig, splitVendorChunkPlugin } from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [splitVendorChunkPlugin()],
  resolve: {
    alias: {
      // This makes it so that imports like `from "@/components"` work.
      '@': path.resolve(__dirname, './src'),
    },
  },
  worker: { format: "es" },
  build: {
    target: 'esnext', // minimal transpilation
    modulePreload: false, // default: `true`. If `false` then the output can be run with node.
    minify: "terser",
    terserOptions: {
      compress: {
        passes: 2, // cuts a few bytes
        drop_console: true, // cuts a few bytes
        // booleans_as_integers: true, // cuts a few bytes
        // keep_fargs: false, // cuts a few bytes
        // unsafe: true, // cuts a few bytes
      },
    },
    assetsInlineLimit: 0,
  },
});
