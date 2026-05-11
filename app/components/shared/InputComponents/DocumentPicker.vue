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
    emit('update:modelValue', target.files[0]);
  }
};

const fileName = computed(() => {
  if (!props.modelValue) return '';
  return props.modelValue instanceof File ? props.modelValue.name : 'PDF tersimpan';
});
</script>

<template>
  <div class="space-y-2">
    <label class="block text-[13px] font-semibold text-slate-700 ml-0.5">{{ label }}</label>
    <div 
      @click="fileInput?.click()"
      :class="[
        'relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer min-h-[140px]',
        modelValue ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 bg-white hover:bg-slate-50'
      ]"
    >
      <input ref="fileInput" type="file" accept=".pdf" class="hidden" @change="onFileChange" />
      
      <div v-if="!modelValue" class="text-center">
        <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <span class="text-xl">📄</span>
        </div>
        <p class="text-sm font-bold text-slate-600">Pilih Dokumen PDF</p>
        <p class="text-xs text-slate-400 mt-1 uppercase">Format PDF</p>
      </div>

      <div v-else class="text-center">
        <div class="text-emerald-600 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <p class="text-xs font-bold text-emerald-700 truncate max-w-[200px]">{{ fileName }}</p>
        <button @click.stop="emit('update:modelValue', null)" class="mt-2 text-[10px] text-red-500 font-bold hover:underline">HAPUS</button>
      </div>
    </div>
  </div>
</template>