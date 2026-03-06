// app/composables/useOnline.ts
export const useOnline = () => {
  const isOnline = ref(true)

  // Jalankan hanya di browser (Client Side)
  if (process.client) {
    isOnline.value = navigator.onLine

    const updateStatus = () => {
      isOnline.value = navigator.onLine
    }

    // Pasang listener untuk mendeteksi perubahan jaringan
    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)

    // Bersihkan listener saat komponen tidak digunakan (On Unmounted)
    onUnmounted(() => {
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
    })
  }

  return isOnline
}