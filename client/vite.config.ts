import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    host: true, // Allow access from other devices on the network
  },
  preview: {
    port: 8080,
    host: true, // Allow access from other devices on the network
  }
  
})
