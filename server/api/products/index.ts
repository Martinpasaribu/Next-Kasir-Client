// server/api/bab/index.ts

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
      message: err?.response?.data?.message || 'Gagal menyambung ke Backend NestJS'
    }
  }
})