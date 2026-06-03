// server/utils/tenantFetch.ts
import { H3Event } from 'h3'

/**
 * Mendapatkan headers otomatis yang sudah diisi tenant, outlet, dan token auth
 */
export function getTenantHeaders(event: H3Event) {
  const tenantId = getRequestTenantDTO(event)
  const outletId = getRequestOutletDTO(event)
  const token = getCookie(event, 'auth_token')
  const cookie = getHeader(event, 'cookie')

  // Validasi Awal secara terpusat
  if (!tenantId) {
    throw createError({
      statusCode: 400,
      message: 'Node Tenant tidak terdeteksi. Akses ditolak.'
    })
  }

  return {
    'x-tenant-id': tenantId,
    'x-outlet-id': outletId || '',
    'Authorization': token ? `Bearer ${token}` : '',
    'cookie': cookie || ''
  }
}

/**
 * Wrapper global untuk error handling dari NestJS agar tidak menulis try-catch berulang kali
 */
export function handleServerError(error: any) {
  throw createError({
    statusCode: error.response?.status || error.statusCode || 500,
    statusMessage: error.response?._data?.message || error.data?.message || 'Internal Server Error',
    data: error.data || null
  })
}