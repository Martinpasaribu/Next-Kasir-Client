<script setup lang="ts">
import { Rocket, Mail, Lock, ChevronRight } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth';
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

// const subdomain = computed(() => {
//   const hostname = url.hostname // 'hostname' tidak termasuk port (:3000)
  
//   if (hostname === 'localhost' || hostname === '127.0.0.1') {
//     if (import.meta.dev) {
//       return 'tenant_yenishope_77n4b.nextkasir.com'
//       // return 'nagatama_corporation.nextkasir.com' 
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

const handleLogin = async () => {
  const authStore = useAuthStore() // Asumsi kamu sudah buat store ini
  isSubmitting.value = true
  const loadingId = notify.addToast('Mengautentikasi...', 'loading');

  if (!subdomain.value) {
    notify.addToast('Tenant tidak terdeteksi', 'error');
    return
  }

  loading.value = true
  try {
    const { data } = await http.post('/auth/merchant-cashier/login', form, {
      headers: { 'x-tenant-id': subdomain.value }
    })

    if (data?.access_token) {
      // Config cookie yang aman (Session based atau 1 day)
      const cookieConfig = { maxAge: 60 * 60 * 24, path: '/' }

      // --- PERBAIKAN DI SINI ---
      // 1. Simpan Token & Tenant ID saja di Cookie (Kunci pintu)
      useCookie('auth_token', cookieConfig).value = data.access_token
      useCookie('tenant_id', cookieConfig).value = subdomain.value

      // 2. Simpan SEMUA data user ke Pinia (Memory/RAM)
      // Ini AMAN karena tidak bisa diintip di tab Application > Cookies
      authStore.setUser(data.user) 

      // 3. Logic Pemilihan Outlet
      const userOutlets = data.user.outlets || []

      if (userOutlets.length === 0 && data.user.role !== 'OWNER') {
        notify.addToast('Akses ditolak: Belum ada outlet yang ditugaskan.', 'warning');
        return
      }

      notify.addToast('Berhasil masuk!', 'success');

      if (userOutlets.length === 1) {
        // Simpan outlet_id di cookie (karena ini pilihan session)
        useCookie('outlet_id', cookieConfig).value = userOutlets[0]._id
        await navigateTo('/dashboard')
      } else {
        // Simpan sementara untuk halaman pemilihan
        localStorage.setItem('temp_outlets', JSON.stringify(userOutlets))
        await navigateTo('/auth/select-outlet')
      }
    }
  } catch (err: any) {
    const msg = err.response?.data?.message || 'Gagal masuk, cek kembali akun Anda'
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