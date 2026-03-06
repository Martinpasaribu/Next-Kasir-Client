// app/stores/products.ts
import { defineStore } from 'pinia'
import { database_dexie } from '~/utils/database_dexie'

export const useProductStore = defineStore('products', () => {
  const products = ref<any[]>([])
  const categories = ref<any[]>([])
  const activeCategory = ref('all') // Default ke 'all' (ID), bukan string 'Semua'
  const loading = ref(false)

  async function fetchAllData() {
    loading.value = true
    try {
      const [resProducts, resCategories] = await Promise.all([
        $fetch<any>('https://nextkasir-server.vercel.app/api/v1/products', { 
           headers: { 'x-tenant-id': 'toko_budi' },
        }),
        $fetch<any>('https://nextkasir-server.vercel.app/api/v1/categories/options', { 
           headers: { 'x-tenant-id': 'toko_budi' },
        })
      ])

      // 1. Handle Produk
      // Jika response produk dibungkus .data, gunakan resProducts.data
      const productData = Array.isArray(resProducts) ? resProducts : resProducts.data
      if (productData) {
        await database_dexie.products.clear()
        await database_dexie.products.bulkPut(JSON.parse(JSON.stringify(productData)))
        products.value = productData
      }

      // 2. Handle Kategori (Options)
      // Sesuai contohmu: { success: true, data: [...] } atau array langsung
      const categoryData = resCategories.data || resCategories
      if (Array.isArray(categoryData)) {
        categories.value = [{ _id: 'all', name: 'Semua' }, ...categoryData]
      }

    } catch (error) {
      console.warn("Offline Mode: Load dari Dexie")
      products.value = await database_dexie.products.toArray()
      if (categories.value.length === 0) {
        categories.value = [{ _id: 'all', name: 'Semua' }]
      }
    } finally {
      loading.value = false
    }
  }

  return { products, categories, activeCategory, loading, fetchAllData }
})