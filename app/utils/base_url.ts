
const runtime = useRuntimeConfig()

// export const Base_URL = 'http://localhost:5002' 

export const Base_URL = process.env.NUXT_BASE_API_WEB || 'https://api.thefolk.id';

console.log('Base URL Aktif Env:', Base_URL); // Cek di console browser
console.log('Base URL Aktif Runtime:', runtime.public.server_api as string); // Cek di console browser