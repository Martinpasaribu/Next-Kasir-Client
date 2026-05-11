// app/types/category.ts

export interface MediaObject {
  _id?: string;
  url: string;
  fileId: string;
  fileName: string;
  fileType: string;
  size: number;
}

export interface ICategory {
  _id: string;          // ID dari MongoDB
  id: string;           // Virtual ID (biasanya hasil toJSON)
  name: string;
  slug: string;
  description?: string;
  sub_description?: string;
  
  // Media fields sesuai schema NestJS kamu
  icon?: MediaObject;
  image_bg?: MediaObject;
  images: MediaObject[];

  // Settings & Metadata
  isActive: boolean;
  order: number;
  isDeleted: boolean;
  isFree: boolean;
  recommend: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Untuk keperluan Form (Tambah/Edit)
export type CategoryForm = Pick<ICategory, 'name' | 'description' | 'sub_description'> & {
  id?: string | null;
};