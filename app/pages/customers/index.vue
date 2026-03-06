<script setup lang="ts">
const headers = [
  { label: 'Pelanggan', key: 'name' },
  { label: 'Total Transaksi', key: 'orders', align: 'center' },
  { label: 'Total Belanja', key: 'spent', align: 'right' },
  { label: 'Status', key: 'status', align: 'center' }
];

const customers = [
  { name: 'Budi Santoso', orders: 12, spent: 'Rp 1.250.000', status: 'VIP' },
  { name: 'Siti Aminah', orders: 8, spent: 'Rp 850.000', status: 'Reguler' },
  { name: 'Andi Wijaya', orders: 3, spent: 'Rp 320.000', status: 'Baru' },
];
</script>

<template>
  <div class="p-4 md:p-10 w-full mx-auto space-y-8">
    
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-3xl md:text-4xl font-black text-nuxt-gray-950 dark:text-white tracking-tight">Pelanggan</h1>
        <p class="text-sm md:text-base text-nuxt-gray-400 font-medium mt-1">Daftar pelanggan setia Anda</p>
      </div>
      <button class="bg-nuxt-green text-nuxt-gray-950 px-6 py-3 rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-lg shadow-nuxt-green/20 flex items-center justify-center gap-2">
        <Icon name="lucide:user-plus" size="18" />
        Tambah Pelanggan
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="bg-white dark:bg-nuxt-gray-900 p-6 rounded-3xl border border-nuxt-gray-200 dark:border-nuxt-gray-800 shadow-sm flex items-center gap-4">
        <div class="p-3 bg-nuxt-green/10 rounded-2xl text-nuxt-green">
          <Icon name="lucide:crown" size="24" />
        </div>
        <div>
          <p class="text-nuxt-gray-400 text-xs font-black uppercase">Top Pelanggan</p>
          <h2 class="text-lg font-black text-nuxt-gray-950 dark:text-white">Budi Santoso</h2>
        </div>
      </div>
      <div class="bg-white dark:bg-nuxt-gray-900 p-6 rounded-3xl border border-nuxt-gray-200 dark:border-nuxt-gray-800 shadow-sm flex items-center gap-4">
        <div class="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
          <Icon name="lucide:users" size="24" />
        </div>
        <div>
          <p class="text-nuxt-gray-400 text-xs font-black uppercase">Total Pelanggan</p>
          <h2 class="text-lg font-black text-nuxt-gray-950 dark:text-white">45 Orang</h2>
        </div>
      </div>
    </div>

    

    <div class="bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden">
      <SharedBaseTable :headers="headers" :items="customers">
        
        <template #cell(status)="{ item }">
          <span :class="{
            'bg-amber-500/10 text-amber-600': item.status === 'VIP',
            'bg-nuxt-gray-200 text-nuxt-gray-600': item.status === 'Reguler',
            'bg-nuxt-green/10 text-nuxt-green': item.status === 'Baru'
          }" class="px-3 py-1 rounded-full text-[10px] font-black uppercase">
            {{ item.status }}
          </span>
        </template>
        
        <template #cell(name)="{ item }">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-nuxt-gray-100 dark:bg-nuxt-gray-800 flex items-center justify-center text-[10px] font-black">
              {{ item.name.charAt(0) }}
            </div>
            <span class="font-bold">{{ item.name }}</span>
          </div>
        </template>

      </SharedBaseTable>
    </div>
    
  </div>
</template>