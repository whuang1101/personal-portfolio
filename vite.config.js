import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://portfolio.172.206.26.66.nip.io',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
