import { useAuthStore } from "~/stores/auth"

interface ProfileResponse {
  success: boolean;
  data: {
    _id: string;
    full_name: string;
    role: 'OWNER' | 'MANAGER' | 'CASHIER';
    permissions: Record<string, boolean>;
    outlets: any[];
  }
}

// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie('auth_token').value
  const tenantId = useCookie('tenant_id').value
  const outletId = useCookie('outlet_id').value // Tambahkan check cookie outlet
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  // 1. EXIT EARLY: Jangan proteksi halaman login, unauthorized, atau public assets
  if (to.path.startsWith('/auth/login') || to.path === '/unauthorized') {
    return
  }

  // 2. Jika TIDAK ada token, tendang ke login
  if (!token) {
    return navigateTo('/auth/login')
  }

  /**
   * 3. LOGIC RE-VALIDATION (The Secret Sauce)
   * Fetch data profil jika Pinia kosong (efek Refresh halaman)
   */
  if (token && !authStore.user) {
    try {
      const response = await $fetch<ProfileResponse>('/api/auth/profile', {
        headers: useRequestHeaders(['cookie', 'authorization']) as Record<string, string>
      })
      if (!response || !response.data) {
        throw new Error('Invalid Profile Response')
      }

      authStore.setUser(response.data) 
      
    } catch (err) {
      console.error('Auth Middleware Error:', err)
      const tokenCookie = useCookie('auth_token')
      tokenCookie.value = null
      return navigateTo('/auth/login')
    }
  }

  // Ambil state terbaru dari Pinia
  const user = authStore.user
  if (!user) return navigateTo('/auth/login')
  
  const userRole = user.role
  const userOutlets = user.outlets || []

  /**
   * 4. OUTLET GUARD (Penting!)
   * Jika belum pilih outlet dan bukan di halaman select-outlet, paksa pilih outlet.
   * Catatan: OWNER bisa dibebaskan dari guard ini jika dashboard owner bersifat global.
   */
  if (!outletId && to.path !== '/auth/select-outlet') {
    // Paksa Kasir/Manager pilih outlet. Owner opsional (tergantung kebutuhan UI kamu).
    if (userRole !== 'OWNER' || userOutlets.length > 0) {
      return navigateTo('/auth/select-outlet')
    }
  }

  // 5. Redirect root '/' ke halaman yang sesuai
  if (to.path === '/') {
    return navigateTo(userRole === 'OWNER' ? '/dashboard' : '/cashier')
  }

  // 6. Proteksi Area Admin/Dashboard (CASHIER dilarang masuk)
  const isAdminPath = to.path.startsWith('/admin') || to.path.startsWith('/dashboard')
  if (isAdminPath && userRole === 'CASHIER') {
    return navigateTo('/cashier')
  }

  // 7. Granular Permission Check
  const requiredPermission = to.meta.permission as string
  if (requiredPermission) {
    if (userRole === 'OWNER') return

    const hasAccess = authStore.hasPermission(requiredPermission)
    if (!hasAccess) {
      console.warn(`Akses ditolak ke ${to.path}. Kurang izin: ${requiredPermission}`)
      return navigateTo('/unauthorized')
    }
  }
})