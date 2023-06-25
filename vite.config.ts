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
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 2, // barely does any difference
      }
    },
    assetsInlineLimit: 0,
  },
});
