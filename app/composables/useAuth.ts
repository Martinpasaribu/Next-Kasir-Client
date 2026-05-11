// composables/useAuth.ts
import { useAuthStore } from "~/stores/auth"

export const useAuth = () => {
  const authStore = useAuthStore()
  
  // Ambil referensi cookie untuk pengecekan status login dasar
  const token = useCookie('auth_token')

  /**
   * Pengecekan Permission
   * Sekarang mengambil data dari Pinia (authStore.user)
   * yang sudah diisi oleh Middleware Global dari Server.
   */
  const hasPermission = (permissionKey: string): boolean => {
    // Gunakan fungsi helper yang sudah kita buat di store
    return authStore.hasPermission(permissionKey)
  }

  /**
   * Fungsi Logout Terpusat
   * Memanggil action logout di store untuk membersihkan semuanya sekaligus
   */
  const logout = async () => {
    await authStore.logout()
  }

  return { 
    // Kita arahkan data-data ini ke State Pinia yang reaktif
    user: computed(() => authStore.user), 
    userRole: computed(() => authStore.user?.role), 
    hasPermission, 
    logout,
    isLoggedIn: computed(() => !!token.value && !!authStore.user) 
  }
}