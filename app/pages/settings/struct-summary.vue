<script setup lang="ts">
import { Rocket, Trash2, Plus, Save, Printer, ListTree, ChevronDown } from 'lucide-vue-next'
import { useMerchantSettings } from '~/composables/useMerchantSettings';
import { useLoading } from '~/stores/useLoading';
import { useMyNotification } from '~/stores/useMyNotification';

const { fetchSettingsStructSummary, updateReceiptSummarySettings } = useMerchantSettings();

const isSaving = ref(false);
const loading = useLoading()
const notify = useMyNotification();

// 1. State Utama - Tetap sesuai struktur Anda
const config = ref({
  logo: { value: '', status: false },
  name: { value: '', status: true },
  address: { value: '', status: true },
  phone: { value: '', status: true },
  tax_percentage: { value: '', status: true },
  footer_note: { value: 'Terima Kasih', status: true },
  description: { value: '', status: true },
  header_one: { value: 'SETTLEMENT', status: true },
  header_two: { value: 'TRANSACTION TOTAL BY ISSUER', status: true },
  header_three: { value: 'SUMMARY', status: true },
  show_time: true,
  summary_groups: [] as any[] // Inisialisasi kosong, nanti diisi default jika server null
});

const sections = [
  {
    title: 'Branding & Header',
    borderClass: 'border-l-4 border-l-emerald-500',
    fields: {
      logo: { label: 'URL Logo', type: 'text' },
      name: { label: 'Nama Toko / Outlet', type: 'text' },
      header_one: { label: 'Judul Struk (Header 1)', type: 'text' },
      header_two: { label: 'Judul  Judul Kedua', type: 'text' },
      header_three: { label: 'Judul Judul Ketiga', type: 'text' },
    }
  },
  {
    title: 'Informasi Kontak',
    borderClass: 'border-l-4 border-l-blue-500',
    fields: {
      address: { label: 'Alamat', type: 'textarea' },
      phone: { label: 'Telepon', type: 'text' },
      footer_note: { label: 'Footer Note', type: 'text' },
    }
  }
];

// 2. Fungsi Manajemen Hierarchy
const addGroup = () => {
  config.value.summary_groups.push({ 
    label: '', 
    status: true, 
    subs: [{ label: '', status: true }] 
  });
};

const removeGroup = (index: number) => {
  config.value.summary_groups.splice(index, 1);
};

const addSub = (groupIndex: number) => {
  config.value.summary_groups[groupIndex].subs.push({ label: '', status: true });
};

const removeSub = (groupIndex: number, subIndex: number) => {
  config.value.summary_groups[groupIndex].subs.splice(subIndex, 1);
};

// 3. Lifecycle & Save (Mengikuti referensi yang berhasil)
onMounted(async () => {
  loading.showLoading('fetch', 'Mengambil Data Settings');
  try {
    const data = await fetchSettingsStructSummary();
    
    if (data) {
      // Sesuai referensi: Gabungkan data dari database ke state lokal dengan spread
      config.value = { 
        ...config.value, 
        ...data
      };

      // Fallback jika summary_groups kosong dari server
      if (!config.value.summary_groups || config.value.summary_groups.length === 0) {
        config.value.summary_groups = [
          { label: 'KARTU DEBIT', status: true, subs: [{ label: 'BRI', status: true }] },
          { label: 'QRIS', status: true, subs: [{ label: 'QRIS BRI', status: true }] }
        ];
      }
      
      notify.addToast(`Konfigurasi dimuat: ${config.value.name.value}`, 'success');
    }
  } catch (error: any) {
    console.error("Fetch Error:", error);
    notify.addToast('Gagal memuat data dari server', 'warning');
  } finally {
    loading.hideLoading();
  }
});

const saveToServer = async () => {
  if (isSaving.value) return;
  isSaving.value = true;
  loading.showLoading('settings', `Menyimpan Konfigurasi`);
  
  try {
    // Sesuai referensi: Ambil snapshot payload dengan spread
    const payload = {
      ...config.value,
    };

    await updateReceiptSummarySettings(payload);
    notify.addToast(`Berhasil disimpan`, 'success');
  } catch (err: any) {
    notify.addToast('Gagal menyimpan', 'warning');
  } finally {
    isSaving.value = false;
    loading.hideLoading();
  }
};
</script>

<template>
  <div class="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-[#fafafa] dark:bg-[#010409]">
    
    <!-- Header -->
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
      <div>
        <h1 class="text-4xl font-black tracking-tighter uppercase dark:text-white">
          Receipt <span class="text-emerald-500">Summary</span>
        </h1>
        <p class="text-zinc-500 font-medium mt-1 italic text-sm">Manajemen hierarki laporan struk fisik (58mm).</p>
      </div>
      <button @click="saveToServer" :disabled="isSaving"
              class="w-full md:w-auto bg-zinc-900 dark:bg-emerald-500 hover:scale-105 text-white px-10 py-4 rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-3">
        <Save v-if="!isSaving" :size="18" />
        <span v-else class="animate-spin text-xl">↻</span>
        <span>SAVE CONFIGURATION</span>
      </button>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      <!-- Editor -->
      <div class="lg:col-span-7 space-y-8">
        
        <!-- Toggle Waktu Global -->
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm">
          <div class="flex justify-between items-center">
            <div class="space-y-1">
              <label class="text-sm font-bold text-zinc-700 dark:text-zinc-300">Cetak Waktu</label>
              <p class="text-[10px] text-zinc-400 italic leading-tight">Menampilkan tanggal dan jam transaksi secara otomatis.</p>
            </div>
            <button 
              @click="config.show_time = !config.show_time"
              :class="config.show_time ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'"
              class="w-12 h-6 rounded-full relative transition-colors duration-300 outline-none"
            >
              <div :class="config.show_time ? 'translate-x-7' : 'translate-x-1'" class="w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 shadow-sm"></div>
            </button>
          </div>
        </div>

        <!-- Standard Sections Editor -->
        <div v-for="(section, sIndex) in sections" :key="sIndex" 
            class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2.5rem] shadow-sm transition-all"
            :class="section.borderClass">
          <div class="text-[10px] font-black tracking-[0.2em] text-zinc-400 mb-8 uppercase">{{ section.title }}</div>
          <div class="space-y-6">
            <div v-for="(field, key) in section.fields" :key="key" class="space-y-2">
              <div class="flex justify-between items-center mb-2">
                <label class="text-sm font-bold dark:text-zinc-300">{{ field.label }}</label>
                
                <button @click="(config as any)[key].status = !(config as any)[key].status"
                        :class="(config as any)[key].status ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'"
                        class="w-12 h-6 rounded-full relative transition-colors duration-300 outline-none">
                  <div :class="(config as any)[key].status ? 'translate-x-7' : 'translate-x-1'" class="w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 shadow-sm"></div>
                </button>
              </div>

              <textarea 
                v-if="field.type === 'textarea'" 
                v-model="(config as any)[key].value" 
                rows="2" 
                class="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none ring-1 ring-zinc-200 dark:ring-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-sm"
              ></textarea>
              <input 
                v-else 
                v-model="(config as any)[key].value" 
                class="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none ring-1 ring-zinc-200 dark:ring-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-sm"
              />
            </div>
          </div>
        </div>

        <!-- Hierarchy Summary Editor -->
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2.5rem] shadow-sm border-l-4 border-l-purple-500">
          <div class="flex justify-between items-center mb-8">
            <div class="text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase">Transaction Hierarchy</div>
            <button @click="addGroup" class="flex items-center gap-2 text-[10px] bg-purple-500 text-white px-4 py-2 rounded-xl font-bold hover:opacity-80 transition-all uppercase">
              <Plus :size="14" /> Add Category
            </button>
          </div>
          
          <div class="space-y-6">
            <div v-for="(group, gIdx) in config.summary_groups" :key="gIdx" 
                 class="p-6 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] bg-zinc-50/50 dark:bg-zinc-800/30 relative">
              
              <div class="flex gap-4 items-center mb-4">
                <div class="p-2 bg-purple-500/10 text-purple-500 rounded-lg"><ListTree :size="18" /></div>
                <input v-model="group.label" placeholder="Kategori" class="flex-1 bg-white dark:bg-zinc-900 p-3 rounded-xl text-sm font-black border-none ring-1 ring-zinc-200 dark:ring-zinc-700 outline-none uppercase" />
                <button @click="group.status = !group.status" :class="group.status ? 'bg-emerald-500' : 'bg-zinc-300'" class="w-10 h-5 rounded-full relative transition-all">
                  <div :class="group.status ? 'translate-x-5' : 'translate-x-1'" class="w-3 h-3 bg-white rounded-full mt-1 transition-all"></div>
                </button>
                <button @click="removeGroup(gIdx)" class="text-zinc-400 hover:text-red-500 transition-colors"><Trash2 :size="18" /></button>
              </div>

              <div class="ml-10 space-y-3 border-l-2 border-dashed border-zinc-200 dark:border-zinc-700 pl-6">
                <div v-for="(sub, sIdx) in group.subs" :key="sIdx" class="flex gap-3 items-center">
                  <input v-model="sub.label" placeholder="Sub-Kategori" class="flex-1 bg-white dark:bg-zinc-900 p-2.5 rounded-xl text-xs font-bold border-none ring-1 ring-zinc-100 dark:ring-zinc-800 outline-none uppercase" />
                  <button @click="sub.status = !sub.status" :class="sub.status ? 'bg-blue-500' : 'bg-zinc-200'" class="w-8 h-4 rounded-full relative transition-all">
                    <div :class="sub.status ? 'translate-x-4' : 'translate-x-1'" class="w-2 h-2 bg-white rounded-full mt-1 transition-all"></div>
                  </button>
                  <button @click="removeSub(gIdx, sIdx)" class="text-zinc-300 hover:text-red-400"><Trash2 :size="14" /></button>
                </div>
                <button @click="addSub(gIdx)" class="text-[9px] font-black text-purple-500 mt-2 hover:bg-purple-50 px-2 py-1 rounded transition-all italic">+ ADD SUB-CATEGORY</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Struk (Kanan) -->
      <div class="lg:col-span-5">
        <div class="sticky top-8 flex flex-col items-center">
          <div class="bg-white text-zinc-900 p-6 rounded-sm font-mono leading-tight w-[310px] shadow-2xl border-t-[12px] border-emerald-500">
            
            <div class="text-center space-y-1 mb-4">
              <div v-if="config.logo.status && config.logo.value" class="mb-2 flex justify-center">
                <img :src="config.logo.value" class="max-h-12 grayscale" />
              </div>
              <h2 v-if="config.name.status" class="text-sm font-bold uppercase">{{ config.name.value || 'NAMA TOKO' }}</h2>
              <p v-if="config.address.status" class="text-[9px] leading-none">{{ config.address.value || 'Alamat Toko' }}</p>
            </div>

            <div v-if="config.header_one.status" class="text-center text-[10px] font-bold border-y border-dashed border-zinc-300 py-1 uppercase mb-4">
              {{ config.header_one.value }}
            </div>

            <div class="flex justify-between text-[9px]">
              <span>TID: TRX-882910</span>
              <span>MID: 00003448822234</span>
            </div>
            <div class="flex justify-between text-[9px] mb-2">
              <span v-if="config.show_time">DATE : 12/05/2026</span>
              <span v-if="config.show_time">TIME : 14:20</span>
            </div>
            
            <!-- Loop Groups Preview -->
            <div v-for="(group, gIdx) in config.summary_groups" :key="gIdx" class="mb-5">
              <template v-if="group.status && group.label">
                <div class="text-[11px] font-bold uppercase border-b border-zinc-100 pb-1 mb-2">{{ group.label }}</div>
                
                <div v-for="(sub, sIdx) in group.subs" :key="sIdx" class="mb-3 pl-2">
                  <template v-if="sub.status && sub.label">
                    <div class="text-[10px] font-bold uppercase mb-1">{{ sub.label }}</div>
                    <div class="flex justify-between text-[9px] text-zinc-500 pl-1">
                      <span>SALE</span> <span>0</span> <span>Rp0</span>
                    </div>
                    <div class="flex justify-between text-[9px] text-zinc-500 pl-1 border-b border-zinc-50 pb-1">
                      <span>VOID</span> <span>0</span> <span>Rp0</span>
                    </div>
                    <div class="flex justify-between text-[9px] font-bold pt-1">
                      <span>TOTAL {{ sub.label }}</span> <span>Rp0</span>
                    </div>
                  </template>
                </div>

                <div class="mt-2 p-1.5 bg-zinc-50 flex justify-between text-[10px] font-black border-y-2 border-double border-zinc-200 uppercase">
                  <span>GRAND TOTAL {{ group.label }}</span>
                  <span>Rp0</span>
                </div>
              </template>
            </div>

            <div class="my-4 border-t-2 border-zinc-900"></div>
            <div class="flex justify-between font-black text-xs uppercase">
              <span>Settlement Total</span>
              <span>Rp0</span>
            </div>

            <div v-if="config.footer_note.status" class="mt-8 text-center text-[9px] italic text-zinc-400 border-t border-dashed pt-4">
              "{{ config.footer_note.value }}"
            </div>
          </div>
          
          <div class="mt-6 flex items-center gap-2 text-zinc-400">
            <Printer :size="14" />
            <span class="text-[10px] font-bold tracking-widest uppercase">Paper Size 58mm</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>