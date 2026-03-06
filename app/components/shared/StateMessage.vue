<template>
  <div class="min-h-full max-h-screen flex flex-col items-center justify-center py-20 text-nuxt-gray-400 ">
    <div v-if="type === 'loading'" class="relative flex flex-col items-center">
      <div class="w-10 h-10 border-4 border-nuxt-green border-t-transparent rounded-full animate-spin mb-4">
    </div>
    <LucideShoppingBasket class="absolute top-2 text-nuxt-light dark: text-nuxt-green-dark" />
      <p class="text-xs font-bold uppercase tracking-widest animate-pulse">Memuat data...</p>
    </div>

    <div v-else-if="type === 'empty'" class="text-center opacity-60">
      <Icon name="ph:magnifying-glass-slash" size="64" class="mx-auto mb-4" />
      <p class="text-sm font-bold uppercase tracking-widest">{{ message || 'Data tidak ditemukan' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
    defineProps<{
        type: 'loading' | 'empty'
        message?: string
    }>()
</script>