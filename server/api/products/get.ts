/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineEventHandler, readBody, getHeader, createError } from 'h3'
import http from '../../utils/http'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method // 👉 ambil method di sini
  const cookie = getHeader(event, 'cookie') // 👉 cookie kalau ada
  const query = getQuery(event)


  if (method === "GET") {
    
    try {
      const response = await http.get(`/products`, {
        headers: { 
          cookie,
          'x-tenant-id': 'toko_budi'
         },
      })

      return {
        success: response?.data.success,
        message: response?.data.message || "data product",
        data : response?.data.data
      }

    } 
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
    console.error("🔥 Error di server/api:", error?.response?.data || error.message)

    // Ambil data dari backend kalau ada
    const backendError = error?.response?.data ?? null
    const backendMessage = backendError?.message ?? error.message ?? "Unknown error"

    // Lempar error tapi pakai POJO (plain object)
    throw createError({
      statusCode: error?.response?.status || 500,
      statusMessage: "Failed to fetch product",
      data: {
        backendMessage,
        requestId: backendError?.requestId ?? null,
        success: backendError?.success ?? false,
      },
    })
  }
  
  }

  throw createError({
    statusCode: 405,
    statusMessage: "Method Not Allowed",
  })
})
