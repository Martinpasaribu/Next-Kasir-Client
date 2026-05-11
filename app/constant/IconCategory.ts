// utils/category.ts

// constant/IconCategory.ts

export const categoryIcons: Record<string, { icon: string, label: string }> = {
  // --- F&B (FOOD & BEVERAGE) ---
  DRK: { icon: 'lucide:coffee', label: 'Minuman' },
  FOD: { icon: 'lucide:utensils', label: 'Makanan' },
  SNK: { icon: 'lucide:cookie', label: 'Camilan / Snack' },
  BAK: { icon: 'lucide:croissant', label: 'Roti / Bakery' },
  FRU: { icon: 'lucide:apple', label: 'Buah & Sayur' },
  FZN: { icon: 'lucide:snowflake', label: 'Frozen Food' },

  // --- FASHION & LIFESTYLE ---
  CLO: { icon: 'lucide:shirt', label: 'Pakaian / Fashion' },
  SHO: { icon: 'lucide:footprints', label: 'Sepatu & Alas Kaki' },
  ACC: { icon: 'lucide:watch', label: 'Aksesoris / Jam' },
  BTY: { icon: 'lucide:sparkles', label: 'Kecantikan / Kosmetik' },
  JWL: { icon: 'lucide:gem', label: 'Perhiasan' },
  BAG: { icon: 'lucide:shopping-bag', label: 'Tas / Koper' },

  // --- RETAIL & GROCERY ---
  SEM: { icon: 'lucide:store', label: 'Sembako / Toko' },
  BRG: { icon: 'lucide:package', label: 'Barang Umum' },
  PRD: { icon: 'lucide:box', label: 'Produk Jadi' },
  MED: { icon: 'lucide:pill', label: 'Obat / Farmasi' },
  HHD: { icon: 'lucide:home', label: 'Rumah Tangga' },

  // --- TECH & GADGET ---
  ELK: { icon: 'lucide:zap', label: 'Elektronik' },
  COM: { icon: 'lucide:monitor', label: 'Komputer / Laptop' },
  PHN: { icon: 'lucide:smartphone', label: 'HP / Gadget' },
  GME: { icon: 'lucide:gamepad-2', label: 'Game / Hobi' },

  // --- OFFICE & EDUCATION ---
  ATK: { icon: 'lucide:pencil', label: 'Alat Tulis' },
  BOK: { icon: 'lucide:book-open', label: 'Buku / Literasi' },
  PERL: { icon: 'lucide:briefcase', label: 'Perlengkapan Kantor' },

  // --- AUTOMOTIVE & TOOLS ---
  MTR: { icon: 'lucide:bike', label: 'Motor / Sepeda' },
  CAR: { icon: 'lucide:car', label: 'Mobil / Otomotif' },
  SRV: { icon: 'lucide:wrench', label: 'Servis / Sparepart' },
  BGN: { icon: 'lucide:hammer', label: 'Bahan Bangunan' },

  // --- SERVICE & LAUNDRY ---
  CLEAN: { icon: 'lucide:spray-can', label: 'Kebersihan' },
  LND: { icon: 'lucide:washing-machine', label: 'Laundry / Jasa' },
  DLV: { icon: 'lucide:truck', label: 'Pengiriman / Logistik' },

  // --- PETS & HOBBIES ---
  PET: { icon: 'lucide:dog', label: 'Pet Shop / Hewan' },
  TOY: { icon: 'lucide:baby', label: 'Mainan Anak' },
  SPT: { icon: 'lucide:dumbbells', label: 'Olahraga' },
  MUS: { icon: 'lucide:music', label: 'Musik / Instrumen' },

  // --- DIGITAL & OTHERS ---
  PDF: { icon: 'lucide:file-text', label: 'Produk Digital' },
  VCH: { icon: 'lucide:ticket', label: 'Voucher / Pulsa' },
  CTG: { icon: 'lucide:layout-template', label: 'Custom / Jasa' },
  OTH: { icon: 'lucide:more-horizontal', label: 'Lain-lain' }
};

// Fungsi tetap mengembalikan string nama ikon untuk komponen <Icon />
// constant/IconCategory.ts

export const getCategoryIcon = (refCode: string | undefined | null): string => {
  // Gunakan optional chaining (?.) untuk menangani null/undefined dengan aman
  const code = refCode?.trim().toUpperCase() || '';
  return categoryIcons[code]?.icon || 'lucide:help-circle';
};

export const getCategoryLabel = (refCode: string | undefined | null): string => {
  const code = refCode?.trim().toUpperCase() || '';
  return categoryIcons[code]?.label || 'Kategori Umum';
};

// // utils/category.ts
// import { 
//   Utensils, Coffee, ShoppingBag, Briefcase, 
//   Package, Pencil, Zap, SprayCan 
// } from 'lucide-vue-next';

// export const categoryIcons: Record<string, any> = {
//   DRK: Coffee,      // Minuman
//   FOD: Utensils,   // Makanan
//   SEM: ShoppingBag, // Sembako
//   PERL: Briefcase,  // Perlengkapan
//   BRG: Package,     // Barang
//   ATK: Pencil,      // Alat Tulis
//   ELK: Zap,         // Elektronik
//   CLEAN: SprayCan   // Kebersihan
// };

// export const getCategoryIcon = (refCode: string | undefined) => {
//   return categoryIcons[refCode || ''] || Utensils;
// };