<script setup lang="ts">
import { 
  CheckCircle, AlertCircle, Info, AlertTriangle, Loader2, X 
} from 'lucide-vue-next';

const props = defineProps<{
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
}>();

const emit = defineEmits(['remove']);

const config = {
  success: { icon: CheckCircle, class: 'bg-white dark:bg-slate-900 border-emerald-500 text-emerald-600', iconClass: 'text-emerald-500' },
  error: { icon: AlertCircle, class: 'bg-white dark:bg-slate-900 border-red-500 text-red-600', iconClass: 'text-red-500' },
  warning: { icon: AlertTriangle, class: 'bg-white dark:bg-slate-900 border-amber-500 text-amber-600', iconClass: 'text-amber-500' },
  info: { icon: Info, class: 'bg-white dark:bg-slate-900 border-blue-500 text-blue-600', iconClass: 'text-blue-500' },
  loading: { icon: Loader2, class: 'bg-white dark:bg-slate-900 border-slate-400 text-slate-600', iconClass: 'text-slate-400 animate-spin' },
};
</script>

<template>
  <div 
    :class="[
      config[type].class, 
      'group relative flex items-center gap-4 px-4 py-4 rounded-2xl border-l-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-opacity-95 backdrop-blur-sm transition-all duration-300'
    ]"
  >
    <div :class="config[type].iconClass">
      <component :is="config[type].icon" class="w-6 h-6" />
    </div>

    <div class="flex-1">
      <p class="text-[14px] font-semibold text-slate-800 dark:text-slate-100 leading-tight">
        {{ message }}
      </p>
    </div>

    <button 
      @click="emit('remove', id)" 
      class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
    >
      <X class="w-4 h-4" />
    </button>
  </div>
</template>