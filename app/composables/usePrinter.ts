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
    if (!cachedServer || !cachedServer.connected) {
      cachedDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb', '00001101-0000-1000-8000-00805f9b34fb']
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

    if (!characteristic) throw new Error("Characteristic not found");

    const finalString = data.type === 'SUMMARY_REPORT' 
      ? buildSummaryString(data) 
      : buildReceiptString(data);

    const encoder = new TextEncoder();
    const payload = encoder.encode(finalString);

    /**
     * PERBAIKAN DI SINI:
     * Gunakan CHUNK_SIZE kecil (20 bytes adalah standar MTU Bluetooth Low Energy)
     * Tambahkan delay agar printer tidak 'tersedak' (Buffer Overflow)
     */
    const CHUNK_SIZE = 20; 
    for (let i = 0; i < payload.length; i += CHUNK_SIZE) {
      const chunk = payload.slice(i, i + CHUNK_SIZE);
      
      await characteristic.writeValueWithoutResponse(chunk);
      
      // Tunggu 30ms setiap chunk agar printer sempat memproses buffer
      await new Promise(resolve => setTimeout(resolve, 30));
    }

    console.log("Cetak selesai terkirim");

  } catch (error: any) {
    cachedServer = null;
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
      if (!cachedServer || !cachedServer.connected) {
        cachedDevice = await navigator.bluetooth.requestDevice({
          // GUNAKAN INI: Terima semua perangkat yang punya nama "Printer" atau sejenisnya
          // atau gunakan acceptAllDevices tapi tetap definisikan optionalServices
          acceptAllDevices: true,
          optionalServices: [
            '000018f0-0000-1000-8000-00805f9b34fb', // Custom Service
            '00001101-0000-1000-8000-00805f9b34fb', // Serial Port Profile (Sangat Umum)
            '49535343-fe7d-4ae5-8fa9-9fafd205e455'  // Service alternatif
          ]
        });

        cachedServer = await cachedDevice.gatt?.connect();
        
        cachedDevice.addEventListener('gattserverdisconnected', () => {
          isConnected.value = false;
          connectionType.value = null;
          cachedServer = null;
        });
      }

      isConnected.value = true;
      connectionType.value = 'BT';
      deviceName.value = cachedDevice.name || 'Printer BT';

      // --- PERBAIKAN DI SINI ---
      // Ambil semua service yang tersedia di printer
      const services = await cachedServer.getPrimaryServices();
      
      if (services.length === 0) {
        throw new Error("Printer tidak melaporkan adanya Service GATT.");
      }

      let characteristic: any = null;

      // Loop semua service untuk mencari characteristic yang bisa di-write
      for (const service of services) {
        const characteristics = await service.getCharacteristics();
        characteristic = characteristics.find((c: any) => 
          c.properties.write || c.properties.writeWithoutResponse
        );
        if (characteristic) break; // Ketemu!
      }

      if (!characteristic) {
        throw new Error("Printer ditemukan, tapi tidak ada jalur untuk mengirim data (Write Characteristic not found).");
      }

      // 3. Kirim Data
      const encoder = new TextEncoder();
      const payload = encoder.encode(buildReceiptString(data));

      // Gunakan writeValue atau writeValueWithoutResponse (lebih cepat)
      const CHUNK_SIZE = 20;
      for (let i = 0; i < payload.length; i += CHUNK_SIZE) {
        const chunk = payload.slice(i, i + CHUNK_SIZE);
        if (characteristic.properties.writeWithoutResponse) {
           await characteristic.writeValueWithoutResponse(chunk);
        } else {
           await characteristic.writeValue(chunk);
        }
      }
      
      console.log("✅ Berhasil cetak!");

    } catch (error: any) {
      console.error("BT Error:", error);
      cachedServer = null; 
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

  return { isConnected, connectionType, deviceName, printViaBluetooth,printViaBluetoothSummary, printViaUSB };
};