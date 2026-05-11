// app/utils/http.ts
import axios from 'axios'

const http = axios.create({
  timeout: 15000
})

http.interceptors.request.use((config) => {
  // Gunakan useCookie dengan hati-hati agar tidak error saat SSR
  const token = useCookie('auth_token').value
  const tenantId = useCookie('tenant_id').value
  const outletId = useCookie('outlet_id').value
  const runtime = useRuntimeConfig()

  // Set baseURL dari runtime config
  config.baseURL = runtime.public.server_api || 'https://api.nextkasir.pro'

  // 1. Lampirkan Token jika ada
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // 2. Lampirkan Tenant ID
  // Jika cookie kosong (misal saat login), kita bisa ambil dari hostname sebagai fallback
  if (tenantId) {
    config.headers['x-tenant-id'] = tenantId
    config.headers['x-outlet-id'] = outletId
  } else {
    // Fallback deteksi subdomain jika cookie belum ter-set
    const host = window.location.hostname
    const parts = host.split('.')
    if (parts.length > 1) {
      config.headers['x-tenant-id'] = parts[0] !== 'www' ? parts[0] : parts[1]
    }
  }

  return config
}, (error) => {
  return Promise.reject(error)
})

export default http