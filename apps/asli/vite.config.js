import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/asli/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Asli — Family Tree',
        short_name: 'Asli',
        description: 'Interactive family tree — part of the Belhssan platform',
        theme_color: '#1c3d5a',
        background_color: '#efe6d2',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/asli/',
        start_url: '/asli/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg}']
      }
    })
  ]
})
