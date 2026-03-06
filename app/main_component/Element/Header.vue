<script setup lang="ts">
defineProps(['modelValue'])
defineEmits(['update:modelValue'])

const isOnline = useOnline()
</script>

<template>
  <header 
    class="px-3 py-2 md:px-5 md:py-2 landscape:xl:py-4 bg-white/80 dark:bg-nuxt-gray-900/80 backdrop-blur-xl border-b border-nuxt-gray-200 dark:border-nuxt-gray-800 transition-all"
  >
    <div class="flex flex-col sm:flex-row landscape:flex-row gap-4 landscape:gap-10 justify-between items-start sm:items-center landscape:items-center">
      
      <div class="landscape:flex landscape:lg:flex-col landscape:items-center landscape:gap-4">
        <h1 class="text-xl landscape:text-base font-black text-nuxt-gray-900 dark:text-white uppercase tracking-tight leading-none">
          Next Kasir
        </h1>
        
        <div class="flex items-center gap-2 mt-1 landscape:mt-0">
          <div 
            class="w-2 h-2 rounded-full animate-pulse"
            :class="isOnline ? 'bg-nuxt-green shadow-[0_0_8px_#00dc82]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'"
          ></div>
          <p 
            class="text-[10px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap"
            :class="isOnline ? 'text-nuxt-green' : 'text-red-500'"
          >
            {{ isOnline ? 'Online' : 'Offline' }}
          </p>
        </div>
      </div>

    </div>

  </header>
</template>

<style scoped>
/* Tambahan transisi halus saat diputar */
header {
  transition: padding 0.3s ease-in-out;
}
</style>