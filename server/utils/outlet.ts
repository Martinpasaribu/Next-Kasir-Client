// server/utils/outlet.ts
import { H3Event, getHeader, getCookie } from 'h3'

export const getRequestOutletDTO = (event: H3Event) => {
  // 1. Cek Header (Prioritas untuk Client-side fetch)
  const headerOutlet = getHeader(event, 'x-outlet-id')
  if (headerOutlet) return headerOutlet

  // 2. Cek Cookie (Penting untuk SSR / Refresh halaman)
  const cookieOutlet = getCookie(event, 'outlet_id')
  if (cookieOutlet) {
    return decodeURIComponent(cookieOutlet)
  }

  return null
}