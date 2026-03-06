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
      class="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-[20px] bg-slate-100 dark:bg-nuxt-gray-800 transition-all duration-500"
    >
      <div class="flex flex-col items-center gap-1 scale-90">
        <div class="p-2  rounded-full shadow-xl shadow-gray-500/10 border border-gray-100 dark:border-gray-900/30">
          <PackageX class="  text-nuxt-gray-300" :size="40"/>
        </div>
        
        <span class=" flex flex-col justify-center items-center px-2.5 py-1 dark:border-zinc-700 rounded-lg text-[9px] md:text-[12px] font-black 
          uppercase tracking-tighter text-slate-600 dark:text-zinc-200"
          >
          <!-- Mencapai Stok Max :  -->
          <span class="text-nuxt-green text-center">{{ product.name }} </span>
          <span> Stok habis </span>
          
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

      <!-- <div class="absolute bottom-0.5 lift-2 flex gap-1 bg-white/90 dark:bg-black/50 backdrop-blur px-2 py-1 rounded-lg text-[8px] md:text-[10px] font-black uppercase">
        <Utensils :size="12"/> {{ product.category_key?.name || 'Umum' }}
      </div> -->

      <div 
        class="absolute top-1 right-1 backdrop-blur px-2 py-1 rounded-lg text-[8px] md:text-[10px] font-black uppercase transition-colors"
        :class="availableStock <= 2 ? 'bg-orange-400 text-white' : 'bg-white/90 dark:bg-black/50 text-nuxt-gray-900 dark:text-white'"
      >
       {{ availableStock }}
      </div>
    </div>

    <h3 class="text-[12px] md:text-sm font-bold text-nuxt-gray-800 dark:text-nuxt-gray-100 mb-1 truncate">
      {{ product.name }}
    </h3>
    <p class="text-[12px] md:text-sm font-black text-nuxt-green">
      Rp {{ product.price_sell?.toLocaleString() || 0 }}
    </p>

    <div class="w-full flex justify-start  mt-2">
      <!-- anak -->
      <div 
        class=" flex justify-center items-center gap-1 bg-nuxt-gray-200 dark:bg-nuxt-gray-950 text-nuxt-gray-500 dark:text-nuxt-gray-100
          backdrop-blur px-2 md:px-4 py-0.5 rounded-xl text-[10px] md:text-[13px] font-semibold ">
        
          <!-- <component 
            :is="getCategoryIcon(product.category_key?.ref_code)" 
            :size="12" 
          /> -->

        <Icon :name="getCategoryIcon(product.category_key?.ref_code)" size="12" />
        <span>{{ product.category_key?.name || 'Umum' }}</span>
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