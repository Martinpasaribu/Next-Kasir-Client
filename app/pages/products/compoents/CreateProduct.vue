<script setup lang="ts">
import type { ICategory, MediaObject } from '~/types/Categories/categories'
import type { CreateProductForm } from '~/types/Product/create_form'
// Import composable
import { useCategoryOptions } from '~/composables/Category/useCategoryOptions';
import { UNIT_OPTIONS } from '~/components/constants';
import TextInput from '~/components/shared/InputComponents/TextInput.vue';
import NumberInput from '~/components/shared/InputComponents/NumberInput.vue';
import CheckboxInput from '~/components/shared/InputComponents/CheckboxInput.vue';
import ImageUpload from '~/components/shared/InputComponents/ImageUpload.vue';
import TextEditor from '~/components/shared/InputComponents/TextEditor.vue';
import { useMyNotification } from '~/stores/useMyNotification';


const props = defineProps<{ 
  show: boolean,
  category?: ICategory | null,
}>()

const emit = defineEmits(['close', 'success'])
const notify = useMyNotification();


// 1. Integrasi useCategoryOptions
const { 
  categoryOptions, 
  isLoadingCategories, 
  fetchCategoryOptions 
} = useCategoryOptions()

const isSubmitting = ref(false)

const form = ref<CreateProductForm>({
  name: '', 
  sku:'',
  description: '',
  sub_description: '',
  order: 0, 
  isActive: true, 
  isFree: true, 
  icon: null, 
  image_bg: null, 
  images: [],
  category_key: null, 
  unit: "pcs", 
  recommend: false,
  price_buy: 0, 
  price_sell: 0,
  stock: 0, 
  min_stock_alert: 0,

})

// 2. Sinkronisasi category_key jika props category berubah
watch(() => props.category, (newVal) => {
  if (newVal) form.value.category_key = newVal._id
}, { immediate: true })

// 3. Ambil data kategori saat mounted
onMounted(() => {
  fetchCategoryOptions()
})

const performUpload = async (file: File | File[] | null, endpoint: 'upload-single' | 'upload-multiple') => {
  if (!file) return null
  if (!Array.isArray(file) && (file as any).url && !(file instanceof File)) return file

  const formData = new FormData()
  if (Array.isArray(file)) {
    file.forEach(f => formData.append('files', f))
  } else {
    formData.append('file', file)
  }

  try {
    const res = await $fetch<any>(`/api/media/${endpoint}`, { method: 'POST', body: formData })
    if (res.success === false) {
       const msg = Array.isArray(res.message) ? res.message.join(', ') : res.message
       throw new Error(msg)
    }
    return res.data || res 
  } catch (err: any) {
    console.error(`Upload error pada ${endpoint}:`, err)
    throw err 
  }
}

const handleAdd = async () => {
  if (!form.value.name) return alert('Nama Produk wajib diisi')
  if (!form.value.category_key) return alert('Silahkan pilih kategori')
  
  isSubmitting.value = true
  const loadingId = notify.addToast('Sedang memproses membuat...', 'loading');


  try {
    const [uploadedIcon, uploadedBg] = await Promise.all([
      performUpload(form.value.icon, 'upload-single'),
      performUpload(form.value.image_bg, 'upload-single'),
    ])

    let uploadedGallery: MediaObject[] = []
    if (form.value.images?.length > 0) {
      uploadedGallery = await performUpload(form.value.images, 'upload-multiple')
    }

    const finalPayload = {
      ...form.value,
      price_buy: Number(form.value.price_buy) || 0,
      price_sell: Number(form.value.price_sell) || 0,
      order: Number(form.value.order) || 0,
      stock: Number(form.value.stock) || 0,
      min_stock_alert: Number(form.value.min_stock_alert) || 0,
      icon: uploadedIcon,
      image_bg: uploadedBg,
      images: uploadedGallery
    }

    const res = await $fetch<any>('/api/products', {
      method: 'POST',
      body: finalPayload
    })

    if (res.success) {
      emit('success')
      resetForm()
      emit('close')
      notify.addToast('Data Produk berhasil dibuat!', 'success');
  
    } else {
      const msg = res.data?.message || res.message || 'Permintaan berhasil namun content tidak tersedia'
      notify.addToast(msg, 'warning');
    }

  } catch (err: any) {
    const msg = err.data?.message || err.message || 'Terjadi kesalahan'
    notify.addToast(msg, 'error');
  } finally {
    isSubmitting.value = false
    notify.removeToast(loadingId);
  }
}

const resetForm = () => {
  form.value = {
    name: '', description: '', sub_description: '',
    order: 0, isActive: true, isFree: false, sku:'',
    icon: null, image_bg: null, images: [],
    category_key: props.category?._id || null, 
    unit: "pcs", recommend: false,
    price_buy: 0, price_sell: 0,
    stock: 0, min_stock_alert: 0,
  }
}


const labelClass = "block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1"
const inputClass = "w-full bg-white dark:bg-gray-700 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 text-sm transition-all duration-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none placeholder:text-slate-400 dark:text-nuxt-gray-200"

</script>

<template>
  <GenericModal 
    :show="show" 
    title="Tambah Produk Baru" 
    :id="form.name || 'Produk Baru'"
    @close="emit('close')" 
    @confirm="handleAdd" 
    :loading="isSubmitting"
    size="3xl"
  >
    <div class="max-h-[65vh] overflow-y-auto custom-scrollbar px-1 -mx-1">

      <div class="mb-8">
        <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4">Informasi Produk</h3>
        <div class="space-y-5">

          <TextInput 
            v-model="form.name"
            label="Nama Produk"
            placeholder="Contoh: Shampo"
          />

          <div>
            <label :class="labelClass">
              Kategori 
              <span v-if="isLoadingCategories" class="text-blue-500 text-[10px] animate-pulse">(Loading...)</span>
            </label>
            <select v-model="form.category_key" :class="inputClass" :disabled="isLoadingCategories">
              <option :value="null">Pilih Kategori</option>
              <option 
                v-for="cat in categoryOptions" 
                :key="cat._id" 
                :value="cat._id"
              >
                {{ cat.name }}
              </option>
            </select>
          </div>

          <TextInput 
            v-model="form.sub_description"
            label="Sub Deskripsi"
            is-textarea
            placeholder="Tuliskan sub-deskripsi produk..."
          />

          <TextEditor 
            v-model="form.description" 
            label="Deskripsi Detail Produk"
          />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumberInput 
              v-model="form.stock"
              label="Stock"
              :suffix="form.unit" 
              placeholder="0"
            />

            <NumberInput 
              v-model="form.price_sell"
              label="Harga Jual"
              prefix="Rp"
              placeholder="0"
            />

            <NumberInput 
              v-model="form.min_stock_alert"
              label="Min Stock Alert"
              suffix="Limit"
              placeholder="5"
            />

            <NumberInput 
              v-model="form.price_buy"
              label="Harga HPP (Modal)"
              prefix="Rp"
              placeholder="0"
            />
          </div>

        </div>
      </div>

      <div class="mb-4">
        <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4">Pengaturan & Akses</h3>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">

            <NumberInput 
              v-model="form.order"
              label="Urut Tampil"
              prefix="#"
              placeholder="0"
            />

            <OptionInput 
              v-model="form.unit"
              label="Satuan (Unit)"
              :options="UNIT_OPTIONS"
              placeholder="Pilih Satuan"
            />
          </div>
                      
            <div class="flex items-center justify-around bg-slate-50 dark:bg-nuxt-gray-800 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 transition-all">
                
                <CheckboxInput 
                  v-model="form.isActive" 
                  label="Status Aktif" 
                  type="switch"
                />

                <div class="w-[1px] h-10 bg-slate-200 dark:bg-zinc-700"></div>
                
                <CheckboxInput 
                v-model="form.recommend" 
                label="Rekomendasi" 
                type="switch"
                />

                <div class="w-[1px] h-10 bg-slate-200 dark:bg-zinc-700"></div>
                
                <CheckboxInput 
                  v-model="form.isFree" 
                  label="Gratis" 
                  type="switch"
                />

              </div>

        </div>
      </div>
            
      <div class="mb-8">
        <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4">Gambar Produk</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUpload v-model="form.icon" label="Foto Utama (1:1)" aspect-ratio="square" />
          <ImageUpload v-model="form.image_bg" label="Banner Produk (16:9)" aspect-ratio="video" />
        </div>
      </div>

      <div class="mt-8 pb-6">
        <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4">Galeri Gambar Pendukung</h3>
        <ImageUpload v-model="form.images" label="Upload Multiple Gambar" multiple />
      </div>
    </div>
  </GenericModal>
</template>