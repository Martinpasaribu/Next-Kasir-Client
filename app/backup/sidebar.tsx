// <!-- eslint-disable @typescript-eslint/no-unused-vars -->
// <!-- eslint-disable @typescript-eslint/no-explicit-any -->


// <script setup lang="ts">
// import ThemeSwitcher from '~/components/tools/ThemeSwitcher.vue';
// import { useCartStore } from '~/stores/cart';
// import { ref, onMounted, onUnmounted } from 'vue';

// import { LogOut } from 'lucide-vue-next'
// const isDesktop = ref(false);
// const isLandscape = ref(false);
// type RoleName = 'OWNER' | 'MANAGER' | 'ASSISTANT' | 'CASHIER'
// type RequiredRole = RoleName | RoleName[]
// interface MenuItem {
//   label: string
//   icon?: any
//   to?: string
//   requiredRole?: RequiredRole
//   permission?: string
//   children?: MenuItem[]
// }

// const updateView = () => {
//   if (typeof window !== 'undefined') {
//     isDesktop.value = window.innerWidth >= 1024; // Sesuai 'lg'
//     isLandscape.value = window.innerWidth > window.innerHeight;
//   }
// };

// onMounted(() => {
//   updateView();
//   window.addEventListener('resize', updateView);
// });
// onUnmounted(() => window.removeEventListener('resize', updateView));

// const cartStore = useCartStore()
// const emit = defineEmits(['openBucket'])

// // Menggunakan prefix 'lucide:' untuk konsistensi
// const menuItems : MenuItem[] =  [
//   { icon: 'lucide:layout-dashboard', 
//     label: 'Kasir', 
//     to: '/cashier' 
//   },
//   { 
//     icon: 'lucide:package', 
//     label: 'Produk', 
//     to: '/products',
//     permission: 'show_product'  
//   },
//   { 
//     icon: 'lucide:bar-chart-3', 
//     label: 'Laporan', 
//     to: '/reports',
//     permission: 'show_report' 
//   },
//   { 
//     icon: 'lucide:user', 
//     label: 'Pelanggan', 
//     to: '/customers' 
//   },
//   { 
//     icon: 'lucide:contact', 
//     label: 'Shift', 
//     to: '/shift' 
//   },
//   { 
//     icon: 'lucide:settings', 
//     label: 'Setelan', 
//     to: '/settings' 
//   },
// ]

// /** ---------- State & composables ---------- **/
// // Tambahkan userRole dari useAuth
// const { user, userRole, hasPermission } = useAuth() 
// const isCollapsed = ref(true)
// const openDropdown = ref<string | null>(null)
// const route = useRoute()


// /** ---------- Access Checker ---------- **/
// const canAccess = (item: MenuItem): boolean => {

//   console.log(`Checking ${item.label}: Role is ${userRole.value}, Perm: ${item.permission} -> ${hasPermission(item.permission || '')}`);
//   // Gunakan userRole.value, bukan user.value.role
//   if (userRole.value === 'OWNER') return true

//   // 2. Role Check (Jika ada batasan role spesifik)
//   if (item.requiredRole) {
//     const roles = Array.isArray(item.requiredRole) ? item.requiredRole : [item.requiredRole]
//     if (!roles.includes(userRole.value as any)) return false
//   }

//   // 3. Permission Check
//   if (item.permission) {
//     return hasPermission(item.permission)
//   }

//   return true
// }


// /** ---------- Filtered menus (Reactive) ---------- **/
// const filteredMenus = computed<MenuItem[]>(() => {
//   return menuItems
//     .map((menu: MenuItem): MenuItem | null => {
//       // 1. Cek akses Parent terlebih dahulu
//       const hasParentAccess = canAccess(menu)
      
//       // 2. Filter anak-anaknya
//       const filteredChildren = menu.children 
//         ? menu.children.filter(child => canAccess(child)) 
//         : undefined
      
//       const hasVisibleChildren = !!(filteredChildren && filteredChildren.length > 0)

//       // --- PERBAIKAN LOGIKA DISINI ---
//       // Jika menu punya anak, dia HANYA tampil jika Parent-nya punya akses AND punya anak yang visible
//       if (menu.children) {
//         if (hasParentAccess && hasVisibleChildren) {
//           return { ...menu, children: filteredChildren } as MenuItem
//         }
//       } 
//       // Jika menu tidak punya anak (menu tunggal), cukup cek akses parent
//       else if (hasParentAccess) {
//         return { ...menu } as MenuItem
//       }
      
//       return null
//     })
//     .filter((item): item is MenuItem => item !== null)
// })

// const toggleExit = async () => {
//   const { logout } = useAuth()
//   await logout()
//   navigateTo('/auth/login?status=logout')
// }


// </script>

// <template>
//   <nav class="fixed bottom-0 left-0 w-full lg:relative lg:w-24 bg-white/80
//    dark:bg-nuxt-gray-900/80 backdrop-blur-xl border-t lg:border-t-0 lg:border-r
//     border-nuxt-gray-200 dark:border-nuxt-gray-800 flex lg:flex-col items-center
//      justify-between z-50 transition-all duration-300 h-13 md:h-10 lg:h-screen lg:py-8">
    
//      <!-- Bagian 1 Samping PC --> 
//     <div v-if="isDesktop" class="hidden lg:flex flex-col items-center gap-8 w-full">
//       <div class="w-12 h-12 bg-nuxt-green rounded-2xl flex items-center justify-center shadow-lg shadow-nuxt-green/20">
//         <Icon name="lucide:zap" size="20" class="text-nuxt-gray-950" />
//       </div>
      
//       <div class="flex flex-col gap-2 w-full px-3">
//         <NuxtLink 
//           v-for="item in filteredMenus" 
//           :key="item.label"
//           :to="item.to"
//           class="group flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 text-nuxt-gray-400 hover:bg-nuxt-gray-100 dark:hover:bg-nuxt-gray-800"
//           active-class="bg-nuxt-green text-nuxt-gray-950 shadow-md"
//         >
//           <Icon :name="item.icon" size="20" stroke-width="2.5" />
//           <span class="text-[9px] font-black uppercase mt-1.5">{{ item.label }}</span>
//         </NuxtLink>
//       </div>
//     </div>

//     <!-- Bagian 2 Bawah  Mobile Lenscape -->
//     <div v-else-if="isLandscape" class="hidden landscape:flex lg:hidden items-center justify-between w-full px-0 md:px-4 max-h-4] relative h-full">
      
//       <div class="flex items-center justify-around flex-1">
//         <NuxtLink v-for="item in filteredMenus.slice(0, 3)" :key="item.label" :to="item.to"
//           class="flex flex-col items-center justify-center gap-1 w-12 text-nuxt-gray-400"
//           active-class="text-nuxt-green"
//         >
//           <Icon :name="item.icon" size="15" stroke-width="2.5" />
//           <span class="text-[7px] font-black uppercase">{{ item.label }}</span>
//         </NuxtLink>
//       </div>

//       <div class="w-11"></div>

//       <div class="flex items-center justify-around flex-1">
//         <NuxtLink v-for="item in filteredMenus.slice(3, 6)" :key="item.label" :to="item.to"
//           class="flex flex-col items-center justify-center gap-1 w-12 text-nuxt-gray-400"
//           active-class="text-nuxt-green"
//         >
//           <Icon :name="item.icon" size="15" stroke-width="2.5" />
//           <span class="text-[7px] font-black uppercase">{{ item.label }}</span>
//         </NuxtLink>
//       </div>

//       <button 
//         @click="$emit('openBucket')"
//         class="absolute left-1/2 -translate-x-1/2 -top-7 w-15 h-15 bg-nuxt-green text-nuxt-gray-950 rounded-full shadow-2xl shadow-nuxt-green/40 flex items-center justify-center border-4 border-nuxt-gray-50 dark:border-nuxt-gray-950 active:scale-90 transition-transform z-10"
//       >
//         <div class="relative">
//           <Icon name="lucide:shopping-cart" size="28" stroke-width="2" class="mt-1 mr-0.5" />
//           <span v-if="cartStore.items.length > 0" 
//                 class="absolute -top-3 -right-3 bg-red-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-nuxt-green">
//             {{ cartStore.items.length }}
//           </span>
//         </div>
//       </button>
//     </div>



//         <!-- Bagian 3 Bawah  Mobile Potrait -->
//     <div v-else class="flex landscape:hidden lg:hidden items-center justify-between w-full px-0 md:px-4 relative h-full">
      
//       <div class="flex items-center justify-around flex-1">
//         <NuxtLink v-for="item in menuItems.slice(0, 2)" :key="item.label" :to="item.to"
//           class="flex flex-col items-center justify-center gap-1 w-12 text-nuxt-gray-400"
//           active-class="text-nuxt-green"
//         >
//           <Icon :name="item.icon" size="20" stroke-width="2.5" />
//           <!-- <span class="text-[8px] font-black uppercase">{{ item.label }}</span> -->
//         </NuxtLink>
//       </div>

//       <div class="w-11"></div>

//       <div class="flex items-center justify-around flex-1">
//         <NuxtLink v-for="item in menuItems.slice(3, 5)" :key="item.label" :to="item.to"
//           class="flex flex-col items-center justify-center gap-1 w-12 text-nuxt-gray-400"
//           active-class="text-nuxt-green"
//         >
//           <Icon :name="item.icon" size="20" stroke-width="2.5" />
//           <!-- <span class="text-[8px] font-black uppercase">{{ item.label }}</span> -->
//         </NuxtLink>
//       </div>

//       <button 
//         @click="$emit('openBucket')"
//         class="absolute left-1/2 -translate-x-1/2 -top-7 w-15 h-15 bg-nuxt-green text-nuxt-gray-950 rounded-full shadow-2xl shadow-nuxt-green/40 flex items-center justify-center border-4 border-nuxt-gray-50 dark:border-nuxt-gray-950 active:scale-90 transition-transform z-10"
//       >
//         <div class="relative">
//           <Icon name="lucide:shopping-cart" size="28" stroke-width="2" class="mt-1 mr-0.5" />
//           <span v-if="cartStore.items.length > 0" 
//                 class="absolute -top-3 -right-3 bg-red-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-nuxt-green">
//             {{ cartStore.items.length }}
//           </span>
//         </div>
//       </button>
//     </div>


//     <div class="hidden flex-col items-center gap-6 w-full pb-4">
//       <ThemeSwitcher />
//       <div class="w-10 h-10 rounded-full border-2 border-nuxt-gray-200 dark:border-nuxt-gray-800 p-0.5 overflow-hidden">
//         <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" class="w-full h-full" />
//       </div>
//     </div>

        
//     <div class="hidden lg:flex flex-col p-4 border-t border-gray-100">
//       <button 
//       class="flex items-center gap-4 p-3 text-sm rounded-xl w-full transition bg-nuxt-gray-800 hover:bg-gray-100 text-gray-500 font-medium"
//       :class="isCollapsed ? 'justify-center p-3.5':''"
//       @click="toggleExit" 
//       >
//         <LogOut class="h-5 w-5 flex-shrink-0 " />
//         <span v-if="!isCollapsed">Keluar</span>
//       </button>
//     </div>

//   </nav>

  
// </template>

// <style scoped>
// /* Menghapus outline agar lebih rapi */
// button:focus { outline: none; }
// </style>