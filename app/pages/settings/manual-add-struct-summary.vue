<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Bluetooth, Save, ChevronLeft, FileText, Printer } from 'lucide-vue-next';
import { useMerchantSettings } from '~/composables/useMerchantSettings';
import { usePrinter } from '~/composables/usePrinter'; // Sesuai referensi Anda
import { useLoading } from '~/stores/useLoading';
import { useMyNotification } from '~/stores/useMyNotification';

// 1. Integrasi Composable & Stores
const { fetchSettingsStructSummary } = useMerchantSettings();
const { printViaUSB, printViaBluetoothSummary } = usePrinter();
const loading = useLoading();
const notify = useMyNotification();

// 2. State Utama
const receiptConfig = ref<any>(null);
const isSaving = ref(false);

// Form rekapitulasi angka
const form = ref<Record<string, any>>({});
const trxInfo = ref({
  trx_id: 'SMR-' + Math.floor(Date.now() / 1000).toString().slice(-6),
  date: new Date().toISOString().split('T')[0]
});

// 3. Lifecycle: Ambil Konfigurasi
onMounted(async () => {
  loading.showLoading('fetch', 'Menyiapkan Form Summary');
  try {
    const data = await fetchSettingsStructSummary();
    if (data) {
      receiptConfig.value = data;
      initializeForm(data.summary_groups);
      notify.addToast('Konfigurasi Summary Dimuat', 'success');
    }
  } catch (err: any) {
    notify.addToast(err || 'Gagal memuat konfigurasi', 'warning');
  } finally {
    loading.hideLoading();
  }
});

const initializeForm = (groups: any[]) => {
  const initialForm: Record<string, any> = {};
  groups.forEach(group => {
    if (group.status) {
      initialForm[group.label] = {};
      group.subs.forEach((sub: any) => {
        if (sub.status) {
          initialForm[group.label][sub.label] = {
            sale_count: 0,
            sale_amount: 0,
            void_count: 0,
            void_amount: 0
          };
        }
      });
    }
  });
  form.value = initialForm;
};

// 4. Kalkulasi Reaktif (Mirip referensi Anda)
const getGroupTotal = (groupLabel: string) => {
  const groupData = form.value[groupLabel];
  if (!groupData) return 0;
  return Object.values(groupData).reduce((acc: number, curr: any) => {
    return acc + (Number(curr.sale_amount) - Number(curr.void_amount));
  }, 0);
};

const grandTotal = computed(() => {
  return Object.keys(form.value).reduce((acc, label) => acc + getGroupTotal(label), 0);
});

// 5. Logic Cetak (Mengikuti Pola doPrint Referensi Anda)
const doPrintSummary = async (method: 'USB' | 'BT') => {
  loading.showLoading('settings', 'Mencetak Summary via ' + method);

  const payload = {
    trx_id: trxInfo.value.trx_id,
    date: trxInfo.value.date,
    summary_data: form.value, // Data angka per kategori
    total_amount: grandTotal.value,
    time: receiptConfig.value?.show_time ? new Date().toLocaleTimeString('id-ID') : '',
    config: receiptConfig.value, // Kirim seluruh config branding (logo, nama toko, dsb)
    type: 'SUMMARY_REPORT' // Flag untuk layer printer agar tahu ini format summary
  };

  try {
    if (method === 'BT') {
      await printViaBluetoothSummary(payload);
    } else {
      await printViaUSB(payload);
    }
    notify.addToast('Summary Struk berhasil dicetak', 'success');
  } catch (err: any) {
    notify.addToast(err || 'Gagal mencetak', 'warning');
  } finally {
    loading.hideLoading();
  }
};
</script>

<template>
  <div class="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-[#fafafa] dark:bg-[#010409]">
    
    <!-- Header (Sesuai gaya referensi Anda) -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
      <div class="flex items-center gap-4">
        <NuxtLink to="/settings/receipt-summary" class="p-3 bg-white dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 shadow-sm">
          <ChevronLeft :size="20" class="dark:text-white" />
        </NuxtLink>
        <div>
          <h1 class="text-3xl font-black uppercase tracking-tighter dark:text-white">
            Manual <span class="text-purple-500">Summary</span>
          </h1>
          <p class="text-zinc-500 text-sm font-medium italic">Rekapitulasi transaksi per kategori.</p>
        </div>
      </div>
      
      <div class="flex gap-3 w-full md:w-auto">
        <button @click="doPrintSummary('BT')" class="bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500">
          <Bluetooth :size="18" />
          <span class="text-xs uppercase">BT Print</span>
        </button>
        <button @click="doPrintSummary('USB')" class="bg-zinc-900 dark:bg-zinc-800 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all hover:bg-black">
          <Printer :size="18" />
          <span class="text-xs uppercase">USB Print</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      <!-- Input Form (Kiri) -->
      <div class="lg:col-span-7 space-y-8">
        <!-- Info Transaksi -->
        <div class="grid grid-cols-2 gap-4 p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border dark:border-zinc-800 shadow-sm">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">ID Report</label>
            <input v-model="trxInfo.trx_id" class="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl outline-none border-none font-bold text-sm" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tanggal</label>
            <input v-model="trxInfo.date" type="date" class="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl outline-none border-none font-bold text-sm uppercase" />
          </div>
        </div>

        <!-- Loop Groups -->
        <div v-for="(group, label) in form" :key="label" 
             class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-sm">
          
          <div class="bg-purple-500 p-4 flex justify-between items-center">
            <span class="text-white font-black text-xs uppercase tracking-widest">{{ label }}</span>
            <span class="text-[10px] text-white/80 font-bold uppercase">Subtotal: Rp {{ getGroupTotal(label).toLocaleString() }}</span>
          </div>

          <div class="p-6 space-y-8">
            <div v-for="(data, subLabel) in group" :key="subLabel" class="space-y-4 border-b border-zinc-50 dark:border-zinc-800 pb-6 last:border-0 last:pb-0">
              <div class="flex justify-between items-center">
                <span class="text-xs font-black text-purple-500 uppercase italic"># {{ subLabel }}</span>
              </div>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="space-y-1">
                  <label class="text-[9px] font-bold text-zinc-400 uppercase">Qty Sale</label>
                  <input type="number" v-model="data.sale_count" class="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-bold outline-none ring-1 ring-zinc-100 dark:ring-zinc-700 focus:ring-purple-500" />
                </div>
                <div class="space-y-1">
                  <label class="text-[9px] font-bold text-zinc-400 uppercase">Amount Sale</label>
                  <input type="number" v-model="data.sale_amount" class="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-bold outline-none ring-1 ring-zinc-100 dark:ring-zinc-700 focus:ring-purple-500" />
                </div>
                <div class="space-y-1">
                  <label class="text-[9px] font-bold text-red-400 uppercase">Qty Void</label>
                  <input type="number" v-model="data.void_count" class="w-full p-2.5 bg-red-50/30 dark:bg-red-900/10 rounded-xl text-sm font-bold outline-none ring-1 ring-red-100 dark:ring-red-900/30" />
                </div>
                <div class="space-y-1">
                  <label class="text-[9px] font-bold text-red-400 uppercase">Amount Void</label>
                  <input type="number" v-model="data.void_amount" class="w-full p-2.5 bg-red-50/30 dark:bg-red-900/10 rounded-xl text-sm font-bold outline-none ring-1 ring-red-100 dark:ring-red-900/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

<!-- Preview Struk (Kanan) -->
<div class="lg:col-span-5">
  <div class="sticky top-8 flex flex-col items-center">
    <div class="bg-white text-zinc-900 p-6 rounded-sm font-mono leading-tight w-[310px] shadow-2xl border-t-[12px] border-emerald-500">
      
      <div class="flex justify-between text-[8px] text-zinc-400 mb-4">
        <span>f{{ form.date?.replace(/-/g, '.') }}.{{ new Date().toLocaleTimeString('id-ID').replace(/:/g, '.') }}</span>
        <span>PE{{ form.trx_id || '000' }}E{{ 1234 }}</span>
      </div>

      <div class="text-center space-y-1 mb-4">
        <h2 v-if="receiptConfig?.name?.status" class="text-sm font-bold uppercase">
          {{ receiptConfig.name.value || 'NAMA TOKO' }}
        </h2>
        <p v-if="receiptConfig?.address?.status" class="text-[9px] leading-none text-zinc-600">
          {{ receiptConfig.address.value || 'Alamat Toko' }}
        </p>
      </div>
      <div class="text-center text-[10px] mb-2 leading-none">-----------------------------</div>

      <div class="text-center mb-4">
        <div class="text-[11px] font-black uppercase italic">
          {{ receiptConfig?.header_one?.value || 'SUMMARY REPORT' }}
        </div>
        <div class="text-[10px] leading-none">-----------------------------</div>
      </div>

      <div class="space-y-0.5 mb-4">
        <div class="flex justify-between text-[9px]">
          <span>ID: {{ form.trx_id || '000' }}</span>
          <span>MID: 000034</span>
        </div>
        <div v-if="receiptConfig?.show_time" class="flex justify-between text-[9px]">
          <span>DATE: {{ form.date }}</span>
          <span>TIME: {{ new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) }}</span>
        </div>
        <div class="text-[10px] leading-none">---------------------------------------</div>
      </div>

      <div class="text-center mb-4">
        <div class="text-[10px] font-bold uppercase">
          {{ receiptConfig?.header_two?.value || 'DETAIL SUMMARY' }}
        </div>
        <div class="text-[10px] leading-none">=======================================</div>
      </div>

      <div v-for="(group, gIdx) in receiptConfig?.summary_groups" :key="gIdx" class="mb-4">
        <template v-if="group.status && group.label">
          <div class="text-[10px] font-bold uppercase mb-0.5">{{ group.label }}</div>
          <div class="text-[9px] leading-none mb-2 text-zinc-300">.......................................</div>

            <!-- Loop Subs -->
            <div v-for="(sub, sIdx) in group.subs" :key="sIdx" class="mb-3 pl-2">
              <template v-if="sub.status && sub.label">
                <div class="text-[10px] font-bold uppercase mb-1">{{ sub.label }}</div>
                
                <!-- Ambil data dari form secara reaktif berdasarkan label -->
                <div class="flex justify-between text-[9px] text-zinc-500 pl-1">
                  <span>SALE</span> 
                  <span>{{ form[group.label]?.[sub.label]?.sale_count || 0 }}</span> 
                  <span>Rp{{ (form[group.label]?.[sub.label]?.sale_amount || 0).toLocaleString() }}</span>
                </div>
                
                <div class="flex justify-between text-[9px] text-zinc-500 pl-1 border-b border-zinc-50 pb-1">
                  <span>VOID</span> 
                  <span>{{ form[group.label]?.[sub.label]?.void_count || 0 }}</span> 
                  <span>Rp{{ (form[group.label]?.[sub.label]?.void_amount || 0).toLocaleString() }}</span>
                </div>

                <div class="flex justify-between text-[9px] font-bold pt-1">
                  <span>TOTAL {{ sub.label }}</span> 
                  <span>Rp{{ ( (form[group.label]?.[sub.label]?.sale_amount || 0) - (form[group.label]?.[sub.label]?.void_amount || 0) ).toLocaleString() }}</span>
                </div>
              </template>
            </div>

          <div class="text-[10px] leading-none">=======================================</div>
          <div class="flex justify-between text-[10px] font-bold py-1">
            <span>TOTAL {{ group.label }}</span>
            <span>Rp{{ getGroupTotal(group.label).toLocaleString() }}</span>
          </div>
          <div class="text-[10px] leading-none mb-4">=======================================</div>
        </template>
      </div>

      <div class="text-center mt-6">
        <div class="text-[10px] font-bold uppercase">{{ receiptConfig?.header_three?.value || 'GRAND SUMMARY' }}</div>
        <div class="text-[10px] leading-none">-----------------------------</div>
      </div>

      <div class="space-y-1 mb-2">
        <div v-for="group in receiptConfig?.summary_groups" :key="group.label" class="flex justify-between text-[10px]">
          <span v-if="group.status">{{ group.label }}</span>
          <span v-if="group.status">Rp{{ getGroupTotal(group.label).toLocaleString() }}</span>
        </div>
      </div>

      <div class="text-[10px] leading-none">=============================</div>
      <div class="flex justify-between text-xs font-black uppercase py-1">
        <span>SETTLEMENT TOTAL</span>
        <span>Rp{{ grandTotal.toLocaleString() }}</span>
      </div>
      <div class="text-[10px] leading-none mb-6">=============================</div>

      <div v-if="receiptConfig?.footer_note?.status" class="text-center">
        <p class="text-[9px] italic text-zinc-400">"{{ receiptConfig.footer_note.value }}"</p>
      </div>

      <div class="flex justify-between text-[8px] text-zinc-300 mt-6 pt-4 border-t border-dashed">
        <span>f{{ form.date?.replace(/-/g, '.') }}.{{ new Date().toLocaleTimeString('id-ID').replace(/:/g, '.') }}</span>
        <span>PE{{ form.trx_id || '000' }}</span>
      </div>
    </div>

    <div class="mt-6 flex items-center gap-2 text-zinc-400">
      <Printer :size="14" />
      <span class="text-[10px] font-black tracking-widest uppercase">Laporan Summary 58mm</span>
    </div>
  </div>
</div>

    </div>
  </div>
</template>

<style scoped>
.thermal-paper {
  width: 300px; /* Lebar visual standar untuk simulasi 58mm di UI */
  min-height: 450px;
  background: white;
  padding: 24px 16px;
  font-family: 'Courier New', Courier, monospace; /* Font mesin ketik agar otentik */
  color: #18181b;
}

/* Hilangkan arrow up/down pada input number agar form bersih */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}

/* Animasi sederhana saat data berubah */
.thermal-paper span {
  transition: all 0.2s ease;
}
</style>