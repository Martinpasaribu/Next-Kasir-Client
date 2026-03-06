<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { LucideX, LucideDelete, LucideEqual, LucideGripHorizontal } from 'lucide-vue-next';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close']);

// --- Logika Kalkulator ---
const display = ref('0');
const formula = ref('');
const append = (char: string) => {
  if (display.value === '0' && !['+', '-', '*', '/'].includes(char)) display.value = char;
  else display.value += char;
};
const clear = () => { display.value = '0'; formula.value = ''; };
const backspace = () => {
  display.value = display.value.length > 1 ? display.value.slice(0, -1) : '0';
};
const calculate = () => {
  try {
    formula.value = display.value + ' =';
    display.value = String(Function(`return ${display.value.replace('×', '*').replace('÷', '/')}`)());
  } catch (e) {
    display.value = 'Error';
    setTimeout(clear, 1500);
  }
};

// --- Logika Draggable ---
const position = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const offset = ref({ x: 0, y: 0 });

const startDrag = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true;
  
  let clientX = 0;
  let clientY = 0;

  // Cara paling aman bagi TS: Cek instance secara langsung
  if (window.TouchEvent && e instanceof TouchEvent) {
    const touch = e.touches[0];
    if (touch) {
      clientX = touch.clientX;
      clientY = touch.clientY;
    }
  } else {
    // Casting eksplisit agar TS tenang
    clientX = (e as MouseEvent).clientX;
    clientY = (e as MouseEvent).clientY;
  }
  
  offset.value = {
    x: clientX - position.value.x,
    y: clientY - position.value.y
  };
};

const onDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return;

  let clientX = 0;
  let clientY = 0;

  if (window.TouchEvent && e instanceof TouchEvent) {
    const touch = e.touches[0];
    if (touch) {
      clientX = touch.clientX;
      clientY = touch.clientY;
    }
  } else {
    clientX = (e as MouseEvent).clientX;
    clientY = (e as MouseEvent).clientY;
  }
  
  // Update posisi dengan batasan layar (boundaries)
  if (process.client) {
    const newX = clientX - offset.value.x;
    const newY = clientY - offset.value.y;

    // Supaya kalkulator tidak hilang keluar layar
    position.value = {
      x: Math.min(Math.max(0, newX), window.innerWidth - 280),
      y: Math.min(Math.max(0, newY), window.innerHeight - 350)
    };
  }
};

const stopDrag = () => { isDragging.value = false; };

// Initial Position (Tengah Layar)
onMounted(() => {
  if (process.client) {
    position.value = { 
      x: (window.innerWidth / 2) - 140, 
      y: (window.innerHeight / 2) - 200 
    };
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchmove', onDrag);
    window.addEventListener('touchend', stopDrag);
  }
});
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[10000] pointer-events-none flex items-center justify-center">
      <div class="absolute inset-0 pointer-events-auto" @click="$emit('close')"></div>

      <div 
        class="relative w-[220px] bg-white dark:bg-gray-900 rounded-[1.5rem] shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden pointer-events-auto select-none"
        :style="{ transform: `translate(${position.x}px, ${position.y}px)`, position: 'absolute', left: 0, top: 0 }"
      >
        <div 
          @mousedown="startDrag" 
          @touchstart="startDrag"
          class="absolute top-0 left-0 right-0 h-6 flex items-center justify-center cursor-move active:opacity-50 z-10"
        >
          <div class="w-8 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>

        <div class="p-4 pt-7 pb-2 text-right flex flex-col justify-end min-h-[85px] bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-100 dark:border-gray-800">
          <!-- <div class="text-[8px] font-black uppercase tracking-widest text-emerald-500/70 mb-0.5">Calc</div> -->
          <div class="text-[10px] text-gray-400 font-medium h-4 overflow-hidden tabular-nums italic">{{ formula }}</div>
          <div class="text-2xl font-semibold tracking-tighter text-gray-950 dark:text-white truncate tabular-nums">
            {{ display }}
          </div>
        </div>

        <div class="p-2 grid grid-cols-4 gap-1.5 bg-white dark:bg-gray-900">
          <button @click="clear" class="btn-mini col-span-2 !bg-red-500/10 !text-red-500 text-[10px]">AC</button>
          <button @click="backspace" class="btn-mini !text-gray-500"><LucideDelete :size="14" /></button>
          <button @click="append('/')" class="btn-mini !text-emerald-500 !bg-emerald-500/10">÷</button>
          
          <button v-for="n in ['7','8','9']" :key="n" @click="append(n)" class="btn-mini bg-gray-50 dark:bg-gray-800">{{ n }}</button>
          <button @click="append('*')" class="btn-mini !text-emerald-500 !bg-emerald-500/10">×</button>

          <button v-for="n in ['4','5','6']" :key="n" @click="append(n)" class="btn-mini bg-gray-50 dark:bg-gray-800">{{ n }}</button>
          <button @click="append('-')" class="btn-mini !text-emerald-500 !bg-emerald-500/10">-</button>

          <button v-for="n in ['1','2','3']" :key="n" @click="append(n)" class="btn-mini bg-gray-50 dark:bg-gray-800">{{ n }}</button>
          <button @click="append('+')" class="btn-mini !text-emerald-500 !bg-emerald-500/10">+</button>

          <button @click="append('0')" class="btn-mini col-span-2 bg-gray-50 dark:bg-gray-800">0</button>
          <button @click="append('.')" class="btn-mini bg-gray-50 dark:bg-gray-800">.</button>
          <button @click="calculate" class="btn-mini !bg-emerald-500 !text-gray-950 shadow-md shadow-emerald-500/20">
            <LucideEqual :size="16" />
          </button>
        </div>

        <button @click="$emit('close')" class="absolute rounded-2xl border border-gray-200 dark:border-gray-700 top-1.5 left-1.5 p-1 text-slate-600 hover:text-red-500 transition-colors z-20">
          <LucideX :size="15" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@reference "../../assets/css/main.css"; 

.btn-mini {
  /* Ukuran tombol diperkecil secara konsisten */
  @apply h-9 rounded-lg flex items-center justify-center text-sm font-bold;
  @apply transition-all active:scale-90 cursor-pointer;
  background-color: color-mix(in srgb, currentColor 8%, transparent);
}

.btn-mini:hover {
  @apply brightness-105;
  background-color: color-mix(in srgb, currentColor 12%, transparent);
}

:where(.dark) .btn-mini {
  @apply bg-gray-800/50 text-white;
}

.fade-enter-active, .fade-leave-active { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px) scale(0.95); }
</style>