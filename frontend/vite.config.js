import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/app/',
  build: {
    outDir: '../public/app',
    emptyOutDir: true
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080',
      '/.netlify': 'http://localhost:8888'
    }
  }
})
