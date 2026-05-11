<script setup lang="ts">
import { Store, Loader2 } from 'lucide-vue-next'

const { selectedOutletId, userOutlets, switchOutlet } = useOutlet()

// 1. State lokal untuk "mengunci" UI agar tidak bounce balik
const proxyId = ref(selectedOutletId.value)
const isSwitching = ref(false)

// Sinkronkan proxyId saat inisialisasi awal atau jika state berubah secara eksternal
watch(selectedOutletId, (newVal) => {
  if (newVal) proxyId.value = newVal
}, { immediate: true })

const onOutletChange = async (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newId = target.value
  
  if (newId === selectedOutletId.value) return

  // 2. Kunci tampilan ke nilai baru secara instan
  proxyId.value = newId
  isSwitching.value = true
  
  // Tambahkan class ke body untuk mematikan scroll (opsional)
  if (process.client) document.body.classList.add('loading-active')

  try {
    await switchOutlet(newId)
  } catch (error) {
    // Jika gagal, kembalikan ke state semula
    isSwitching.value = false
    proxyId.value = selectedOutletId.value
    if (process.client) document.body.classList.remove('loading-active')
    console.error('Failed to switch outlet:', error)
  }
}
</script>

<template>
  <div 
    class="flex w-full max-w-[14rem] items-center gap-2 bg-[#424242] dark:bg-[#161b22] border border-[#30363d] rounded-xl px-3 py-2 transition-all group relative"
    :class="[isSwitching ? 'opacity-50 border-sky-500/50' : 'hover:border-sky-500/50']"
  >
    <Store 
      :size="14" 
      class="text-sky-400 group-hover:scale-110 transition-transform" 
    />
    
    <select 
      v-model="proxyId"
      @change="onOutletChange"
      :disabled="isSwitching"
      class="bg-transparent text-[11px] font-bold text-white outline-none cursor-pointer uppercase tracking-tight pr-2 disabled:cursor-not-allowed"
    >
      <option v-if="!userOutlets?.length" disabled value="">No Outlets Available</option>
      <option 
        v-for="outlet in userOutlets" 
        :key="outlet.id || outlet._id" 
        :value="outlet.id || outlet._id" 
        class="bg-[#0d1117] text-white"
      >
        {{ outlet.name }}
      </option>
    </select>
  </div>

  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isSwitching" 
        class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#424242] dark:bg-[#161b22]/90 backdrop-blur-md"
      >
        <div class="relative flex items-center justify-center">
          <div class="absolute w-24 h-24 border-2 border-sky-500/10 border-t-sky-500 rounded-full animate-spin"></div>
          
          <div class="bg-[#0d1117] p-6 rounded-[2rem] border border-[#30363d] shadow-2xl shadow-sky-500/20">
            <Loader2 :size="40" class="text-sky-400 animate-spin" />
          </div>
        </div>

        <div class="mt-8 text-center">
          <h3 class="text-white font-black tracking-[0.3em] uppercase text-xs">Switching Node</h3>
          <p class="text-gray-500 text-[9px] uppercase tracking-[0.4em] mt-3 animate-pulse">
            Reconnecting to Database Instance...
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
:global(body.loading-active) {
  overflow: hidden !important;
}
</style>