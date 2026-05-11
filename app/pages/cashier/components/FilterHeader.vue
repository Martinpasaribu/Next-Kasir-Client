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
      
      <div class="relative w-full sm:w-64 landscape:w-48 transition-all">
        <span class="absolute inset-y-0 left-3 flex items-center text-nuxt-gray-400">
          <LucideSearch :size="16" />
        </span>
        <input 
          :value="modelValue"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          type="text" 
          placeholder="Cari..." 
          class="w-full pl-9 pr-4 py-2 landscape:py-0.5 landscape:lg:py-1.5 text-sm bg-nuxt-gray-100 dark:bg-nuxt-gray-800 border-none rounded-xl focus:ring-2 focus:ring-nuxt-green/30 outline-none transition-all placeholder:text-nuxt-gray-400"
        />
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