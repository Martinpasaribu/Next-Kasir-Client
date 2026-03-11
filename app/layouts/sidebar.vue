<script setup lang="ts">
import ThemeSwitcher from '~/components/tools/ThemeSwitcher.vue';
import { useCartStore } from '~/stores/cart';

import { ref, onMounted, onUnmounted } from 'vue';

const isDesktop = ref(false);
const isLandscape = ref(false);

const updateView = () => {
  if (typeof window !== 'undefined') {
    isDesktop.value = window.innerWidth >= 1024; // Sesuai 'lg'
    isLandscape.value = window.innerWidth > window.innerHeight;
  }
};

onMounted(() => {
  updateView();
  window.addEventListener('resize', updateView);
});
onUnmounted(() => window.removeEventListener('resize', updateView));

const cartStore = useCartStore()
const emit = defineEmits(['openBucket'])

// Menggunakan prefix 'lucide:' untuk konsistensi
const menuItems = [
  { icon: 'lucide:layout-dashboard', label: 'Kasir', to: '/' },
  { icon: 'lucide:package', label: 'Produk', to: '/products' },
  { icon: 'lucide:bar-chart-3', label: 'Laporan', to: '/reports' },
  { icon: 'lucide:user', label: 'Pelanggan', to: '/customers' },
  { icon: 'lucide:contact', label: 'Shift', to: '/shift' },
  { icon: 'lucide:settings', label: 'Setelan', to: '/settings' },
]
</script>

<template>
  <nav class="fixed bottom-0 left-0 w-full lg:relative lg:w-24 bg-white/80
   dark:bg-nuxt-gray-900/80 backdrop-blur-xl border-t lg:border-t-0 lg:border-r
    border-nuxt-gray-200 dark:border-nuxt-gray-800 flex lg:flex-col items-center
     justify-between z-50 transition-all duration-300 h-13 md:h-10 lg:h-screen lg:py-8">
    
     <!-- Bagian 1 Samping PC --> 
    <div v-if="isDesktop" class="hidden lg:flex flex-col items-center gap-8 w-full">
      <div class="w-12 h-12 bg-nuxt-green rounded-2xl flex items-center justify-center shadow-lg shadow-nuxt-green/20">
        <Icon name="lucide:zap" size="20" class="text-nuxt-gray-950" />
      </div>
      
      <div class="flex flex-col gap-2 w-full px-3">
        <NuxtLink 
          v-for="item in menuItems" 
          :key="item.label"
          :to="item.to"
          class="group flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 text-nuxt-gray-400 hover:bg-nuxt-gray-100 dark:hover:bg-nuxt-gray-800"
          active-class="bg-nuxt-green text-nuxt-gray-950 shadow-md"
        >
          <Icon :name="item.icon" size="20" stroke-width="2.5" />
          <span class="text-[9px] font-black uppercase mt-1.5">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Bagian 2 Bawah  Mobile Lenscape -->
    <div v-else-if="isLandscape" class="hidden landscape:flex lg:hidden items-center justify-between w-full px-0 md:px-4 max-h-4] relative h-full">
      
      <div class="flex items-center justify-around flex-1">
        <NuxtLink v-for="item in menuItems.slice(0, 3)" :key="item.label" :to="item.to"
          class="flex flex-col items-center justify-center gap-1 w-12 text-nuxt-gray-400"
          active-class="text-nuxt-green"
        >
          <Icon :name="item.icon" size="15" stroke-width="2.5" />
          <span class="text-[7px] font-black uppercase">{{ item.label }}</span>
        </NuxtLink>
      </div>

      <div class="w-11"></div>

      <div class="flex items-center justify-around flex-1">
        <NuxtLink v-for="item in menuItems.slice(3, 6)" :key="item.label" :to="item.to"
          class="flex flex-col items-center justify-center gap-1 w-12 text-nuxt-gray-400"
          active-class="text-nuxt-green"
        >
          <Icon :name="item.icon" size="15" stroke-width="2.5" />
          <span class="text-[7px] font-black uppercase">{{ item.label }}</span>
        </NuxtLink>
      </div>

      <button 
        @click="$emit('openBucket')"
        class="absolute left-1/2 -translate-x-1/2 -top-7 w-15 h-15 bg-nuxt-green text-nuxt-gray-950 rounded-full shadow-2xl shadow-nuxt-green/40 flex items-center justify-center border-4 border-nuxt-gray-50 dark:border-nuxt-gray-950 active:scale-90 transition-transform z-10"
      >
        <div class="relative">
          <Icon name="lucide:shopping-cart" size="28" stroke-width="2" class="mt-1 mr-0.5" />
          <span v-if="cartStore.items.length > 0" 
                class="absolute -top-3 -right-3 bg-red-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-nuxt-green">
            {{ cartStore.items.length }}
          </span>
        </div>
      </button>
    </div>



        <!-- Bagian 3 Bawah  Mobile Potrait -->
    <div v-else class="flex landscape:hidden lg:hidden items-center justify-between w-full px-0 md:px-4 relative h-full">
      
      <div class="flex items-center justify-around flex-1">
        <NuxtLink v-for="item in menuItems.slice(0, 2)" :key="item.label" :to="item.to"
          class="flex flex-col items-center justify-center gap-1 w-12 text-nuxt-gray-400"
          active-class="text-nuxt-green"
        >
          <Icon :name="item.icon" size="20" stroke-width="2.5" />
          <!-- <span class="text-[8px] font-black uppercase">{{ item.label }}</span> -->
        </NuxtLink>
      </div>

      <div class="w-11"></div>

      <div class="flex items-center justify-around flex-1">
        <NuxtLink v-for="item in menuItems.slice(3, 5)" :key="item.label" :to="item.to"
          class="flex flex-col items-center justify-center gap-1 w-12 text-nuxt-gray-400"
          active-class="text-nuxt-green"
        >
          <Icon :name="item.icon" size="20" stroke-width="2.5" />
          <!-- <span class="text-[8px] font-black uppercase">{{ item.label }}</span> -->
        </NuxtLink>
      </div>

      <button 
        @click="$emit('openBucket')"
        class="absolute left-1/2 -translate-x-1/2 -top-7 w-15 h-15 bg-nuxt-green text-nuxt-gray-950 rounded-full shadow-2xl shadow-nuxt-green/40 flex items-center justify-center border-4 border-nuxt-gray-50 dark:border-nuxt-gray-950 active:scale-90 transition-transform z-10"
      >
        <div class="relative">
          <Icon name="lucide:shopping-cart" size="28" stroke-width="2" class="mt-1 mr-0.5" />
          <span v-if="cartStore.items.length > 0" 
                class="absolute -top-3 -right-3 bg-red-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-nuxt-green">
            {{ cartStore.items.length }}
          </span>
        </div>
      </button>
    </div>


    <div class="hidden lg:flex flex-col items-center gap-6 w-full pb-4">
      <ThemeSwitcher />
      <div class="w-10 h-10 rounded-full border-2 border-nuxt-gray-200 dark:border-nuxt-gray-800 p-0.5 overflow-hidden">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" class="w-full h-full" />
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Menghapus outline agar lebih rapi */
button:focus { outline: none; }
</style>