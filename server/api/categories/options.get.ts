// server/api/categories/options.get.ts

import { getRequestTenantDTO } from "~~/server/utils/tenant"

export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()

  const tenantId = getRequestTenantDTO(event)
  const outletId = getRequestOutletDTO(event)
  
  const token = getCookie(event, 'auth_token')
  const cookie = getHeader(event, 'cookie')

  const headers = {
    'x-tenant-id': tenantId,
    'x-outlet-id': outletId || '',
    'Authorization': token ? `Bearer ${token}` : '',
    'cookie': cookie || ''
  }

  if (!tenantId) {
    throw createError({
      statusCode: 400,
      message: 'Tenant ID tidak terdeteksi. Pastikan Anda mengakses via subdomain yang benar.'
    })
  }

  try {
    // 2. Tembak ke Backend NestJS menggunakan instance axios 'http'
    // Pastikan 'http' di server/utils/ juga sudah terkonfigurasi baseURL-nya
    const res = await http.get(`/categories/options`,{ headers })

    // NestJS biasanya mengembalikan data langsung atau dalam objek { data: ... }
    return {
      success: true, 
      data: res.data 
    }

  } catch (error: any) {
    // 3. Error Handling yang lebih informatif
    throw createError({
      statusCode: error.response?.status || 500,
      message: `Gagal mengambil opsi kategori: ${error.response?.data?.message || error.message}`
    })
  }
})