<script setup lang="ts">
const headers = [
  { label: 'Produk', key: 'name' },
  { label: 'Kategori', key: 'category' },
  { label: 'Harga', key: 'price' },
  { label: 'Status', key: 'status' }, // Tambah kolom status
  { label: '', key: 'actions', align: 'right' }
];

const products = [
  { name: 'Iga Bakar Spesial', category: 'Makanan', price: 'Rp 45.000', status: 'Tersedia' },
  { name: 'Es Teh Manis', category: 'Minuman', price: 'Rp 5.000', status: 'Habis' },
];
</script>

<template>
  <div class="p-4 md:p-10 w-full mx-auto space-y-6 md:space-y-8">
    
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-3xl md:text-4xl font-black text-nuxt-gray-950 dark:text-white tracking-tight">Produk</h1>
        <p class="text-sm md:text-base text-nuxt-gray-400 font-medium">Kelola daftar menu dan harga Anda</p>
      </div>
      <button class="w-full sm:w-auto bg-nuxt-green text-nuxt-gray-950 px-6 py-3 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-nuxt-green/20 flex items-center justify-center gap-2">
        <Icon name="lucide:plus" size="18" />
        Tambah Produk
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
      <div v-for="stat in ['Total Produk', 'Kategori Aktif', 'Produk Habis']" :key="stat" 
           class="bg-white dark:bg-nuxt-gray-900 p-5 md:p-6 rounded-2xl md:rounded-3xl border border-nuxt-gray-200 dark:border-nuxt-gray-800 shadow-sm">
        <p class="text-nuxt-gray-400 text-[10px] md:text-xs font-black uppercase tracking-widest truncate">{{ stat }}</p>
        <h2 class="text-2xl md:text-3xl font-black mt-1 md:mt-2 text-nuxt-gray-950 dark:text-white">12</h2>
      </div>
    </div>

    <div class="flex items-center gap-2 md:gap-3">
      <div class="flex-1 bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 rounded-2xl px-4 py-3 flex items-center gap-3">
        <Icon name="lucide:search" class="text-nuxt-gray-400" size="18" />
        <input placeholder="Cari produk..." class="bg-transparent outline-none w-full text-sm font-semibold" />
      </div>
      <button class="bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 p-3 rounded-2xl text-nuxt-gray-400 hover:text-nuxt-green transition-colors">
        <Icon name="lucide:filter" size="20" />
      </button>
    </div>

    <div class="bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden">
      <SharedBaseTable :headers="headers" :items="products">
        <template #cell(status)="{ item }">
          <span :class="item.status === 'Tersedia' ? 'bg-nuxt-green/10 text-nuxt-green' : 'bg-red-500/10 text-red-500'" 
                class="px-2.5 py-1 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider">
            {{ item.status }}
          </span>
        </template>
        
        <template #cell(actions)="{ item }">
          <div class="flex justify-end">
            <button class="p-2 hover:bg-nuxt-gray-100 dark:hover:bg-nuxt-gray-800 rounded-xl transition-all text-nuxt-gray-400 hover:text-nuxt-green">
              <Icon name="lucide:pencil" size="16" />
            </button>
          </div>
        </template>
      </SharedBaseTable>
    </div>
    
  </div>
</template>