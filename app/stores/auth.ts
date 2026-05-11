// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // 1. State: Data user hanya ada di RAM (In-Memory)
  const user = ref<any>(null)

  // 2. Cookies: Referensi ke cookie token dan tenant
  const token = useCookie('auth_token')
  const tenantId = useCookie('tenant_id')
  const outletId = useCookie('outlet_id')

  // 3. Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  
  const userRole = computed(() => user.value?.role || null)

  // 4. Actions
  
  // Fungsi untuk mengisi data profil ke RAM (dipanggil oleh login atau middleware)
  const setUser = (data: any) => {
    user.value = data
  }

  // Fungsi Logout: Membersihkan RAM dan Cookie secara permanen
  const logout = async () => {
    // Bersihkan State di RAM
    user.value = null
    
    // Bersihkan Cookies
    token.value = null
    outletId.value = null
    // tenantId.value = null // Opsional: hapus jika ingin reset tenant saat logout

    // Bersihkan temporary data lainnya
    localStorage.removeItem('temp_outlets')

    // Tendang ke halaman login
    await navigateTo('/auth/login')
  }

  // Fungsi pengecekan permission (God Mode untuk OWNER)
  const hasPermission = (permission: string) => {
    // Jika user belum dimuat, asumsikan tidak ada izin
    if (!user.value) return false
    
    // OWNER selalu punya akses ke apapun
    if (user.value.role === 'OWNER') return true
    
    // Cek di dalam objek permissions (e.g., user.permissions.show_product)
    return user.value.permissions?.[permission] === true
  }

  return { 
    user, 
    isAuthenticated, 
    userRole,
    setUser, 
    hasPermission, 
    logout 
  }
})