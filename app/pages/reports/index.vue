<script setup lang="ts">
const headers = [
  { label: 'Waktu', key: 'time' },
  { label: 'Transaksi', key: 'id' },
  { label: 'Produk', key: 'items' },
  { label: 'Total', key: 'amount', align: 'right' }
];

const transactions = [
  { time: '18:45', id: 'TRX-001', items: 'Iga Bakar, Es Teh', amount: 'Rp 50.000' },
  { time: '17:20', id: 'TRX-002', items: 'Es Teh Manis', amount: 'Rp 5.000' },
  { time: '16:10', id: 'TRX-003', items: 'Nasi Goreng', amount: 'Rp 25.000' },
];
</script>

<template>
  <div class="p-4 md:p-10 w-full mx-auto space-y-6 md:space-y-8">
    
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-3xl md:text-4xl font-black text-nuxt-gray-950 dark:text-white tracking-tight">Laporan</h1>
        <p class="text-sm md:text-base text-nuxt-gray-400 font-medium">Ringkasan performa penjualan hari ini</p>
      </div>
      <button class="bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 px-6 py-3 rounded-2xl font-bold hover:border-nuxt-green transition-all flex items-center justify-center gap-2 text-nuxt-gray-950 dark:text-white">
        <Icon name="lucide:calendar" size="18" />
        Pilih Tanggal
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in ['Total Omset', 'Total Transaksi', 'Produk Terlaris', 'Metode Tunai']" :key="stat" 
           class="bg-white dark:bg-nuxt-gray-900 p-5 md:p-6 rounded-2xl md:rounded-3xl border border-nuxt-gray-200 dark:border-nuxt-gray-800 shadow-sm">
        <p class="text-nuxt-gray-400 text-[10px] md:text-xs font-black uppercase tracking-widest truncate">{{ stat }}</p>
        <h2 class="text-xl md:text-2xl font-black mt-2 text-nuxt-gray-950 dark:text-white">Rp 2.450.000</h2>
      </div>
    </div>

    

    <div class="bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden">
      <div class="p-6 border-b border-nuxt-gray-200 dark:border-nuxt-gray-800">
        <h3 class="font-black text-lg">Transaksi Terbaru</h3>
      </div>
      
      <SharedBaseTable :headers="headers" :items="transactions">
        <template #cell(amount)="{ item }">
          <span class="font-black text-nuxt-green">{{ item.amount }}</span>
        </template>
        
        <template #cell(items)="{ item }">
          <span class="text-xs text-nuxt-gray-400">{{ item.items }}</span>
        </template>
      </SharedBaseTable>
    </div>
    
  </div>
</template>