<script setup lang="ts">
import { Loader } from 'lucide-vue-next';

const props = defineProps<{
  show: boolean;
  title: string;
  id: string;
  confirmLabel?: string;
  loading?: boolean;
}>();

const emit = defineEmits(['close', 'confirm']);

// Close on ESC key
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && props.show) emit('close');
  });
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        
        <div class="fixed inset-0 bg-slate-900/60 dark:bg-black-1/60 backdrop-blur-sm" @click="emit('close')"></div>

        <div class="relative w-full max-w-xl max-h-[90vh] bg-white dark:bg-nuxt-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col ">
          <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center ">
            <div>
              <h3 class="text-lg font-bold text-nuxt-green dark:text-nuxt-green-dark">{{ title }}</h3>
              <h3 class="text-sm font-normal text-slate-400 dark:text-nuxt-gray-400">{{ id }}</h3>
            </div>
            <button @click="emit('close')" class="text-slate-400 hover:text-slate-600">✕</button>
          </div>

          <div class="p-6">
            <slot />
          </div>

          <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50 dark:bg-nuxt-gray-900 flex justify-end gap-3">
            <button 
              @click="emit('close')" 
              class="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-white-1 dark:bg-nuxt-gray-200 dark:hover:bg-nuxt-gray-400 transition-colors disabled:opacity-50  
              rounded-xl"
            >
              Batal
            </button>
            <button 
              @click="emit('confirm')" 
              :disabled="loading"
              class="px-6 py-2 text-sm font-semibold text-black-2 bg-primary-2 dark:text-nuxt-green-dark hover:bg-primary-2 dark:bg-nuxt-gray-950 dark:hover:bg-green-950 transition-colors
               disabled:opacity-50 rounded-xl flex items-center gap-2"
            >
              <span v-if="loading" class="text-lg">
                <Loader :size="17"  class="text-white animate-spin dark:text-nuxt-green-dark "/>
              </span>
              {{ confirmLabel || 'Simpan' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>