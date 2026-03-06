// app/utils/db.ts
import Dexie, { type Table } from 'dexie';
import type { ITransaction } from '~/types/transaction/transaction';

export interface Product {
  _id?: string; // ID dari MongoDB
  name: string;
  price_sell: number;
  price_buy: string;
  category: string;
  icon?: string;
}

// Interface Customer sesuai fitur sebelumnya
export interface ICustomer {
  id?: number; 
  name: string;
  phone: string;
  address?: string;
  createdAt: string;
  syncStatus: string;
}

export class PosDatabase extends Dexie {
  // Gunakan ITransaction untuk table orders agar struktur data lokal & remote sama
  orders!: Table<ITransaction & { id?: number; syncStatus: 'P' | 'S' | 'F' }>;
  customers!: Table<ICustomer>;
  products!: Table<any>; // Gunakan any atau buat interface produk jika perlu

  constructor() {
    super('NextKasirDB');
    
    this.version(2).stores({
      // ++id adalah primary key lokal untuk Dexie
      // syncStatus di-index agar pencarian data "pending" sangat cepat
      orders: 'trx_id, syncStatus, createdAt', 
      
      // Indexing name dan phone untuk fitur pencarian di CustomerModal
      customers: '++id, name, phone',
      
      // Indexing produk
      products: '_id, name, category_key.name' 
    });
  }
}

export const database_dexie = new PosDatabase();