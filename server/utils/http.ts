// server/utils/http.ts
import axios from 'axios'

const http = axios.create({
  timeout: 10000,
})

http.interceptors.request.use((config) => {
  const runtime = useRuntimeConfig()
  const baseURL = runtime.public.server_api || process.env.NUXT_BASE_API_WEB
  
  if (!baseURL) {
    throw new Error("NUXT_BASE_API_WEB belum diset di environment variables")
  }

  config.baseURL = baseURL
  
  // LOG URL untuk memastikan apa yang dipanggil
  console.log("🚀 Requesting to:", `${config.baseURL}${config.url}`)
  
  return config
})

export default http