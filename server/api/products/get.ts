/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineEventHandler, getHeader, createError, getQuery } from 'h3'
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

  // Helper untuk Header agar tidak menulis ulang di GET & POST
  const headers = {
    'x-tenant-id': tenantId,
    'x-outlet-id': outletId || '',
    'Authorization': token ? `Bearer ${token}` : '',
    'cookie': cookie || ''
  }

  if (method === "GET") {
    try {
      // Menggunakan $fetch bawaan Nuxt/Nitro
      const response: any = await $fetch(`${runtime.public.server_api}/products/cashier`, {
        method: 'GET',
        headers,
        query: getQuery(event) // Forward query params (search, page, dll)
      })

      return {
        success: response?.success ?? true,
        message: response?.message || "Data products retrieved",
        data: response?.data || []
      }

    } catch (error: any) {
      // Log error untuk kebutuhan debugging server
      console.error("🔥 [Nitro Error]:", error.data || error.message)

      // Lempar error yang rapi ke frontend
      throw createError({
        statusCode: error.response?.status || 500,
        statusMessage: error.response?.statusText || "Internal Server Error",
        data: {
          message: error.data?.message || error.message || "Failed to fetch products",
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