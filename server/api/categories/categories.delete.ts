// server/api/categories.delete.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const id = query.id
  
  const cookie = getHeader(event, 'cookie')

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID is required' })
  }

  try {
    // PASTIKAN URL KE NESTJS BENAR
    // Jika NestJS pakai @Delete(':id'), maka URLnya: /categories/ID
    const response = await $fetch(`${config.public.apiBase}/categories/${id}`, {
      headers: { 
        cookie: cookie || '',
        'x-tenant-id': 'toko_budi' 
      },
      method: 'DELETE',
    })
    return response
  } catch (error: any) {
    // Log error di terminal Nuxt untuk melihat detailnya
    console.error('Delete Proxy Error:', error.data)
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || 'NestJS Server Error',
    })
  }
})