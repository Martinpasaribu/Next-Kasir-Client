<script setup lang="ts">
import { useLoading } from '~/stores/useLoading';
import { useMyNotification } from '~/stores/useMyNotification';

const { settingsStruct, loading: settingsLoading, fetchSettingsStruct, updateReceiptSettings } = useMerchantSettings();

const isSaving = ref(false);
const loading = useLoading()
const notify = useMyNotification();

// 2. State Utama (Default Structure)
const config = ref({
  logo: { value: '', status: false },
  name: { value: '', status: true },
  address: { value: '', status: true },
  phone: { value: '', status: true },
  email: { value: '', status: false },
  instagram: { value: '', status: true },
  website: { value: '', status: true },
  footer_note: { value: '', status: true },
  description: { value: '', status: true },
  tax_percentage: 10,
  show_time: true
});

// 3. Definisi Struktur Form (Iteratif agar template bersih)
const sections = [
  {
    title: 'Branding & Logo',
    borderClass: 'border-l-4 border-l-emerald-500',
    fields: {
      logo: { label: 'URL Logo (Bit-Image)', type: 'text' },
      name: { label: 'Nama Toko / Outlet', type: 'text' },
      description: { label: 'Deskripsi Toko', type: 'textarea' }
    }
  },
  {
    title: 'Contact Information',
    borderClass: 'border-l-4 border-l-blue-500',
    fields: {
      address: { label: 'Alamat Lengkap', type: 'textarea' },
      phone: { label: 'Nomor Telepon', type: 'text' },
      email: { label: 'Email Bisnis', type: 'text' }
    }
  },
  {
    title: 'Social Presence',
    borderClass: 'border-l-4 border-l-pink-500',
    fields: {
      instagram: { label: 'Instagram Username', type: 'text' },
      website: { label: 'Website URL', type: 'text' },
      footer_note: { label: 'Greeting / Pesan Penutup', type: 'text' }
    }
  }
];

// 4. Inisialisasi Data dari Server
onMounted(async () => {

  loading.showLoading('fetch','Mengambil Data Settings');

  try {
    
    const data = await fetchSettingsStruct();
    
    if (data) {
      // Gabungkan data dari database ke state lokal
      config.value = { 
        ...config.value, 
        ...data
      };

        console.log("🚀 ~ lol ~ fetchSettingsStruct ~ res:", data )

      // Mapping field tambahan yang berada di luar objek settings_receipt jika ada
      if (data.tax_percentage !== undefined) config.value.tax_percentage = data.tax_percentage;
      if (data.show_time !== undefined) config.value.show_time = data.show_time;
    
          
      // notify.addToast(`Data struk berhasil dimuat: ${JSON.stringify(config.value)}`, 'success');
      notify.addToast(`Data struk berhasil dimuat: ${JSON.stringify(config.value.name.value)}`, 'success');
  
    } else {
      notify.addToast(' Data struk tidak ditemukan atau domain salah.', 'warning');
    }

  } catch (error: any) {
    
      notify.addToast(error, 'warning');

  } finally {

    setTimeout(() => {
      loading.hideLoading();
    }, 500);
  }

});


const saveToServer = async () => {
  if (isSaving.value) return;
  
  isSaving.value = true;

  loading.showLoading('settings','Menyimapan Format Struk')

  try {

    const payload = {
      ...config.value,
    };

    // Mengirim ke endpoint /api/settings dengan domain: 'RECEIPT'
    await updateReceiptSettings(payload);
    
    notify.addToast('Konfigurasi struk berhasil disimpan ke server', 'success');
  
  } catch (err: any) {

      console.error(err);
      notify.addToast(err || 'Gagal menyimpan konfigurasi', 'warning');

  } finally {

      isSaving.value = false;
      loading.hideLoading();

  }
};

</script>

<template>
  <div class="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
    
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
      <div>
        <h1 class="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">Receipt <span class="text-emerald-500">Config</span></h1>
        <p class="text-zinc-500 font-medium mt-1 text-sm md:text-base">Kelola identitas outlet yang akan tampil pada struk fisik.</p>
      </div>
      <button @click="saveToServer" :disabled="isSaving || settingsLoading"
              class="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-300 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 active:scale-95">
        <span v-if="isSaving" class="animate-spin text-xl">↻</span>
        <span>{{ isSaving ? 'SAVING...' : 'SAVE TO SERVER' }}</span>
      </button>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      <div class="lg:col-span-7 space-y-8">
        
        <div v-if="settingsLoading" class="space-y-8">
           <div v-for="i in 3" :key="i" class="h-64 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-[2.5rem]"></div>
        </div>

        <template v-else>
          <div v-for="(section, sIndex) in sections" :key="sIndex" 
               class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2.5rem] shadow-sm transition-all"
               :class="section.borderClass">
            
            <div class="text-[11px] font-black tracking-[0.2em] text-zinc-400 mb-8 uppercase">{{ section.title }}</div>
            
            <div class="space-y-6">
              <div v-for="(field, key) in section.fields" :key="key" class="space-y-2">
                <div class="flex justify-between items-center mb-2">
                  <label class="text-sm font-bold text-zinc-700 dark:text-zinc-300">{{ field.label }}</label>
                  
                  <button 
                    @click="config[key].status = !config[key].status"
                    :class="config[key].status ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'"
                    class="w-12 h-6 rounded-full relative transition-colors duration-300 outline-none"
                  >
                    <div 
                      :class="config[key].status ? 'translate-x-7' : 'translate-x-1'"
                      class="w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 shadow-sm"
                    ></div>
                  </button>
                </div>

                <textarea 
                  v-if="field.type === 'textarea'" 
                  v-model="config[key].value" 
                  rows="2" 
                  class="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none ring-1 ring-zinc-200 dark:ring-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                ></textarea>
                <input 
                  v-else 
                  v-model="config[key].value" 
                  :type="field.type || 'text'" 
                  class="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none ring-1 ring-zinc-200 dark:ring-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2.5rem] shadow-sm border-l-4 border-l-amber-500">
            <div class="text-[11px] font-black tracking-[0.2em] text-zinc-400 mb-8 uppercase">SYSTEM SETTINGS</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-bold text-zinc-700 dark:text-zinc-300">Pajak Default (%)</label>
                <input v-model.number="config.tax_percentage" type="number" class="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none ring-1 ring-zinc-200 dark:ring-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium" />
              </div>
              <div class="space-y-2 flex flex-col justify-between">
                <div class="flex justify-between items-center pt-2">
                  <label class="text-sm font-bold text-zinc-700 dark:text-zinc-300">Cetak Waktu</label>
                  <button 
                    @click="config.show_time = !config.show_time"
                    :class="config.show_time ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'"
                    class="w-12 h-6 rounded-full relative transition-colors duration-300 outline-none"
                  >
                    <div :class="config.show_time ? 'translate-x-7' : 'translate-x-1'" class="w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 shadow-sm"></div>
                  </button>
                </div>
                <p class="text-[10px] text-zinc-400 italic leading-tight">Menampilkan tanggal dan jam transaksi secara otomatis.</p>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="lg:col-span-5 relative">
        <div class="sticky top-8 flex flex-col items-center">
          
          <div class="bg-white text-zinc-800 p-8 rounded-sm font-mono leading-tight w-[300px] border-t-[12px] border-emerald-500 shadow-2xl overflow-hidden">
            
            <div v-if="config.logo.status && config.logo.value" class="mb-4 flex justify-center">
               <img :src="config.logo.value" class="max-h-16 object-contain grayscale contrast-125" />
            </div>

            <div class="text-center space-y-1">
              <h2 v-if="config.name.status" class="text-lg font-bold uppercase break-words">{{ config.name.value || 'NAMA TOKO' }}</h2>
              <p v-if="config.address.status" class="text-[10px] leading-tight break-words">{{ config.address.value || 'Alamat Outlet' }}</p>
              <p v-if="config.phone.status" class="text-[10px]">Telp: {{ config.phone.value || '-' }}</p>
            </div>

            <div class="py-4 text-center text-zinc-300 tracking-widest">--------------------------------</div>

            <div class="flex justify-between text-[9px]">
              <span>ID: TRX-882910</span>
              <span v-if="config.show_time">08/05/2026 15:30</span>
            </div>

            <div class="py-4 text-center text-zinc-300 tracking-widest">--------------------------------</div>

            <div class="py-2">
              <div class="flex justify-between font-bold"><span>CONTOH PRODUK</span><span>50.000</span></div>
              <div class="text-[10px]">1 x 50.000</div>
            </div>

            <div class="py-4 text-center text-zinc-300 tracking-widest">================================</div>
            <div class="flex justify-between font-bold text-sm">
              <span>TOTAL</span>
              <span>50.000</span>
            </div>

            <div class="mt-6 text-center text-[9px] opacity-60 space-y-0.5">
              <p v-if="config.instagram.status">IG: {{ config.instagram.value }}</p>
              <p v-if="config.website.status">{{ config.website.value }}</p>
              <p v-if="config.email.status">{{ config.email.value }}</p>
            </div>

            <div v-if="config.footer_note.status" class="mt-6 text-center italic text-[10px] pt-4 border-t border-dashed border-zinc-200 break-words">
              "{{ config.footer_note.value }}"
            </div>
            <div v-if="config.description.status" class="mt-6 text-center italic text-[10px] pt-4 border-t border-dashed border-zinc-200 break-words">
              "{{ config.description.value }}"
            </div>
          </div>
          
          <p class="mt-8 text-xs font-black text-zinc-400 tracking-widest uppercase">Visual Preview 58mm</p>
        </div>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
/* Transisi halus untuk semua interaksi */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Memastikan konten struk tidak pecah layout */
.break-words {
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>