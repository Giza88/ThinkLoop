import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

const apiPort = process.env.VITE_API_PORT ?? '3001'
const apiOrigin = `http://localhost:${apiPort}`

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'shared'),
    },
  },
  server: {
    proxy: {
      '/api': apiOrigin,
      '/health': apiOrigin,
    },
  },
})
