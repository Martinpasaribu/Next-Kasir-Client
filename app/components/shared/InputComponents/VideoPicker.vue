<script setup lang="ts">
const props = defineProps<{
  modelValue: any;
  label: string;
}>();

const emit = defineEmits(['update:modelValue']);
const fileInput = ref<HTMLInputElement | null>(null);

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    // Validasi sederhana: pastikan mp4
    if (target.files[0].type !== 'video/mp4') {
      return alert('Hanya mendukung format MP4');
    }
    emit('update:modelValue', target.files[0]);
  }
};

const fileName = computed(() => {
  if (!props.modelValue) return '';
  return props.modelValue instanceof File ? props.modelValue.name : 'Video tersimpan';
});
</script>

<template>
  <div class="space-y-2">
    <label class="block text-[13px] font-semibold text-slate-700 ml-0.5">{{ label }}</label>
    <div 
      @click="fileInput?.click()"
      :class="[
        'relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer min-h-[140px]',
        modelValue ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 bg-white hover:bg-slate-50'
      ]"
    >
      <input ref="fileInput" type="file" accept="video/mp4" class="hidden" @change="onFileChange" />
      
      <div v-if="!modelValue" class="text-center">
        <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <span class="text-xl">▶</span>
        </div>
        <p class="text-sm font-bold text-slate-600">Pilih Video Materi</p>
        <p class="text-xs text-slate-400 mt-1 uppercase">Format MP4</p>
      </div>

      <div v-else class="text-center">
        <div class="text-blue-600 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-xs font-bold text-blue-700 truncate max-w-[200px]">{{ fileName }}</p>
        <button @click.stop="emit('update:modelValue', null)" class="mt-2 text-[10px] text-red-500 font-bold hover:underline">HAPUS</button>
      </div>
    </div>
  </div>
</template>