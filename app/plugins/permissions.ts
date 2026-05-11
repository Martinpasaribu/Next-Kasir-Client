// Granular Permissions

export default defineNuxtPlugin((nuxtApp) => {
  const { hasPermission } = useAuth()

  nuxtApp.vueApp.directive('can', {
    mounted(el, binding) {
      const permission = binding.value
      if (!hasPermission(permission)) {
        // Hapus elemen jika tidak punya akses
        el.parentNode?.removeChild(el)
      }
    }
  })
})



// 4. Cara Penggunaan di Component/Page
// A. Membatasi Tombol (Directive)
// Sangat bersih, cukup tambahkan v-can.

// Cuplikan kode
// <button v-can="'show_product'" @click="addProduct">
//   Add New Product
// </button>

// <button v-if="hasRole('OWNER')" class="text-danger">
//   Hard Delete
// </button>
// B. Membatasi Halaman (Page Meta)
// Daftarkan di halaman .vue kamu.

// Cuplikan kode
// <script setup lang="ts">
// definePageMeta({
//   middleware: 'permission',
//   permission: 'show_report_profit_loss' // Hanya yang punya akses laporan laba rugi
// })
// </script>
// C. Membatasi Logika di Script
// Gunakan fungsi dari composable.

// TypeScript
// const { hasPermission } = useAuth()

// const handleExport = () => {
//   if (!hasPermission('show_report_transaction')) {
//     alert("Maaf, Anda tidak memiliki izin untuk ekspor data.")
//     return
//   }
//   // Jalankan fungsi ekspor...
// }
// 5. Bonus: Integrasi dengan Sidebar
// Agar sidebar kamu otomatis rapi sesuai akses user:

// Cuplikan kode
// <script setup lang="ts">
// const { hasPermission } = useAuth()

// const menuItems = [
//   { label: 'Inventory', icon: 'Package', perm: 'show_inventory', link: '/inventory' },
//   { label: 'Staff Management', icon: 'Users', perm: 'show_employee', link: '/staff' },
//   { label: 'Financial Report', icon: 'Dollar', perm: 'show_report_income', link: '/reports/income' },
// ]

// // Filter menu berdasarkan permission
// const allowedMenu = computed(() => 
//   menuItems.filter(item => hasPermission(item.perm))
// )
// </script>

// <template>
//   <nav>
//     <NuxtLink v-for="item in allowedMenu" :key="item.label" :to="item.link">
//       {{ item.label }}
//     </NuxtLink>
//   </nav>
// </template>

// <script setup lang="ts">
// definePageMeta({
//   // Middleware global otomatis jalan, kita tinggal kasih "instruksi" permission apa yang dibutuhkan
//   permission: 'show_report_income' 
// })
// </script>

// <template>
//   <div>Halaman Laporan Pendapatan</div>
// </template>