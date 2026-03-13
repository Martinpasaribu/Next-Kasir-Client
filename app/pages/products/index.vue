<script setup lang="ts">
import { useProductFilter } from '~/composables/filter/useProductFilter';
import { getCategoryIcon } from '~/constant/IconCategory';
import { useProductStore } from '~/stores/products';
import CategoryList from './sub-pages/CategoryList.vue';
import ProductList from './sub-pages/ProductList.vue';

const productStore = useProductStore()
const { search, sortBy, viewMode, activeTab, filterAndSort } = useProductFilter();

const filteredProducts = computed(() => filterAndSort(productStore.products));

const stats = computed(() => ({
  total: productStore.products.length,
  activeCategories: productStore.categories.length,
  outOfStock: productStore.products.filter(p => p.stock <= 0).length
}));

onMounted(() => productStore.fetchAllData())
</script>

<template>
  <div class="relative p-4 md:p-10 w-full mx-auto space-y-6 h-full min-h-screen md:space-y-8 overflow-y-auto">
    
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-3xl md:text-4xl font-black text-nuxt-gray-950 dark:text-white tracking-tight">Produk</h1>
        <p class="text-sm md:text-base text-nuxt-gray-400 font-medium">Kelola daftar menu dan harga Anda</p>
      </div>

      <button class="hidden md:flex items-center justify-center gap-2 bg-nuxt-green text-nuxt-gray-950 px-6 py-3 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-nuxt-green/20">
        <Icon name="lucide:plus" size="18" /> Tambah Produk
      </button>

      <button class="fixed bottom-[4rem] right-4 z-40 flex items-center justify-center gap-2 md:hidden bg-white text-nuxt-gray-950 p-2 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg">
        <Icon name="lucide:plus" size="30" />
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
      <div @click="activeTab = 'all'" :class="activeTab === 'all' ? 'border-nuxt-green' : 'border-nuxt-gray-200'"
           class="cursor-pointer bg-white dark:bg-nuxt-gray-900 p-5 md:p-6 rounded-2xl md:rounded-3xl border dark:border-nuxt-gray-800 shadow-sm transition-all hover:ring-1 ring-nuxt-green">
        <p class="text-nuxt-gray-400 text-[10px] md:text-xs font-black uppercase tracking-widest">Total Produk</p>
        <div class="flex items-center gap-2 mt-2">
          <Icon :name="getCategoryIcon('PRD')" size="25" class="text-nuxt-green"/>
          <h2 class="text-2xl md:text-3xl font-black text-nuxt-gray-950 dark:text-white">{{ stats.total }}</h2>
        </div>
      </div>

      <div @click="activeTab = 'categories'" :class="activeTab === 'categories' ? 'border-nuxt-green' : 'border-nuxt-gray-200'"
           class="cursor-pointer bg-white dark:bg-nuxt-gray-900 p-5 md:p-6 rounded-2xl md:rounded-3xl border dark:border-nuxt-gray-800 shadow-sm transition-all hover:ring-1 ring-nuxt-green">
        <p class="text-nuxt-gray-400 text-[10px] md:text-xs font-black uppercase tracking-widest">Kategori Aktif</p>
        <div class="flex items-center gap-2 mt-2">
          <Icon :name="getCategoryIcon('CTG')" size="25" class="text-nuxt-green"/>
          <h2 class="text-2xl md:text-3xl font-black text-nuxt-gray-950 dark:text-white">{{ stats.activeCategories }}</h2>
        </div>
      </div>

      <div @click="activeTab = 'out-of-stock'" :class="activeTab === 'out-of-stock' ? 'border-red-500' : 'border-nuxt-gray-200'"
           class="cursor-pointer bg-white dark:bg-nuxt-gray-900 p-5 md:p-6 rounded-2xl md:rounded-3xl border dark:border-nuxt-gray-800 shadow-sm transition-all hover:ring-1 ring-red-500">
        <p class="text-nuxt-gray-400 text-[10px] md:text-xs font-black uppercase tracking-widest">Produk Habis</p>
        <div class="flex items-center gap-2 mt-2">
          <Icon :name="getCategoryIcon('PDF')" size="25" class="text-red-500"/>
          <h2 class="text-2xl md:text-3xl font-black text-red-500">{{ stats.outOfStock }}</h2>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2 md:gap-3">
      <div class="flex-1 bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 rounded-2xl px-4 py-3 flex items-center gap-3">
        <Icon name="lucide:search" class="text-nuxt-gray-400" size="18" />
        <input v-model="search" placeholder="Cari produk..." class="bg-transparent outline-none w-full text-sm font-semibold" />
      </div>
      <select v-model="sortBy" class="bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 p-3 rounded-2xl text-xs font-bold outline-none">
        <option value="default">Urutkan</option>
        <option value="name-asc">Nama A-Z</option>
        <option value="name-desc">Nama Z-A</option>
        <option value="price-low">Harga Termurah</option>
        <option value="price-high">Harga Termahal</option>
      </select>
      <button 
        @click="viewMode = viewMode === 'grid' ? 'list' : 'grid'" 
        class="group flex items-center justify-center bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 p-3 rounded-2xl hover:border-nuxt-green transition-all duration-200 active:scale-95 shadow-sm"
        title="Ganti Tampilan"
      >
        <Icon 
          :name="viewMode === 'grid' ? 'lucide:layout-list' : 'lucide:grid'" 
          size="20" 
          :class="viewMode === 'grid' ? 'text-nuxt-gray-400 group-hover:text-nuxt-green' : 'text-nuxt-green'"
          class="transition-colors"
        />
      </button>
    </div>

    <div class="pb-20">
      <SharedStateMessage v-if="productStore.loading" type="loading" />
  
      <div v-if="!productStore.loading && productStore.products.length > 0">

        <CategoryList 
          v-if="activeTab === 'categories'" 
          :categories="productStore.categories"
          :view-mode="viewMode"  
        />

        <ProductList 
          v-else 
          :products="filteredProducts" 
          :view-mode="viewMode" 
        />

      </div>
    </div>
    
  </div>
</template>