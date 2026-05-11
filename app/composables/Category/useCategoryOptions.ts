// composables/useCategoryOptions.ts
import { ref } from 'vue'
import { useMyNotification } from '~/stores/useMyNotification'

export const useCategoryOptions = () => {
  const categoryOptions = ref<{ _id: string, name: string }[]>([])
  const isLoadingCategories = ref(false)
  const categoryError = ref<string | null>(null)
  const notify = useMyNotification();

  const fetchCategoryOptions = async () => {
    isLoadingCategories.value = true
    categoryError.value = null
    try {
      // Pastikan endpoint ini sesuai dengan yang kita buat di NestJS tadi
      const res = await $fetch<any>('/api/categories/options')
      
      // Sanitasi data: pastikan selalu mengembalikan array
      categoryOptions.value = res.data || res || []
    } catch (err: any) {
      categoryError.value = err.message || 'Gagal memuat kategori'
      console.error('Error fetching categories:', err)
      notify.addToast(err, 'error');
    } finally {
      isLoadingCategories.value = false
    }
  }

  return {
    categoryOptions,
    isLoadingCategories,
    categoryError,
    fetchCategoryOptions
  }
}