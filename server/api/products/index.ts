// server/api/bab/index.ts

import { getTenantHeaders } from "~~/server/utils/tenantFetch"

export default defineEventHandler(async (event) => {
  const method = event.method

  // 1. Ambil headers otomatis (Pasti tervalidasi tenantId-nya di dalam helper)
  const headers = getTenantHeaders(event)

  try {
    if (method === 'GET') {
      // Kita kirim cookie secara manual lewat header Axios di sini
      const res = await http.get('/products/admin', { headers })
      
      return { 
        success: true, 
        data: res.data 
      }
    }

    if (method === 'POST') {
      const body = await readBody(event)
      const res = await http.post('/products/admin', body, { headers })
      return { success: true, data: res.data }
    }
  } catch (err: any) {
    // Log ini akan muncul di terminal console kamu
    console.error(`❌ Error ${method} /products/admin:`, err.response?.data || err.message)
    
    return {
      success: false,
      message: err?.response?.data?.message || 'Gagal menyambung ke Backend NestJS',
      errors: err?.response?.data?.errors || null
    }
  }
})