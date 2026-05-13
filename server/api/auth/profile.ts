/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineEventHandler, getHeader, createError, getQuery, getCookie } from 'h3'
import { getRequestOutletDTO } from '~~/server/utils/outlet'
import { getRequestTenantDTO } from '~~/server/utils/tenant'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const runtime = useRuntimeConfig()

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

  // 3. Susun Headers untuk NestJS
  const headers = {
    'x-tenant-id': tenantId,
    'x-outlet-id': outletId || '',
    'Authorization': token ? `Bearer ${token}` : '',
    'cookie': cookie || ''
  }


 
  if (method === "GET") {
    try {
      const response: any = await $fetch(`${runtime.public.server_api}/auth/merchant/profile`, { headers })

      return {
        success: response?.success ?? true,
        data: response?.data || null
      }

    } catch (error: any) {
      // LOG DETAIL UNTUK DEBUGGING
      console.error("🔥 [Nitro Fetch Error]:", {
        status: error.response?.status,
        url: error.request,
        message: error.data?.message || error.message
      })

      throw createError({
        statusCode: error.response?.status || 500,
        statusMessage: error.response?.statusText || "Internal Server Error",
        data: {
          message: error.data?.message || "Unauthorized access to backend",
          success: false
        },
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: "Method Not Allowed",
  })
})