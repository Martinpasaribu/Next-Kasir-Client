<script setup lang="ts">
// Menggunakan v-model reaktif
const modelValue = defineModel<number>()

interface Props {
  label?: string
  placeholder?: string
  prefix?: string // Contoh: 'Rp'
  suffix?: string // Contoh: 'Pcs' atau 'Kg'
  error?: string
  min?: number
  max?: number
}

defineProps<Props>()

const labelClass = "block text-[11px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1"
const inputWrapperClass = "relative flex items-center"
const baseInputClass = "w-full p-3 bg-slate-50 dark:bg-nuxt-gray-800 border border-slate-200 dark:border-nuxt-gray-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 dark:text-zinc-200"
</script>

<template>
  <div class="w-full">
    <label v-if="label" :class="labelClass">{{ label }}</label>
    
    <div :class="inputWrapperClass">
      <span v-if="prefix" class="absolute left-4 text-slate-400 text-sm font-medium">
        {{ prefix }}
      </span>

      <input
        v-model.number="modelValue"
        type="number"
        :min="min"
        :max="max"
        :placeholder="placeholder"
        :class="[
          baseInputClass,
          prefix ? 'pl-11' : 'pl-4',
          suffix ? 'pr-12' : 'pr-4',
          error ? 'border-red-500 ring-1 ring-red-500' : ''
        ]"
      />

      <span v-if="suffix" class="absolute right-4 text-slate-400 text-xs font-bold uppercase">
        {{ suffix }}
      </span>
    </div>

    <p v-if="error" class="mt-1.5 ml-1 text-[10px] text-red-500 font-bold uppercase italic">
      * {{ error }}
    </p>
  </div>
</template>

<style scoped>
/* Menghilangkan panah bawaan browser pada input number */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>