import { defineStore } from 'pinia'
import { useMyNotification } from './useMyNotification'
import type { IDiscount, ITransaction, IPayment, TransactionStatus } from '~/types/transaction/transaction'
import { useProductStore } from './products'
import type { ITransactionForm } from '~/types/transaction/form'
import { database_dexie } from '../utils/database_dexie'
import http from '../utils/http'

export const useCartStore = defineStore('cart', () => {
  
  const notify = useMyNotification()
  const productStore = useProductStore()
  
  // -- STATE --
  const items = ref<any[]>([])
  const customerNote = ref('')
  const isSyncing = ref(false)
  const payments = ref<any[]>([])
  // State Baru sesuai Interface ITransaction
  const discount = ref<IDiscount>({ type: 'fixed', nominal: 0 })
  const shippingFee = ref(0)
  const downPaymentAmount = ref(0) // Untuk menampung input DP sementara
  const selectedCustomer = ref<any>(null)

  // -- COMPUTED (REAL-TIME CALCULATION) --
  
  // Total sebelum diskon & pajak (sub_amount)
  const sub_amount = computed(() => 
    items.value.reduce((acc, item) => acc + (item.price_sell * item.quantity), 0)
  )

  // Nilai Diskon (Konversi persen ke rupiah jika tipe-nya percentage)
  const discountAmount = computed(() => {
    if (discount.value.type === 'percentage') {
      return (sub_amount.value * discount.value.nominal) / 100
    }
    return discount.value.nominal
  })

  // Pajak 10% dihitung setelah diskon
  const tax_amount = computed(() => {
    const afterDiscount = sub_amount.value - discountAmount.value
    return afterDiscount > 0 ? afterDiscount * 0.1 : 0
  })

  // Total akhir (total_amount)
  const total_amount = computed(() => {
    const val = (sub_amount.value - discountAmount.value) + tax_amount.value + shippingFee.value
    return val > 0 ? val : 0
  })

  // Sisa yang harus dibayar (due_price)
  const remainingBill = computed(() => {
    const res = total_amount.value - downPaymentAmount.value
    return res > 0 ? res : 0
  })

  // -- ACTIONS --

  function addToCart(product: any) {
    const existing = items.value.find(i => i._id === product._id)
    if (existing) {
      if (existing.quantity < product.stock) {
        existing.quantity++
      } else {
        notify.addToast(`Stok maksimal (${product.stock}) tercapai!`, 'error')
      }
    } else {
      if (product.stock > 0) {
        items.value.push({ ...product, quantity: 1 })
      } else {
        notify.addToast('Stok produk ini kosong!', 'error')
      }
    }
  }

  function removeFromCart(productId: string) {
    const index = items.value.findIndex(i => i._id === productId)
    if (index > -1) {
      if (items.value[index].quantity > 1) {
        items.value[index].quantity--
      } else {
        items.value.splice(index, 1)
      }
    }
  }

  // Reset Keranjang & Penyesuaian
  function clearCart() {
    items.value = []
    customerNote.value = ''
    discount.value = { type: 'fixed', nominal: 0 }
    shippingFee.value = 0
    downPaymentAmount.value = 0
    selectedCustomer.value = null
    payments.value = []
  }

  // PROSES CHECKOUT (Simpan ke Dexie)
  async function checkout() {

    if (items.value.length === 0) return

  // PERBAIKAN: Pastikan payments sudah ada isinya dari modal pembayaran
    // Jika payments kosong, kita buat default cash sesuai total
// Pastikan struktur payments memenuhi syarat validator server
    const finalPayments = payments.value.map(p => ({
      type: p.method || p.type || 'cash', // Sesuaikan dengan key yang dipakai di UI
      label: p.name || p.label || 'Tunai', // Sesuaikan dengan key yang dipakai di UI
      price: Number(p.price || total_amount.value),
      reference_no: p.reference_no || ''
    }));

    const transactionData = {
      trx_id: `TRX-${Date.now()}`,
      outlet_id: '699faf5dccde2f6e9e9aede5', 
      cashier_key: 'KASIR-01', 
      customer_data: selectedCustomer.value ? {
          name: selectedCustomer.value.name,
          phone: selectedCustomer.value.phone,
          address: selectedCustomer.value.address,
          is_new: !selectedCustomer.value._id 
      } : null,
      // PERBAIKAN: Pastikan mapping menghasilkan array murni tanpa slot kosong
      product_key: items.value.map(item => ({
        product_id: item._id,
        name: item.name,
        price: Number(item.price_sell),
        qty: Number(item.quantity),
        subtotal: Number(item.price_sell * item.quantity),
        discount_item: 0
      })),
      down_payment: Number(downPaymentAmount.value || 0),
      sub_amount: Number(sub_amount.value),
      total_amount: Number(total_amount.value),
      discount: { 
        type: discount.value.type, 
        nominal: Number(discount.value.nominal) 
      },
      tax_amount: Number(tax_amount.value),
      shippingFee: Number(shippingFee.value),
      note: customerNote.value || "",
      payments: finalPayments, // Gunakan payments yang sudah divalidasi
      status: (remainingBill.value > 0 ? 'PARTIAL' : 'PAID') as TransactionStatus,
      created_by: 'KASIR-01',
      syncStatus: 'P' as 'P' | 'S' | 'F'
    }

    try {
      // 1. Konversi objek Proxy Vue menjadi Plain Object
      // Cara tercepat dan teraman untuk deep-clone tanpa Proxy:
      const cleanData = JSON.parse(JSON.stringify(transactionData));

      // 2. Simpan ke Dexie
      await database_dexie.orders.add(cleanData);
      clearCart() // Gunakan fungsi reset
      await syncToRemote()
      // notify.addToast('Sync Local ', 'success')
    } catch (error) {
      console.error("Gagal simpan transaksi:", error)
      notify.addToast('Gagal menyimpan transaksi', 'error')
    } 
  }

async function syncToRemote() {

  if (isSyncing.value || !navigator.onLine) return 

  const loadingId = notify.addToast('Membayar ', 'loading');
  isSyncing.value = true

  try {


    const pendingOrders = await database_dexie.orders.where('syncStatus').equals('P').toArray()
    
    for (const order of pendingOrders) {
      try {
        // Hapus ID lokal Dexie agar backend tidak protes
        const { trx_id, syncStatus, ...orderPayload } = order;

        console.log("PAYLOAD YANG DIKIRIM:", JSON.stringify(orderPayload, null, 2));

        // 2. Kirim data. 
        // Jika server menolak 'body' dan 'headers', sesuaikan dengan kebutuhan endpoint Anda
        const response: any = await http.post('/transactions/checkout', orderPayload, {
          headers: { 'x-tenant-id': 'toko_budi' }
        });

        // --- KUNCI: UPDATE DATA LOKAL ---
        // Setelah sukses transaksi, fetch ulang semua produk dari server ke Dexie
        await productStore.fetchAllData();
        
        // Jika berhasil, update status transaksi di lokal
        await database_dexie.orders.update(trx_id, { syncStatus: 'S' })

        // Tandai transaksi lokal sebagai sudah sinkron
        // await database_dexie.orders.delete(trx_id); // Saya sarankan delete agar antrean bersih
    
        // OPTIONAL: Jika di dalam orderPayload ada customer baru, 
        // Anda mungkin ingin mengupdate tabel customer lokal juga agar tidak 'P' lagi
        if (order.customer_key && order.customer_key.phone) {
           await database_dexie.customers
             .where('phone').equals(order.customer_key.phone)
             .modify({ syncStatus: 'S' });
        }

        notify.addToast('Transaksi Berhasil', 'success')

      } catch (e) {
        console.error("Gagal sync order:", order.trx_id, e)
        notify.addToast(`Gagal Sync to server : ${e}`, 'error')
      }
    }
  } finally {
    isSyncing.value = false
    notify.removeToast(loadingId);
  }
}

  return { 
    items, customerNote, discount, shippingFee, downPaymentAmount,
    sub_amount, selectedCustomer, total_amount, payments, tax_amount, discountAmount, remainingBill,
    isSyncing, addToCart, removeFromCart, checkout, syncToRemote, clearCart 
  }
})