<script setup lang="ts">
import { computed } from 'vue'
import { categoryIcons, getCategoryIcon, getCategoryLabel } from '~/constant/IconCategory'

interface Props {
  modelValue: string | null | undefined
  label?: string
  disabled?: boolean
  error?: string
  placeholder?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

/** ---------- Styling Konsisten ---------- **/
const labelClass = "block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2"
const inputClass = "w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-[#30363d] rounded-xl px-4 pl-10 py-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all disabled:opacity-50 appearance-none text-white"

/** ---------- Data Logic ---------- **/
// mapping data untuk list dropdown agar menampilkan Nama Kategori
const options = Object.entries(categoryIcons).map(([code, value]) => ({
  code,
  label: value.label
}))

const currentIconName = computed(() => getCategoryIcon(props.modelValue))
const currentLabel = computed(() => getCategoryLabel(props.modelValue))

/** ---------- Action Handler ---------- **/
const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const val = target.value === 'null' ? null : target.value
  emit('update:modelValue', val)
}
</script>

<template>
  <div class="w-full">
    <label v-if="label" :class="labelClass">{{ label }}</label>
    
    <div class="space-y-3">
      <div 
        v-if="modelValue"
        class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-[#0d1117] border border-dashed border-gray-200 dark:border-[#30363d] rounded-2xl transition-all animate-in fade-in zoom-in duration-300"
      >
        <div class="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shadow-inner">
          <Icon :key="currentIconName" :name="currentIconName" size="32" stroke-width="2" />
        </div>
        <div>
          <h4 class="font-bold text-white text-sm">Preview Terpilih</h4>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-[10px] font-black uppercase tracking-wider text-sky-400">
              {{ currentLabel }}
            </span>
            <span class="text-[10px] text-gray-600 font-mono italic">
              ({{ modelValue }})
            </span>
          </div>
        </div>
      </div>

      <div class="relative flex items-center">
        <div class="absolute left-3.5 z-10 text-gray-500">
          <Icon 
            :key="currentIconName"
            :name="currentIconName || 'lucide:help-circle'" 
            size="18" 
          />
        </div>

        <select 
          :value="modelValue || 'null'" 
          :class="inputClass" 
          :disabled="disabled"
          @change="onChange"
        >
          <option value="null">{{ placeholder || 'Pilih Jenis Kategori' }}</option>
          <option 
            v-for="opt in options" 
            :key="opt.code" 
            :value="opt.code"
          >
            {{ opt.label }} ({{ opt.code }})
          </option>
        </select>

        <div class="absolute right-3.5 pointer-events-none text-gray-500">
          <Icon name="lucide:chevron-down" size="16" />
        </div>
      </div>
    </div>
    
    <p v-if="error" class="mt-1 text-[10px] font-bold text-rose-500 uppercase tracking-tight italic">{{ error }}</p>
  </div>
</template>