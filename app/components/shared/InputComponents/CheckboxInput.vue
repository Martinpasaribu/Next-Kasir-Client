<script setup lang="ts">
// Menggunakan defineModel untuk sinkronisasi boolean
const modelValue = defineModel<boolean>()

interface Props {
  label: string
  description?: string
  type?: 'checkbox' | 'switch' // Pilihan tampilan
}

withDefaults(defineProps<Props>(), {
  type: 'switch'
})
</script>

<template>
  <div class="flex flex-col items-center gap-2 group cursor-pointer" @click="modelValue = !modelValue">
    <span class="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest transition-colors group-hover:text-blue-500">
      {{ label }}
    </span>

    <div v-if="type === 'switch'" 
      class="relative w-12 h-6 rounded-full transition-all duration-300"
      :class="modelValue ? 'bg-blue-600' : 'bg-slate-200 dark:bg-zinc-700'"
    >
      <div 
        class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm"
        :class="modelValue ? 'translate-x-6' : 'translate-x-0'"
      ></div>
    </div>

    <input 
      v-else
      type="checkbox" 
      v-model="modelValue"
      @click.stop
      class="w-5 h-5 rounded-lg accent-blue-600 cursor-pointer"
    />
    
    <span v-if="description" class="text-[9px] text-slate-400 italic">{{ description }}</span>
  </div>
</template>