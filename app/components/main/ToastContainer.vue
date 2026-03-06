<script setup lang="ts">
import { storeToRefs } from 'pinia';
import ToastItem from './ToastItem.vue';
import { useMyNotification } from '~/stores/useMyNotification';

// Gunakan nama baru yang sudah kita buat
const notificationStore = useMyNotification();
const { toasts } = storeToRefs(notificationStore);

</script>

<template>
  <Teleport to="body">
    <div class="fixed z-[9999] flex flex-col gap-3 pointer-events-none w-full p-4 
            /* HP (Layar < sm): Atas Kanan */
            top-0 right-0 items-end
            /* Desktop (Layar >= sm): Bawah Kanan */
            sm:top-auto sm:bottom-6 sm:right-6 
            /* Ukuran Lebar */
            max-w-[300px] sm:max-w-[400px]">
      <TransitionGroup name="toast">
        <div 
          v-for="item in notificationStore.toasts" 
          :key="item.id"
          class="pointer-events-auto"
        >
          <ToastItem 
            v-bind="item"
            @remove="notificationStore.removeToast"
          />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
/* 1. Efek Muncul (Enter) */
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

/* 2. Efek Keluar (Leave) */
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

/* 3. Durasi & Smoothness */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* 4. Efek Push (Move) - Penting agar toast lain bergeser halus */
.toast-move {
  transition: transform 0.4s ease;
}

/* Memastikan elemen yang keluar tidak merusak layout saat transisi move */
.toast-leave-active {
  position: absolute;
  width: 100%;
}
</style>