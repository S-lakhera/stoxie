import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 10000, // Port that Render gives you (or any valid port for local dev)
    allowedHosts: ['stoxie-frontend.onrender.com'],
    host: '0.0.0.0', // Make sure it's set to '0.0.0.0' to be publicly accessible
  },
})
