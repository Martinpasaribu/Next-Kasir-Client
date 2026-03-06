// nuxt.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-02-20',
  devtools: { enabled: true },

  devServer: {
    port: 3003,
    host: '0.0.0.0', 
  },

  // 2. Tambahkan allowedHosts di dalam blok vite.server
  vite: {
    server: {
      allowedHosts: [
        'squirrelish-perishing-cyndi.ngrok-free.dev',
        '.ngrok-free.dev' // Mengizinkan semua subdomain ngrok
      ]
    },
    plugins: [
      (tailwindcss as any)()
    ],
  },

  // 1. Aktifkan Mode Nuxt 4 (Struktur folder app/)
  future: {
    compatibilityVersion: 4,
  },

  // 3. Daftarkan Modules (Tanpa @nuxtjs/tailwindcss)
  modules: [
    '@vite-pwa/nuxt',
    '@pinia/nuxt',
    'dayjs-nuxt',
    '@nuxtjs/color-mode',
    'nuxt-lucide-icons'
  ],

  // 4. CSS Utama
  css: ['~/assets/css/main.css'],

  colorMode: {
    // Tailwind v4 mendeteksi .dark pada class secara otomatis 
    // jika kita menggunakan variabel CSS
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },
  

  // 5. Konfigurasi PWA
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Smart Kasir Pro',
      short_name: 'Kasir',
      theme_color: '#00dc82',
      background_color: '#ffffff',
      display: 'standalone',
    },
    workbox: {
      disableDevLogs: true,
      navigateFallback: '/',
      navigateFallbackDenylist: [/^\/_nuxt\/@fs/],
      // Hanya aktifkan precache penuh di production untuk menghindari warning dev
      globPatterns: process.env.NODE_ENV === 'production' ? ['**/*.{js,css,html,png,svg,ico}'] : [],
    },
    devOptions: {
      enabled: false,
      type: 'classic', 
    },
  },


  // 6. Pinia Store Auto-import untuk Nuxt 4
  pinia: {
    storesDirs: ['./app/stores/**'],
  }
})