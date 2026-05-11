<script setup lang="ts">
const props = defineProps<{
  modelValue: any // Menampung File atau MediaObject
  label: string
  description?: string
  aspectRatio?: 'square' | 'video'
  multiple?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

/**
 * Fungsi untuk mendapatkan URL preview.
 * Jika data adalah File baru, buat Blob URL.
 * Jika data adalah MediaObject lama (saat edit), gunakan .url.
 */
const getPreviewUrl = (item: any) => {
  if (!item) return ''
  if (item instanceof File) return URL.createObjectURL(item)
  return item.url // Jika ini MediaObject dari database
}

const handleFile = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  const fileArray = Array.from(files)

  if (props.multiple) {
    const currentVal = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    emit('update:modelValue', [...currentVal, ...fileArray])
  } else {
    emit('update:modelValue', fileArray[0])
  }
  
  target.value = '' // Reset input agar bisa upload file yang sama
}

const removeItem = (index?: number) => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    const newVal = [...props.modelValue]
    newVal.splice(index!, 1)
    emit('update:modelValue', newVal)
  } else {
    emit('update:modelValue', null)
  }
}
</script>

<template>
  <div class="flex flex-col gap-2 w-full">
    <div class="flex flex-col justify-start items-start mb-1">
      <label class="text-[13px] font-semibold text-slate-700 ml-0.5">{{ label }}</label>
      <span v-if="description" class="text-[10px] text-slate-400 font-medium italic">{{ description }}</span>
    </div>

    <div v-if="multiple" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      <div 
        v-for="(file, idx) in (modelValue as any[])" 
        :key="idx"
        class="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group shadow-sm bg-slate-50"
      >
        <img :src="getPreviewUrl(file)" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-slate-900/40 dark:bg-nuxt-gray-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
          <button @click="removeItem(idx)" class="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors shadow-lg">
            <span class="text-[10px] font-bold uppercase px-1">Remove</span>
          </button>
        </div>
      </div>

      <label class="aspect-square border-2 border-dashed border-slate-200 dark:bg-nuxt-gray-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
        <div class="w-8 h-8 bg-white dark:nuxt-gray-700 border border-slate-100 shadow-sm rounded-lg flex items-center justify-center mb-1 group-hover:scale-110 transition-transform text-slate-400">＋</div>
        <!-- <span class="text-[9px] font-bold text-slate-400 uppercase">Add Image</span> -->
        <input type="file" class="hidden" @change="handleFile" multiple accept="image/*" />
      </label>
    </div>

    <div 
      v-else
      :class="[
        'relative group border-2 border-dashed rounded-2xl transition-all duration-300 flex flex-col items-center justify-center overflow-hidden bg-nuxt-gray-800 dark:bg-black-1',
        aspectRatio === 'video' ? 'aspect-video' : 'aspect-square',
        modelValue ? 'border-slate-200' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'
      ]"
    >
      <template v-if="modelValue">
        <img :src="getPreviewUrl(modelValue)" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
          <button @click="removeItem()" class="bg-white/20 hover:bg-red-500 text-white p-2 rounded-xl transition-colors">
            <span class="text-xs font-bold uppercase px-2">Remove</span>
          </button>
        </div>
      </template>

      <label v-else class="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4">
        <div class="w-10 h-10 bg-white dark:bg-nuxt-gray-200 border border-slate-100 shadow-sm rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
          <span class="text-slate-400 font-light text-xl">＋</span>
        </div>
        <span class="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Drop or Click</span>
        <input type="file" class="hidden" @change="handleFile" accept="image/*" />
      </label>
    </div>
  </div>
</template>