<script setup lang="ts">
import { getCategoryIcon } from '~/constant/IconCategory';

defineProps<{ categories: any[], viewMode: 'grid' | 'list' }>();
</script>

<template>
  <div :class="viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 gap-4' : 'flex flex-col gap-2'">
    <div v-for="cat in categories" :key="cat._id" 
          class="bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 
          p-4 rounded-3xl transition-all hover:ring-2 ring-nuxt-green  flex  justify-between items-center">
        
        <div class="">

          <Icon :name="getCategoryIcon(cat?.ref_code)" size="25" />
          <div class="font-bold text-nuxt-gray-950 dark:text-white">{{ cat.name }}</div>
        </div>
        <LucideChevronRight />
    </div>
  </div>
</template>