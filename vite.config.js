import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon-192.svg', 'icon-512.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        id: '/',
        name: 'Early Emotional Distress Detection & Support',
        short_name: 'Distress Support',

        description: 'Mental health support app for early-career individuals',

        start_url: '/',
        scope: '/',
        dir: 'ltr',
        lang: 'en-US',

        display: 'standalone',
        display_override: ['standalone', 'minimal-ui', 'browser'],

        orientation: 'any',

        categories: ['health', 'medical', 'lifestyle', 'productivity'],

        theme_color: '#5F7FA8',
        background_color: '#E9EEF3',

        related_applications: [],
        prefer_related_applications: false,

        icons: [
          {
            src: 'icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],

        shortcuts: [
          {
            name: 'Emergency Help',
            short_name: 'Emergency',
            url: '/emergency',
            icons: [{ src: '/icon-512.png', sizes: '512x512' }]
          },
          {
            name: 'Stress Relief Exercises',
            short_name: 'Exercises',
            url: '/exercises',
            icons: [{ src: '/icon-512.png', sizes: '512x512' }]
          },
          {
            name: 'AI Support Chat',
            short_name: 'AI Chat',
            url: '/chat',
            icons: [{ src: '/icon-512.png', sizes: '512x512' }]
          }
      ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
})
