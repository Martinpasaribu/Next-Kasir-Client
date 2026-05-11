<script setup lang="ts">
import { PackageOpen, Plus } from 'lucide-vue-next';

defineProps<{ 
  products: any[], 
  viewMode: 'grid' | 'list' 
}>();

defineEmits(['addNew']); // Opsional: untuk mentrigger modal tambah produk
</script>

<template>
  <div>
    <div v-if="products.length > 0" 
         :class="viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 gap-4' : 'flex flex-col gap-2'">
      <div v-for="item in products" :key="item._id" 
           class="bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 
           p-4 rounded-3xl transition-all hover:ring-2 ring-nuxt-green flex justify-between items-center group cursor-pointer">
        
        <div class="min-w-0">
          <div class="font-bold text-nuxt-gray-950 dark:text-white truncate">{{ item.name }}</div>
          <div class="text-xs text-nuxt-gray-400">Rp {{ item.price_sell?.toLocaleString() || 0 }}</div>
        </div>
        <LucideChevronRight class="text-nuxt-gray-300 group-hover:text-nuxt-green transition-colors" :size="18" />
      </div>
    </div>

    <div v-else 
         class="flex flex-col items-center justify-center py-20 px-6 bg-nuxt-gray-50/50 dark:bg-nuxt-gray-900/20 border-2 border-dashed border-nuxt-gray-200 dark:border-nuxt-gray-800 rounded-[3rem] animate-in fade-in zoom-in duration-500">
      
      <div class="w-20 h-20 bg-white dark:bg-nuxt-gray-900 rounded-[2rem] shadow-xl shadow-nuxt-gray-200/50 dark:shadow-none flex items-center justify-center mb-6 ring-1 ring-nuxt-gray-100 dark:ring-nuxt-gray-800">
        <PackageOpen :size="32" class="text-nuxt-gray-300 dark:text-nuxt-gray-600" />
      </div>

      <div class="text-center space-y-2 mb-8">
        <h3 class="text-xl font-black italic tracking-tighter text-nuxt-gray-900 dark:text-white uppercase">
          No Products <span class="text-nuxt-green">Found</span>
        </h3>
        <p class="text-sm text-nuxt-gray-400 max-w-[240px] leading-relaxed">
          Your inventory is currently empty. Start by adding your first unit.
        </p>
      </div>

      <button 
        @click="$emit('addNew')"
        class="flex items-center gap-2 bg-nuxt-gray-950 dark:bg-white text-nuxt-green-dark dark:text-black-4 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-nuxt-gray-200 dark:shadow-none"
      >
        <Plus :size="14" stroke-width="3" />
        Tambah Produk
      </button>
    </div>
  </div>
</template>