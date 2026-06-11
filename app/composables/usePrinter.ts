// composables/usePrinter.ts
import { ref } from 'vue'

const isConnected = ref(false)
const connectionType = ref<'USB' | 'BT' | null>(null)
const deviceName = ref('')

// State untuk menyimpan koneksi agar tidak pairing ulang
let cachedDevice: any = null;
let cachedServer: any = null;

export const usePrinter = () => {
  /**
   * charWidth 30-32 biasanya ideal untuk paper 58mm
   */


const COMMON_PRINTER_UUIDS = [
  '000018f0-0000-1000-8000-00805f9b34fb',
];

if (process.client && navigator.serial) {
  navigator.serial.addEventListener('disconnect', () => {
    if (connectionType.value === 'USB') {
      isConnected.value = false
      connectionType.value = null
      deviceName.value = ''
    }
  });
}



const charWidth = 30; 

const commands = {
  init: '\x1B\x40',
  center: '\x1B\x61\x01',
  left: '\x1B\x61\x00',
  right: '\x1B\x61\x02',
  boldOn: '\x1B\x45\x01',
  boldOff: '\x1B\x45\x00',
  // setMargin: '\x1D\x4C\x10\x00', 
  setMargin: '\x1D\x4C\x10\x00',
  feed: '\x0A\x0A\x0A\x0A\x0A',
  fontSmall: '\x1b\x21\x01', // Font B
  fontNormal: '\x1b\x21\x00', // Font A
};


// Helper untuk garis yang selalu pas dengan charWidth
const drawLine = (char = '-') => char.repeat(charWidth);

// Helper format line yang fleksibel terhadap lebar (w)
const formatLine = (left: string, right: string, w = charWidth) => {
  const spaceCount = w - (left.length + right.length);
  return left + " ".repeat(Math.max(0, spaceCount)) + right;
};


/**
 * BUILD SUMMARY SETTLEMENT 80MM (FORCE MARGIN TENGAH - TEKS WAJIB KIRI-KANAN)
 */
const buildManualSummary80mm = (data: any) => {
  const cfg = data.config || {};
  
// 1. Kembalikan ke lebar maksimal kertas 80mm agar teks memanfaatkan space kanan
  const WIDTH_80MM = 42; 

  // Helper formatting khusus (Teks kiri-kanan presisi)
  const formatLine80 = (left: string, right: string) => {
    const spaceCount = WIDTH_80MM - (left.length + right.length);
    return left + " ".repeat(Math.max(0, spaceCount)) + right;
  };

  const drawLine80 = (char = '-') => char.repeat(WIDTH_80MM);
  const drawLine0180 = (char = '=') => char.repeat(WIDTH_80MM);

  // =========================================================================
  // NATIVE ESC/POS HEX COMMANDS (PENYESUAIAN RUANG KANAN-KIRI)
  // =========================================================================
  const setLineSpacing = '\x1b\x33\x28'; 
  const resetLineSpacing = '\x1b\x32';   
  
  // Kita sesuaikan margin kiri menjadi 16 atau 24 dots (\x10 atau \x18)
  // Nilai ini sangat pas untuk membuat teks mepet kanan-kiri secara seimbang di kertas 80mm
  const setLeftMargin = '\x1d\x4c\x14\x00';  // Menggunakan nilai kesetimbangan 20 dots
  const resetLeftMargin = '\x1d\x4c\x00\x00'; 

  const FORCE_LEFT = '\x1b\x61\x00';   
  const FORCE_CENTER = '\x1b\x61\x01';
  // =========================================================================

  // Ambil nilai nominal data
  const menuSales = data.menu_sales || 0;
  const menuDiscount = data.menu_discount || 0;
  const menuNetSales1 = menuSales - menuDiscount;
  const billDiscount = data.sales_by_promo.m_disc_bill || 0;
  const menuNetSales2 = menuSales - billDiscount;

  const servCharge = data.service_charge || 0;
  const taxAmount = data.tax_amount || 0;
  const roundAmount = data.round_amount || 0;
  const extraCharge = data.extra_charge || 0;

  const finalNetSales = menuNetSales2 + servCharge + taxAmount + roundAmount + extraCharge;
  
  
  const NetSalesCategory = data.net_sales_category || 0;
  const NetSalesPromo = data.net_sales_promo || 0;

  // RUMUS AKURAT: Service Charge dihitung 5% dari (Food + Beverage - Total Discount)
  const computedServiceCharge = computed(() => {
    return Math.round(menuNetSales2 * 0.05)
  })

  // RUMUS AKURAT: Tax dihitung 10% dari (Food + Beverage - Total Discount + Service Charge)
  const computedTaxAmount = computed(() => {
    const baseTaxable = menuNetSales2 + computedServiceCharge.value
    return Math.round(baseTaxable * 0.10)
  })

  // Grand Total Akumulasi Akhir setelah Pajak, Service, Pembulatan, & Biaya Tambahan
  const grandTotal = computed(() => {
    return menuNetSales2 + 
          computedServiceCharge.value + 
          computedTaxAmount.value + 
          (data.round_amount || 0) + 
          (data.extra_charge || 0)
  })


  // Metrik Audit Trafik Restoran
  const salesPerBill = computed(() => data.total_bills ? Math.trunc(grandTotal.value / data.total_bills) : 0)
  const salesPerGuest = computed(() => data.total_guests ? Math.trunc(grandTotal.value / data.total_guests) : 0)

  const formattedWorkDate = computed(() => {
    const [datePart] = data.work_date.split('T')

    const [year, month, day] = datePart.split('-')

    return `${day}-${month}-${year}`
  })

  const computedPrintDate = computed(() => {
    const [datePart, timePart] = data.work_date.split('T')

    const [year, month, day] = datePart.split('-')

    return `${day}-${month}-${year} - ${timePart}`
  })


  // const formatNumber = (value: any) => Math.round(value || 0).toLocaleString('id-ID');
  const formatNumber = (value: any) => Math.trunc(value || 0).toLocaleString('id-ID');

  


// Inisialisasi awal: Set Spacing, Set Margin Geser Tengah, Paksa Teks Rata Kiri
  let p = commands.init + setLineSpacing;

  // reset margin dulu
  p += resetLeftMargin;

  p += FORCE_CENTER;
  p += "LAPORAN SEMENTARA\n";
  p += "RINGKASAN PENJUALAN\n\n";

  // baru aktifkan margin untuk isi laporan
  p += FORCE_LEFT;

  p += `${(cfg.name?.value || 'NAMA USAHA')}\n`;

  // Kembalikan ke Kiri untuk data Header lainnya
  p += FORCE_LEFT + commands.boldOff; 
  p += formatLine80(`Work Date  : ${formattedWorkDate.value || '01-04-2026'}`, "") + "\n";
  p += formatLine80(`Print Date : ${computedPrintDate.value || '01-04-2026 - 21:33'}`, "") + "\n";
  p += drawLine80() + "\n\n"; 

  // 2. MAIN FINANCIAL SUMMARY (Setiap line dipastikan mewarisi FORCE_LEFT)
  p += FORCE_LEFT;
  p += formatLine80("Menu Sales :", formatNumber(menuSales)) + "\n";
  p += formatLine80("Menu Discount :", formatNumber(menuDiscount)) + "\n";
  p += formatLine80("", "--------") + "\n";
  p += formatLine80("Menu Net Sales :", formatNumber(menuNetSales1)) + "\n\n";
  p += formatLine80("Bill Discount :", formatNumber(billDiscount)) + "\n";
  p += formatLine80("", "--------") + "\n";
  p += formatLine80("Total Net Sales :", formatNumber(menuNetSales2)) + "\n\n";

  p += formatLine80("Serv. Charge :", formatNumber(servCharge)) + "\n";
  p += formatLine80("Tax :", formatNumber(taxAmount)) + "\n";
  p += formatLine80("Round Amount :", formatNumber(roundAmount)) + "\n";
  p += formatLine80("Extra Charge :", formatNumber(extraCharge)) + "\n";
  p += formatLine80("", "--------") + "\n";
  
  p += commands.boldOn;
  p += formatLine80("Gross Sales :",  Math.trunc(finalNetSales).toLocaleString('id-ID' )) + "\n";
  p += commands.boldOff + "\n\n";   

  // 3. TRAFFIC & AUDIT METRICS
  p += FORCE_LEFT;
  p += formatLine80("Total # of Bills Disc :", (data.sales_by_promo.m_disc_bill_qty || 0).toString()) + "\n";
  p += formatLine80("Total # of Bills :", (data.total_bills || 0).toString()) + "\n";
  p += formatLine80("Sales per Bill :", (salesPerBill.value  || 0).toLocaleString('id-ID')) + "\n\n";
  p += formatLine80("Total # of Guest :", (data.total_guests || 0).toString()) + "\n";
  p += formatLine80("Sales per Guest :", (salesPerGuest.value  || 0).toLocaleString('id-ID')) + "\n\n";
  p += formatLine80("Cancel # Menu(s) :", (data.cancel_menu_count || 0).toString()) + "\n";
  p += formatLine80("Total Amount :", (data.cancel_total_amount || 0).toLocaleString('id-ID')) + "\n\n";

  // 4. SALES BY TYPE
  p += FORCE_LEFT;
  // p += "======================================\n";
  p += drawLine0180() + "\n"; 
  // p += "Sales By Type\n";

  p += FORCE_CENTER + "Sales By Type\n" + FORCE_LEFT;

  p += drawLine0180() + "\n\n"; 
  // p += "======================================\n";
  
  const salesType = data.sales_by_type || {};
  const salesPromo = data.sales_by_promo || {};

  p += "Dine-In :\n";
  p += formatLine80("  Qty (100%) :", (formatNumber(salesType.qty) || 0).toString()) + "\n";
  // p += formatLine80("  Item Sales (100%) :", (salesType.item_sales || 0).toLocaleString('id-ID')) + "\n";
  p += formatLine80("  Item Sales (100%) :", formatNumber(menuSales)) + "\n";
  p += formatLine80("  Discount Item :", (salesPromo.m_disc_item || 0).toLocaleString('id-ID')) + "\n";
  p += formatLine80("  Discount Bill :", (salesPromo.m_disc_bill || 0).toLocaleString('id-ID')) + "\n";
  p += formatLine80("  Net Sales (100%) :", formatNumber(menuNetSales2)) + "\n";
  // p += "--------------------------------------\n";
  p += drawLine80() + "\n";
  // p += formatLine80("Total :", formatNumber(salesType.net_sales || 0)) + "\n";
  p += formatLine80("Total :", formatNumber(menuNetSales2)) + "\n";
  // p += "======================================\n\n";
  p += drawLine0180() + "\n\n"; 

  // 5. SALES BY CATEGORY
  p += FORCE_LEFT;
  // p += "======================================\n";
  p += drawLine0180() + "\n"; 
  // p += "Sales By Category\n";
  p += FORCE_CENTER + "Sales By Category\n" + FORCE_LEFT;
  p += drawLine0180() + "\n\n"; 
  // p += "======================================\n";
  

  const cat = data.sales_by_category || {};

  p += "Foods :\n";
  p += formatLine80(`  Item Sales (${cat.food_pct || 0}%) :`, (formatNumber(cat.food_sales) || 0).toLocaleString('id-ID')) + "\n";
  p += formatLine80(`  Discount (${cat.food_discount_pct || 0}%) :`, (formatNumber(cat.food_discount) || 0).toLocaleString('id-ID')) + "\n";
  p += formatLine80(`  Net Sales (${cat.food_net_pct || 0}%) :`, (formatNumber(cat.food_net) || 0).toLocaleString('id-ID')) + "\n\n";

  p += "Beverages :\n";
  p += formatLine80(`  Item Sales (${cat.bev_pct || 0}%) :`, (formatNumber(cat.bev_sales) || 0).toLocaleString('id-ID')) + "\n";
  p += formatLine80(`  Discount (${cat.bev_discount_pct || 0}%) :`, (formatNumber(cat.bev_discount) || 0).toLocaleString('id-ID')) + "\n";
  p += formatLine80(`  Net Sales (${cat.bev_net_pct || 0}%) :`, (formatNumber(cat.bev_net) || 0).toLocaleString('id-ID')) + "\n";
  
  // p += "--------------------------------------\n";
  p += drawLine80() + "\n"; 
  // p += formatLine80("Total :", ((cat.food_sales || 0) + (cat.bev_sales || 0)).toLocaleString('id-ID')) + "\n";
  p += formatLine80("Total :", (formatNumber(NetSalesCategory))) + "\n";
  // p += "======================================\n\n";
  p += drawLine0180() + "\n\n"; 

  
  // 6. SALES BY PROMO
  // p += FORCE_LEFT;
  // // p += "======================================\n";
  // p += drawLine0180() + "\n"; 

  // // p += "Sales By Promo\n";
  // p += FORCE_CENTER + "Sales By Promo\n" + FORCE_LEFT;
  // p += drawLine0180() + "\n\n"; 
  // // p += "======================================\n";
  
  // const promo = data.sales_by_promo || {};

  // p += `${promo.name || 'NO PROMO'} :\n`;
  // p += formatLine80(`  Item Sales (${promo.item_sales_pct || 0}%) :`, (formatNumber(promo.item_sales) || 0).toLocaleString('id-ID')) + "\n";
  // p += formatLine80(`  Disc. Item (${promo.disc_item_pct || 0}%) :`, (promo.disc_item || 0).toLocaleString('id-ID')) + "\n";
  // p += formatLine80(`  Disc. Bill (${promo.disc_bill_pct || 0}%) :`, (promo.disc_bill || 0).toLocaleString('id-ID')) + "\n";
  // p += formatLine80("", "-------------") + "\n";
  // p += formatLine80(`Net Sales (${promo.net_sales_pct || 100}%) :`, (formatNumber(promo.np_n) || 0).toLocaleString('id-ID')) + "\n\n";
  // // p += "======================================\n\n";


  // p += `${promo.name_m || 'MANUAL PROMO'} :\n`;
  // p += formatLine80(`  Item Sales (${promo.m_item_sales_pct || 0}%) :`, (formatNumber(promo.m_item_sales) || 0).toLocaleString('id-ID')) + "\n";
  // p += formatLine80(`  Disc. Item (${promo.m_disc_item_pct || 0}%) :`, (promo.m_disc_item || 0).toLocaleString('id-ID')) + "\n";
  // p += formatLine80(`  Disc. Bill (${promo.m_disc_bill_pct || 0}%) :`, (promo.m_disc_bill || 0).toLocaleString('id-ID')) + "\n";
  // p += formatLine80("", "-------------") + "\n";
  // p += formatLine80(`Net Sales (${promo.m_net_sales_pct || 100}%) :`, (formatNumber(promo.m_n) || 0).toLocaleString('id-ID')) + "\n";
  // // p += "======================================\n\n";
  //   // p += "--------------------------------------\n";
  // p += drawLine80() + "\n\n"; 
  // // p += formatLine80("Total :", ((cat.food_sales || 0) + (cat.bev_sales || 0)).toLocaleString('id-ID')) + "\n";
  // p += formatLine80("Total :",  (formatNumber(NetSalesPromo) || 0).toLocaleString('id-ID')) + "\n";
  // p += drawLine0180() + "\n\n"; 



  // 7. PAYMENT TYPE SUMMARY
  p += FORCE_LEFT;
  // p += "======================================\n";
  p += drawLine0180() + "\n"; 
  // p += "Payment Type Summary\n";
  p += FORCE_CENTER + "Payment Type Summary\n" + FORCE_LEFT;
  p += drawLine0180() + "\n\n"; 
  // p += "======================================\n";
  
  const pay = data.payments || {};
  const ccOthers = pay.cc_others || 0;
  const debitOthers = pay.debit_others || 0;
  const qrisBri = pay.qris_bri || 0;
  const dpAmount = pay.dp || 0;
  
  const cashAmount = finalNetSales - (ccOthers + debitOthers + qrisBri + dpAmount);

  p += formatLine80("Cash :", formatNumber(cashAmount)) + "\n";
  p += formatLine80("CC Others :", ccOthers.toLocaleString('id-ID')) + "\n";
  p += formatLine80("Debit Others :", debitOthers.toLocaleString('id-ID')) + "\n";
  p += formatLine80("Qris BRI :", qrisBri.toLocaleString('id-ID')) + "\n";
  p += formatLine80("DP :", dpAmount.toLocaleString('id-ID')) + "\n";
  // p += formatLine80("CASH :", formatNumber(cashAmount)) + "\n";
  // p += "--------------------------------------\n";
  p += drawLine80() + "\n"; 
  
  p += commands.boldOn;
  p += formatLine80("Total :", Math.trunc(finalNetSales).toLocaleString('id-ID' )) + "\n";
  p += commands.boldOff;
  // p += "======================================\n";
  p += drawLine0180() + "\n\n"; 

  // Reset margin dan line spacing ke default pabrik sebelum pemotongan kertas
  p += resetLeftMargin + resetLineSpacing + FORCE_LEFT;

  // Dorong kertas kosong akhir
  p += "\n\n\n\n\n\n";
  
  if (commands.feed) p += commands.feed;
  if (commands.paperCut) p += commands.paperCut;

  return p;
};



  const printManualSettlement = async (data: any) => {
      try {
        // Menggunakan cached connection agar tidak pairing ulang (sesuai logic sebelumnya)
        if (!cachedServer || !cachedServer.connected) {
          cachedDevice = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [
              '000018f0-0000-1000-8000-00805f9b34fb', 
              '00001101-0000-1000-8000-00805f9b34fb'
            ]
          });
          cachedServer = await cachedDevice.gatt?.connect();
        }

        const services = await cachedServer.getPrimaryServices();
        let characteristic: any = null;
        for (const service of services) {
          const characteristics = await service.getCharacteristics();
          characteristic = characteristics.find((c: any) => c.properties.write || c.properties.writeWithoutResponse);
          if (characteristic) break;
        }

        if (!characteristic) throw new Error("Characteristic write tidak ditemukan");

        // Compile string payload laporan 80mm
        const finalString = buildManualSummary80mm(data);

        const encoder = new TextEncoder();
        const payload = encoder.encode(finalString);

        // Kirim chunk per 20 byte dengan throttle delay 30ms
        const CHUNK_SIZE = 20; 
        for (let i = 0; i < payload.length; i += CHUNK_SIZE) {
          const chunk = payload.slice(i, i + CHUNK_SIZE);
          if (characteristic.properties.writeWithoutResponse) {
            await characteristic.writeValueWithoutResponse(chunk);
          } else {
            await characteristic.writeValue(chunk);
          }
          await new Promise(resolve => setTimeout(resolve, 30));
        }

        console.log("✅ Settlement Report 80mm Berhasil Dicetak!");
      } catch (error: any) {
        if (error.name !== 'NotFoundError') cachedServer = null;
        alert(`Gagal cetak: ${error.message}`);
      }
    };


  const buildSummaryString = (data: any) => {
    const cfg = data.config || {};
    const WIDTH_NORMAL = 29; 
    const WIDTH_SMALL = 39;  
    
    let p = commands.init + commands.setMargin;


    /**
     * GENERATOR KODE DINAMIS BERDASARKAN DATA
     */
    // 1. Ambil tanggal dari data (Asumsi format data.date: "YYYY-MM-DD")
    // Kita bersihkan tanda "-" atau "/" agar menjadi format f2026.05.13
    const dateSource = data.date ? data.date.replace(/-/g, '.') : '0.0.0';
    const timeSource = data.time ? data.time.replace(/:/g, '.') : '0.0';
    const vCode = `f${dateSource}.${timeSource}`;

    // 2. Kode Serial (Gunakan data.trx_id sebagai benih agar konsisten, atau tetap random)
    // Di sini saya buat kombinasi ID transaksi agar terlihat autentik
    const sCode = `PE${data.trx_id || '000'}E${Math.floor(1000 + Math.random() * 9000)}`;

    // --- CETAK KODE DINAMIS DI ATAS ---
    p += commands.fontSmall + commands.left;
    p += formatLine(vCode, sCode.substring(0, 13), WIDTH_SMALL) + "\n";
    p += commands.fontNormal;
    p += "\n\n"; 

    // 1. Branding
    p += commands.center + commands.boldOn;
    if (cfg.name?.status) p += `${cfg.name.value.toUpperCase()}\n`;
    p += commands.boldOff;
    if (cfg.address?.status) p += `${cfg.address.value}\n`;
    p += "-".repeat(WIDTH_NORMAL) + "\n";

    // 2. Title Laporan Utama
    p += commands.boldOn + (cfg.header_one?.value || 'SUMMARY REPORT').toUpperCase() + "\n" + commands.boldOff;
    p += "-".repeat(WIDTH_NORMAL) + "\n\n";

    // 3. Metadata (Font Small)
    p += commands.fontSmall + commands.left;
    p += formatLine(`ID: ${data.trx_id}`, `MID: 000034`, WIDTH_SMALL) + "\n";
    if (cfg.show_time) {
      p += formatLine(`DATE: ${data.date}`, `TIME: ${data.time}`, WIDTH_SMALL) + "\n";
    }
    p += "-".repeat(WIDTH_SMALL) + "\n\n";

    // Header Detail Section
    p += commands.center + commands.boldOn;
    p += (cfg.header_two?.value || 'DETAIL SUMMARY').toUpperCase() + "\n";
    p += "=".repeat(WIDTH_SMALL) + "\n\n";
    p += commands.left;

    // Variabel untuk menampung total per grup guna dicetak di summary bawah
    const groupTotalsSummary: { label: string, total: number }[] = [];

    // 4. Looping Detail Group Summary
    cfg.summary_groups?.forEach((group: any) => {
      if (group.status && group.label) {
        p += commands.boldOn + group.label.toUpperCase() + commands.boldOff + "\n";
        p += ".".repeat(WIDTH_SMALL) + "\n";

        group.subs?.forEach((sub: any) => {
          if (sub.status && sub.label) {
            const val = data.summary_data[group.label]?.[sub.label] || { 
              sale_count: 0, sale_amount: 0, void_count: 0, void_amount: 0 
            };
            const netAmount = val.sale_amount - val.void_amount;

            p += commands.boldOn + sub.label.toUpperCase() + commands.boldOff + "\n";

            const formatThreeColumnSmall = (label: string, qty: number, amount: number) => {
              const qtyStr = qty.toString();
              const amtStr = `Rp${amount.toLocaleString()}`;
              const labelPart = label.padEnd(12, ' '); 
              const amountPart = amtStr.padStart(14, ' '); 
              const middleSpace = WIDTH_SMALL - labelPart.length - amountPart.length;
              const padLeft = Math.floor((middleSpace - qtyStr.length) / 2);
              const qtyPart = qtyStr.padStart(padLeft + qtyStr.length, ' ').padEnd(middleSpace, ' ');
              return labelPart + qtyPart + amountPart;
            };

            p += formatThreeColumnSmall("  SALE", val.sale_count, val.sale_amount) + "\n";
            p += formatThreeColumnSmall("  VOID", val.void_count, val.void_amount) + "\n";
            p += formatLine(`  TOTAL ${sub.label}`, `Rp${netAmount.toLocaleString()}`, WIDTH_SMALL) + "\n\n";
          }
        });

        // Hitung Total per Group
        const groupTotal = Object.values(data.summary_data[group.label] || {}).reduce((acc: number, curr: any) => {
          return acc + (Number(curr.sale_amount) - Number(curr.void_amount));
        }, 0);
        
        // Simpan untuk summary di bawah
        groupTotalsSummary.push({ label: group.label, total: groupTotal });

        p += "=".repeat(WIDTH_SMALL) + "\n";
        p += formatLine(`TOTAL ${group.label}`, `Rp${groupTotal.toLocaleString()}`, WIDTH_SMALL) + "\n";
        p += "=".repeat(WIDTH_SMALL) + "\n\n";
      }
    });

    // 5. GRAND SUMMARY (REKAPITULASI DI BAWAH)
    p += commands.fontNormal + commands.center;
    p += commands.boldOn + (cfg.header_three?.value || 'GRAND SUMMARY').toUpperCase() + "\n" + commands.boldOff;
    p += "-".repeat(WIDTH_NORMAL) + "\n";
    p += commands.left;

    // Cetak ulang total tiap grup di sini dengan Font Normal
    groupTotalsSummary.forEach(item => {
      p += formatLine(item.label, `Rp${item.total.toLocaleString()}`, WIDTH_NORMAL) + "\n";
    });

    // 6. SETTLEMENT TOTAL (FINAL)
    p += "=".repeat(WIDTH_NORMAL) + "\n";
    p += commands.boldOn;
    p += formatLine("SETTLEMENT TOTAL", `Rp${data.total_amount.toLocaleString()}`, WIDTH_NORMAL) + "\n";
    p += commands.boldOff;
    p += "=".repeat(WIDTH_NORMAL) + "\n";

    // 7. Footer Note
    if (cfg.footer_note?.status && cfg.footer_note?.value) {
      p += "\n" + commands.center + commands.fontSmall;
      p += `${cfg.footer_note.value}\n`;
      p += commands.fontNormal + commands.left; 
    }


    // --- CETAK KODE DINAMIS DI ATAS ---
    p += "\n\n"; 
    p += commands.fontSmall + commands.left;
    p += formatLine(vCode, sCode.substring(0, 13), WIDTH_SMALL) + "\n";
    p += commands.fontNormal;

    // 8. PUSH PAPER
    p += "\n\n\n\n\n"; 
    
    return p;
  };

  // CORE PRINT LOGIC (Bluetooth)
  const printViaBluetoothSummary = async (data: any) => {
      try {
        // 1. CEK KONEKSI AKTIF
        // Kita hanya panggil requestDevice jika cachedServer belum ada atau sudah disconnect
        if (!cachedServer || !cachedServer.connected) {
          console.log("Memulai koneksi baru...");
          
          cachedDevice = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [
              '000018f0-0000-1000-8000-00805f9b34fb', 
              '00001101-0000-1000-8000-00805f9b34fb'
            ]
          });

          // Simpan server ke cache
          cachedServer = await cachedDevice.gatt?.connect();

          // Tambahkan listener agar jika printer mati/diskonek manual, state kita reset
          cachedDevice.addEventListener('gattserverdisconnected', () => {
            console.log("Printer terputus secara fisik.");
            isConnected.value = false;
            cachedServer = null;
          });
        }

        // Update state UI
        isConnected.value = true;
        deviceName.value = cachedDevice.name || 'Printer BT';

        // 2. PROSES SEARCH SERVICE (Sangat cepat jika sudah terkoneksi)
        const services = await cachedServer.getPrimaryServices();
        let characteristic: any = null;
        for (const service of services) {
          const characteristics = await service.getCharacteristics();
          characteristic = characteristics.find((c: any) => 
            c.properties.write || c.properties.writeWithoutResponse
          );
          if (characteristic) break;
        }

        if (!characteristic) throw new Error("Characteristic tidak ditemukan");

        // 3. GENERATE DATA
        const finalString = data.type === 'SUMMARY_REPORT' 
          ? buildSummaryString(data) 
          : buildReceiptString(data);

        const encoder = new TextEncoder();
        const payload = encoder.encode(finalString);

        // 4. KIRIM DATA DENGAN DELAY
        const CHUNK_SIZE = 20; 
        for (let i = 0; i < payload.length; i += CHUNK_SIZE) {
          const chunk = payload.slice(i, i + CHUNK_SIZE);
          await characteristic.writeValueWithoutResponse(chunk);
          await new Promise(resolve => setTimeout(resolve, 30));
        }

        console.log("✅ Berhasil cetak menggunakan koneksi yang ada.");

      } catch (error: any) {
        // PENTING: Jangan reset cachedServer jika user hanya membatalkan dialog bluetooth
        if (error.name !== 'NotFoundError') {
          cachedServer = null;
        }
        console.error("BT Error:", error);
        alert(`Gagal cetak: ${error.message}`);
      }
    };
  
  /**
   * BUILD RECEIPT STRING
   * Menggunakan data dari server (receiptConfig)
   */
  const buildReceiptString = (data: any) => {
    // Ambil config dari payload (dikirim dari Page via doPrint)
    const cfg = data.config || {};
    
    let p = commands.init;
    p += commands.setMargin;
    
    // HEADER (Branding)
    p += commands.center + commands.boldOn;
    if (cfg.name?.status) {
      p += `${cfg.name.value.toUpperCase()}\n`;
    }
    p += commands.boldOff;

    if (cfg.description?.status && cfg.description?.value) {
      p += `${cfg.description.value}\n`;
    }

    if (cfg.address?.status && cfg.address?.value) {
      p += `${cfg.address.value}\n`;
    }

    if (cfg.phone?.status && cfg.phone?.value) {
      p += `Telp: ${cfg.phone.value}\n`;
    }

    if (cfg.email?.status && cfg.email?.value) {
      p += `${cfg.email.value}\n`;
    }
    
    // INFO TRANSAKSI
    p += "\n" + commands.left;
    p += `ID : ${data.trx_id}\n`;
    // Tampilkan waktu jika di-enable di server
    const timeInfo = cfg.show_time ? ` ${data.time}` : '';
    p += `Tgl: ${data.date}${timeInfo}\n`;
    p += drawLine() + "\n";

    // DAFTAR ITEMS
    data.products.forEach((item: any) => {
      p += `${item.name.toUpperCase()}\n`;
      const leftInfo = `${item.qty} x ${item.price.toLocaleString()}`;
      const rightInfo = item.subtotal.toLocaleString();
      p += formatLine(leftInfo, rightInfo) + "\n";
    });

    p += drawLine() + "\n";

    // RINGKASAN HARGA
    p += formatLine("Subtotal", data.sub_amount.toLocaleString()) + "\n";
    if (data.tax_amount > 0) {
      p += formatLine(`Pajak (${cfg.tax_percentage || 0}%)`, data.tax_amount.toLocaleString()) + "\n";
    }
    
    p += drawLine('=') + "\n";
    
    // TOTAL
    p += commands.boldOn;
    p += formatLine("TOTAL", data.total_amount.toLocaleString()) + "\n";
    p += commands.boldOff;
    
    p += formatLine("BAYAR", (data.payment_amount || 0).toLocaleString()) + "\n";
    p += formatLine("KEMBALI", (data.change_amount || 0).toLocaleString()) + "\n";

    // FOOTER (Socials & Greeting)

    p += "\n\n\n" + commands.center;

    if (cfg.instagram?.status && cfg.instagram?.value) {
      p += `IG: @${cfg.instagram.value}\n`;
    }

    if (cfg.website?.status && cfg.website?.value) {
      p += `${cfg.website.value}\n`;
    }

    p += "\n" + commands.center;
  
    if (cfg.footer_note?.status && cfg.footer_note?.value) {
      p += `${cfg.footer_note.value}\n`;
    }

    p += commands.feed;
    
    return p;
  };



 const printViaBluetooth = async (data: any) => {
    try {
      // 1. CEK KONEKSI (Jangan pairing ulang jika sudah ada cache)
      if (!cachedServer || !cachedServer.connected) {
        console.log("Memulai koneksi Bluetooth baru...");
        
        cachedDevice = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: [
            '000018f0-0000-1000-8000-00805f9b34fb', 
            '00001101-0000-1000-8000-00805f9b34fb',
            '49535343-fe7d-4ae5-8fa9-9fafd205e455'
          ]
        });

        cachedServer = await cachedDevice.gatt?.connect();
        
        // Listener saat koneksi terputus secara fisik (printer mati/jauh)
        cachedDevice.addEventListener('gattserverdisconnected', () => {
          console.log("Printer terputus.");
          isConnected.value = false;
          connectionType.value = null;
          cachedServer = null; // Reset cache agar bisa pairing ulang nanti
        });
      }

      // Update State UI
      isConnected.value = true;
      connectionType.value = 'BT';
      deviceName.value = cachedDevice.name || 'Printer BT';

      // 2. SEARCH SERVICES & CHARACTERISTICS
      const services = await cachedServer.getPrimaryServices();
      if (services.length === 0) throw new Error("Printer tidak melaporkan adanya Service GATT.");

      let characteristic: any = null;
      for (const service of services) {
        const characteristics = await service.getCharacteristics();
        characteristic = characteristics.find((c: any) => 
          c.properties.write || c.properties.writeWithoutResponse
        );
        if (characteristic) break;
      }

      if (!characteristic) throw new Error("Jalur data (Characteristic) tidak ditemukan.");

      // 3. GENERATE PAYLOAD
      const encoder = new TextEncoder();
      const payload = encoder.encode(buildReceiptString(data));

      // 4. KIRIM DATA DENGAN CHUNKING & DELAY (Agar printer tidak error/tersedak)
      const CHUNK_SIZE = 20; // Ukuran standar MTU BLE
      for (let i = 0; i < payload.length; i += CHUNK_SIZE) {
        const chunk = payload.slice(i, i + CHUNK_SIZE);
        
        if (characteristic.properties.writeWithoutResponse) {
           await characteristic.writeValueWithoutResponse(chunk);
        } else {
           await characteristic.writeValue(chunk);
        }

        // Delay kecil 30ms per chunk sangat penting untuk printer Bluetooth thermal murah
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      
      console.log("✅ Berhasil cetak struk!");

    } catch (error: any) {
      console.error("BT Error:", error);
      
      // Jangan hapus cache jika user hanya menekan 'Cancel' pada popup
      if (error.name !== 'NotFoundError') {
        cachedServer = null; 
      }
      
      alert(`Gagal cetak: ${error.message}`);
    }
  };
  
  const printViaUSB = async (data: any) => {
    try {
      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate: 9600 });

      isConnected.value = true;
      connectionType.value = 'USB';

      const writer = port.writable.getWriter();
      const encoder = new TextEncoder();
      const payload = encoder.encode(buildReceiptString(data));
      
      await writer.write(payload);
      writer.releaseLock();
      await port.close();
    } catch (error: any) {
      console.error("USB Error:", error);
    }
  };

  return { isConnected, connectionType, deviceName, printManualSettlement, printViaBluetooth,printViaBluetoothSummary, printViaUSB };

};