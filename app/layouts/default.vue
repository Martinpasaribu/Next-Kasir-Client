<script setup lang="ts">
import Bucket from '~/pages/cashier/components/Bucket.vue';
import Sidebar from './sidebar.vue';
import FloatingMenu from '~/components/tools/FloatingMenu.vue';
import CalculatorModal from '~/components/modal/CalculatorModal.vue';
const isBucketOpen = ref(false) // State untuk kontrol Bucket di mobile
const isCalcOpen = ref(false);
const isMobileOrTablet = ref(false);


const checkScreen = () => {
  // Jika lebar layar di bawah 1280px (Tailwind XL breakpoint)
  isMobileOrTablet.value = window.innerWidth < 1280
  
  // Jika layar kembali lebar, otomatis tutup bucket agar tidak bug saat resize balik ke kecil
  if (!isMobileOrTablet.value) {
    isBucketOpen.value = false
  }
}

onMounted(() => {
  checkScreen() // Cek saat pertama kali load
  window.addEventListener('resize', checkScreen)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreen)
})

</script>

<template>
  <div class="min-h-screen bg-nuxt-gray-50 dark:bg-nuxt-gray-950 text-nuxt-gray-900 dark:text-white flex flex-col md:flex-row overflow-hidden">
    
    <FloatingMenu @open-calculator="isCalcOpen = true" />

    <Sidebar @open-bucket="isBucketOpen = true" />

    <main class="flex-1 flex flex-col h-screen overflow-auto relative">
      <slot />
    </main>
    
    <CalculatorModal :is-open="isCalcOpen" @close="isCalcOpen = false" />


    <template v-if="isMobileOrTablet">
      <Bucket 
        :is-open="isBucketOpen" 
        @close="isBucketOpen = false" 
        @open="isBucketOpen = true" 
      />
    </template>
    
    </div>
</template>