<template>
  <div class="flex-grow w-full flex flex-col items-center justify-center py-12 text-nuxt-gray-400">
    
    <div v-if="type === 'loading'" class="relative flex flex-col items-center">
      <div class="relative flex items-center justify-center mb-6">
        <div class="w-14 h-14 border-2 border-nuxt-green border-t-transparent rounded-full animate-spin"></div>
        <LucideShoppingBasket :size="20" class="absolute text-nuxt-green animate-pulse" />
      </div>
      <p class="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse text-nuxt-green/60">
        Memuat data
      </p>
    </div>

    <div v-else-if="type === 'empty'" class="flex flex-col items-center opacity-30 py-10">
      <Icon name="ph:magnifying-glass-slash" size="64" class="mb-4" />
      <p class="text-xs font-bold uppercase tracking-widest">{{ message || 'Data tidak tersedia' }}</p>
    </div>
    
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: 'loading' | 'empty'
  message?: string
}>()
</script>