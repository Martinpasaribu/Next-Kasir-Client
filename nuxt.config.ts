// nuxt.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-02-20',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Next Kasir',
      link: [
        // Tambahkan baris ini
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

    // 1. Aktifkan Mode Nuxt 4 (Struktur folder app/)
  future: {
    compatibilityVersion: 4,
  },
  
  runtimeConfig: {
    public: {
      node_env: process.env.NUXT_PUBLIC_NODE_ENV || 'development',
      server_api:  process.env.NUXT_SERVER_API,
      server_url: process.env.NUXT_SERVER_API,
      API_AUTH_URL: process.env.NUXT_PUBLIC_API_AUTH_URL,
      CLIENT_HASH_SECRET: process.env.NUXT_PUBLIC_CLIENT_HASH_SECRET,
      API_WEB: process.env.NUXT_PUBLIC_API_WEB,
    }
  },

  devServer: {
    port: 3003,
    host: '0.0.0.0', 
  },
  

  // 2. Tambahkan allowedHosts di dalam blok vite.server
  vite: {
    // server: {
    //   allowedHosts: [
    //     'squirrelish-perishing-cyndi.ngrok-free.dev',
    //     '.ngrok-free.dev' // Mengizinkan semua subdomain ngrok
    //   ]
    // },
    plugins: [
      (tailwindcss as any)()
    ],
  },



  // 3. Daftarkan Modules (Tanpa @nuxtjs/tailwindcss)
  modules: [
    '@vite-pwa/nuxt',
    '@pinia/nuxt',
    'dayjs-nuxt',
    '@nuxtjs/color-mode',
    'nuxt-lucide-icons',
    '@nuxt/icon',
  ],

  // 4. CSS Utama
  css: ['~/assets/css/main.css'],
  icon: {
      serverBundle: {
        collections: ['lucide', 'ph', 'heroicons'] // Tambahkan lucide di sini
      }
  },

  colorMode: {
    // Tailwind v4 mendeteksi .dark pada class secara otomatis 
    // jika kita menggunakan variabel CSS
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },
  
  nitro: {
    // Konfigurasi untuk Local Development
    serveStatic: true,
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