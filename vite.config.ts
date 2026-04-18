import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/smartcity-new/',
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@mobile': path.resolve(__dirname, 'src/mobile'),
      '@pc': path.resolve(__dirname, 'src/pc'),
      '@api': path.resolve(__dirname, 'src/shared/api'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
})
