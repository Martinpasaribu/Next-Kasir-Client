// server/api/settings/index.ts

import { getRequestOutletDTO } from "~~/server/utils/outlet"
import { getRequestTenantDTO } from "~~/server/utils/tenant"

export default defineEventHandler(async (event) => {
  const method = event.method
  const query = getQuery(event)
  
  // 1. Ambil Identitas Tenant & Outlet dari Utils
  const tenantId = getRequestTenantDTO(event)
  const outletId = getRequestOutletDTO(event)
  
  // 2. Ambil Kredensial untuk diteruskan ke NestJS
  const token = getCookie(event, 'auth_token')
  const cookie = getHeader(event, 'cookie')

  // Validasi: Pastikan tenant terdeteksi
  if (!tenantId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tenant ID required'
    })
  }

  // Persiapkan Headers untuk komunikasi antar server (Nitro -> NestJS)
  const headers = {
    'x-tenant-id': tenantId,
    'x-outlet-id': outletId || '',
    'Authorization': token ? `Bearer ${token}` : '',
    'cookie': cookie || ''
  }

  try {
    // --- GET SETTINGS BY DOMAIN ---
    if (method === 'GET') {
      const res = await http.get(`/merchant-settings/receipt`, { headers })
      
      return res.data 
    }

    // --- UPDATE SETTINGS (PATCH) ---
    // Endpoint ini menangani: PATCH /api/merchant-settings
    if (method === 'PATCH' || method === 'POST') {
      const body = await readBody(event)
      let endpoint = '/merchant-settings/general'

      // Jika body mengandung data struk, arahkan ke endpoint spesifik receipt
      if (body.domain === 'RECEIPT' || body.settings_receipt) {
        endpoint = '/merchant-settings/receipt'
      }

      const res = await http.patch(endpoint, body, { headers })
      return {
        success: true,
        data: res.data
      }
    }

  } catch (err: any) {
    console.error(`[Settings Proxy Error] ${method}:`, err.response?.data || err.message)
    
    throw createError({
      statusCode: err.response?.status || 500,
      message: err.response?.data?.message || 'Gagal sinkronisasi pengaturan dengan server'
    })
  }
})