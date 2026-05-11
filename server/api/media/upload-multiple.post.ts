// server/api/media/upload-multiple.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const formData = await readFormData(event)


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
    // Teruskan ke NestJS Backend (Endpoint: media/upload-multiple)
    const response = await $fetch(`${config.public.server_api}/media/upload-multiple`, {
      method: 'POST',
      headers,
      body: formData,
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'Failed to upload multiple files to backend server',
    })
  }
})