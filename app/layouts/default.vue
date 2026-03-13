<script setup lang="ts">
import Bucket from '~/main_component/Element/Bucket.vue';
import Sidebar from './sidebar.vue';
import FloatingMenu from '~/components/tools/FloatingMenu.vue';
import CalculatorModal from '~/components/modal/CalculatorModal.vue';
const isBucketOpen = ref(false) // State untuk kontrol Bucket di mobile
const isCalcOpen = ref(false);

</script>

<template>
  <div class="min-h-screen bg-nuxt-gray-50 dark:bg-nuxt-gray-950 text-nuxt-gray-900 dark:text-white flex flex-col md:flex-row overflow-hidden">
    
    <FloatingMenu @open-calculator="isCalcOpen = true" />

    <Sidebar @open-bucket="isBucketOpen = true" />

    <main class="flex-1 flex flex-col h-screen overflow-auto relative ">
      <slot />
    </main>
    

    <!-- Componenet Yang di tampilakan -->
    <CalculatorModal :is-open="isCalcOpen" @close="isCalcOpen = false" />
    <Bucket 
      :is-open="isBucketOpen" 
      @close="isBucketOpen = false" 
      @open="isBucketOpen = true" 
    />
  </div>
</template>