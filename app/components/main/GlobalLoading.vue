<template>
  <Transition name="fade">
    <div v-if="loadingStore.isActive" 
         class="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm">
      
      <div class="flex flex-col items-center text-center p-8">
        <div class="relative mb-6">
          <div class="absolute inset-0 bg-nuxt-green/20 blur-2xl rounded-full animate-pulse"></div>
          
          <div class="relative bg-zinc-900 border border-zinc-800 p-5 rounded-[2rem] shadow-2xl">
            <component 
              :is="LucideIcons[loadingStore.currentConfig.icon] || LucideIcons.Loader2" 
              class="w-12 h-12 text-nuxt-green"
              :class="{ 'animate-spin-slow': loadingStore.currentConfig.icon === 'Loader2' }"
              :stroke-width="2.5"
            />
          </div>
        </div>

        <h3 class="text-white font-black text-xl uppercase tracking-tighter mb-2">
          {{ loadingStore.currentConfig.title }}
        </h3>
        
        <p class="text-zinc-400 text-sm font-medium max-w-[280px] leading-relaxed">
          {{ loadingStore.currentConfig.desc }}
        </p>

        <div class="mt-6 w-48 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div class="h-full bg-nuxt-green rounded-full animate-loading-bar"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import * as LucideIcons from 'lucide-vue-next'
import { useLoading } from '~/stores/useLoading'

const loadingStore = useLoading()
</script>

<style scoped>
.animate-spin-slow {
  animation: spin 2s linear infinite;
}

.animate-loading-bar {
  width: 30%;
  animation: loading-progress 1.5s infinite ease-in-out;
}

@keyframes loading-progress {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Transisi Halus */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>