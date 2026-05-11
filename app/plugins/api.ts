// plugins/api.ts
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    // Pastikan key runtimeConfig sesuai dengan nuxt.config Anda
    baseURL: config.public.server_api || 'https://api.nextkasir.pro',

    onRequest({ options }) {
      // 1. Ambil data cookie terbaru
      const token = useCookie('auth_token').value
      const tenantId = useCookie('tenant_id').value
      const outletId = useCookie('outlet_id').value

      // 2. Inisialisasi headers dengan cara yang lebih aman untuk ofetch/Nuxt 4
      const headers = new Headers(options.headers)

      // 3. Tambahkan header standar seperti Axios agar tidak ditolak server/CORS
      headers.set('Accept', 'application/json, text/plain, */*')

      // 4. Injeksi Auth & Tenant
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      
      if (tenantId) {
        headers.set('x-tenant-id', String(tenantId))
      }
      
      if (outletId) {
        headers.set('x-outlet-id', String(outletId))
      }

      // 5. Timpa headers lama dengan Headers object yang baru
      options.headers = headers
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        const authCookie = useCookie('auth_token')
        authCookie.value = null
        await navigateTo('/auth/login')
      }
    }
  })

  return {
    provide: {
      api
    }
  }
})