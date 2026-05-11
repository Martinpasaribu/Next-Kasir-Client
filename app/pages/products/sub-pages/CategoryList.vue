<script setup lang="ts">
import { getCategoryIcon } from '~/constant/IconCategory';
import { Layers, Plus, FolderSearch } from 'lucide-vue-next';

defineProps<{ 
  categories: any[], 
  viewMode: 'grid' | 'list' 
}>();

defineEmits(['addCategory']);
</script>

<template>
  <div>
    <div v-if="categories.length > 0" 
         :class="viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 gap-4' : 'flex flex-col gap-2'">
      <div v-for="cat in categories" :key="cat._id" 
           class="bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 
           p-5 rounded-[2rem] transition-all hover:ring-2 ring-nuxt-green flex justify-between items-center group cursor-pointer shadow-sm hover:shadow-md">
        
        <div class="flex items-center gap-4 min-w-0">
          <div class="w-12 h-12 bg-nuxt-gray-50 dark:bg-nuxt-gray-800 rounded-2xl flex items-center justify-center text-nuxt-green group-hover:scale-110 transition-transform">
            <Icon :name="getCategoryIcon(cat?.ref_code)" size="24" />
          </div>
          <div class="min-w-0">
            <div class="font-bold text-nuxt-gray-950 dark:text-white truncate uppercase tracking-tight text-sm">{{ cat.name }}</div>
            <div class="text-[10px] text-nuxt-gray-400 font-mono">CODE: {{ cat.ref_code || 'N/A' }}</div>
          </div>
        </div>
        <LucideChevronRight class="text-nuxt-gray-300 group-hover:text-nuxt-green transition-colors" :size="18" />
      </div>
    </div>

    <div v-else 
         class="flex flex-col items-center justify-center py-24 px-6 bg-nuxt-gray-50/30 dark:bg-nuxt-gray-900/10 border-2 border-dashed border-nuxt-gray-200 dark:border-nuxt-gray-800 rounded-[3.5rem] animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div class="relative mb-6">
        <div class="w-24 h-24 bg-white dark:bg-nuxt-gray-900 rounded-[2.5rem] shadow-xl flex items-center justify-center ring-1 ring-nuxt-gray-100 dark:ring-nuxt-gray-800">
          <Layers :size="40" class="text-nuxt-gray-200 dark:text-nuxt-gray-700" />
        </div>
        <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-nuxt-green text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-black-4">
          <FolderSearch :size="16" />
        </div>
      </div>

      <div class="text-center space-y-2 mb-10">
        <h3 class="text-2xl font-black italic tracking-tighter text-nuxt-gray-900 dark:text-white uppercase">
          No Categories <span class="text-nuxt-green">Defined</span>
        </h3>
        <p class="text-xs text-nuxt-gray-400 max-w-[280px] leading-relaxed font-medium">
          Organize your inventory by creating groups. This helps in faster product lookup and better reporting.
        </p>
      </div>

      <button 
        @click="$emit('addCategory')"
        class="group flex items-center gap-3 bg-nuxt-green text-black-4 px-8 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-nuxt-gray-950 hover:text-white dark:hover:bg-white dark:hover:text-black-4 transition-all shadow-xl shadow-nuxt-green/20"
      >
        <Plus :size="16" stroke-width="3" class="group-hover:rotate-90 transition-transform duration-300" />
        Create First Category
      </button>
    </div>
  </div>
</template>