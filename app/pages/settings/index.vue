<script setup lang="ts">
import { Store, ShieldCheck, CreditCard, Bell, Moon, Printer, User, LogOut } from 'lucide-vue-next';
import OutletSelector from '~/components/tools/OutletSelector.vue';
import ThemeSwitcherText from '~/components/tools/ThemeSwitcherText.vue';
import TextInput from '~/components/shared/InputComponents/TextInput.vue';
import NumberInput from '~/components/shared/InputComponents/NumberInput.vue';
import TextEditor from '~/components/shared/InputComponents/TextEditor.vue';
import { useLoading } from '~/stores/useLoading';
import { useMyNotification } from '~/stores/useMyNotification';

// 1. Integrasi Composables
const { user: userData, loading: authLoading, fetchProfile, logout: handleLogout } = useAuthProfile()
const { settings, loading: settingsLoading, fetchSettings, updateGlobalSettings } = useMerchantSettings()

const tenantId = useCookie('tenant_id')
const isSaving = ref(false)
const notify = useMyNotification();
const loading = useLoading()


// 2. State Lokal untuk Form
const shopDetails = ref({
  name: '',
  description:'',
  address: '',
  currency: 'IDR',
  auto_print: false ,
  auto_save_print: false
});

const globalTax = ref({
  tax_value: 0,
  is_enabled: false
});

const isAutoPrint = ref(false)
const isAutoSaveDB = ref(false)

// 3. Inisialisasi Data
onMounted(async () => {
  // Tampilkan loading dengan kategori 'fetch
  loading.showLoading('fetch','Mengambil Data Settings');

  try {
    // Jalankan fetch secara paralel untuk speed
    await Promise.all([
      fetchProfile(),
      fetchSettings(),
    ]);

    // Mapping data dari DB ke form lokal
    if (settings.value) {
      shopDetails.value.name = settings.value.name_outlet || '';
      shopDetails.value.description = settings.value.description || '';
      shopDetails.value.address = settings.value.address || '';
      shopDetails.value.auto_print = settings.value.auto_print ?? false;
      shopDetails.value.auto_save_print = settings.value.auto_save_print ?? false;
      
      if (settings.value.tax_settings) {
        globalTax.value = {
          tax_value: settings.value.tax_settings.tax_value || 0,
          is_enabled: settings.value.tax_settings.is_enabled || false
        };
      }
    }
  } catch (error) {
    console.error("Gagal inisialisasi data:", error);
    // Opsional: kamu bisa panggil alert atau toast error di sini
  } finally {
    // Selesai fetch (berhasil/gagal), tutup loading
    // Berikan sedikit delay 500ms agar transisi tidak terlalu kaget (flash)
    setTimeout(() => {
      loading.hideLoading();
    }, 500);
  }
});

// 4. Logic Simpan
const handleSaveAll = async () => {
  if (isSaving.value) return;
  
  isSaving.value = true;
  
  loading.showLoading('settings')

  try {
    const colorMode = useColorMode();
    
    await updateGlobalSettings({
      theme: (colorMode.preference as any),
      tax: globalTax.value,
      shopDetails: shopDetails.value,
      // Kita selipkan metadata untuk auto print
      metadata: {
        auto_print: isAutoPrint.value,
        auto_save_print: isAutoSaveDB.value
      }
    });
    
    notify.addToast('Konfigurasi berhasil disimpan ke server!', 'success');
  
  } catch (e:any) {

    console.error(e);

    notify.addToast(e, 'warning');
  } finally {
    isSaving.value = false;
    loading.hideLoading()
  }
}

const cleanTenantId = computed(() => tenantId.value?.replace('tenant_', '') || 'Guest');
</script>

<template>
  <div class="p-4 md:p-7 w-full mx-auto space-y-8 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
    
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl md:text-4xl font-black text-nuxt-gray-950 dark:text-white tracking-tighter uppercase">
          System <span class="text-nuxt-green">Settings</span>
        </h1>
        <p class="text-nuxt-gray-400 font-medium mt-1 flex items-center gap-2">
          <ShieldCheck :size="14" class="text-nuxt-green" />
          Konfigurasi akses untuk <span class="font-bold text-nuxt-gray-600 dark:text-nuxt-gray-200">@{{ cleanTenantId }}</span>
        </p>
      </div>
      
      <div class="bg-nuxt-green/10 border border-nuxt-green/20 px-4 py-2 rounded-2xl flex items-center gap-3">
        <div class="w-2 h-2 bg-nuxt-green rounded-full animate-pulse"></div>
        <span class="text-[10px] font-black uppercase tracking-widest text-nuxt-green-dark dark:text-nuxt-green">System Operational</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        
        <section class="space-y-4">
          <div class="flex items-center gap-2 px-1">
            <Store :size="16" class="text-nuxt-green" />
            <h2 class="text-xs font-black text-nuxt-gray-950 dark:text-white uppercase tracking-[0.2em]">Pindah Terminal / Outlet</h2>
          </div>
          <div class="bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 p-3 rounded-3xl shadow-sm">
            <OutletSelector />
            <p class="px-6 py-2 text-[10px] text-nuxt-gray-400 italic">* Mengganti outlet akan menyesuaikan stok dan laporan transaksi otomatis.</p>
          </div>
        </section>

        <section class="space-y-4">
          <h2 class="text-xs font-black text-nuxt-gray-950 dark:text-white uppercase tracking-[0.2em] px-1">Informasi Toko</h2>
          <div class="bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 p-6 md:p-8 rounded-[2.5rem] space-y-6 shadow-sm">
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-2">

                <TextInput 
                  v-model="shopDetails.name"
                  label="Nama Toko"
                  placeholder="Toko BUDI Berkah "
                />

              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-nuxt-gray-400 uppercase tracking-widest px-1">Mata Uang</label>
                <div class="relative">
                  <select v-model="shopDetails.currency" class="w-full bg-nuxt-gray-50 dark:bg-nuxt-gray-950 p-4 rounded-2xl border-2 border-transparent focus:border-nuxt-green/30 outline-none transition-all font-bold appearance-none">
                    <option value="IDR">IDR (Rupiah)</option>
                    <option value="USD">USD (Dollar)</option>
                  </select>
                  <Icon name="lucide:chevron-down" class="absolute right-4 top-1/2 -translate-y-1/2 text-nuxt-gray-400 pointer-events-none" size="18" />
                </div>
              </div>
            </div>
            <div class="space-y-2">

              <TextEditor 
                v-model="shopDetails.description" 
                label="Deskripsi Mengenai Merchant"
              />

              <TextInput 
                v-model="shopDetails.address"
                label="Alamat Lengkap"
                placeholder="Alamat lengkap toko"
              />

            </div>
          </div>
        </section>

        <section class="space-y-4">
          <h2 class="text-xs font-black text-nuxt-gray-950 dark:text-white uppercase tracking-[0.2em] px-1">Konfigurasi Pajak Global</h2>
          <div class="bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 p-6 md:p-8 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row gap-6 items-center">
            <div class="flex-1 w-full space-y-2">
              <label class="text-[10px] font-black text-nuxt-gray-400 uppercase tracking-widest px-1">Besaran Pajak (%)</label>
              <div class="relative">
                  <NumberInput 
                    v-model="globalTax.tax_value"
                    label="Urut Tampil"
                    prefix="#"
                    placeholder="0"
                  />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 font-black text-nuxt-gray-300">%</span>
              </div>
            </div>
            <div class="flex flex-col items-center gap-2">
              <label class="text-[10px] font-black text-nuxt-gray-400 uppercase tracking-widest">Status Pajak</label>
              <button 
                @click="globalTax.is_enabled = !globalTax.is_enabled"
                :class="globalTax.is_enabled ? 'bg-nuxt-green text-white' : 'bg-nuxt-gray-100 text-nuxt-gray-800'"
                class="px-6 py-3 rounded-2xl font-black text-xs transition-all uppercase tracking-widest"
              >
                {{ globalTax.is_enabled ? 'Aktif' : 'Non-Aktif' }}
              </button>
            </div>
          </div>
        </section>

      </div>

      <div class="space-y-8">
        <section class="space-y-4">
          <h2 class="text-xs font-black text-nuxt-gray-950 dark:text-white uppercase tracking-[0.2em] px-1">Preferensi Tampilan</h2>
          <div class="bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 p-6 rounded-[2.5rem] shadow-sm">
             <ThemeSwitcherText />
          </div>
        </section>

        <section class="space-y-4">
          <h2 class="text-xs font-black text-nuxt-gray-950 dark:text-white uppercase tracking-[0.2em] px-1">Hardware & Struk</h2>
          <div class="space-y-3">
            <div @click="shopDetails.auto_print = !shopDetails.auto_print" class="flex bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 items-center justify-between p-4 rounded-2xl hover:bg-nuxt-gray-50 dark:hover:bg-nuxt-gray-800 transition-colors cursor-pointer group">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-nuxt-gray-50 dark:bg-nuxt-gray-800 flex items-center justify-center text-nuxt-gray-400 group-hover:text-nuxt-green transition-colors">
                  <Printer :size="20" />
                </div>
                <div>
                  <p class="text-sm font-bold">Cetak Struk</p>
                  <p class="text-[10px] text-nuxt-gray-400">Otomatis tiap transaksi</p>
                </div>
              </div>
              <button :class="shopDetails.auto_print ? 'bg-nuxt-green' : 'bg-nuxt-gray-200 dark:bg-gray-700'" class="w-12 h-6 rounded-full relative transition-all duration-300">
                <div :class="shopDetails.auto_print ? 'translate-x-6' : 'translate-x-1'" class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
              </button>
            </div>
            <div @click="shopDetails.auto_save_print = !shopDetails.auto_save_print" class="flex bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 items-center justify-between p-4 rounded-2xl hover:bg-nuxt-gray-50 dark:hover:bg-nuxt-gray-800 transition-colors cursor-pointer group">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-nuxt-gray-50 dark:bg-nuxt-gray-800 flex items-center justify-center text-nuxt-gray-400 group-hover:text-nuxt-green transition-colors">
                  <Printer :size="20" />
                </div>
                <div>
                  <p class="text-sm font-bold">Simpan Struk</p>
                  <p class="text-[10px] text-nuxt-gray-400">Otomatis Menyimpan Data Struk</p>
                </div>
              </div>
              <button :class="shopDetails.auto_save_print ? 'bg-nuxt-green' : 'bg-nuxt-gray-200 dark:bg-gray-700'" class="w-12 h-6 rounded-full relative transition-all duration-300">
                <div :class="shopDetails.auto_save_print ? 'translate-x-6' : 'translate-x-1'" class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
              </button>
            </div>


            <NuxtLink to="/settings/struct" class="flex bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 items-center gap-3 p-4 rounded-2xl hover:bg-nuxt-gray-50 dark:hover:bg-nuxt-gray-800 transition-colors">
                <div class="w-10 h-10 rounded-xl bg-nuxt-gray-50 dark:bg-nuxt-gray-800 flex items-center justify-center text-nuxt-gray-400"><Printer :size="20" /></div>
                <div><p class="text-sm font-bold">Format Struk</p><p class="text-[10px] text-nuxt-gray-400">Atur layout & logo</p></div>
            </NuxtLink>
            <NuxtLink to="/settings/manual-add-struct" class="flex bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 items-center gap-3 p-4 rounded-2xl hover:bg-nuxt-gray-50 dark:hover:bg-nuxt-gray-800 transition-colors">
                <div class="w-10 h-10 rounded-xl bg-nuxt-gray-50 dark:bg-nuxt-gray-800 flex items-center justify-center text-nuxt-gray-400"><Printer :size="20" /></div>
                <div><p class="text-sm font-bold">Tambah Manual </p><p class="text-[10px] text-nuxt-gray-400">Membuat Struk Manual</p></div>
            </NuxtLink>
          </div>
        </section>

        <section class="space-y-4">
           <div class="bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 p-6 rounded-[2.5rem] shadow-sm relative overflow-hidden">
             <div class="relative z-10 flex items-center gap-4">
                <div class="w-16 h-16 rounded-2xl bg-nuxt-green/20 flex items-center justify-center text-nuxt-green border-2 border-nuxt-green/10 overflow-hidden">
                  <img v-if="userData?.avatar" :src="userData.avatar" class="w-full h-full object-cover" />
                  <User v-else :size="32" />
                </div>
                <div class="flex-1">
                  <p class="text-xs font-black text-nuxt-green uppercase tracking-widest mb-1">{{ userData?.role || 'Staff' }}</p>
                  <h3 class="text-lg font-black dark:text-white">{{ userData?.full_name || 'User' }}</h3>
                </div>
             </div>
             <button @click="handleLogout" class="mt-6 w-full flex items-center justify-between p-3 rounded-xl hover:bg-danger/10 group transition-colors">
                <span class="text-xs font-bold text-danger">Keluar Sesi</span>
                <LogOut :size="14" class="text-danger opacity-50" />
             </button>
           </div>
        </section>
      </div>
    </div>

    <div class="flex justify-end pt-4 border-t border-nuxt-gray-100 dark:border-nuxt-gray-800">
      <button 
        @click="handleSaveAll"
        :disabled="isSaving || settingsLoading"
        class="bg-nuxt-green hover:bg-nuxt-gray-950 dark:hover:bg-white text-nuxt-gray-950 dark:hover:text-nuxt-gray-950 hover:text-white px-10 py-4 rounded-[1.5rem] font-black uppercase tracking-widest transition-all shadow-xl shadow-nuxt-green/20 active:scale-95 disabled:opacity-50"
      >
        <span v-if="isSaving">Menyimpan...</span>
        <span v-else>Simpan Perubahan</span>
      </button>
    </div>
    
  </div>
</template>