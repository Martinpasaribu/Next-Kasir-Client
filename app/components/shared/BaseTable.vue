<script setup lang="ts">
defineProps<{
  headers: { label: string; key: string; align?: 'left' | 'right' | 'center' }[];
  items: any[];
}>();
</script>

<template>
  <div class="relative w-full">
    <div v-if="!items || items.length === 0" class="flex flex-col items-center justify-center py-20 text-nuxt-gray-400">
      <Icon name="lucide:inbox" size="48" class="mb-4 opacity-50" />
      <p class="font-black text-sm uppercase tracking-widest">Data Tidak Ditemukan</p>
    </div>

    <div v-else class="hidden md:block overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-nuxt-gray-200 dark:border-nuxt-gray-800 text-nuxt-gray-400 uppercase text-[10px] tracking-[0.15em] font-black">
            <th v-for="h in headers" :key="h.key" 
                :class="['px-6 py-4', h.align === 'right' ? 'text-right' : h.align === 'center' ? 'text-center' : 'text-left']">
              {{ h.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-nuxt-gray-200 dark:divide-nuxt-gray-800">
          <tr v-for="(item, index) in items" :key="index" class="group hover:bg-nuxt-gray-50/50 dark:hover:bg-nuxt-gray-800/20 transition-all duration-200">
            <td v-for="h in headers" :key="h.key" 
                :class="['px-6 py-4 text-sm font-semibold text-nuxt-gray-950 dark:text-white', h.align === 'right' ? 'text-right' : h.align === 'center' ? 'text-center' : 'text-left']">
              <slot :name="`cell(${h.key})`" :item="item">
                {{ item[h.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="md:hidden space-y-4">
      <div v-for="(item, index) in items" :key="index" 
           class="p-5 bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 rounded-3xl shadow-sm hover:shadow-md hover:border-nuxt-green transition-all">
        
        <div v-for="h in headers" :key="h.key" 
             v-show="h.label" 
             class="flex justify-between items-center py-2.5 border-b last:border-0 border-nuxt-gray-100 dark:border-nuxt-gray-800/50">
          <span class="text-[9px] font-black uppercase text-nuxt-gray-400 tracking-wider">{{ h.label }}</span>
          <span class="text-sm font-bold text-nuxt-gray-950 dark:text-white text-right ml-4">
            <slot :name="`cell(${h.key})`" :item="item">
              {{ item[h.key] }}
            </slot>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>