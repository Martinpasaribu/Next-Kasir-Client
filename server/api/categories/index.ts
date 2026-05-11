// server/api/categories/index.ts
import { getRequestOutletDTO } from "~~/server/utils/outlet"
import { getRequestTenantDTO } from "~~/server/utils/tenant"

export default defineEventHandler(async (event) => {
  const method = event.method
  
  // 1. Ambil Tenant ID (Auto-check Header/Cookie/Subdomain)
  const tenantId = getRequestTenantDTO(event)
  const outletId = getRequestOutletDTO(event)
  
  // 2. Ambil Token & Cookie mentah untuk diteruskan ke NestJS
  const token = getCookie(event, 'auth_token')
  const cookie = getHeader(event, 'cookie')

  // Validasi Awal: Cegah request kosong ke database
  if (!tenantId) {
    throw createError({
      statusCode: 400,
      message: 'Node Tenant tidak terdeteksi. Akses ditolak.'
    })
  }

  // Helper untuk Header agar tidak menulis ulang di GET & POST
  const headers = {
    'x-tenant-id': tenantId,
    'x-outlet-id': outletId || '',
    'Authorization': token ? `Bearer ${token}` : '',
    'cookie': cookie || ''
  }

  try {
    // --- HANDLE GET REQUEST ---
    if (method === 'GET') {
      const res = await http.get('/categories', { headers })
      return { 
        success: true, 
        data: res.data 
      }
    }

    // --- HANDLE POST REQUEST ---
    if (method === 'POST') {
      const body = await readBody(event)
      const res = await http.post('/categories', body, { headers })
      return { 
        success: true, 
        data: res.data 
      }
    }

  } catch (err: any) {
    // Logging untuk debugging di terminal Nitro
    console.error(`[Nitro Error] ${method} /categories:`, err.response?.data || err.message)
    
    // Kembalikan error yang jelas ke Frontend Vue
    throw createError({
      statusCode: err.response?.status || 500,
      message: err.response?.data?.message || 'Gagal sinkronisasi dengan Backend NestJS'
    })
  }
})