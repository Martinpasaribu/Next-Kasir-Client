/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineEventHandler, getHeader, createError, getQuery, getCookie } from 'h3'
import { getRequestOutletDTO } from '~~/server/utils/outlet'
import { getRequestTenantDTO } from '~~/server/utils/tenant'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const runtime = useRuntimeConfig()
  
  // 1. Ambil Identitas (Tenant & Outlet)
  const tenantId = getRequestTenantDTO(event)
  const outletId = getRequestOutletDTO(event)
  
  // 2. Ambil Token secara agresif
  // Cek di Cookie, jika kosong cek di Header Authorization (antisipasi diteruskan dari client)
  let token = getCookie(event, 'auth_token')
  if (!token) {
    const authHeader = getHeader(event, 'authorization')
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]
    }
  }

  // Validasi Tenant
  if (!tenantId) {
    throw createError({
      statusCode: 400,
      message: 'Node Tenant tidak terdeteksi.'
    })
  }

  // 3. Susun Headers untuk NestJS
  const headers: Record<string, string> = {
    'x-tenant-id': tenantId,
    'Accept': 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (outletId) {
    headers['x-outlet-id'] = outletId
  }

  // Teruskan semua cookie mentah dari browser ke NestJS (Opsional tapi sering membantu)
  const rawCookie = getHeader(event, 'cookie')
  if (rawCookie) {
    headers['cookie'] = rawCookie
  }

  if (method === "GET") {
    try {
      const response: any = await $fetch(`${runtime.public.server_api}/auth/merchant/profile`, {
        method: 'GET',
        headers,
        query: getQuery(event)
      })

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