<script setup lang="ts">
import { useCartStore } from '~/stores/cart';
import { 
  LucideCheckCircle2, LucideWallet, LucideQrCode, 
  LucideBanknote, LucideX, LucideArrowRight 
} from 'lucide-vue-next';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close', 'success']);
const cartStore = useCartStore();

const paymentMethods = [
  { id: 'cash', name: 'Tunai', icon: LucideBanknote, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
  { id: 'qris', name: 'QRIS', icon: LucideQrCode, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  { id: 'transfer', name: 'Transfer', icon: LucideWallet, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
];

const selectedMethod = ref('cash');
const amountPaid = ref(0);
const isProcessing = ref(false);

const change = computed(() => {
  const res = amountPaid.value - cartStore.total_amount;
  return res > 0 ? res : 0;
});

const handlePayment = async () => {
  if (isProcessing.value) return;

  // Validasi khusus tunai
  if (selectedMethod.value === 'cash' && amountPaid.value < cartStore.total_amount) {
    alert('Nominal uang tunai kurang!');
    return;
  }

  isProcessing.value = true;

  try {
    // 1. Masukkan data pembayaran ke store sebelum checkout
    // Ini agar array 'payments' di backend tidak kosong []
    cartStore.payments = [{
      method: selectedMethod.value,
      price: selectedMethod.value === 'cash' ? amountPaid.value : cartStore.total_amount,
      reference_no: '', // Bisa diisi nomor referensi transfer/QRIS jika ada
    }];

    await cartStore.checkout();

    amountPaid.value = 0;
    emit('success');
    setTimeout(() => {
      emit('close');
    }, 500);

  } catch (error) {
    console.error("Payment failed:", error);
  } finally {
    isProcessing.value = false;
    
  }
};

// Penambahan: Auto-fill nominal pas jika tombol diklik (UX)
const setExactAmount = () => {
  amountPaid.value = cartStore.total_amount;
};

</script>
<template>
  <Transition name="modal-bounce">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4">
      <div class="absolute inset-0 bg-nuxt-gray-950/40 backdrop-blur-md" @click="!isProcessing && emit('close')"></div>

      <div class="relative bg-white dark:bg-nuxt-gray-900 w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col landscape:flex-row md:flex-row h-auto max-h-[90vh]">
        
        <div class="w-full landscape:w-5/12 md:w-5/12 bg-nuxt-gray-50 dark:bg-nuxt-gray-950 p-6 md:p-8 flex flex-col overflow-y-auto max-h-[40vh] landscape:max-h-[90vh]">
          <button @click="emit('close')" class="absolute top-4 right-4 p-2 rounded-full bg-nuxt-gray-200 z-10 md:hidden">
            <LucideX :size="18" />
          </button>

          <div class="mb-4">
            <p class="text-[9px] font-black uppercase tracking-[0.2em] text-nuxt-gray-400 mb-1">Total Tagihan</p>
            <h2 class="text-2xl font-black text-nuxt-green">Rp {{ cartStore.total_amount.toLocaleString() }}</h2>
          </div>

          <div class="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            <div v-for="item in cartStore.items" :key="item._id" class="flex justify-between items-center text-xs">
              <span class="text-nuxt-gray-500 truncate pr-4">{{ item.name }} x{{ item.quantity }}</span>
              <span class="font-bold whitespace-nowrap">Rp {{ (item.price_sell * item.quantity).toLocaleString() }}</span>
            </div>
          </div>

          <div v-if="cartStore.customerNote" class="mt-4 pt-4 border-t border-nuxt-gray-200 dark:border-nuxt-gray-800">
             <div class="p-3 rounded-2xl bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 italic text-[9px] text-nuxt-gray-500">
                "{{ cartStore.customerNote }}"
             </div>
          </div>
        </div>

        <div class="flex-1 p-6 md:p-8 flex flex-col bg-white dark:bg-nuxt-gray-900 overflow-y-auto max-h-[60vh] landscape:max-h-[90vh]">
          <h3 class="font-black text-lg uppercase mb-4 tracking-tight">Metode Pembayaran</h3>
          
          <div class="grid grid-cols-3 gap-2 mb-6">
            <button 
              v-for="method in paymentMethods" 
              :key="method.id"
              @click="selectedMethod = method.id"
              :class="[
                selectedMethod === method.id 
                ? 'ring-2 ring-nuxt-green border-transparent' 
                : 'border-nuxt-gray-200 dark:border-nuxt-gray-800'
              ]"
              class="flex flex-col items-center justify-center p-3 rounded-2xl border transition-all hover:bg-nuxt-gray-50 dark:hover:bg-nuxt-gray-800"
            >
              <component :is="method.icon" :class="method.color" class="mb-1" :size="20" />
              <span class="text-[8px] font-black uppercase">{{ method.name }}</span>
            </button>
          </div>

          <div v-if="selectedMethod === 'cash'" class="space-y-3">
            <div class="flex justify-between items-end">
              <label class="text-[8px] font-black uppercase text-nuxt-gray-400">Nominal Tunai</label>
              <button @click="setExactAmount" class="text-[8px] font-bold text-nuxt-green underline">UANG PAS</button>
            </div>
            
            <input 
              v-model="amountPaid"
              type="number"
              inputmode="decimal"
              class="w-full bg-nuxt-gray-100 dark:bg-nuxt-gray-800 text-xl font-black p-3 rounded-2xl outline-none focus:ring-2 focus:ring-nuxt-green transition-all"
              placeholder="0"
            />

            <div class="flex flex-wrap gap-1.5">
              <button 
                v-for="money in [10000, 20000, 50000, 100000]" 
                :key="money"
                @click="amountPaid = money"
                class="px-2 py-1 rounded-lg bg-nuxt-gray-100 dark:bg-nuxt-gray-800 text-[9px] font-bold hover:bg-nuxt-green/20"
              >
                +{{ (money/1000) }}k
              </button>
            </div>

            <div class="flex justify-between items-center p-3 rounded-2xl bg-nuxt-green/10 text-nuxt-green border border-nuxt-green/20">
              <span class="text-[9px] font-bold uppercase">Kembalian</span>
              <span class="text-lg font-black">Rp {{ change.toLocaleString() }}</span>
            </div>
          </div>

          <div class="mt-auto pt-6">
            <button 
              @click="handlePayment"
              :disabled="isProcessing || (selectedMethod === 'cash' && amountPaid < cartStore.total_amount)"
              class="w-full bg-nuxt-green disabled:bg-nuxt-gray-200 disabled:text-nuxt-gray-400 text-nuxt-gray-950 font-black py-3 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span v-if="isProcessing" class="animate-spin rounded-full h-4 w-4 border-2 border-nuxt-gray-950 border-t-transparent"></span>
              <template v-else>
                <span>SELESAIKAN</span>
                <LucideArrowRight :size="16" />
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.modal-bounce-enter-active { animation: bounce-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-bounce-leave-active { animation: bounce-in 0.3s reverse; }
@keyframes bounce-in {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>