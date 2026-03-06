<script setup lang="ts">
import { useCartStore } from '~/stores/cart';
import { LucideSettings2, LucidePercent, LucideTruck, LucideWallet, LucideX, LucideBanknote } from 'lucide-vue-next';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close']);
const cartStore = useCartStore();

// State Lokal
const form = ref({
  discountType: cartStore.discount.type,
  discountNominal: cartStore.discount.nominal,
  downPayment: cartStore.downPaymentAmount,
  shippingFee: cartStore.shippingFee
});

const applyAdjustments = () => {
  cartStore.discount = {
    type: form.value.discountType,
    nominal: form.value.discountNominal
  };
  cartStore.downPaymentAmount = form.value.downPayment;
  cartStore.shippingFee = form.value.shippingFee;
  emit('close');
};
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-nuxt-gray-950/60 backdrop-blur-sm" @click="emit('close')"></div>
      
      <div class="relative bg-white dark:bg-nuxt-gray-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-nuxt-gray-200 dark:border-nuxt-gray-800">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-3">
            <div class="p-3 bg-nuxt-green/10 rounded-2xl text-nuxt-green">
              <LucideSettings2 :size="24" />
            </div>
            <h3 class="font-black uppercase tracking-tight text-xl">Penyesuaian Transaksi</h3>
          </div>
        </div>

        <div class="space-y-6">
          <div class="p-5 rounded-3xl bg-nuxt-gray-50 dark:bg-nuxt-gray-800/50 border border-nuxt-gray-100 dark:border-nuxt-gray-800">
            <label class="flex items-center gap-2 text-[10px] font-black uppercase text-nuxt-gray-400 mb-4 ml-1">
              <LucidePercent :size="12" /> Konfigurasi Diskon
            </label>
            
            <div class="flex gap-2 mb-4 p-1 bg-white dark:bg-nuxt-gray-950 rounded-xl border border-nuxt-gray-200 dark:border-nuxt-gray-800">
              <button 
                @click="form.discountType = 'fixed'"
                :class="form.discountType === 'fixed' ? 'bg-nuxt-green text-nuxt-gray-950' : 'text-nuxt-gray-400'"
                class="flex-1 py-2 rounded-lg font-bold text-xs transition-all"
              >Rp (Fixed)</button>
              <button 
                @click="form.discountType = 'percentage'"
                :class="form.discountType === 'percentage' ? 'bg-nuxt-green text-nuxt-gray-950' : 'text-nuxt-gray-400'"
                class="flex-1 py-2 rounded-lg font-bold text-xs transition-all"
              >% (Percent)</button>
            </div>

            <input 
              v-model="form.discountNominal" type="number"
              class="w-full bg-white dark:bg-nuxt-gray-800 p-4 rounded-2xl border border-nuxt-gray-200 dark:border-nuxt-gray-700 font-bold outline-none focus:ring-2 focus:ring-nuxt-green transition-all"
              :placeholder="form.discountType === 'fixed' ? 'Nominal Rp' : 'Persentase %'"
            />
          </div>

          <div class="grid grid-cols-1 gap-4">
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-[10px] font-black uppercase text-nuxt-gray-400 ml-2">
                <LucideBanknote :size="12" /> Uang Muka (DP)
              </label>
              <input 
                v-model="form.downPayment" type="number"
                class="w-full bg-nuxt-gray-50 dark:bg-nuxt-gray-800 p-4 rounded-2xl border border-nuxt-gray-100 dark:border-nuxt-gray-700 font-bold outline-none focus:ring-2 focus:ring-nuxt-green"
              />
            </div>

            <div class="space-y-2 text-center mt-1">

              <label class="w-full text-center ext-[15px] font-black uppercase text-nuxt-gray-400 ">
                 Tambahan
              </label>

              <label class="flex items-center gap-2 text-[10px] font-black uppercase text-nuxt-gray-400 ml-2">
                <LucideTruck :size="12" /> Ongkos Kirim
              </label>
              <input 
                v-model="form.shippingFee" type="number"
                class="w-full bg-nuxt-gray-50 dark:bg-nuxt-gray-800 p-4 rounded-2xl border border-nuxt-gray-100 dark:border-nuxt-gray-700 font-bold outline-none focus:ring-2 focus:ring-nuxt-green"
              />
            </div>
          </div>
        </div>

        <button 
          @click="applyAdjustments"
          class="w-full mt-8 bg-nuxt-gray-950 dark:bg-nuxt-green text-white dark:text-nuxt-gray-950 font-black py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
        >
          SIMPAN PENYESUAIAN
        </button>
      </div>
    </div>
  </Transition>
</template>