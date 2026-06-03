<template>
  <div class=" bg-zinc-950 text-zinc-100 p-6 lg:p-10">
    <div class="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800 pb-6">
      <div>
        <h1 class="text-2xl font-black tracking-tight uppercase italic text-white flex items-center gap-2">
          <span class="w-2 h-6 bg-emerald-500 rounded-sm"></span>
          Input Manual Summary Settlement
        </h1>
        <p class="text-zinc-500 text-xs font-medium tracking-wide mt-1 uppercase">
          Format Laporan Finansial & Audit Standar Kertas 80mm
        </p>
      </div>
      <button 
        @click="handlePrint"
        class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_20px_rgba(16,185,129,0.2)] active:scale-95"
      >
        <Printer class="w-4 h-4" />
        Cetak Ke Printer (80mm)
      </button>
    </div>

    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <div class="lg:col-span-7 space-y-6">
        
        <div class="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-2xl space-y-4">
          <h2 class="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-2">
            <span>01.</span> Informasi Utama & Laporan Menu
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Nama Usaha</label>
              <input v-model="form.shop_name" type="text" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">ID Transaksi/Laporan</label>
              <input v-model="form.trx_id" type="text" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Work Date</label>
              <input v-model="form.work_date" type="date" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Menu Sales gross (Rp)</label>
              <input v-model.number="form.menu_sales" type="number" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Menu Discount (Rp)</label>
              <input v-model.number="form.menu_discount" type="number" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Bill Discount (Rp)</label>
              <input v-model.number="form.bill_discount" type="number" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
          </div>
        </div>

        <div class="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-2xl space-y-4">
          <h2 class="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-2">
            <span>02.</span> Biaya Operasional & Pajak (Kalkulasi Otomatis)
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Service Charge (5% Rumus)</label>
              <input :value="computedServiceCharge" type="number" disabled class="w-full bg-zinc-800/40 border border-zinc-800 text-zinc-400 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed font-medium" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Tax Amount (10% Rumus)</label>
              <input :value="computedTaxAmount" type="number" disabled class="w-full bg-zinc-800/40 border border-zinc-800 text-zinc-400 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed font-medium" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Round Amount (Pembulatan)</label>
              <input v-model.number="form.round_amount" type="number" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Extra Charge (Rp)</label>
              <input v-model.number="form.extra_charge" type="number" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
          </div>
        </div>

        <div class="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-2xl space-y-4">
          <h2 class="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-2">
            <span>03.</span> Audit Trafik & Pembatalan (Cancel)
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Total # Of Bills</label>
              <input v-model.number="form.total_bills" type="number" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Total # Of Guests</label>
              <input v-model.number="form.total_guests" type="number" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Cancel # Menu (Qty)</label>
              <input v-model.number="form.cancel_menu_count" type="number" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Total Amount Cancel (Rp)</label>
              <input v-model.number="form.cancel_total_amount" type="number" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
          </div>
        </div>

        <div class="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-2xl space-y-4">
          <h2 class="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-2">
            <span>04.</span> Sales by Type
          </h2>
          <div class="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
            <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">QTY (100%)</p>
            <div class="grid grid-cols-2 gap-3">
              <input v-model.number="form.sales_by_type.qty" type="number" step="0.1" placeholder="Persentase (%)" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs" />
            </div>
          </div>
          <div class=" hidden p-4 flex bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
            <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Item Sales (100%)</p>
            <div class="grid grid-cols-2 gap-3">
              <input v-model.number="form.sales_by_category.bev_pct" type="number" step="0.1" placeholder="Item Sales (100%)" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs" />
            </div>
            <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Item Sales (100%)</p>
            <div class="grid grid-cols-2 gap-3">
              <input v-model.number="form.sales_by_category.bev_pct" type="number" step="0.1" placeholder="Item Sales (100%)" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs" />
            </div>
            </div>
        </div>


        
        <div class="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-2xl space-y-4">
          <h2 class="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-2">
            <span>05.</span> Distribusi Produk (Category & Type)
          </h2>
          <div class="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
            <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Kategori Makanan (Foods)</p>
            <div class="grid grid-cols-2 gap-3">
              <input v-model.number="form.sales_by_category.food_pct" type="number" step="0.1" placeholder="Persentase (%)" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs" />
              <input v-model.number="form.sales_by_category.food_sales" type="number" placeholder="Gross Sales (Rp)" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs" />
            </div>
          </div>
          <div class="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
            <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Kategori Minuman (Beverages)</p>
            <div class="grid grid-cols-2 gap-3">
              <input v-model.number="form.sales_by_category.bev_pct" type="number" step="0.1" placeholder="Persentase (%)" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs" />
              <input v-model.number="form.sales_by_category.bev_sales" type="number" placeholder="Gross Sales (Rp)" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs" />
            </div>
          </div>
        </div>

        <div class="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-2xl space-y-4">
          <h2 class="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-2">
            <span>05.</span> Rekapitulasi Non-Tunai (Payments)
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Credit Card (CC) Others</label>
              <input v-model.number="form.payments.cc_others" type="number" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Debit Card Others</label>
              <input v-model.number="form.payments.debit_others" type="number" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">QRIS BRI</label>
              <input v-model.number="form.payments.qris_bri" type="number" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Down Payment (DP)</label>
              <input v-model.number="form.payments.dp" type="number" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
          </div>
        </div>

      </div>

      <div class="lg:col-span-5 sticky top-8 flex flex-col items-center">
        <div class="bg-white text-zinc-900 p-6 rounded-sm font-mono leading-tight w-[340px] shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-t-[12px] border-emerald-500 text-xs">
          
          <div class="text-center space-y-0.5 mb-3">
            <h2 class="text-sm font-black uppercase tracking-tighter">{{ form.shop_name || 'NAMA USAHA' }}</h2>
            <p class="text-[10px]">Work Date  : {{ form.work_date || '01-04-2026' }}</p>
            <p class="text-[10px]">Print Date : {{ computedPrintDate }}</p>
          </div>
          <div class="text-center tracking-tighter opacity-40 mb-3">------------------------------------------</div>

          <div class="space-y-1">
            <div class="flex justify-between"><span>Menu Sales :</span><span>{{ (form.menu_sales || 0).toLocaleString('id-ID') }}</span></div>
            <div class="flex justify-between"><span>Menu Discount :</span><span>{{ (form.menu_discount || 0).toLocaleString('id-ID') }}</span></div>
            <div class="text-right tracking-tighter opacity-40">--------</div>
            <div class="flex justify-between"><span>Menu Net Sales :</span><span>{{ menuNetSales1.toLocaleString('id-ID') }}</span></div>
            <div class="flex justify-between"><span>Bill Discount :</span><span>{{ (form.bill_discount || 0).toLocaleString('id-ID') }}</span></div>
            <div class="text-right tracking-tighter opacity-40">--------</div>
            <div class="flex justify-between font-bold"><span>Menu Net Sales :</span><span>{{ menuNetSales2.toLocaleString('id-ID') }}</span></div>
          </div>

          <div class="space-y-1 mt-4">
            <div class="flex justify-between"><span>Serv Charge (5%) :</span><span>{{ computedServiceCharge.toLocaleString('id-ID') }}</span></div>
            <div class="flex justify-between"><span>Tax (10%) :</span><span>{{ computedTaxAmount.toLocaleString('id-ID') }}</span></div>
            <div class="flex justify-between"><span>Round Amount :</span><span>{{ (form.round_amount || 0).toLocaleString('id-ID') }}</span></div>
            <div class="flex justify-between"><span>Extra Charge :</span><span>{{ (form.extra_charge || 0).toLocaleString('id-ID') }}</span></div>
            <div class="text-right tracking-tighter opacity-40">--------</div>
            <div class="flex justify-between font-black border-y border-zinc-900 py-1 uppercase">
              <span>Menu Net Sales :</span><span>{{ grandTotal.toLocaleString('id-ID') }}</span>
            </div>
          </div>

          <div class="space-y-1 mt-4 text-[11px] text-zinc-700">
            <div class="flex justify-between"><span>Total # Of Bills :</span><span>{{ form.total_bills }}</span></div>
            <div class="flex justify-between"><span>Sales per Bill :</span><span>{{ salesPerBill.toLocaleString('id-ID') }}</span></div>
            <div class="flex justify-between mt-1"><span>Total # Of Guest :</span><span>{{ form.total_guests }}</span></div>
            <div class="flex justify-between"><span>Sales per Guest :</span><span>{{ salesPerGuest.toLocaleString('id-ID') }}</span></div>
            <div class="flex justify-between mt-1 text-red-600"><span>Cancel # Menu :</span><span>{{ form.cancel_menu_count }}</span></div>
            <div class="flex justify-between text-red-600"><span>Total Amount :</span><span>{{ (form.cancel_total_amount || 0).toLocaleString('id-ID') }}</span></div>
          </div>

          <div class="text-center my-3 font-bold">==================================</div>
          <div class="text-center font-black uppercase tracking-wide">Sales By Type</div>
          <div class="text-center my-1">==================================</div>
          <div class="space-y-0.5">
            <p class="font-bold">Dine-In :</p>
            <div class="flex justify-between pl-2 text-zinc-600"><span>Qty (100%) :</span><span>{{form.sales_by_type.qty}}</span></div>
            <div class="flex justify-between pl-2 text-zinc-600"><span>Item Sales (100%) :</span><span>{{ (form.menu_sales || 0).toLocaleString('id-ID') }}</span></div>
            <div class="flex justify-between pl-2 text-zinc-600"><span>Net Sales (100%) :</span><span>{{ (form.menu_sales || 0).toLocaleString('id-ID') }}</span></div>
            <div class="text-center tracking-tighter opacity-30">----------------------------------</div>
            <div class="flex justify-between font-bold"><span>Total :</span><span>{{ (form.menu_sales || 0).toLocaleString('id-ID') }}</span></div>
          </div>

          <div class="text-center my-3 font-bold">==================================</div>
          <div class="text-center font-black uppercase tracking-wide">Sales By Category</div>
          <div class="text-center my-1">==================================</div>
          <div class="space-y-2">
            <div>
              <p class="font-bold">Foods :</p>
              <div class="flex justify-between pl-2 text-zinc-600"><span>Item Sales ({{ form.sales_by_category.food_pct }}%) :</span><span>{{ (form.sales_by_category.food_sales || 0).toLocaleString('id-ID') }}</span></div>
              <div class="flex justify-between pl-2 text-zinc-600"><span>Net Sales ({{ form.sales_by_category.food_pct }}%) :</span><span>{{ (form.sales_by_category.food_sales || 0).toLocaleString('id-ID') }}</span></div>
            </div>
            <div>
              <p class="font-bold">Beverages :</p>
              <div class="flex justify-between pl-2 text-zinc-600"><span>Item Sales ({{ form.sales_by_category.bev_pct }}%) :</span><span>{{ (form.sales_by_category.bev_sales || 0).toLocaleString('id-ID') }}</span></div>
              <div class="flex justify-between pl-2 text-zinc-600"><span>Net Sales ({{ form.sales_by_category.bev_pct }}%) :</span><span>{{ (form.sales_by_category.bev_sales || 0).toLocaleString('id-ID') }}</span></div>
            </div>
            <div class="text-center tracking-tighter opacity-30">----------------------------------</div>
            <div class="flex justify-between font-bold"><span>Total :</span><span>{{ (Number(form.sales_by_category.food_sales || 0) + Number(form.sales_by_category.bev_sales || 0)).toLocaleString('id-ID') }}</span></div>
          </div>

          <div class="text-center my-3 font-bold">==================================</div>
          <div class="text-center font-black uppercase tracking-wide">Payment Type Summary</div>
          <div class="text-center my-1">==================================</div>
          <div class="space-y-1">
            <div class="flex justify-between"><span>CC Others :</span><span>{{ (form.payments.cc_others || 0).toLocaleString('id-ID') }}</span></div>
            <div class="flex justify-between"><span>Debit Others :</span><span>{{ (form.payments.debit_others || 0).toLocaleString('id-ID') }}</span></div>
            <div class="flex justify-between"><span>Qris BRI :</span><span>{{ (form.payments.qris_bri || 0).toLocaleString('id-ID') }}</span></div>
            <div class="flex justify-between"><span>DP :</span><span>{{ (form.payments.dp || 0).toLocaleString('id-ID') }}</span></div>
            <div class="flex justify-between font-bold text-emerald-700 bg-emerald-50 px-1 rounded-sm">
              <span>CASH (Otomatis) :</span><span>{{ calculatedCash.toLocaleString('id-ID') }}</span>
            </div>
            <div class="text-center tracking-tighter opacity-30">----------------------------------</div>
            <div class="flex justify-between font-black text-sm uppercase"><span>Total :</span><span>{{ grandTotal.toLocaleString('id-ID') }}</span></div>
          </div>

        </div>
        
        <div class="mt-4 flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full">
          <Printer class="w-3 h-3 text-emerald-500" />
          Spesifikasi Kertas: 80mm Thermal
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Printer } from 'lucide-vue-next'
import { usePrinter } from '~/composables/usePrinter'

const { printManualSettlement } = usePrinter()

// 1. STATE FORM AWAL
const form = ref({
  shop_name: 'NEXT KASIR CORE',
  trx_id: '88291',
  work_date: new Date().toISOString().substring(0, 10),
  menu_sales: 3922500, // Akan di-override oleh computedMenuSales di payload printer
  menu_discount: 0,
  bill_discount: 0,
  round_amount: 196125,
  extra_charge: 196125,
  total_bills: 17,
  total_guests: 17,
  cancel_menu_count: 1,
  cancel_total_amount: 25000,
  sales_by_type: {
    qty: 133,
    item_sales: 3922500,
    discount_item: 0,
    discount_bill: 0,
    net_sales: 3922500
  },
  sales_by_category: {
    food_pct: 64.2,
    food_sales: 2518500,
    food_discount: 0,
    food_net: 2518500,
    bev_pct: 35.8,
    bev_sales: 1404000,
    bev_discount: 0,
    bev_net: 1404000
  },
  sales_by_promo: {
    name: 'NO Promo',
    pct: 100,
    item_sales: 3922500,
    disc_item: 0,
    disc_bill: 0,
    net_sales: 3922500
  },
  payments: {
    cc_others: 673273,
    debit_others: 1311410,
    qris_bri: 2145807,
    dp: 400000
  }
})

// 2. REAKTIF COMPUTED BERDASARKAN RUMUS FINANSIAL RESTORAN (TAX & SERVICE BERANTAI + AKUMULASI GABUNGAN)

// Format tanggal & waktu cetak
const computedPrintDate = computed(() => {
  const now = new Date()
  const dateStr = form.value.work_date.split('-').reverse().join('-')
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
  return `${dateStr} - ${timeStr}`
})

// Menu Sales Bruto otomatis dijumlahkan dari distribusi kategori (Food + Beverage)
const computedMenuSales = computed(() => {
  return Number(form.value.sales_by_category.food_sales || 0) + Number(form.value.sales_by_category.bev_sales || 0)
})

// Menu Net Sales 1: Total Bruto dikurangi Diskon Menu/Item
const menuNetSales1 = computed(() => {
  return Math.max(0, computedMenuSales.value - (form.value.menu_discount || 0))
})

// Menu Net Sales 2: Hasil Net 1 dikurangi Diskon Bill (Dasar Pengenaan Pajak & Service)
const menuNetSales2 = computed(() => {
  return Math.max(0, menuNetSales1.value - (form.value.bill_discount || 0))
})

// RUMUS AKURAT: Service Charge dihitung 5% dari (Food + Beverage - Total Discount)
const computedServiceCharge = computed(() => {
  return Math.round(menuNetSales2.value * 0.05)
})

// RUMUS AKURAT: Tax dihitung 10% dari (Food + Beverage - Total Discount + Service Charge)
const computedTaxAmount = computed(() => {
  const baseTaxable = menuNetSales2.value + computedServiceCharge.value
  return Math.round(baseTaxable * 0.10)
})

// Grand Total Akumulasi Akhir setelah Pajak, Service, Pembulatan, & Biaya Tambahan
const grandTotal = computed(() => {
  return menuNetSales2.value + 
         computedServiceCharge.value + 
         computedTaxAmount.value + 
         (form.value.round_amount || 0) + 
         (form.value.extra_charge || 0)
})

// Metrik Audit Trafik Restoran
const salesPerBill = computed(() => form.value.total_bills ? Math.round(grandTotal.value / form.value.total_bills) : 0)
const salesPerGuest = computed(() => form.value.total_guests ? Math.round(grandTotal.value / form.value.total_guests) : 0)

// RUMUS CASH: Sisa nilai Grand Total setelah dikurangi semua instrumen pembayaran Non-Tunai
const calculatedCash = computed(() => {
  const p = form.value.payments
  const totalNonCash = (p.cc_others || 0) + (p.debit_others || 0) + (p.qris_bri || 0) + (p.dp || 0)
  return Math.max(0, grandTotal.value - totalNonCash)
})

// 3. ACTION TRIGGER PRINTER
const handlePrint = async () => {
  const payload = {
    ...form.value,
    menu_sales: computedMenuSales.value,         // Kirim akumulasi Food + Beverage terbaru
    service_charge: computedServiceCharge.value, // Kirim hasil kalkulasi rumus otomatis (5%)
    tax_amount: computedTaxAmount.value,         // Kirim hasil kalkulasi rumus otomatis (10%)
    print_date: computedPrintDate.value,
    config: {
      name: { value: form.value.shop_name }
    }
  }
  
  await printManualSettlement(payload)
}
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>