// composables/useTenant.ts
import { useAuthStore } from '~/stores/auth'

export const useTenant = () => {
  const authStore = useAuthStore()
  const tenantCookie = useCookie('tenant_id')
  const url = useRequestURL()

  const getTenantId = (): string | null => {
    // 1. Cek Cookie terlebih dahulu (ini sumber kebenaran untuk identitas database)
    if (tenantCookie.value) return tenantCookie.value

    // 2. Logic Deteksi Subdomain (Jika belum login/cookie kosong)
    const hostname = url.hostname
    
    // Logic Dev/Localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Pastikan ini sesuai dengan tenant testing kamu
      return 'nagatama_corporation.nextkasir.com' 
    }

    // Logic Production (e.g., naga.nextkasir.com)
    const parts = hostname.split('.')
    if (parts.length > 1) {
      return parts[0] !== 'www' ? parts[0] : parts[1]
    }

    return null
  }

  return {
    // Tetap computed agar reaktif jika cookie berubah
    tenantId: computed(() => getTenantId()),

    /**
     * PERBAIKAN: isAdmin & isOwner
     * Kita ambil dari Pinia Store karena data role di Cookie sudah kita hapus
     * untuk alasan keamanan.
     */
    isOwner: computed(() => authStore.user?.role === 'OWNER'),
    
    // Jika kamu masih pakai role 'ADMIN' di sistemmu:
    isAdmin: computed(() => authStore.user?.role === 'ADMIN' || authStore.user?.role === 'OWNER')
  }
}