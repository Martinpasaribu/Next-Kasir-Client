// server/api/bab.delete.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const id = query.id

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID is required' })
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
    // PASTIKAN URL KE NESTJS BENAR
    // Jika NestJS pakai @Delete(':id'), maka URLnya: /bab/ID
    const response = await $fetch(`${config.public.apiBase}/products/${id}`, {
      headers ,
      method: 'DELETE',
    })
    return response || { success: true }
    
  } catch (error: any) {
    // Log error di terminal Nuxt untuk melihat detailnya
    console.error('Delete Proxy Error:', error.data)
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'NestJS Server Error',
    })
  }
})