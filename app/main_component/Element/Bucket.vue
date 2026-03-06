

<script setup lang="ts">
import { useCartStore } from '~/stores/cart';
import CheckoutModal from './CheckoutModal.vue';
import PriceAdjustmentModal from './PriceAdjustmentModal.vue';
import CustomerModal from './CustomerModal.vue';

const cartStore = useCartStore()

// Logic sederhana untuk catatan (Jika belum ada di Pinia Store)
const isNoteModalOpen = ref(false)
const tempNote = ref(cartStore.customerNote || '')
const isCheckoutOpen = ref(false);
const isAdjustmentOpen = ref(false)
const isCustomerModalOpen = ref(false);

const emit = defineEmits(['close', 'success'])

const props = defineProps<{
  isOpen?: boolean
}>()

const openNoteModal = () => {
  isNoteModalOpen.value = true
}

const saveNote = () => {
  cartStore.customerNote = tempNote.value
  isNoteModalOpen.value = false
}

</script>


<template>
  
  <Transition name="fade">
    <div v-if="isOpen" 
         class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] xl:hidden" 
         @click="emit('close')"></div>
  </Transition>

  <aside 
      :class="[
        'bg-white dark:bg-nuxt-gray-900 border-l border-nuxt-gray-200 dark:border-nuxt-gray-800 flex flex-col transition-transform duration-500 ease-in-out',
        // Desktop: Tetap Sidebar
        'xl:relative xl:translate-x-0 xl:flex xl:w-96',
        // Mobile & Tablet: Menjadi Drawer/Slide-over
        'fixed right-0 top-0 h-full z-[100] w-[90%] sm:w-[400px]',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      ]"
    >
    <div class="p-6 border-b border-nuxt-gray-200 dark:border-nuxt-gray-800 flex justify-between items-center">
      <h2 class="font-black text-lg uppercase tracking-tight">Keranjang</h2>
      <div class="flex items-center gap-3">
        
        <button 
          @click="isCustomerModalOpen = true" 
          :class="cartStore.selectedCustomer ? 'text-blue-500' : 'text-nuxt-gray-400'"
          class="hover:text-blue-500 transition-colors relative group"
        >
          <LucideUserPlus v-if="!cartStore.selectedCustomer" :size="20" />
          <LucideUserCheck v-else :size="20" />
          
          <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-nuxt-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {{ cartStore.selectedCustomer ? cartStore.selectedCustomer.name : 'Pilih Customer' }}
          </span>
        </button>

        <button 
          @click="isAdjustmentOpen = true" 
          class="text-nuxt-gray-400 hover:text-orange-500 transition-colors group relative"
        >
          <LucideSettings2 :size="20" />
          <span v-if="cartStore.discount.nominal > 0 || cartStore.shippingFee > 0" class="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
        </button>
        
        <button 
          @click="openNoteModal" 
          class="text-nuxt-gray-400 hover:text-nuxt-green transition-colors relative group"
        >
          <LucideStickyNote :size="20" />
          <span v-if="cartStore.customerNote" class="absolute -top-1 -right-1 w-2 h-2 bg-nuxt-green rounded-full"></span>
          
          <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-nuxt-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Catatan Pesanan
          </span>
        </button>

        <button @click="cartStore.items = []" class="text-nuxt-gray-400 hover:text-red-500 transition-colors">
          <LucideTrash2 :size="20" />
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
      <div v-for="item in cartStore.items" :key="item._id" class="flex gap-4 items-center animate-slide-in">
        <div class="w-12 h-12 bg-nuxt-gray-100 dark:bg-nuxt-gray-800 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
          <img v-if="item.image" :src="item.image" class="w-full h-full object-cover" />
          <LucideCoffee v-else class="text-nuxt-green" :size="20" />
        </div>

        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-bold leading-none mb-1 truncate text-nuxt-gray-800 dark:text-white">
            {{ item.name }}
          </h4>
          <p class="text-[14px] text-nuxt-gray-400">
            <span class="text-nuxt-green">{{ item.quantity }}</span> x Rp {{ item.price_sell?.toLocaleString() }}  
          </p>
        </div>

        <div class="text-right">
          <p class="text-xs font-black text-nuxt-gray-900 dark:text-white">
            Rp {{ (item.price_sell * item.quantity).toLocaleString() }}
          </p>
          <div class="flex gap-2 mt-1 justify-end font-extrabold">
             <button 
              @click="cartStore.removeFromCart(item._id)"
              class="w-7 h-7 flex items-center justify-center bg-nuxt-gray-100 dark:bg-nuxt-gray-800 rounded text-[14px] hover:bg-red-100 hover:text-red-500 transition-colors"
             >-</button>
             <button 
              @click="cartStore.addToCart(item)"
              class="w-7 h-7 flex items-center justify-center bg-nuxt-gray-100 dark:bg-nuxt-gray-800 rounded text-[14px] hover:bg-nuxt-green hover:text-black transition-colors"
             >+</button>
          </div>
        </div>
      </div>
      <div v-if="cartStore.items.length === 0" class="h-full flex flex-col items-center justify-center text-center opacity-30">
        <LucideShoppingCart :size="48" class="mb-2" />
        <p class="text-xs font-bold">Belum ada item</p>
      </div>
    </div>

    <div class="p-6 mx-2 bg-nuxt-gray-50 dark:bg-nuxt-gray-950 border-t border-nuxt-gray-200 dark:border-nuxt-gray-800 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div class="flex flex-col space-y-1 mb-6">
          <div class="flex justify-between text-xs text-nuxt-gray-500">
            <span>Subtotal</span>
            <span class="font-bold">Rp {{ cartStore.sub_amount.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-xs text-nuxt-gray-500">
            <span>Pajak (10%)</span>
            <span class="font-bold">Rp {{ cartStore.tax_amount.toLocaleString() }}</span>
          </div>
          <div v-if="cartStore.shippingFee > 0" class="flex justify-between text-xs text-nuxt-gray-500">
            <span>Ongkos Kirim</span>
            <span class="font-bold">+ Rp {{ cartStore.shippingFee.toLocaleString() }}</span>
          </div>
          <div v-if="cartStore.downPaymentAmount > 0" class="flex justify-between text-xs text-blue-500 pt-1">
            <span>Uang Muka (DP)</span>
            <span class="font-bold">- Rp {{ cartStore.downPaymentAmount.toLocaleString() }}</span>
          </div>
          <div v-if="cartStore.discount.nominal > 0" class="flex justify-between text-xs text-red-500 italic">
            <span>Diskon Manual</span>
            <span class="font-bold">- Rp {{ cartStore.discount.nominal.toLocaleString() }}</span>
          </div>
          <div v-if="cartStore.downPaymentAmount > 0" class="flex justify-between text-sm font-black text-gray-500 pt-1 border-t border-dashed">
            <span class="text-gray-700  dark:text-white">Sisa Tagihan</span>
            <span class="text-orange-500 ">Rp {{ cartStore.remainingBill.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-xl font-black pt-2 text-nuxt-gray-900 dark:text-white border-t border-nuxt-gray-200 dark:border-nuxt-gray-800">
            <span>Total</span>
            <span class="text-nuxt-green">Rp {{ cartStore.total_amount.toLocaleString() }}</span>
          </div>
      </div>
      
      <button 
         @click="isCheckoutOpen = true" 
         :disabled="cartStore.items.length === 0"
         class="w-full bg-nuxt-green text-nuxt-gray-950 font-black py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
       >
         KONFIRMASI PEMBAYARAN
       </button>  

    </div>

    
  </aside>
  
  <div>
    <Transition name="fade">
      <div v-if="isNoteModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isNoteModalOpen = false"></div>
        
        <div class="relative bg-white dark:bg-nuxt-gray-900 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-zoom-in">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-nuxt-green/10 rounded-xl">
              <LucideStickyNote class="text-nuxt-green" :size="24" />
            </div>
            <h3 class="font-black uppercase tracking-tight">Catatan Customer</h3>
          </div>
  
          <textarea 
            v-model="tempNote"
            rows="4"
            placeholder="Contoh: Meja nomor 5, Gula dipisah, atau Tanpa Sedotan..."
            class="w-full p-4 bg-nuxt-gray-50 dark:bg-nuxt-gray-800 border border-nuxt-gray-200 dark:border-nuxt-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-nuxt-green transition-all text-sm"
          ></textarea>
  
          <div class="grid grid-cols-2 gap-3 mt-6">
            <button @click="isNoteModalOpen = false" class="py-3 font-bold text-nuxt-gray-400 hover:bg-nuxt-gray-100 dark:hover:bg-nuxt-gray-800 rounded-xl transition-colors">
              BATAL
            </button>
            <button @click="saveNote" class="py-3 bg-nuxt-green text-nuxt-gray-950 font-black rounded-xl hover:opacity-90 transition-opacity">
              SIMPAN NOTE
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>


  <CheckoutModal 
    :is-open="isCheckoutOpen" 
    @close="isCheckoutOpen = false" 
    @success="emit('success')"
  />

  <PriceAdjustmentModal
    :is-open="isAdjustmentOpen" 
    @close="isAdjustmentOpen = false" />

  <CustomerModal
    :is-open="isCustomerModalOpen" 
    @close="isCustomerModalOpen = false" />

  
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>