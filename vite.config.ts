import { defineConfig, splitVendorChunkPlugin } from 'vite';

export default defineConfig({
  assetsInclude: ['**/*.zip'],
  plugins: [splitVendorChunkPlugin()],
  build: {
    minify: 'terser',
    assetsInlineLimit: 0,
  },
});
