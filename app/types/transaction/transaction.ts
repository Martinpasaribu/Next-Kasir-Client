// src/types/transaction.ts

export type PaymentStatus = 'dp' | 'pending' | 'paid' | '';
export type TransactionStatus = 'PAID' | 'CANCELLED' | 'REFUND' | 'PARTIAL';

export interface IPayment {
  type: string;        // 'cash', 'qris', 'bank_transfer', dll
  pay_id: string;
  status: PaymentStatus;
  code: string;
  label: string;       // Nama metode, misal: "BCA EDC", "Tunai"
  due_price: number;   // Sisa tagihan
  price: number;       // Nominal yang dibayarkan
  change: number;      // Kembalian
  note: string;
  user_sent: string;
  bill_key: string;
  biller_code: string;
  merchant_id: string;
  account_number: string;
  provider_name: string;
  currency: string;    // Default: 'IDR'
}

export interface IDiscount {
  promo_id?: string;   // ID dari MongoDB Promo
  type: string;        // 'percentage' | 'fixed'
  nominal: number;
}

export interface ITransactionProduct {
  product_id: string;
  name: string;        // Snapshot nama saat transaksi
  price: number;       // Snapshot harga saat transaksi
  discount_item: number;
  qty: number;
  subtotal: number;
}

export interface ITransaction {
  _id?: string;        // Generate otomatis dari MongoDB
  trx_id: string;      // Contoh: INV/2023/0001
  outlet_id: string;   // Reference ID Outlet
  customer_key?: any;
  cashier_key: string;
  product_key: ITransactionProduct[];
  down_payment: number;  // Total down_payment
  sub_amount: number;  // Total sebelum diskon/pajak
  total_amount: number; // Total akhir yang dibayarkan
  discount: IDiscount;
  tax_amount: number;
  shippingFee: number;
  note: string;
  payments: IPayment[];
  status: TransactionStatus;
  created_by: string;  // ID User/Kasir
  syncStatus: string;  // synced | pending | failed ( S | P | F })
  createdAt?: string;  // ISO Date string
  updatedAt?: string;  // ISO Date string
}