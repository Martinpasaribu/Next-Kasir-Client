import http from '@/utils/http' // Instance Axios Anda

interface DashboardStats {
  stats: {
    products: number;
    transactions: number;
    materials: number;
    revenue: number;
    categories: number;
  };
  recentSales: any[];
}

export const useDashboard = () => {
  const { $api } = useNuxtApp()
  const { selectedOutletId } = useOutlet()

  // --- STATE UNTUK AXIOS (Manual) ---
  const overview = ref<DashboardStats>({
    stats: { products: 0, transactions: 0, materials: 0, revenue: 0, categories:0 },
    recentSales: []
  })
  const pendingAxios = ref(false)

  // --- STATE UNTUK NUXT $API (Auto/AsyncData) ---
  // Kita gunakan useAsyncData agar Nuxt 4 mengelola siklusnya
  const { 
    data: overviewNuxt, 
    pending: pendingNuxt, 
    refresh: refreshNuxt 
  } = useAsyncData<DashboardStats>(
    `dashboard-nuxt-${selectedOutletId.value}`,
    () => $api('/merchant-overview/stats'),
    {
      watch: [selectedOutletId],
      lazy: true,
      default: () => ({
        stats: { products: 0, transactions: 0, materials: 0, revenue: 0, categories: 0 },
        recentSales: []
      })
    }
  )

  // --- FUNGSI FETCH AXIOS ---
  const refreshAxios = async () => {
    if (!selectedOutletId.value) return
    pendingAxios.value = true
    try {
      const response = await http.get<DashboardStats>('/merchant-overview/stats')
      overview.value = response.data
    } catch (err) {
      console.error('Axios Fetch Error:', err)
    } finally {
      pendingAxios.value = false
    }
  }

  // --- TRIGGER TEST ---
  const refreshAll = () => {
    // refreshAxios() // Jalankan Axios
    refreshNuxt()  // Jalankan Nuxt $api
  }

  // Monitor perubahan outlet
  watch(selectedOutletId, () => {
    refreshAxios()
  })

  onMounted(() => {
    refreshAxios()
  })

  // --- FORMATTER (Gunakan data dari Nuxt sebagai default UI) ---
  const statsSummary = computed(() => {
    // Pilih salah satu untuk ditampilkan di UI (misal: overviewNuxt)
    const source = overviewNuxt.value
    
    return [
      { 
        name: 'Total Revenue', 
        value: source.stats.revenue, 
        formatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(source.stats.revenue),
        label: 'Pendapatan',
        color: 'text-emerald-400'
      },
      { 
        name: 'Active Orders', 
        value: source.stats.transactions, 
        label: 'Transaksi',
        color: 'text-sky-400'
      },
      { 
        name: 'Total Products', 
        value: source.stats.products, 
        label: 'Produk',
        color: 'text-purple-400'
      },
      { 
        name: 'Raw Materials', 
        value: source.stats.materials, 
        label: 'Bahan Baku',
        color: 'text-orange-400'
      },
      { 
        name: 'Total Categories', 
        value: source.stats.categories, 
        label: 'Kategori',
        color: 'text-rose-400' // Warna baru untuk membedakan
      },
    ]
  })

  return {
    overview,       // Hasil Axios
    overviewNuxt,   // Hasil Nuxt $api
    pending: pendingNuxt,
    pendingAxios,
    statsSummary,
    recentSales: computed(() => overviewNuxt.value.recentSales),
    refreshStats: refreshAll
  }
}