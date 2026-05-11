<script setup lang="ts">
import { Rocket } from 'lucide-vue-next'


definePageMeta({
  public: true // 👈 Ini yang akan dibaca middleware di atas
})

</script>

<template>
  <!-- <div class="min-h-screen bg-[#010409] flex flex-col items-center justify-center text-white">
    <div class="relative">
      <div class="h-20 w-20 border-[3px] border-sky-500/10 border-t-sky-500 rounded-full animate-spin"></div>
      <Rocket class="absolute inset-0 m-auto text-sky-400" :size="28" />
    </div>
    
    <div class="mt-8 text-center space-y-2">
      <h2 class="text-sm font-black uppercase tracking-[0.4em] text-white">
        Initializing<span class="text-sky-400">_Terminal</span>
      </h2>
      <p class="text-[10px] font-bold uppercase tracking-widest text-gray-600 animate-pulse">
        Establishing Secure Connection...
      </p>
    </div>
  </div> -->

  <div class="min-h-screen bg-[#010409] text-white">
    <nav class="p-6 flex justify-between items-center border-b border-[#30363d]">
      <h1 class="text-xl font-black italic uppercase tracking-tighter">
        NextKasir<span class="text-sky-400">_Pro</span>
      </h1>
      <a href="https://admin.nextkasir.pro" class="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-sky-400 transition-colors">
        Console_Admin
      </a>
    </nav>

    <main class="max-w-4xl mx-auto pt-32 px-6 text-center">
      <h2 class="text-6xl font-black italic tracking-tighter leading-none uppercase mb-6">
        The Next Generation <br/> 
        <span class="text-sky-400">Point of Sale.</span>
      </h2>
      <p class="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed mb-10">
        Multi-tenant architecture designed for high-performance retail and hospitality management. 
        Secure, scalable, and lightning fast.
      </p>
      <div class="flex justify-center gap-4">
        <button class="px-8 py-4 bg-white text-black font-black uppercase text-xs rounded-2xl hover:bg-sky-400 transition-all">
          Get Started
        </button>
        <button class="px-8 py-4 bg-[#0d1117] border border-[#30363d] text-white font-black uppercase text-xs rounded-2xl hover:border-sky-400 transition-all">
          Documentation
        </button>
      </div>
    </main>
  </div>
</template>