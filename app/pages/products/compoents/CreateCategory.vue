<script setup lang="ts">
import type { MediaObject } from '~/types/Categories/categories'
import type { CreateCategoryForm } from '~/types/Categories/create_from';
import TextInput from '~/components/shared/InputComponents/TextInput.vue';
import NumberInput from '~/components/shared/InputComponents/NumberInput.vue';
import CheckboxInput from '~/components/shared/InputComponents/CheckboxInput.vue';
import ImageUpload from '~/components/shared/InputComponents/ImageUpload.vue';
import { useMyNotification } from '~/stores/useMyNotification';
import IconSelect from '~/components/shared/InputComponents/IconSelect.vue';


const props = defineProps<{ 
  show: boolean,
 }>()

const emit = defineEmits(['close', 'success'])
const isSubmitting = ref(false)
const notify = useMyNotification();


const form = ref<CreateCategoryForm>({
  name: '', description: '', sub_description: '',
  order: 0, isActive: true, isFree: false , slug:'',
  icon: null, image_bg: null, images: [],
  recommend: false, ref_code:''
})


// Logika upload yang sudah dipisah dan dioptimasi
const performUpload = async (file: File | File[] | null, endpoint: 'upload-single' | 'upload-multiple') => {
  if (!file) return null
  // Jika file sudah berupa object media dari database (punya URL), kembalikan langsung
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
  if (!form.value.name) return alert('Nama Bab wajib diisi')
  
  isSubmitting.value = true
  const loadingId = notify.addToast('Sedang memproses membuat...', 'loading');


  try {
    // 1. Upload semua asset secara paralel (Menggunakan picker masing-masing)
    const [uploadedIcon, uploadedBg] = await Promise.all([
      performUpload(form.value.icon, 'upload-single'),
      performUpload(form.value.image_bg, 'upload-single'),
    //   performUpload(form.value.document, 'upload-single'),
    //   performUpload(form.value.video_url, 'upload-single')
    ])

    let uploadedGallery: MediaObject[] = []
    if (form.value.images?.length > 0) {
      uploadedGallery = await performUpload(form.value.images, 'upload-multiple')
    }

    // 2. Susun Payload dengan sanitasi angka agar tidak menjadi string kosong
    const finalPayload = {
      ...form.value,
      order: Number(form.value.order) || 0,
      icon: uploadedIcon,
      image_bg: uploadedBg,
      images: uploadedGallery
      // document: uploadedDoc,
      // video_url: uploadedVid,
    }

    // 3. Kirim ke API API Product
    const res = await $fetch<any>('/api/categories', {
      method: 'POST',
      body: finalPayload
    })

    if (res.success) {
      emit('success')
      resetForm()
      emit('close')
      notify.addToast('Data Category berhasil dibuat!', 'success');
  
    } else {
      const msg = res.data?.message || res.message || 'Permintaan berhasil namun content tidak tersedia'
      notify.addToast(msg, 'warning');
    }

  } catch (err: any) {
    const msg = err.data?.message || err.message || 'Terjadi kesalahan'
    notify.addToast(msg, 'error');
  } finally {
    notify.removeToast(loadingId);
    isSubmitting.value = false

  }
}


const resetForm = () => {
  form.value = {
    name: '', description: '', sub_description: '',
    order: 0, isActive: true, recommend: false, slug:'',
    icon: null, image_bg: null, images: [],
    isFree: true, ref_code: ''
  }
}

const labelClass = "block text-[13px] font-semibold text-slate-700 dark:text-white mb-1.5 ml-0.5 tracking-tight"
const inputClass = "w-full bg-white dark:bg-black-2 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 text-sm transition-all duration-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none placeholder:text-slate-400 dark:text-white-1"
</script>

<template>
  <GenericModal 
    :show="show" 
    title="Tambah Kategori Baru" 
    :id="`Category`"
    @close="emit('close')" 
    @confirm="handleAdd" 
    :loading="isSubmitting"
    size="3xl"
  >
    <div class="max-h-[65vh] overflow-y-auto custom-scrollbar px-1 -mx-1">

      <div class="mb-8">
        <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Informasi Produk</h3>

          <IconSelect 
            v-model="form.ref_code"
            label="Icon Kategori"
            placeholder="Pilih Ikon untuk Minuman, Makanan, dll."
          />

          <TextInput 
            v-model="form.name"
            label="Nama Kategori"
            placeholder="Contoh: Minuman"
          />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">

            <TextInput 
              v-model="form.sub_description"
              label="Sub Deskripsi"
              is-textarea
              placeholder="Tuliskan sub-deskripsi kateogori..."
            />

            <TextInput 
              v-model="form.description"
              label="Deskripsi"
              is-textarea
              placeholder="Tuliskan Deskripsi kateogori..."
            />


          </div>

      </div>

      <div class="mb-4">
        <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Pengaturan & Akses</h3>
        <div :class="labelClass">


          <NumberInput 
            v-model="form.order"
            label="Urut Tampil"
            prefix="#"
            placeholder="0"
          />
                                
            <div class="flex items-center justify-around bg-slate-50 dark:bg-zinc-800/50 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6 transition-all mt-4">
                
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
        <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Gambar</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUpload v-model="form.icon" label="Icon" aspect-ratio="square" />
          <ImageUpload v-model="form.image_bg" label="Background" aspect-ratio="video" />
        </div>
      </div>

      <div class="mt-8">
        <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Galeri Gambar Pendukung</h3>
        <ImageUpload label="" v-model="form.images" multiple />
      </div>
    </div>
  </GenericModal>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e2e8f0; 
  border-radius: 100px;
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
}
</style>