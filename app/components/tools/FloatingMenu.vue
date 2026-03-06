<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { LucideMaximize, LucideMinimize, LucideRefreshCw, Calculator, Smartphone, Sun, Moon, Monitor } from 'lucide-vue-next';

// Emit untuk memberitahu parent jika kalkulator diklik
const emit = defineEmits(['openCalculator']);
const colorMode = useColorMode()

const isFullscreen = ref(false);
const isDragging = ref(false);
const showMenu = ref(false);
const position = ref({ x: -100, y: -100 }); 

const updateSafePosition = () => {
  if (!process.client) return;
  const w = window.innerWidth;
  const h = window.innerHeight;

  if (position.value.x < 0 || position.value.x > w) position.value.x = w - 80;
  if (position.value.y < 0 || position.value.y > h) position.value.y = h - 150;

  position.value = {
    x: Math.min(Math.max(10, position.value.x), w - 70),
    y: Math.min(Math.max(10, position.value.y), h - 70)
  };
};

// --- FUNGSI BARU ---

// 1. Rotasi Layar Otomatis (Landscape <-> Portrait)
const toggleRotation = async () => {
  if (!process.client) return;
  try {
    if (window.screen.orientation) {
      const type = window.screen.orientation.type;
      if (type.includes('portrait')) {
        await document.documentElement.requestFullscreen(); // Harus fullscreen di beberapa browser
        await window.screen.orientation.lock('landscape');
      } else {
        await window.screen.orientation.lock('portrait');
      }
    }
  } catch (err) {
    console.warn("Rotasi otomatis tidak didukung di browser ini/perangkat ini.");
    // Fallback: Kasih tau user lewat toast/alert jika perlu
  }
  showMenu.value = false;
};

// 2. Buka Kalkulator
const openCalculator = () => {
  emit('openCalculator'); // Kirim sinyal ke parent (index.vue/default.vue)
  showMenu.value = false;
};

// --- LOGIKA DRAG & EVENT ---

const handleDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return;
  let clientX = 0, clientY = 0;
  if (window.TouchEvent && e instanceof TouchEvent) {
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
  } else {
    clientX = (e as MouseEvent).clientX;
    clientY = (e as MouseEvent).clientY;
  }
  position.value = {
    x: Math.min(Math.max(10, clientX - 28), window.innerWidth - 70),
    y: Math.min(Math.max(10, clientY - 28), window.innerHeight - 70)
  };
};

const toggleFullscreen = () => {
  if (!process.client) return;
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
  showMenu.value = false;
};

onMounted(() => {
  updateSafePosition();
  window.addEventListener('resize', updateSafePosition);
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement;
  });
});

onUnmounted(() => {
  if (process.client) window.removeEventListener('resize', updateSafePosition);
});

const refreshApp = () => {
  if (process.client) window.location.reload();
};


const toggleTheme = () => {
  const modes = ['system', 'light', 'dark']
  const current = colorMode.preference ?? 'system'
  const nextIndex = (modes.indexOf(current) + 1) % modes.length
  colorMode.preference = modes[nextIndex] as string
}
</script>


<template>
  <div class="fixed z-[9999] select-none touch-none"
    :class="{ 'transition-all duration-300': !isDragging }"
    :style="{ left: `${position.x}px`, top: `${position.y}px` }">
    

    <Transition name="pop">
    <div v-if="showMenu" 
        class="absolute bottom-20 right-0 p-3 bg-white/90 dark:bg-nuxt-gray-900/95 backdrop-blur-xl border border-nuxt-gray-200 dark:border-nuxt-gray-800 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] w-44 overflow-hidden"
    >
        <div class="px-2 pb-2 mb-2 border-b border-nuxt-gray-100 dark:border-nuxt-gray-800 flex justify-between items-center">
        <span class="text-[10px] font-black uppercase tracking-widest text-nuxt-gray-400">Quick Tools</span>
        <div class="w-1.5 h-1.5 rounded-full bg-nuxt-green animate-pulse"></div>
        </div>

        <div class="grid grid-cols-2 gap-2">
        
        <button @click="toggleFullscreen" 
            class="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-nuxt-gray-50 dark:bg-nuxt-gray-800/50 hover:bg-nuxt-green/10 dark:hover:bg-nuxt-green/20 border border-transparent hover:border-nuxt-green/30 transition-all group"
        >
            <component :is="isFullscreen ? LucideMinimize : LucideMaximize" :size="22" 
            class="text-nuxt-gray-600 dark:text-nuxt-gray-400 group-hover:text-nuxt-green group-hover:scale-110 transition-transform" />
            <!-- <span class="text-[8px] font-bold uppercase tracking-tighter text-nuxt-gray-500 group-hover:text-nuxt-green">Screen</span> -->
        </button>
        
        <button @click="toggleRotation" 
            class="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-nuxt-gray-50 dark:bg-nuxt-gray-800/50 hover:bg-nuxt-green/10 dark:hover:bg-nuxt-green/20 border border-transparent hover:border-nuxt-green/30 transition-all group"
        >
            <Smartphone :size="22" 
            class="text-nuxt-gray-600 dark:text-nuxt-gray-400 group-hover:text-nuxt-green group-hover:scale-110 transition-transform" />
            <!-- <span class="text-[8px] font-bold uppercase tracking-tighter text-nuxt-gray-500 group-hover:text-nuxt-green">Rotate</span> -->
        </button>

        <button @click="openCalculator" 
            class="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-nuxt-gray-50 dark:bg-nuxt-gray-800/50 hover:bg-nuxt-green/10 dark:hover:bg-nuxt-green/20 border border-transparent hover:border-nuxt-green/30 transition-all group"
        >
            <Calculator :size="22" 
            class="text-nuxt-gray-600 dark:text-nuxt-gray-400 group-hover:text-nuxt-green group-hover:scale-110 transition-transform" />
            <!-- <span class="text-[8px] font-bold uppercase tracking-tighter text-nuxt-gray-500 group-hover:text-nuxt-green">Calc</span> -->
        </button>

        <button @click="refreshApp()" 
            class="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-nuxt-gray-50 dark:bg-nuxt-gray-800/50 hover:bg-red-500/10 dark:hover:bg-red-500/20 border border-transparent hover:border-red-500/30 transition-all group"
        >
            <LucideRefreshCw :size="22" 
            class="text-nuxt-gray-600 dark:text-nuxt-gray-400 group-hover:text-red-500 group-hover:rotate-180 transition-all duration-500" />
            <!-- <span class="text-[8px] font-bold uppercase tracking-tighter text-nuxt-gray-500 group-hover:text-red-500">Reset</span> -->
        </button>

        <button @click="toggleTheme()"
            class="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-nuxt-gray-50 dark:bg-nuxt-gray-800/50 hover:bg-red-500/10 dark:hover:bg-red-500/20 border border-transparent hover:border-red-500/30 transition-all group"
        >
            <div class="w-5 h-5 flex items-center justify-center">
                <Sun v-if="colorMode.preference === 'light'" class="w-full h-full text-amber-500" />
                <Moon v-else-if="colorMode.preference === 'dark'" class="w-full h-full text-indigo-400" />
                <Monitor v-else class="w-full h-full text-slate-500" />
            </div>
            <!-- <class="text-nuxt-gray-600 dark:text-nuxt-gray-400 group-hover:text-red-500 group-hover:rotate-180 transition-all duration-500" /> -->
            <!-- <span class="text-[8px] font-bold uppercase tracking-tighter text-nuxt-gray-500 group-hover:text-red-500">Mode</span> -->
        </button>

        </div>
    </div>
    </Transition>

    <button 
      @mousedown="isDragging = true"
      @touchstart="isDragging = true"
      @mousemove="handleDrag"
      @touchmove="handleDrag"
      @mouseup="isDragging = false"
      @touchend="isDragging = false"
      @click="!isDragging && (showMenu = !showMenu)"
      class="w-14 h-14 bg-gray-200  dark:bg-white/2 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-2xl cursor-move active:scale-90 transition-transform"
      :class="{ 'ring-4 ring-nuxt-green/30': showMenu }"
    >
      <div class="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center">
        <div class="w-6 h-6 rounded-full bg-white/80 dark:bg-white/20 animate-pulse"></div>
      </div>
    </button>
  </div>
</template>