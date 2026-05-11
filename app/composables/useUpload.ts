// app/composables/useUpload.ts

import type { MediaObject } from "~/types/Categories/categories"

export const useUpload = () => {
  const isUploading = ref(false)

  const uploadFile = async (file: File): Promise<MediaObject | null> => {
    const formData = new FormData()
    formData.append('file', file)

    isUploading.value = true
    try {
      const res = await $fetch<{ success: boolean; data: MediaObject }>('/api/media/upload', {
        method: 'POST',
        body: formData
      })

      if (res.success) return res.data
      return null
    } catch (err) {
      console.error('Upload Error:', err)
      alert('Gagal mengunggah file')
      return null
    } finally {
      isUploading.value = false
    }
  }

  return {
    uploadFile,
    isUploading
  }
}