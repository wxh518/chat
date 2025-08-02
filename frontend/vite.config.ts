import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/renderer'),
    },
  },
  // build: {
  //   outDir: path.join(__dirname, 'release/bundled'),
  // },
  // publicDir: path.resolve(__dirname, 'public'),
  // server: {
  //   fs: {
  //     allow: [path.resolve(__dirname, 'src/renderer')],
  //   },
  // },
})
