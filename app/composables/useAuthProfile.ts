// composables/useAuthProfile.ts
import { useAuthStore } from '~/stores/auth'

interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    permissions: Record<string, boolean>; // Gunakan Record agar mudah dicek key-nya
    tenant_id: string;
    outlets: any[];
    avatar?: string | null;
  }
}

export const useAuthProfile = () => {
  const authStore = useAuthStore()
  const token = useCookie('auth_token')
  const tenantId = useCookie('tenant_id')
  const config = useRuntimeConfig()
  const loading = ref(false)

  const fetchProfile = async () => {
    if (!token.value) return null
    
    loading.value = true
    try {
      // Gunakan $fetch agar lebih stabil di berbagai lifecycle
      const response = await $fetch<ProfileResponse>('/api/auth/profile')

      if (response?.success) {
        // SIMPAN KE PINIA (Memory), BUKAN COOKIE
        authStore.setUser(response.data)
        return response.data
      }
    } catch (err: any) {
      console.error('Failed to fetch merchant profile:', err)
      // Jika error 401/Unauthorized, paksa logout
      if (err.response?.status === 401) {
        authStore.logout()
      }
    } finally {
      loading.value = false
    }
  }

  const isAuthenticated = computed(() => !!token.value && !!authStore.user)

  return {
    user: computed(() => authStore.user), // Ambil dari Pinia secara reaktif
    loading,
    fetchProfile,
    logout: authStore.logout,
    isAuthenticated
  }
}