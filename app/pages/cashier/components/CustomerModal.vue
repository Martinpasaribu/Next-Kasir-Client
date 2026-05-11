<script setup lang="ts">
import { useCartStore } from '~/stores/cart';
import { LucideUserPlus, LucideSearch, LucideX, LucideUser, LucidePhone, LucideMapPin, LucideCheck } from 'lucide-vue-next';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(['close']);
const cartStore = useCartStore();

const isAddingNew = ref(false);
const searchQuery = ref('');
const customers = ref<any[]>([]);

// Form untuk customer baru
const newCustomer = ref({
  name: '',
  phone: '',
  address: ''
});

// Ambil data customer dari Dexie saat modal dibuka atau saat mengetik
const fetchCustomers = async () => {
  try {
    // Gunakan collection untuk performa lebih baik
    const collection = database_dexie.customers;
    
    if (searchQuery.value.trim().length > 0) {
      const q = searchQuery.value.toLowerCase();
      // Dexie filter bekerja pada array hasil toArray() jika field tidak di-index
      customers.value = await collection
        .filter(c => 
          c.name.toLowerCase().includes(q) || 
          c.phone.includes(q)
        )
        .toArray();
    } else {
      // Ambil 10 data terbaru
      customers.value = await collection.reverse().limit(10).toArray();
    }
    console.log("Customer fetched:", customers.value); // Debug log
  } catch (error) {
    console.error("Gagal mengambil customer:", error);
  }
};

// Tambahkan watch ini
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    fetchCustomers(); // Ambil data terbaru setiap kali modal terbuka
    searchQuery.value = ''; // Reset pencarian
  }
});


const selectCustomer = (c: any) => {
  cartStore.selectedCustomer = c;
  emit('close');
};

const saveNewCustomer = async () => {
  if (!newCustomer.value.name || !newCustomer.value.phone) return;
  
  const customerData = {
    name: newCustomer.value.name,
    phone: newCustomer.value.phone,
    address: newCustomer.value.address,
    createdAt: new Date().toISOString(),
    syncStatus: 'P' 
  };
  
  try {
    const generatedId = await database_dexie.customers.add(customerData);
    
    // Pastikan ID masuk ke objek agar UI Checkmark (LucideCheck) berfungsi
    const savedObject = { id: generatedId, ...customerData };
    
    cartStore.selectedCustomer = savedObject;
    
    // Refresh list agar customer baru muncul saat modal dibuka lagi
    await fetchCustomers();
    
    // Reset & Close
    newCustomer.value = { name: '', phone: '', address: '' };
    isAddingNew.value = false;
    emit('close');
  } catch (error) {
    console.error("Gagal simpan customer:", error);
  }
};


</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-nuxt-gray-950/60 backdrop-blur-sm" @click="emit('close')"></div>
      
      <div class="relative bg-white dark:bg-nuxt-gray-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-nuxt-gray-200 dark:border-nuxt-gray-800 flex flex-col max-h-[90vh]">
        
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
              <LucideUser :size="24" />
            </div>
            <h3 class="font-black uppercase tracking-tight text-xl">Customer</h3>
          </div>
          <button @click="isAddingNew = !isAddingNew" class="text-xs font-black uppercase text-blue-500 hover:underline">
            {{ isAddingNew ? 'Cari Data' : '+ Customer Baru' }}
          </button>
        </div>

        <div v-if="!isAddingNew" class="flex flex-col flex-1 overflow-hidden">
          <div class="relative mb-4">
            <LucideSearch class="absolute left-4 top-1/2 -translate-y-1/2 text-nuxt-gray-400" :size="18" />
            <input 
              v-model="searchQuery"
              placeholder="Cari nama atau no. telp..."
              class="w-full bg-nuxt-gray-50 dark:bg-nuxt-gray-800 p-4 pl-12 rounded-2xl outline-none border border-transparent focus:border-blue-500 transition-all text-sm font-bold"
            />
          </div>

          <div class="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            <div 
              v-for="c in customers" :key="c.id"
              @click="selectCustomer(c)"
              class="p-4 rounded-2xl border border-nuxt-gray-100 dark:border-nuxt-gray-800 hover:bg-blue-50 dark:hover:bg-blue-500/10 cursor-pointer transition-all flex justify-between items-center group"
            >
              <div>
                <p class="font-bold text-sm">{{ c.name }}</p>
                <p class="text-[11px] text-nuxt-gray-400">{{ c.phone }}</p>
              </div>
              <LucideCheck v-if="cartStore.selectedCustomer?.id === c.id" class="text-blue-500" :size="18" />
            </div>
            <div v-if="customers.length === 0" class="text-center py-8 opacity-30 text-xs font-bold">
              Customer tidak ditemukan
            </div>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase text-nuxt-gray-400 ml-2">Nama Lengkap</label>
            <input v-model="newCustomer.name" class="w-full bg-nuxt-gray-50 dark:bg-nuxt-gray-800 p-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 font-bold" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase text-nuxt-gray-400 ml-2">No. Telepon</label>
            <input v-model="newCustomer.phone" type="tel" class="w-full bg-nuxt-gray-50 dark:bg-nuxt-gray-800 p-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 font-bold" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase text-nuxt-gray-400 ml-2">Alamat (Opsional)</label>
            <textarea v-model="newCustomer.address" rows="2" class="w-full bg-nuxt-gray-50 dark:bg-nuxt-gray-800 p-4 rounded-2xl outline-none border border-transparent focus:border-blue-500 font-bold text-sm"></textarea>
          </div>
          <button @click="saveNewCustomer" class="w-full bg-blue-500 text-white font-black py-4 rounded-2xl shadow-lg hover:opacity-90 transition-all">
            SIMPAN & PILIH
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>