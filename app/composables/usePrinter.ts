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
  const charWidth = 30;

  const commands = {
    init: '\x1B\x40',
    center: '\x1B\x61\x01',
    left: '\x1B\x61\x00',
    right: '\x1B\x61\x02',
    boldOn: '\x1B\x45\x01',
    boldOff: '\x1B\x45\x00',
    setMargin: '\x1D\x4C\x10\x00', // Margin kiri agar teks tidak terlalu mepet gear
    feed: '\x0A\x0A\x0A\x0A\x0A',  // Feed extra agar kertas keluar cukup untuk disobek
  };

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

  const formatLine = (left: string, right: string) => {
    const spaceCount = charWidth - (left.length + right.length);
    return left + " ".repeat(Math.max(0, spaceCount)) + right;
  };

  const drawLine = (char = '-') => char.repeat(charWidth);

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

  return { isConnected, connectionType, deviceName, printViaBluetooth, printViaUSB };
};