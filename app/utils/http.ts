// app/utils/http.ts
import axios from 'axios'

const http = axios.create({
  timeout: 15000
})


http.interceptors.request.use((config) => {
  const token = useCookie('auth_token').value
  const tenantId = useCookie('tenant_id').value
  const outletId = useCookie('outlet_id').value
  const runtime = useRuntimeConfig()

  config.baseURL = runtime.public.server_api || 'https://api.nextkasir.pro'

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // --- PERBAIKAN DI SINI ---
  
  // 1. Cek apakah header 'x-tenant-id' SUDAH ADA (dikirim manual dari login.vue)
  // Jika sudah ada, jangan timpa dengan logic hostname!
  if (!config.headers['x-tenant-id']) {
    if (tenantId) {
      config.headers['x-tenant-id'] = tenantId
    } else if (typeof window !== 'undefined') {
      // Fallback deteksi subdomain jika cookie kosong DAN bukan sedang SSR
      const host = window.location.hostname
      
      // Jika localhost atau vercel, arahkan ke dummy
      if (host.includes('localhost') || host.includes('vercel.app') || host.includes('next-kasir-client.vercel.app') ) {
        config.headers['x-tenant-id'] = 'tenant_yenishope_77n4b'
      } else {
        const parts = host.split('.')
        if (parts.length > 1) {
          config.headers['x-tenant-id'] = parts[0] !== 'www' ? parts[0] : parts[1]
        }
      }
    }
  }

  if (outletId) {
    config.headers['x-outlet-id'] = outletId
  }

  return config
})

export default http