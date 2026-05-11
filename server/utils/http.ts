// server/utils/http.ts
import axios from 'axios'

const http = axios.create({
  withCredentials: true,
  timeout: 10000,
})

http.interceptors.request.use((config) => {
  const runtime = useRuntimeConfig()
  
  // Pastikan baseURL terisi dari env
  config.baseURL = runtime.public.server_api as string

  // JANGAN panggil useRequestEvent di sini, karena akan error
  return config
})

export default http