import { ref } from 'vue'
import { defineStore } from 'pinia'

// Definisikan tipe kategori yang tersedia untuk autocompletion
type LoadingCategory = 'default' | 'settings' | 'printer' | 'delete' | 'auth' | 'upload' | 'fetch'

export const useLoading = defineStore('loading', () => {
  const isActive = ref(false)

  // 1. Definisikan semua preset di sini
  const presets: Record<LoadingCategory, { icon: string; title: string; desc: string }> = {
    default: {
      icon: 'Loader2',
      title: 'Loading...',
      desc: 'Mohon tunggu sebentar'
    },
    settings: {
      icon: 'ShieldCheck',
      title: 'Saving Settings',
      desc: 'Sinkronisasi konfigurasi ke server...'
    },
    printer: {
      icon: 'Printer',
      title: 'Printing Struk',
      desc: 'Menghubungkan ke printer thermal...'
    },
    delete: {
      icon: 'Trash2',
      title: 'Deleting Data',
      desc: 'Menghapus data dari database...'
    },
    auth: {
      icon: 'Lock',
      title: 'Authenticating',
      desc: 'Memverifikasi identitas Anda...'
    },
    upload: {
      icon: 'CloudUpload',
      title: 'Uploading',
      desc: 'Sedang mengunggah berkas...'
    },
    fetch: {
        icon: 'Database', 
        title: 'Sinkronisasi Data...',
        desc: 'Sedang mengambil konfigurasi terbaru dari server, mohon tunggu.'
    }
  }

  // State untuk config yang sedang aktif
  const currentConfig = ref({ ...presets.default })

    // Versi Parameter Terbalik (Opsional jika dirasa lebih rapi)
    const showLoading = (category: LoadingCategory = 'default', title?: string) => {
        const selectedPreset = presets[category] || presets.default
        currentConfig.value = {
        ...selectedPreset,
        title: title ?? selectedPreset.title
        }
        isActive.value = true
    }



  const hideLoading = () => {
    isActive.value = false
  }

  return { isActive, currentConfig, showLoading, hideLoading }
})