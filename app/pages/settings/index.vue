<script setup lang="ts">
// Dummy Data untuk preferensi toko
const shopDetails = ref({
  name: 'Next Kasir Utama',
  address: 'Jl. Sudirman No. 123, Jakarta',
  currency: 'IDR'
});
</script>

<template>
  <div class="p-4 md:p-10 w-full mx-auto space-y-8">
    
    <div>
      <h1 class="text-3xl md:text-4xl font-black text-nuxt-gray-950 dark:text-white tracking-tight">Setelan</h1>
      <p class="text-nuxt-gray-400 font-medium mt-1">Konfigurasi preferensi sistem dan toko Anda</p>
    </div>

    <div class="space-y-4">
      <h2 class="text-sm font-black text-nuxt-gray-950 dark:text-white uppercase tracking-widest">Informasi Toko</h2>
      <BaseCard class="space-y-6">
        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-xs font-black text-nuxt-gray-400 uppercase">Nama Toko</label>
            <input v-model="shopDetails.name" class="w-full bg-nuxt-gray-50 dark:bg-nuxt-gray-800 p-3 rounded-2xl border border-transparent focus:border-nuxt-green outline-none transition-all" />
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-nuxt-gray-400 uppercase">Mata Uang</label>
            <select class="w-full bg-nuxt-gray-50 dark:bg-nuxt-gray-800 p-3 rounded-2xl border border-transparent focus:border-nuxt-green outline-none transition-all">
              <option>IDR (Rupiah)</option>
              <option>USD (Dollar)</option>
            </select>
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-xs font-black text-nuxt-gray-400 uppercase">Alamat Lengkap</label>
          <textarea v-model="shopDetails.address" class="w-full bg-nuxt-gray-50 dark:bg-nuxt-gray-800 p-3 rounded-2xl border border-transparent focus:border-nuxt-green outline-none h-24"></textarea>
        </div>
      </BaseCard>
    </div>

    <div class="space-y-4">
      <h2 class="text-sm font-black text-nuxt-gray-950 dark:text-white uppercase tracking-widest">Preferensi Sistem</h2>
      <BaseCard class="space-y-4">
        <div class="flex items-center justify-between py-2 border-b border-nuxt-gray-100 dark:border-nuxt-gray-800">
          <div>
            <p class="font-bold">Mode Gelap</p>
            <p class="text-xs text-nuxt-gray-400">Gunakan tema gelap di semua halaman</p>
          </div>
          <button class="w-12 h-6 bg-nuxt-green rounded-full relative transition-all">
            <div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
          </button>
        </div>
        <div class="flex items-center justify-between py-2">
          <div>
            <p class="font-bold">Cetak Struk Otomatis</p>
            <p class="text-xs text-nuxt-gray-400">Cetak setiap transaksi berhasil</p>
          </div>
          <button class="w-12 h-6 bg-nuxt-gray-200 dark:bg-nuxt-gray-700 rounded-full relative transition-all">
            <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
          </button>
        </div>
      </BaseCard>
    </div>

    <div class="flex justify-end pt-4">
      <button class="bg-nuxt-gray-950 dark:bg-white text-white dark:text-nuxt-gray-950 px-8 py-4 rounded-2xl font-black hover:scale-[1.02] transition-all">
        Simpan Perubahan
      </button>
    </div>
    
  </div>
</template>