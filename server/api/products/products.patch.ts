// server/api/bab/bab.patch.ts

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const id = query.id // Mengambil ID dari ?id=... yang dikirim frontend


  if (!id) {
    throw createError({ statusCode: 400, message: 'ID is required for update' })
  }


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
    // PERBAIKAN DI SINI: Masukkan ID ke dalam URL path
     const response = await $fetch(`${config.public.apiBase}/products/${id}`, { 
      headers,
      method: 'PATCH',
      body: body,
      
    })
    return response
  } catch (err: any) {
    throw createError({
      statusCode: err.response?.status || 500,
      statusMessage: err.message,
      data: err.data
    })
  }
})