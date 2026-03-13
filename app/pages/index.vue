<script setup lang="ts">
import { getCategoryIcon } from '~/constant/IconCategory'
import Bucket from '~/main_component/Element/Bucket.vue'
import FilterHeader from '~/main_component/Element/FilterHeader.vue'
import Header from '~/main_component/Element/Header.vue'
import ProductCard from '~/main_component/Element/ProductCard.vue'
import { useCartStore } from '~/stores/cart'
import { useProductStore } from '~/stores/products'

const productStore = useProductStore()
const cartStore = useCartStore()
const search = ref('')
const isBucketOpen = ref(false) // State untuk kontrol Bucket di mobile

// Ambil semua data (Produk + Kategori) saat mount
onMounted(() => {
  productStore.fetchAllData()
})


// Otomatis tutup bucket jika resize ke layar besar
if (process.client) {
  const mediaQuery = window.matchMedia('(min-width: 1280px)')
  mediaQuery.addEventListener('change', (e) => {
    if (e.matches) isBucketOpen.value = false
  })
}

// Logika Filter: Search + Kategori
const filteredProducts = computed(() => {
  return productStore.products.filter(p => {
    // 1. Filter Search
    const matchSearch = p.name.toLowerCase().includes(search.value.toLowerCase())
    
    // 2. Filter Kategori (Mencocokkan _id)
    const matchCategory = productStore.activeCategory === 'all' || 
                          p.category_key?._id === productStore.activeCategory
    
    return matchSearch && matchCategory
  })
})
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-nuxt-gray-50 dark:bg-nuxt-gray-950 text-nuxt-gray-900 dark:text-white">
    
    <main class="flex-1 overflow-y-auto min-w-0 h-full overflow-x-hidden">
      
      <Header v-model="search" />

      <!-- Filter -->
      <div class="sticky top-0 z-30 shrink-0 bg-nuxt-gray-50 dark:bg-nuxt-gray-950 shadow-md">
        
        <FilterHeader v-model="search" />
      
        <div  
          class="bg-white dark:bg-nuxt-gray-900 border-b border-nuxt-gray-200 dark:border-nuxt-gray-800 
                px-4 transition-all py-2 landscape:py-1 md:py-3 xl:py-4"
        >
          <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button 
              v-for="cat in productStore.categories" 
              :key="cat._id"
              @click="productStore.activeCategory = cat._id"
              class="font-black uppercase tracking-wider whitespace-nowrap transition-all border
                    px-2 py-1.5 rounded-lg text-[9px] md:px-3 md:py-2 md:rounded-xl md:text-[10px]
                    landscape:py-1 landscape:px-3 2xl:py-3 2xl:px-6"
              :class="productStore.activeCategory === cat._id 
                ? 'bg-nuxt-green-dark text-nuxt-gray-100 border-nuxt-green-dark shadow-md shadow-nuxt-green/10' 
                : 'bg-transparent text-nuxt-gray-400 border-nuxt-gray-100 dark:border-nuxt-gray-800 hover:bg-nuxt-gray-50 dark:hover:bg-nuxt-gray-800'"
            >
              <div class="flex text-center gap-2">

                <!-- <component 
                  :is="getCategoryIcon(cat?.ref_code)" 
                  :size="12" 
                /> -->

                <Icon :name="getCategoryIcon(cat?.ref_code)" size="12" />

                {{ cat.name }}

              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="p-2 sm:p-4 md:p-6 landscape:p-3 flex flex-col min-h-[70vh] overflow-x-hidden">
        
        <SharedStateMessage v-if="productStore.loading" type="loading" />

        <div v-else-if="filteredProducts.length > 0 " 
          class="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 landscape:md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 3xl:grid-cols-9 gap-2 sm:gap-3 md:gap-4 pb-15">
          <ProductCard
            v-for="p in filteredProducts" 
            :key="p._id" 
            :product="p" 
            class="landscape:scale-[0.95] origin-top"
            @click="cartStore.addToCart(p)"
          />
        </div>

     
      </div>

    </main>

    <Bucket
      :is-open="isBucketOpen"
      @close="isBucketOpen = false"
      @success="productStore.fetchAllData()"
    />
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* OPTIMASI KHUSUS LANDSCAPE HP (Tinggi layar < 500px) */
@media (max-height: 500px) and (orientation: landscape) {
  /* Perkecil gap antar item grid agar muat lebih banyak */
  .grid {
    gap: 0.5rem !important;
  }
  
  /* Pastikan padding main tidak terlalu boros */
  main {
    height: 100vh;
  }
}
</style>


<!-- 
<div class="fixed bottom-6 right-6 hidden md:block xl:hidden z-[80]">
  <button 
    @click="isBucketOpen = true"
    class="flex items-center gap-3 bg-nuxt-green text-black px-6 py-4 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all group"
  >
    <div class="relative">
      <LucideShoppingCart :size="24" />
      <span v-if="cartStore.items.length > 0" 
            class="absolute -top-2 -right-2 bg-white text-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-nuxt-green">
        {{ cartStore.items.length }}
      </span>
    </div>
    <span class="font-black text-sm uppercase tracking-wider">
      Rp {{ cartStore.total_amount.toLocaleString() }}
    </span>
  </button>
</div>

<div class="fixed bottom-10 left-1/2 -translate-x-1/2 block md:hidden z-[80]  px-6 ">
  <button 
    @click="isBucketOpen = true"
    class="flex items-center justify-center gap-3 bg-nuxt-green text-black w-full p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group"
  >
    <div class="relative">
      <LucideShoppingCart :size="24" />
      <span v-if="cartStore.items.length > 0" 
            class="absolute -top-2 -right-2 bg-white text-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-nuxt-green">
        {{ cartStore.items.length }}
      </span>
    </div>
  </button>
</div> -->