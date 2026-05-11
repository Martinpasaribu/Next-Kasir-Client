// composables/useOutlet.ts
import { useAuthStore } from '~/stores/auth'

export const useOutlet = () => {
  const authStore = useAuthStore()
  
  // 1. Tetap simpan ID yang dipilih di Cookie agar tidak hilang saat refresh
  const selectedOutletId = useCookie<string | null>('outlet_id', {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    watch: true 
  })

  // 2. Ambil daftar outlet dari Pinia (Data segar dari server via Middleware)
  const userOutlets = computed(() => authStore.user?.outlets || [])

  // 3. Cari objek outlet yang sedang aktif
  const currentOutlet = computed(() => {
    const outlets = userOutlets.value
    if (!outlets.length || !selectedOutletId.value) return null
    
    return outlets.find((o: { id: any; _id: any }) => 
      String(o.id || o._id) === String(selectedOutletId.value)
    ) || null
  })

  // 4. Fungsi ganti outlet
  const switchOutlet = async (id: string) => {
    if (!id) return
    
    // Update cookie ID outlet terpilih
    selectedOutletId.value = id

    if (process.client) {
      await nextTick()
      
      // Berikan feedback visual atau langsung reload untuk reset state aplikasi
      // Reload penting agar semua fetch API berikutnya menggunakan outlet_id yang baru di header
      setTimeout(() => {
        window.location.reload()
      }, 500) 
    }
  }

  return {
    selectedOutletId,
    userOutlets,
    currentOutlet,
    switchOutlet
  }
}