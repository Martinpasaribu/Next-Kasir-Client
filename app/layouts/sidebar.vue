<script setup lang="ts">
import ThemeSwitcher from '~/components/tools/ThemeSwitcher.vue';
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore()

// Menerima emit untuk membuka keranjang di Parent (index.vue)
const emit = defineEmits(['openBucket'])

// Kamu bisa menambahkan navigasi aktif di sini nanti
const menuItems = [
  { icon: 'ph:layout-duotone', label: 'Kasir', active: true },
  { icon: 'ph:package-duotone', label: 'Produk', active: false },
  { icon: 'ph:chart-line-up-duotone', label: 'Laporan', active: false },
  { icon: 'ph:gear-six-duotone', label: 'Setelan', active: false },
]
</script>

<template>
  <nav 
    class="fixed bottom-0 left-0 w-full lg:relative lg:w-24 bg-white/80 
  dark:bg-nuxt-gray-900/80 backdrop-blur-xl border-t lg:border-t-0 lf:border-r 
  border-nuxt-gray-200 dark:border-nuxt-gray-800 flex lg:flex-col items-center justify-between py-3 md:py-8 landscape:py-2 z-50 h-10 landscape:lg:h-screen transition-all">
    

    <!-- Disamping  Kiri-->
    <div class="hidden lg:flex flex-col lg:fle-col items-center gap-8 w-full">
      <div class="w-12 h-12 bg-nuxt-green rounded-2xl flex items-center justify-center shadow-lg shadow-nuxt-green/20">
        <Icon name="ph:lightning-fill" size="24" class="text-nuxt-gray-950" />
      </div>
      
      <div class="flex flex-col gap-4 w-full items-center">
        <button 
          v-for="item in menuItems" 
          :key="item.label"
          class="group relative p-3 rounded-2xl transition-all duration-300"
          :class="item.active 
            ? 'bg-nuxt-green text-nuxt-gray-950 shadow-md' 
            : 'text-nuxt-gray-400 hover:bg-nuxt-gray-100 dark:hover:bg-nuxt-gray-800'"
        >
          <Icon :name="item.icon" size="26" />
        </button>

        <button 
          @click="$emit('openBucket')"
          class="xl:hidden group relative p-4 rounded-2xl bg-nuxt-green text-nuxt-gray-950 shadow-lg shadow-nuxt-green/20 hover:scale-110 active:scale-90 transition-all mt-4"
        >
          <div class="relative">
            <LucideShoppingCart :size="24" />
            <span v-if="cartStore.items.length > 0" 
                  class="absolute -top-2 -right-2 bg-white text-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-nuxt-green">
              {{ cartStore.items.length }}
            </span>
          </div>
        </button>
      </div>
    </div>

    <!-- Di Bawah -->
    <div class="flex lg:hidden items-center justify-between w-full px-6 relative">
      
      <div class="flex gap-8">
        <button v-for="item in menuItems.slice(0, 2)" :key="item.label" 
          :class="item.active ? 'text-nuxt-green' : 'text-nuxt-gray-400'"
          class="flex flex-col items-center gap-1"
        >
          <Icon :name="item.icon" size="24" />
          <span class="text-[9px] font-bold uppercase">{{ item.label }}</span>
        </button>
      </div>

      <div class="absolute left-1/2 -translate-x-1/2 -top-10">
        <button 
          @click="$emit('openBucket')"
          class="w-16 h-16 bg-nuxt-green text-nuxt-gray-950 rounded-full shadow-2xl shadow-nuxt-green/40 flex items-center justify-center border-4 border-white dark:border-nuxt-gray-950 active:scale-90 transition-transform"
        >
          <div class="relative">
            <LucideShoppingCart :size="24" />
            <span v-if="cartStore.items.length > 0" 
                  class="absolute -top-2 -right-2 bg-white text-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-nuxt-green">
              {{ cartStore.items.length }}
            </span>
          </div>
        </button>
      </div>

      <div class="flex gap-8">
        <button v-for="item in menuItems.slice(2, 4)" :key="item.label" 
          :class="item.active ? 'text-nuxt-green' : 'text-nuxt-gray-400'"
          class="flex flex-col items-center gap-1"
        >
          <Icon :name="item.icon" size="24" />
          <span class="text-[9px] font-bold uppercase">{{ item.label }}</span>
        </button>
      </div>
    </div>

    <div class="hidden lg:flex flex-col items-center gap-6 w-full">
      <ThemeSwitcher />
      <div class="w-10 h-10 rounded-full border-2 border-nuxt-gray-200 dark:border-nuxt-gray-800 p-0.5">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" class="w-full h-full rounded-full" />
      </div>
    </div>

  </nav>
</template>

<style scoped>
/* Transisi halus untuk navigasi */
nav {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>