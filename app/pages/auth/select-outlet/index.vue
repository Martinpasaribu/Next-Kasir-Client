<script setup lang="ts">
import { Store, ChevronRight, LogOut, Loader2, Zap } from 'lucide-vue-next'

definePageMeta({
  layout: false
})

const outlets = ref<any[]>([])
const isLoading = ref(false)
const selectedId = ref<string | null>(null)

onMounted(() => {
  const saved = localStorage.getItem('temp_outlets')
  if (saved) {
    try {
      outlets.value = JSON.parse(saved)
    } catch (e) {
      outlets.value = []
    }
  }
  
  if (outlets.value.length === 0) navigateTo('/auth/login')
})

const selectOutlet = async (outletId: string) => {
  if (isLoading.value) return
  
  isLoading.value = true
  selectedId.value = outletId
  
  const cookieConfig = { maxAge: 60 * 60 * 24, path: '/' }
  useCookie('outlet_id', cookieConfig).value = outletId
  
  // Berikan delay sedikit lebih lama agar animasi "Zap" terlihat
  await new Promise(resolve => setTimeout(resolve, 800))
  
  localStorage.removeItem('temp_outlets')
  await navigateTo('/cashier')
}
</script>

<template>
  <div class="min-h-screen bg-[#010409] text-white flex flex-col items-center justify-center p-6 overflow-hidden selection:bg-sky-500/30">
    
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] bg-sky-500/10 blur-[120px] rounded-full animate-pulse"></div>
      <div class="absolute -bottom-[10%] -left-[10%] w-[500px] h-[500px] bg-sky-600/5 blur-[120px] rounded-full"></div>
    </div>

    <div class="w-full max-w-md text-center mb-10 z-10">
      <div class="inline-flex p-4 rounded-3xl bg-sky-500/10 text-sky-400 mb-6 border border-sky-500/20 shadow-2xl shadow-sky-500/10 animate-bounce-subtle">
        <Store :size="40" stroke-width="2.5" />
      </div>
      <h1 class="text-3xl font-black uppercase tracking-tighter leading-none animate-reveal-text">
        Pilih <span class="text-sky-400">Terminal</span>
      </h1>
      <p class="text-gray-500 text-sm mt-3 font-medium tracking-wide animate-fade-in-delayed">
        Hubungkan perangkat ke salah satu cabang aktif
      </p>
    </div>

    <div class="w-full max-w-md space-y-4 relative z-10">
      
      <div 
        v-for="(outlet, index) in outlets" 
        :key="outlet._id"
        @click="selectOutlet(outlet._id)"
        :style="{ '--delay': `${index * 0.1}s` }"
        :class="[
          'group relative border p-6 rounded-[2rem] transition-all duration-500 flex items-center gap-5 shadow-2xl select-none animate-staggered-entry',
          selectedId === outlet._id 
            ? 'border-sky-400 bg-sky-400/10 scale-[0.98] ring-4 ring-sky-400/10' 
            : 'bg-[#0d1117]/80 backdrop-blur-md border-[#30363d] hover:border-sky-400/40 hover:bg-[#161b22] cursor-pointer active:scale-95'
        ]"
      >
        <div :class="[
          'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700',
          selectedId === outlet._id 
            ? 'bg-sky-400 text-black rotate-[360deg] shadow-[0_0_20px_rgba(56,189,248,0.5)]' 
            : 'bg-[#1c2128] text-gray-400 group-hover:bg-sky-400/20 group-hover:text-sky-400'
        ]">
          <Zap v-if="selectedId === outlet._id" :size="28" fill="currentColor" />
          <Store v-else :size="28" />
        </div>
        
        <div class="flex-1">
          <h3 :class="[
            'font-black text-base tracking-tight transition-colors duration-300',
            selectedId === outlet._id ? 'text-sky-400' : 'text-gray-200'
          ]">
            {{ outlet.name }}
          </h3>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-[10px] bg-[#1c2128] px-2 py-0.5 rounded-md text-gray-500 font-black uppercase tracking-widest border border-[#30363d]">
              ID: {{ outlet.code }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-center w-8 h-8">
           <Loader2 v-if="selectedId === outlet._id" class="animate-spin text-sky-400" :size="20" />
           <ChevronRight v-else :size="20" class="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </div>

        <div v-if="selectedId === outlet._id" class="absolute inset-x-10 -bottom-px h-px bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_15px_rgba(56,189,248,0.8)]"></div>
      </div>

      <button 
        v-if="!isLoading"
        @click="navigateTo('/auth/login')"
        class="w-full py-8 text-gray-600 hover:text-white text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-all duration-500 animate-fade-in-delayed group"
      >
        <div class="h-px w-8 bg-gray-800 group-hover:w-12 transition-all"></div>
        <LogOut :size="14" class="group-hover:-translate-x-1 transition-transform" /> Ganti Akun
        <div class="h-px w-8 bg-gray-800 group-hover:w-12 transition-all"></div>
      </button>
    </div>

    <Transition name="fade">
      <div v-if="isLoading" class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#010409]/80 backdrop-blur-xl">
          <div class="relative">
            <div class="w-24 h-24 border-4 border-sky-400/10 border-t-sky-400 rounded-full animate-spin"></div>
            <Store class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sky-400 animate-pulse" :size="32" />
          </div>
          <p class="mt-8 text-xs font-black uppercase tracking-[0.5em] text-sky-400 animate-pulse">Initializing System</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Staggered entry animation */
.animate-staggered-entry {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  animation: entry 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: var(--delay);
}

@keyframes entry {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Bounce effect for icon */
.animate-bounce-subtle {
  animation: bounceSubtle 3s infinite ease-in-out;
}

@keyframes bounceSubtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Text reveal */
.animate-reveal-text {
  animation: reveal 0.8s cubic-bezier(0.77, 0, 0.175, 1);
}

@keyframes reveal {
  from { opacity: 0; letter-spacing: -0.5em; filter: blur(10px); }
  to { opacity: 1; letter-spacing: normal; filter: blur(0); }
}

.animate-fade-in-delayed {
  opacity: 0;
  animation: fadeIn 1s ease-out 0.4s forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

/* Page Transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>