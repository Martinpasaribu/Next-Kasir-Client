<script setup>
import { ref, computed, onMounted } from 'vue';
import { Bluetooth, CircleMinus } from 'lucide-vue-next';
import { useLoading } from '~/stores/useLoading';
import { useMyNotification } from '~/stores/useMyNotification';


// 1. Integrasi Composable
const { fetchSettingsStruct, loading: settingsLoading } = useMerchantSettings();
const { printViaUSB, printViaBluetooth } = usePrinter();

const loading = useLoading()
const notify = useMyNotification();


// State untuk menyimpan konfigurasi dari server
const receiptConfig = ref(null);

const form = ref({
  trx_id: 'TRX-' + Math.floor(Date.now() / 1000).toString().slice(-6),
  date: new Date().toISOString().split('T')[0],
  items: [{ name: '', qty: 1, price: 0 }],
  pay_amount: 0
});

// 2. Ambil data dari server saat mounted
onMounted(async () => {

  try {
    
    loading.showLoading('fetch','Mengambil Format Struk');
    
    // Memanggil method yang mengembalikan result?.settings_receipt dari NestJS
    const data = await fetchSettingsStruct(); 

    if (data) {
      receiptConfig.value = data;

      console.log('✅ Konfigurasi Struk Dimuat:', data);
      notify.addToast(`Konfigurasi Struk Dimuat`, 'success');
        
    }
  } catch (err) {
     notify.addToast(err || 'Gagal memuat konfigurasi', 'warning');
  } finally {

    setTimeout(() => {
      loading.hideLoading();
    }, 500);
  }
});

// 3. Kalkulasi Berdasarkan Config Server
const subtotal = computed(() => form.value.items.reduce((a, b) => a + (b.qty * b.price), 0));

const tax = computed(() => {
  // Mengambil tax_percentage langsung dari root settings_receipt
  const taxRate = receiptConfig.value?.tax_percentage || 0;
  return subtotal.value * (taxRate / 100);
});

const grandTotal = computed(() => subtotal.value + tax.value);
const changeAmount = computed(() => {
  const diff = form.value.pay_amount - grandTotal.value;
  return diff > 0 ? diff : 0;
});

const doPrint = async (method) => {

  loading.showLoading('settings','Mencetak Struk via ' + (method === 'BT' ? 'Bluetooth' : 'USB'))

  const payload = {
    ...form.value,
    products: form.value.items.map(i => ({ ...i, subtotal: i.qty * i.price })),
    sub_amount: subtotal.value,
    tax_amount: tax.value,
    total_amount: grandTotal.value,
    payment_amount: form.value.pay_amount,
    change_amount: changeAmount.value,
    // Gunakan show_time dari server config jika tersedia
    time: receiptConfig.value?.show_time ? new Date().toLocaleTimeString('id-ID') : '',
    
    // Kirim seluruh config untuk diproses di layer printer (USB/BT)
    config: receiptConfig.value 
  };

  try {
    if (method === 'BT') {
      await printViaBluetooth(payload);
    } else {
      await printViaUSB(payload);
    }
 
    notify.addToast('Struk berhasil dicetak', 'success');
      
  } catch (err) {
    console.error("Cetak gagal:", err);
    notify.addToast(err || 'Gagal mencetak struk', 'warning');
    
  } finally {
      loading.hideLoading();

  }
};
</script>

<template>
  <div class="p-8 flex flex-col lg:flex-row gap-8">

    <div class="flex-1 space-y-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 class="text-3xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white flex items-center gap-3">
            <span class="bg-emerald-500 text-white p-2 rounded-xl shadow-lg shadow-emerald-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            Manual <span class="text-emerald-500">Receipt</span>
          </h1>
          <p class="text-zinc-500 text-sm mt-1 font-medium italic">Buat dan cetak struk kustom dengan cepat.</p>
        </div>
        <div class="w-full md:w-auto bg-white dark:bg-zinc-900 p-2 rounded-2xl border dark:border-zinc-800 shadow-sm">
          <PrinterStatus />
        </div>
      </div>

      <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none overflow-hidden transition-all">
        
        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50/50 dark:bg-zinc-800/30 border-b border-zinc-100 dark:border-zinc-800">
          <div class="group space-y-2">
            <label class="text-[11px] font-black text-zinc-400 ml-1 tracking-widest uppercase flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> ID Transaksi
            </label>
            <div class="relative">
              <input v-model="form.trx_id" class="w-full p-4 pl-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold" />
              <span class="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 text-xl">#</span>
            </div>
          </div>
          <div class="group space-y-2">
            <label class="text-[11px] font-black text-zinc-400 ml-1 tracking-widest uppercase flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Tanggal Transaksi
            </label>
            <input v-model="form.date" type="date" class="w-full p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold uppercase text-sm" />
          </div>
        </div>

        <div class="p-8 space-y-6">
          <div class="flex justify-between items-center">
            <label class="text-[11px] font-black text-zinc-400 tracking-[0.2em] uppercase">Daftar Item Pesanan</label>
            <span class="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full font-bold text-zinc-500">{{ form.items.length }} Item</span>
          </div>

          <div class="space-y-4">
            <div v-for="(item, idx) in form.items" :key="idx" class="group flex flex-wrap md:flex-nowrap gap-3 items-center bg-white dark:bg-zinc-800/40 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-700 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all relative">
              
              <div class="flex-1 min-w-[200px] relative">
                <input v-model="item.name" placeholder="Nama Menu..." class="w-full p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl outline-none border-none focus:ring-2 focus:ring-emerald-500 font-bold text-zinc-700 dark:text-zinc-200" />
              </div>

              <div class="flex items-center gap-2">
                <div class="w-24 relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-30 uppercase">Qty</span>
                  <input v-model.number="item.qty" type="number" class="w-full p-3 pl-10 bg-zinc-50 dark:bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-center font-bold" />
                </div>
                
                <div class="w-36 relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-30 uppercase">Rp</span>
                  <input v-model.number="item.price" type="number" placeholder="Harga" class="w-full p-3 pl-10 bg-zinc-50 dark:bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-right font-black text-emerald-600" />
                </div>

                <button @click="form.items.splice(idx, 1)" class="p-3 text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all">

                  <CircleMinus />

                </button>
              </div>
            </div>
          </div>

          <button @click="form.items.push({name:'', qty:1, price:0})" 
                  class="w-full py-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 font-black text-xs tracking-widest hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-50/50 transition-all uppercase">
            + Tambah Item Baru
          </button>
        </div>

        <div class="p-8 bg-zinc-900 dark:bg-black">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div class="space-y-0.5">
                  <label class="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.2em]">Tunai Diterima</label>
                  <input v-model.number="form.pay_amount" type="number" class="bg-transparent border-none outline-none text-white text-3xl font-black w-full placeholder:text-zinc-800" placeholder="0" />
                </div>
              </div>
              <div class="h-px bg-zinc-800"></div>
              <div class="flex justify-between items-center text-zinc-400">
                <span class="text-xs font-bold uppercase tracking-widest">Kembalian</span>
                <span class="text-xl font-mono font-black text-white">Rp {{ changeAmount.toLocaleString() }}</span>
              </div>
            </div>

            <div class="flex gap-4">
              <button @click="doPrint('USB')" class="flex-1 flex flex-col items-center justify-center gap-2 bg-white text-zinc-900 py-6 rounded-[2rem] font-black hover:bg-emerald-500 hover:text-white transition-all group">
                <span class="text-2xl group-hover:scale-125 transition-transform">🔌</span>
                <span class="text-[10px] tracking-tighter uppercase">Cetak USB</span>
              </button>
              <button @click="doPrint('BT')" class="flex-1 flex flex-col items-center justify-center gap-2 bg-blue-600 text-white py-6 rounded-[2rem] font-black hover:bg-blue-500 transition-all group shadow-xl shadow-blue-900/20">
                <Bluetooth  class="text-2xl group-hover:rotate-12 transition-transform"/>
                <span class="text-[10px] tracking-tighter uppercase">Cetak Bluetooth</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="w-124 hidden lg:block">
      <div class="sticky top-8">
        <p class="text-md font-black mb-4 text-zinc-400 uppercase tracking-widest text-center">Visual Preview (58mm)</p>
        
        <div v-if="settingsLoading" class="thermal-paper animate-pulse flex items-center justify-center border-dashed border-2 border-zinc-200">
          <p class="text-[14px] font-bold text-zinc-400 uppercase">Sinkronisasi Server...</p>
        </div>

        <div v-else class="thermal-paper shadow-2xl rounded-sm border-t-[8px] border-emerald-500">
          <div class="text-center space-y-1">
            <div v-if="receiptConfig?.logo?.status && receiptConfig?.logo?.value" class="mb-2">
               <img :src="receiptConfig.logo.value" class="max-h-12 mx-auto grayscale contrast-125" />
            </div>
            
            <h2 v-if="receiptConfig?.name?.status" class="font-bold text-[13px] uppercase">
              {{ receiptConfig?.name?.value || 'NAMA TOKO' }}
            </h2>
            
            <p v-if="receiptConfig?.description?.status" class="text-[13px] font-medium leading-tight">
              {{ receiptConfig?.description?.value }}
            </p>

            <p v-if="receiptConfig?.address?.status" class="text-[13px] leading-tight opacity-80">
              {{ receiptConfig?.address?.value || 'Alamat Outlet' }}
            </p>
            
            <p v-if="receiptConfig?.phone?.status && receiptConfig?.phone?.value" class="text-[13px]">
              Telp: {{ receiptConfig?.phone?.value }}
            </p>
            
            <p v-if="receiptConfig?.email?.status && receiptConfig?.email?.value" class="text-[8px]">
              {{ receiptConfig?.email?.value }}
            </p>
          </div>

          <div class="mt-4 flex justify-between text-[13px] border-t border-zinc-100 pt-2">
            <span>ID: {{ form.trx_id }}</span>
            <span v-if="receiptConfig?.show_time">{{ form.date }}</span>
          </div>
          
          <p class="text-center text-zinc-300 my-1">--------------------------------</p>
          
          <div v-for="(item, index) in form.items" :key="index" class="my-2 text-[14px]">
            <p class="uppercase font-bold">{{ item.name || 'PILIH MENU...' }}</p>
            <div class="flex justify-between font-mono">
              <span>{{ item.qty }} x {{ item.price.toLocaleString() }}</span>
              <span>{{ (item.qty * item.price).toLocaleString() }}</span>
            </div>
          </div>
          
          <p class="text-center text-zinc-300 my-1">--------------------------------</p>
          
          <div class="space-y-0.5 text-[14px]">
            <div class="flex justify-between"><span>SUBTOTAL</span><span>{{ subtotal.toLocaleString() }}</span></div>
            <div v-if="tax > 0" class="flex justify-between">
              <span>PAJAK ({{ receiptConfig?.tax_percentage }}%)</span>
              <span>{{ tax.toLocaleString() }}</span>
            </div>
          </div>

          <p class="text-center text-zinc-300 my-1 font-bold">================================</p>
          <div class="flex justify-between font-bold text-[13px] uppercase">
            <span>TOTAL</span>
            <span>{{ grandTotal.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-[14px] mt-1 opacity-70">
            <span>BAYAR</span>
            <span>{{ form.pay_amount.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-[14px] opacity-70">
            <span>KEMBALI</span>
            <span>{{ changeAmount.toLocaleString() }}</span>
          </div>
          
          <div class="mt-6 text-center space-y-1.5">

            <div class="text-[12px] opacity-60 uppercase font-bold flex flex-col items-center">
              <span v-if="receiptConfig?.instagram?.status && receiptConfig?.instagram?.value">IG: @{{ receiptConfig?.instagram?.value }}</span>
              <span v-if="receiptConfig?.website?.status && receiptConfig?.website?.value">{{ receiptConfig?.website?.value }}</span>
            </div>
            <p v-if="receiptConfig?.footer_note?.status" class="text-[14px] italic border-t border-dashed border-zinc-200 pt-3">
              "{{ receiptConfig?.footer_note?.value }}"
            </p>
            
          </div>

          <div class="h-6"></div> 
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.thermal-paper {
  width: 88mm;
  min-height: 160mm;
  font-family: 'Courier New', Courier, monospace;
  line-height: 1.1;
  padding: 20px 12px;
  background: white;
  color: #18181b;
  margin: 0 auto;
  border-radius: 2px;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>