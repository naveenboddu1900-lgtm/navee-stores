import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (error, req) => {
            console.warn(`[vite] backend not ready for ${req.url}: ${error.code || error.message}`)
          })
        }
      }
    }
  }
})
