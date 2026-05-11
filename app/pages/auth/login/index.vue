<script setup lang="ts">
import { Rocket, Mail, Lock, ChevronRight } from 'lucide-vue-next'
import { useMyNotification } from '~/stores/useMyNotification';

definePageMeta({
  layout: false
})

const isSubmitting = ref(false)
const notify = useMyNotification();

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const url = useRequestURL()

// Logika Subdomain yang Anti-Gagal
// const subdomain = computed(() => {
//   const hostname = url.hostname // 'hostname' tidak termasuk port (:3000)
  
//   // 1. Cek jika di localhost
//   if (hostname === 'localhost' || hostname === '127.0.0.1') {
//     // Jika kamu sedang dev, kita paksa ke tenant 'budi_berkarya'
//     // import.meta.dev lebih akurat di Nuxt 3/4 daripada process.dev
//     if (import.meta.dev) {
//       // return 'nagatama_corporation.nextkasir.com' 
//       return 'tenant_yenishope_77n4b.nextkasir.com'
//     }
//   }

//   // 2. Logic untuk Production (domain.com) atau lvh.me
//   const parts = hostname.split('.')
  
//   // Jika akses budi.nextkasir.pro -> ['budi', 'nextkasir', 'pro']
//   if (parts.length > 1) {
//     // Ambil bagian pertama kecuali jika itu 'www'
//     return parts[0] !== 'www' ? parts[0] : parts[1]
//   }

//   return null
// })


const subdomain = computed(() => {
  // Jika di SSR, gunakan headers host, jika di client gunakan window.location
  const hostname = process.server 
    ? url.hostname 
    : window.location.hostname

  // 1. Definisikan list base domain (tanpa tenant)
  const baseDomains = [
    'localhost',
    '127.0.0.1',
    'next-kasir-client.vercel.app', // Domain spesifik Vercel Anda
    'nextkasir.com',
    'www.nextkasir.com'
  ]

  // 2. Cek apakah hostname termasuk base domain atau subdomain vercel
  const isBase = baseDomains.includes(hostname) || hostname.endsWith('.vercel.app')

  if (isBase) {
    // RETURN TENANT DUMMY UNTUK TESTING
    return 'tenant_yenishope_77n4b'
  }

  // 3. Logic untuk Production (Real Tenant Subdomain)
  const parts = hostname.split('.')
  
  // Kasus: tenant.nextkasir.com (3 parts)
  if (parts.length >= 3) {
    return parts[0] !== 'www' ? parts[0] : parts[1]
  }

  // Jika tidak ada subdomain, return null atau dummy sebagai fallback
  return null
})

const handleLogin = async () => {
  // Debugging: Munculkan di console jika masih gagal
  console.log('Current Hostname:', url.hostname)
  console.log('Detected Subdomain:', subdomain.value)

  isSubmitting.value = true
  const loadingId = notify.addToast('Masuk..', 'loading');

  if (!subdomain.value) {
    alert('❌ Tenant Node not detected. System cannot route your database.')
    return
  }

  loading.value = true
  try {
    const { data } = await http.post('/auth/merchant-admin/login', form, {
      headers: {
        'x-tenant-id': subdomain.value
      }
    })

    // Di dalam handleLogin (app/pages/login.vue)
    if (data?.access_token) {
      const cookieConfig = { maxAge: 60 * 60 * 24, path: '/' }

      // 1. Simpan Token
      useCookie('auth_token', cookieConfig).value = data.access_token

      // 2. Simpan Role (Sangat Penting untuk bypass OWNER)
      useCookie('user_role', cookieConfig).value = data.user.role 
      
      // 3. Simpan data permissions (Objek show_xxx yang kamu kirim tadi)
      useCookie('user_data', cookieConfig).value = data.user.permissions 

      // 4. Simpan Tenant ID
      useCookie('tenant_id', cookieConfig).value = subdomain.value

      useCookie('user_outlets', cookieConfig).value = data.user.outlets

      // useCookie('outlet_id', cookieConfig).value = subdomain.value
      
      // 3. LOGIC PEMILIHAN OUTLET
      const userOutlets = data.user.outlets || []

      if (userOutlets.length === 0 && data.user.role !== 'OWNER') {
        // Kasus: User terdaftar tapi tidak punya akses ke cabang manapun
        notify.addToast('Akun Anda belum ditugaskan ke outlet manapun. Hubungi Admin.', 'warning');
        return
      }

      notify.addToast('Autentikasi berhasil!', 'success');

      if (userOutlets.length === 1) {
        // Langsung masuk jika cuma punya 1 akses (misal Kasir di 1 cabang)
        useCookie('outlet_id', cookieConfig).value = userOutlets[0]._id
        await navigateTo('/dashboard')
      } else {
        // Jika OWNER atau Manager banyak cabang, arahkan ke Page Pilih Outlet
        // Simpan sementara daftar outlet di localStorage agar bisa dipilih di page berikutnya
        localStorage.setItem('temp_outlets', JSON.stringify(userOutlets))
        await navigateTo('/auth/select-outlet')
      }

    }

  } catch (err: any) {

    const msg = err.response?.data?.message || 'Unauthorized Access'
    notify.addToast(msg, 'error');

  } finally {
    loading.value = false
    notify.removeToast(loadingId);
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#010409] flex items-center justify-center p-6 text-white selection:bg-sky-500/30">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[120px]" />
    </div>

    <div class="w-full max-w-[400px] relative z-10">
      <div class="text-center mb-8">
        <div class="inline-flex p-4 rounded-3xl bg-[#0d1117] border border-[#30363d] mb-4 shadow-2xl">
          <Rocket class="text-sky-400 animate-pulse" :size="32" />
        </div>
        <h1 class="text-2xl font-black uppercase">
           Next Kasir
        </h1>
        <div class="mt-2 flex items-center justify-center gap-2">
          <span class="h-[1px] w-4 bg-[#30363d]"></span>
          <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            Node: <span class="text-sky-400">{{ subdomain || 'UNKNOWN' }}</span>
          </p>
          <span class="h-[1px] w-4 bg-[#30363d]"></span>
        </div>
      </div>

      <div class="bg-[#0d1117] border border-[#30363d] p-8 rounded-[2.5rem] shadow-2xl">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 ml-1">
              <Mail :size="12" class="text-sky-400" /> Identifier
            </label>
            <input 
              v-model="form.email"
              type="email" 
              placeholder="admin@nextkasir.pro"
              class="w-full p-4 bg-[#010409] border border-[#30363d] rounded-2xl outline-none focus:border-sky-400 transition-all text-sm font-medium"
            />
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 ml-1">
              <Lock :size="12" class="text-sky-400" /> Keycode
            </label>
            <input 
              v-model="form.password"
              type="password" 
              placeholder="••••••••"
              class="w-full p-4 bg-[#010409] border border-[#30363d] rounded-2xl outline-none focus:border-sky-400 transition-all text-sm font-medium"
            />
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full py-4 bg-sky-500 hover:bg-white text-black font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 text-[11px] group disabled:opacity-50"
          >
            <span v-if="loading" class="animate-spin border-2 border-black border-t-transparent rounded-full h-4 w-4" />
            <template v-else>
              Authorize Access <ChevronRight :size="16" class="group-hover:translate-x-1 transition-transform" />
            </template>
          </button>
        </form>

        <div class="mt-8 pt-6 border-t border-[#30363d]/50">
          <p class="text-[9px] text-center text-gray-600 font-bold uppercase tracking-wider leading-relaxed">
            Authorized personnel only <br/>
            System monitor: stable
          </p>
        </div>
      </div>
    </div>
  </div>
</template>