import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // Allow external connections
    allowedHosts: [
      'localhost',
      '.trycloudflare.com', // Cloudflare Tunnel
      '.ngrok.io', // ngrok
      '.loca.lt', // LocalTunnel
      '.serveo.net', // Serveo
      '.tunnelmole.com', // TunnelMole
      '.pagekite.me', // PageKite
    ]
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  }
})

