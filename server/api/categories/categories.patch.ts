// server/api/categories.patch.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const body = await readBody(event)
  const cookie = getHeader(event, 'cookie')

  // Ambil ID dari query string ?id=...
  const id = query.id

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID is required for update' })
  }

  try {
    // Pastikan URL tujuan benar: ${config.public.apiBase}/categories?id=${id}
    const response = await $fetch(`${config.public.apiBase}/categories/${id}`, {
      headers: { 
        cookie: cookie || '',
        'x-tenant-id': 'toko_budi' 
      },
      method: 'PATCH',
      body: body
    })

    return response  // Harus dikembalikan agar frontend menerima objek { success: true, ... }
  } catch (error: any) {
    // Melempar error agar ditangkap oleh blok catch di handleUpdate (frontend)
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.message || 'Internal Server Error',
      data: error.data // Sertakan data asli dari NestJS
    })
  }
})