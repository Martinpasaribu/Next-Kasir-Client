<script setup lang="ts">
import ToastContainer from './components/main/ToastContainer.vue';

</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <VitePwaManifest />
    <ToastContainer />
  </div>
</template>

<style>
/* Reset dasar agar layout penuh */
html, body, #__nuxt {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>