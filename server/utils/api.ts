// import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

// class ApiHandler {
//   private api: AxiosInstance

//   constructor() {
//     this.api = axios.create({
//       // Mengambil base URL dari runtimeConfig Nuxt
//       baseURL: 'http://localhost:3000', // Ganti sesuai URL NestJS kamu
//       timeout: 10000,
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       }
//     })

//     // INTERCEPTOR: Masukkan Token Otomatis
//     this.api.interceptors.request.use((config) => {
//       const token = useCookie('auth_token').value
//       if (token && config.headers) {
//         config.headers.Authorization = `Bearer ${token}`
//       }
//       return config
//     })

//     // INTERCEPTOR: Tangani Error Global (Contoh: Logout jika 401)
//     this.api.interceptors.response.use(
//       (response) => response.data, // Langsung kembalikan data agar tidak perlu .data lagi di page
//       (error) => {
//         const status = error.response?.status
//         if (status === 401) {
//           // Logika logout jika token expired
//           console.error('Unauthorized! Redirecting to login...')
//         }
//         return Promise.reject(error.response?.data || error.message)
//       }
//     )
//   }

//   // Fungsi sakti satu-untuk-semua
//   async exec<T>(endpoint: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET', data?: any, config?: AxiosRequestConfig): Promise<T> {
//     return this.api({
//       url: endpoint,
//       method,
//       data: method !== 'GET' ? data : undefined,
//       params: method === 'GET' ? data : undefined,
//       ...config
//     }) as Promise<T>
//   }
// }

// export const $api = new ApiHandler()