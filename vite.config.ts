import { defineConfig, splitVendorChunkPlugin } from 'vite';

export default defineConfig({
  assetsInclude: ['**/*.zip'],
  plugins: [splitVendorChunkPlugin()],
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
