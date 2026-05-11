<script setup lang="ts">
// Menggunakan defineModel untuk sinkronisasi teks
const modelValue = defineModel<string>()

interface Props {
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'url'
  isTextarea?: boolean
  rows?: number
  error?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  isTextarea: false,
  rows: 4
})

const labelClass = "block text-[11px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest mb-2 ml-1"
const baseInputClass = "w-full p-3 bg-slate-50 dark:bg-nuxt-gray-800 border border-slate-200 dark:border-zinc-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 dark:text-zinc-200 placeholder:text-slate-400"
</script>

<template>
  <div class="w-full">
    <label v-if="label" :class="labelClass">{{ label }}</label>
    
    <textarea
      v-if="isTextarea"
      v-model="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :class="[
        baseInputClass, 
        'resize-none',
        error ? 'border-red-500 ring-1 ring-red-500' : ''
      ]"
    ></textarea>

    <input
      v-else
      v-model="modelValue"
      :type="type"
      :placeholder="placeholder"
      :class="[
        baseInputClass,
        error ? 'border-red-500 ring-1 ring-red-500' : ''
      ]"
    />

    <p v-if="error" class="mt-1.5 ml-1 text-[10px] text-red-500 font-bold uppercase italic tracking-tight">
      * {{ error }}
    </p>
  </div>
</template>