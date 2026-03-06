
// utils/category.ts

// Cukup simpan nama ikonnya saja sebagai string (sesuai nama di lucide.dev)
export const categoryIcons: Record<string, string> = {
  DRK: 'lucide:coffee',
  FOD: 'lucide:utensils',
  SEM: 'lucide:shopping-bag',
  PERL: 'lucide:briefcase',
  BRG: 'lucide:package',
  ATK: 'lucide:pencil',
  ELK: 'lucide:zap',
  CLEAN: 'lucide:spray-can'
};

// Fungsi ini sekarang mengembalikan string, bukan komponen
export const getCategoryIcon = (refCode: string | undefined): string => {
  return categoryIcons[refCode || ''] || 'lucide:utensils';
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