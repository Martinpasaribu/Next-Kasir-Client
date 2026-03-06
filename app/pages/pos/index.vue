<template>
  <div class="flex flex-1 overflow-hidden h-full">
    
    <section class="flex-1 flex flex-col min-w-0 bg-transparent">
      <header class="p-4 md:p-6 bg-nuxt-gray-50/80 dark:bg-nuxt-gray-950/80 backdrop-blur-md sticky top-0 z-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 class="text-xl font-black tracking-tight">KASIR PRO</h1>
          <div class="relative w-full md:w-72">
            <input 
              type="text" 
              placeholder="Cari produk atau scan..." 
              class="w-full bg-white dark:bg-nuxt-gray-900 border border-nuxt-gray-200 dark:border-nuxt-gray-800 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-nuxt-green/50 transition-all text-sm"
            />
          </div>
        </div>
        
        <div class="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
          <button v-for="cat in ['Semua', 'Makanan', 'Minuman', 'Snack']" :key="cat"
            class="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border border-nuxt-gray-200 dark:border-nuxt-gray-800 hover:bg-white dark:hover:bg-nuxt-gray-800"
            :class="cat === 'Semua' ? 'bg-nuxt-green text-nuxt-gray-950 border-nuxt-green' : 'text-nuxt-gray-500'"
          >
            {{ cat }}
          </button>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-4 md:p-6 pt-0">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          <div v-for="i in 12" :key="i" 
            class="group bg-white dark:bg-nuxt-gray-900 p-3 rounded-2xl border border-nuxt-gray-200 dark:border-nuxt-gray-800 hover:border-nuxt-green transition-all cursor-pointer active:scale-95 shadow-sm hover:shadow-md"
          >
            <div class="aspect-square bg-nuxt-gray-100 dark:bg-nuxt-gray-800 rounded-xl mb-3 overflow-hidden">
               <div class="w-full h-full flex items-center justify-center text-nuxt-gray-300">
                 <Icon name="ph:image-square-duotone" size="32" />
               </div>
            </div>
            <h4 class="font-bold text-sm leading-tight mb-1 line-clamp-2">Cappuccino Hot Grande</h4>
            <p class="text-nuxt-green font-black text-sm">Rp 25.000</p>
          </div>
        </div>
      </div>
    </section>

    <aside class="hidden lg:flex w-80 xl:w-96 bg-white dark:bg-nuxt-gray-900 border-l border-nuxt-gray-200 dark:border-nuxt-gray-800 flex-col">
      <div class="p-6 border-b border-nuxt-gray-100 dark:border-nuxt-gray-800 flex justify-between items-center">
        <h2 class="font-black text-lg">Keranjang</h2>
        <span class="bg-nuxt-gray-100 dark:bg-nuxt-gray-800 px-2 py-1 rounded-md text-[10px] font-bold">3 ITEMS</span>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <div v-for="n in 3" :key="n" class="flex gap-3">
          <div class="w-12 h-12 bg-nuxt-gray-100 dark:bg-nuxt-gray-800 rounded-lg flex-shrink-0"></div>
          <div class="flex-1">
            <h5 class="text-xs font-bold leading-none mb-1">Cappuccino Hot</h5>
            <p class="text-[10px] text-nuxt-gray-400">Rp 25.000 x 1</p>
          </div>
          <div class="font-bold text-xs text-right">Rp 25.000</div>
        </div>
      </div>

      <div class="p-6 bg-nuxt-gray-50 dark:bg-nuxt-gray-900/50 space-y-3">
        <div class="flex justify-between text-sm">
          <span class="text-nuxt-gray-500">Subtotal</span>
          <span class="font-bold">Rp 75.000</span>
        </div>
        <div class="flex justify-between text-lg font-black">
          <span>Total</span>
          <span class="text-nuxt-green">Rp 75.000</span>
        </div>
        <button class="w-full bg-nuxt-green text-nuxt-gray-950 font-black py-4 rounded-2xl shadow-lg shadow-nuxt-green/20 hover:scale-[1.02] active:scale-95 transition-all">
          KONFIRMASI BAYAR
        </button>
      </div>
    </aside>

    <button class="lg:hidden fixed bottom-20 right-6 bg-nuxt-green text-nuxt-gray-950 p-4 rounded-full shadow-2xl flex items-center gap-3 font-bold animate-bounce">
      <Icon name="ph:shopping-cart-fill" size="24" />
      <span>3 Item</span>
    </button>
  </div>
</template>