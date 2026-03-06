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
    <div v-if="isOpen" class="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-nuxt-gray-950/40 backdrop-blur-md" @click="!isProcessing && emit('close')"></div>

      <div class="relative bg-white dark:bg-nuxt-gray-900 w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col md:flex-row h-full max-h-[600px]">
        
        <div class="w-full md:w-5/12 bg-nuxt-gray-50 dark:bg-nuxt-gray-950 p-8 flex flex-col">
          <button @click="emit('close')" class="md:hidden absolute top-4 right-4 p-2 rounded-full bg-nuxt-gray-200">
            <LucideX :size="18" />
          </button>

          <div class="mb-8">
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-nuxt-gray-400 mb-1">Total Tagihan</p>
            <h2 class="text-3xl font-black text-nuxt-green">Rp {{ cartStore.total_amount.toLocaleString() }}</h2>
          </div>

          <div class="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            <div v-for="item in cartStore.items" :key="item._id" class="flex justify-between items-center text-sm">
              <span class="text-nuxt-gray-500 truncate pr-4">{{ item.name }} x{{ item.quantity }}</span>
              <span class="font-bold whitespace-nowrap">Rp {{ (item.price_sell * item.quantity).toLocaleString() }}</span>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-nuxt-gray-200 dark:border-nuxt-gray-800">
             <div v-if="cartStore.customerNote" class="p-4 rounded-2xl bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 italic text-xs text-nuxt-gray-500">
                "{{ cartStore.customerNote }}"
             </div>
          </div>
        </div>

        <div class="flex-1 p-8 flex flex-col bg-white dark:bg-nuxt-gray-900">
          <h3 class="font-black text-xl uppercase mb-6 tracking-tight">Metode Pembayaran</h3>
          
          <div class="grid grid-cols-3 gap-3 mb-8">
            <button 
              v-for="method in paymentMethods" 
              :key="method.id"
              @click="selectedMethod = method.id"
              :class="[
                selectedMethod === method.id 
                ? 'ring-2 ring-nuxt-green border-transparent' 
                : 'border-nuxt-gray-200 dark:border-nuxt-gray-800'
              ]"
              class="flex flex-col items-center justify-center p-4 rounded-2xl border transition-all hover:bg-nuxt-gray-50 dark:hover:bg-nuxt-gray-800"
            >
              <component :is="method.icon" :class="method.color" class="mb-2" :size="24" />
              <span class="text-[10px] font-black uppercase">{{ method.name }}</span>
            </button>
          </div>

          <!-- Tipe Bayar Cash -->
          <div v-if="selectedMethod === 'cash'" class="space-y-4 flex-1">
            <div class="flex justify-between items-end">
              <label class="text-[10px] font-black uppercase text-nuxt-gray-400">Nominal Tunai</label>
              <button @click="setExactAmount" class="text-[10px] font-bold text-nuxt-green underline">UANG PAS</button>
            </div>
            
            <div class="relative">
              <input 
                v-model="amountPaid"
                type="number"
                ref="cashInput"
                class="w-full bg-nuxt-gray-100 dark:bg-nuxt-gray-800 text-2xl font-black p-4 rounded-2xl outline-none focus:ring-2 focus:ring-nuxt-green transition-all"
                placeholder="0"
              />
            </div>

            <div class="flex flex-wrap gap-2">
              <button 
                v-for="money in [10000, 20000, 30000, 50000, 100000]" 
                :key="money"
                @click="amountPaid = money"
                class="px-3 py-1.5 rounded-lg bg-nuxt-gray-100 dark:bg-nuxt-gray-800 text-[10px] font-bold hover:bg-nuxt-green/20"
              >
                +{{ money.toLocaleString() }}
              </button>
            </div>

            <div class="flex justify-between items-center p-4 rounded-2xl bg-nuxt-green/10 text-nuxt-green border border-nuxt-green/20">
              <span class="text-xs font-bold uppercase">Kembalian</span>
              <span class="text-xl font-black">Rp {{ change.toLocaleString() }}</span>
            </div>
          </div>

          <div class="mt-auto pt-6 flex gap-3">
            <button 
              @click="handlePayment"
              :disabled="isProcessing || (selectedMethod === 'cash' && amountPaid < cartStore.total_amount)"
              class="flex-1 bg-nuxt-green disabled:bg-nuxt-gray-200 disabled:text-nuxt-gray-400 text-nuxt-gray-950 font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 group transition-all"
            >
              <span v-if="isProcessing" class="animate-spin rounded-full h-4 w-4 border-2 border-nuxt-gray-950 border-t-transparent"></span>
              <template v-else>
                <span>SELESAIKAN ORDER</span>
                <LucideArrowRight class="group-hover:translate-x-1 transition-transform" :size="18" />
              </template>
            </button>
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-bounce-enter-active { animation: bounce-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-bounce-leave-active { animation: bounce-in 0.3s reverse; }
@keyframes bounce-in {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>