import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'landing-assets/[name].[hash][extname]',
        chunkFileNames: 'landing-assets/[name].[hash].js',
        entryFileNames: 'landing-assets/[name].[hash].js',
      },
    },
  },
})
