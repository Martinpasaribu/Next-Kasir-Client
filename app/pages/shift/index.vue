<script setup lang="ts">
const headers = [
  { label: 'Staf', key: 'staff' },
  { label: 'Mulai', key: 'start' },
  { label: 'Berakhir', key: 'end' },
  { label: 'Status', key: 'status', align: 'right' }
];

const shifts = [
  { staff: 'Budi (Kasir)', start: '08:00', end: '16:00', status: 'Aktif' },
  { staff: 'Siti (Admin)', start: '16:00', end: '00:00', status: 'Menunggu' },
  { staff: 'Andi (Security)', start: '00:00', end: '08:00', status: 'Selesai' },
];
</script>

<template>
  <div class="p-4 md:p-10 w-full mx-auto space-y-8">
    
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-3xl md:text-4xl font-black text-nuxt-gray-950 dark:text-white tracking-tight">Manajemen Shift</h1>
        <p class="text-sm md:text-base text-nuxt-gray-400 font-medium mt-1">Pantau jadwal dan kehadiran staf</p>
      </div>
      <button class="bg-nuxt-green text-nuxt-gray-950 px-6 py-3 rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-lg shadow-nuxt-green/20 flex items-center justify-center gap-2">
        <Icon name="lucide:clock" size="18" />
        Atur Jadwal
      </button>
    </div>

    <div class="bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 rounded-3xl p-6 shadow-sm">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-nuxt-green/20 flex items-center justify-center text-nuxt-green">
          <Icon name="lucide:user-check" size="24" />
        </div>
        <div>
          <p class="text-xs font-black uppercase text-nuxt-gray-400">Shift Saat Ini</p>
          <h3 class="font-black text-lg">Budi (Kasir)</h3>
        </div>
      </div>
    </div>

    

    <div class="bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden">
      <SharedBaseTable :headers="headers" :items="shifts">
        
        <template #cell(staff)="{ item }">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-nuxt-gray-100 dark:bg-nuxt-gray-800 flex items-center justify-center text-[10px] font-black">
              {{ item.staff.charAt(0) }}
            </div>
            <span class="font-bold">{{ item.staff }}</span>
          </div>
        </template>

        <template #cell(status)="{ item }">
          <span :class="{
            'bg-nuxt-green/10 text-nuxt-green': item.status === 'Aktif',
            'bg-amber-500/10 text-amber-600': item.status === 'Menunggu',
            'bg-nuxt-gray-200 text-nuxt-gray-600': item.status === 'Selesai'
          }" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            {{ item.status }}
          </span>
        </template>

      </SharedBaseTable>
    </div>
    
  </div>
</template>