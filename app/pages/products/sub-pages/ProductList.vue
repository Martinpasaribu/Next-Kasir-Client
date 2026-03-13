<script setup lang="ts">
defineProps<{ products: any[], viewMode: 'grid' | 'list' }>();
</script>

<template>
  <div :class="viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 gap-4' : 'flex flex-col gap-2'">
    <div v-for="item in products" :key="item._id" 
         class="bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 
         p-4 rounded-3xl transition-all hover:ring-2 ring-nuxt-green  flex  justify-between items-center">
      
      <div class="">
        <div class="font-bold text-nuxt-gray-950 dark:text-white">{{ item.name }}</div>
        <div class="text-xs text-nuxt-gray-400">Rp {{ item.price_sell.toLocaleString() }}</div>
      </div>
      <LucideChevronRight />
    </div>
  </div>
</template>