<template>
  <div 
    class="group bg-white dark:bg-nuxt-gray-900 p-2 md:p-3 rounded-2xl border transition-all cursor-pointer shadow-sm active:scale-95 overflow-hidden relative"
    :class="[
      isMaxStock 
        ? 'border-gray-400 dark:border-gray-800 opacity-80 cursor-not-allowed' 
        : 'border-nuxt-gray-200 dark:border-nuxt-gray-800 hover:border-nuxt-green'
    ]"
  >
    <div 
      v-if="isMaxStock" 
      class="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-[20px] bg-slate-100/50 dark:bg-nuxt-gray-800/50 transition-all duration-500"
    >
      <div class="flex flex-col items-center gap-1 scale-90">
        <div class="p-2 rounded-full shadow-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
          <PackageX class="text-nuxt-gray-300" :size="32"/>
        </div>
        <span class="flex flex-col items-center text-center px-2 py-1 text-[10px] md:text-xs font-black uppercase tracking-tighter text-slate-600 dark:text-zinc-200">
          <span class="text-nuxt-green line-clamp-1">{{ product.name }}</span>
          <span>Stok habis</span>
        </span>
      </div>
    </div>

    <div class="aspect-square bg-nuxt-gray-100 dark:bg-nuxt-gray-800 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
      <img 
        v-if="product.icon" 
        :src="product.icon.url" 
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <Box v-else :size="40" class="text-nuxt-gray-300 group-hover:scale-110 transition-transform" />

      <div 
        class="absolute top-1 right-1 backdrop-blur px-2 py-1 rounded-lg text-[8px] md:text-[10px] font-black uppercase transition-colors"
        :class="availableStock <= 2 ? 'bg-orange-400 text-white' : 'bg-white/90 dark:bg-black/50 text-nuxt-gray-900 dark:text-white'"
      >
       {{ availableStock }}
      </div>
    </div>

    <h3 class="text-[12px] md:text-xs lg:text-[13px] xl:text-[14px] font-bold text-nuxt-gray-800 dark:text-nuxt-gray-100 mb-0.5 truncate">
      {{ product.name }}
    </h3>
    <p class="text-[12px] md:text-xs lg:text-[13px] xl:text-[14px] font-black text-nuxt-green">
      Rp {{ product.price_sell?.toLocaleString() || 0 }}
    </p>

    <div class="w-full flex justify-start mt-2">
      <div 
        class="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-zinc-800/80 px-2 py-1 rounded-lg border border-transparent dark:border-zinc-700/50"
      >
        <Icon 
          :name="getCategoryIcon(product.category_key?.ref_code)" 
          size="12" 
          class="flex-none text-gray-500 dark:text-gray-400" 
        />
        <span class="text-[10px] md:text-[11px] font-semibold text-gray-600 dark:text-gray-300 truncate max-w-[40px] md:max-w-[65px] leading-none">
          {{ product.category_key?.name || 'Umum' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LucideCoffee, Box, PackageX, Utensils } from 'lucide-vue-next'
import { getCategoryIcon } from '~/constant/IconCategory';
import { useCartStore } from '~/stores/cart'

const props = defineProps<{ product: any }>()
const cartStore = useCartStore()

// 1. Cari tahu berapa qty produk ini yang sudah ada di keranjang
const qtyInCart = computed(() => {
  const item = cartStore.items.find(i => i._id === props.product._id)
  return item ? item.quantity : 0
})

// 2. Hitung sisa stok yang tersedia secara visual
const availableStock = computed(() => {
  const sisa = props.product.stock - qtyInCart.value
  return sisa > 0 ? sisa : 0
})

// 3. Status jika stok sudah mencapai batas maksimal di keranjang
const isMaxStock = computed(() => availableStock.value <= 0)
</script>