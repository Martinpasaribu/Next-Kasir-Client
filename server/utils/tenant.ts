// server/utils/tenant.ts
import { H3Event } from 'h3'

export const getRequestTenantDTO = (event: H3Event) => {
  // 1. Cek dari Header x-tenant-id (Prioritas Utama)
  const headerTenant = getHeader(event, 'x-tenant-id')
  if (headerTenant) return headerTenant

  // 2. Cek dari Cookie (Penting untuk SSR & Direct Link)
  const cookieTenant = getCookie(event, 'tenant_id')
  if (cookieTenant) {
    // Gunakan decodeURIComponent jika tenantId mengandung karakter spesial
    return decodeURIComponent(cookieTenant)
  }

  // 3. Fallback: Deteksi dari Hostname
  const host = getHeader(event, 'host') || ''
  // Menghilangkan port jika ada (misal: localhost:3000 -> localhost)
  const hostname = host.split(':')[0]

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Pastikan ini adalah 'slug' default untuk development Anda
    return 'nagatama_corporation.nextkasir.com'
  }

  // Logic Subdomain untuk Production
  const parts = hostname.split('.')
  
  // Jika "nagatama.nextkasir.com" -> parts: ["nagatama", "nextkasir", "com"]
  if (parts.length >= 2) {
    const subdomain = parts[0] !== 'www' ? parts[0] : parts[1]
    
    // Opsional: Jika Anda ingin backend selalu menerima FULL DOMAIN
    // Anda bisa menambahkan logic penempelan domain di sini jika parts[0] hanya slug
    return subdomain.includes('.') ? subdomain : `${subdomain}.nextkasir.com`
  }

  return null
}