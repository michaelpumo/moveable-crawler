// vite.config.js
import { resolve } from 'pathe'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    minify: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'MoveableCrawler',
      // the proper extensions will be added
      fileName: 'moveable-crawler',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['jsdom'],
      output: {
        globals: {
          jsdom: 'jsdom'
        }
      }
    }
  }
})
