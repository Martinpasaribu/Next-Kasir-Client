<script setup lang="ts">
// Menggunakan defineModel agar v-model di parent otomatis sinkron
const modelValue = defineModel<string | number>()

interface Option {
  label: string
  value: string | number
}

defineProps<{
  label?: string
  options: Option[]
  placeholder?: string
  error?: string
}>()

const labelClass = "block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1"
const selectClass = "w-full p-3 bg-slate-50 dark:bg-nuxt-gray-800 border border-slate-200 dark:border-nuxt-gray-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none text-slate-700 dark:text-zinc-200"
</script>

<template>
  <div class="w-full">
    <label v-if="label" :class="labelClass">{{ label }}</label>
    
    <div class="relative">
      <select 
        v-model="modelValue" 
        :class="[selectClass, error ? 'border-red-500 ring-1 ring-red-500' : '']"
      >
        <option value="" disabled selected>{{ placeholder || 'Pilih opsi...' }}</option>
        <option 
          v-for="opt in options" 
          :key="opt.value" 
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>
      
      <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
    
    <p v-if="error" class="mt-1 ml-1 text-[10px] text-red-500 font-bold uppercase tracking-tight">
      {{ error }}
    </p>
  </div>
</template>