<script setup lang="ts">
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  ArrowUpRight, 
  LogOut,
  Bell
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth' // Import Pinia Store

// Middleware auth.global.ts akan menjamin data authStore.user sudah terisi sebelum page dirender
definePageMeta({
  layout: 'default' 
})

const authStore = useAuthStore()
const tenantId = useCookie('tenant_id') // Tetap gunakan cookie untuk visual Node ID

const stats = reactive([
  { name: 'Total Revenue', value: 'Rp 12.500.000', icon: TrendingUp, color: 'text-emerald-400' },
  { name: 'Active Orders', value: '24', icon: ShoppingCart, color: 'text-sky-400' },
  { name: 'Total Products', value: '142', icon: Package, color: 'text-purple-400' },
  { name: 'Customers', value: '89', icon: Users, color: 'text-orange-400' },
])

const handleLogout = async () => {
  // Gunakan fungsi logout terpusat dari Pinia
  // Ini akan otomatis membersihkan RAM, Cookies, dan me-redirect ke login
  await authStore.logout()
}
</script>

<template>
  <div class="min-h-screen bg-[#010409] text-gray-300 font-sans">
    <nav class="border-b border-[#30363d] bg-[#0d1117]/80 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <h1 class="text-lg font-black italic tracking-tighter uppercase text-white">
              NextKasir<span class="text-sky-400">_Pro</span>
            </h1>
            <span class="px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/20 text-[10px] font-bold text-sky-400 uppercase tracking-widest">
              Node: {{ tenantId || 'UNKNOWN' }}
            </span>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="hidden md:block text-right mr-2">
              <p class="text-[10px] font-black uppercase text-sky-400 leading-none">
                {{ authStore.user?.role || 'User' }}
              </p>
              <p class="text-xs font-medium text-white">{{ authStore.user?.full_name || 'Personnel' }}</p>
            </div>

            <button class="p-2 hover:bg-[#30363d] rounded-full transition-colors relative">
              <Bell :size="20" />
              <span class="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0d1117]"></span>
            </button>
            
            <button @click="handleLogout" class="flex items-center gap-2 px-3 py-1.5 bg-[#161b22] hover:bg-rose-500/10 border border-[#30363d] hover:border-rose-500/50 rounded-xl text-xs font-bold transition-all text-rose-400">
              <LogOut :size="14" /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-white tracking-tight">System Overview</h2>
        <p class="text-sm text-gray-500">
          Welcome back, <span class="text-sky-400 font-medium">{{ authStore.user?.full_name || 'Admin' }}</span>. 
          Operational status is stable.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div v-for="item in stats" :key="item.name" 
          class="bg-[#0d1117] border border-[#30363d] p-6 rounded-[2rem] hover:border-sky-500/30 transition-all group">
          <div class="flex items-start justify-between">
            <div :class="[item.color, 'p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform']">
              <component :is="item.icon" :size="24" />
            </div>
            <ArrowUpRight :size="16" class="text-gray-600 group-hover:text-sky-400 transition-colors" />
          </div>
          <div class="mt-4">
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{{ item.name }}</p>
            <h3 class="text-xl font-bold text-white mt-1">{{ item.value }}</h3>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-[#0d1117] border border-[#30363d] rounded-[2.5rem] p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-white flex items-center gap-2">
              <LayoutDashboard :size="18" class="text-sky-400" /> Sales Performance
            </h3>
          </div>
          <div class="h-[300px] flex items-center justify-center border border-dashed border-[#30363d] rounded-3xl text-gray-600 italic text-sm">
            Waiting for data stream...
          </div>
        </div>

        <div class="bg-[#0d1117] border border-[#30363d] rounded-[2.5rem] p-8">
          <h3 class="font-bold text-white mb-6">Quick Actions</h3>
          <div class="space-y-3">
            <button v-if="authStore.hasPermission('show_product')" 
              class="w-full flex items-center justify-between p-4 bg-[#161b22] hover:bg-sky-500 hover:text-black rounded-2xl transition-all font-bold text-xs group">
              Add New Product <Package :size="16" />
            </button>
            <button v-if="authStore.userRole === 'OWNER'" 
              class="w-full flex items-center justify-between p-4 bg-[#161b22] hover:bg-sky-500 hover:text-black rounded-2xl transition-all font-bold text-xs group">
              Manage Staff <Users :size="16" />
            </button>
            <button v-if="authStore.hasPermission('show_report')" 
              class="w-full flex items-center justify-between p-4 bg-[#161b22] hover:bg-sky-500 hover:text-black rounded-2xl transition-all font-bold text-xs group">
              Generate Report <TrendingUp :size="16" />
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>