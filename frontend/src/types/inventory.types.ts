// Supplier types
export interface Supplier {
  id: number;
  supplierCode: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  note?: string;
  status: 'DANG_HOP_TAC' | 'NGUNG_HOP_TAC';
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierDto {
  supplierCode: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  note?: string;
}

export interface UpdateSupplierDto {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  note?: string;
  status?: 'DANG_HOP_TAC' | 'NGUNG_HOP_TAC';
}

// Ingredient types
export interface Ingredient {
  id: number;
  ingredientCode: string;
  name: string;
  unit: string;
  currentStock: number;
  minStock: number;
  status: 'CON_HANG' | 'SAP_HET' | 'HET_HANG' | 'NGUNG_SU_DUNG';
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIngredientDto {
  ingredientCode: string;
  name: string;
  unit: string;
  currentStock?: number;
  minStock?: number;
  note?: string;
}

export interface UpdateIngredientDto {
  name?: string;
  unit?: string;
  minStock?: number;
  note?: string;
  status?: 'CON_HANG' | 'SAP_HET' | 'HET_HANG' | 'NGUNG_SU_DUNG';
}

// Transaction types
export interface InventoryTransaction {
  id: number;
  transactionCode: string;
  ingredientId: number;
  supplierId?: number;
  type: 'NHAP_KHO' | 'XUAT_KHO' | 'DIEU_CHINH';
  quantity: number;
  unitPrice?: number;
  totalAmount?: number;
  note?: string;
  createdByUserId?: number;
  createdAt: string;
  updatedAt: string;
  ingredient?: Ingredient;
  supplier?: Supplier;
}

export interface CreateTransactionDto {
  ingredientId: number;
  supplierId?: number;
  type: 'NHAP_KHO' | 'XUAT_KHO' | 'DIEU_CHINH';
  quantity: number;
  unitPrice?: number;
  note?: string;
}

export interface ExportTransactionDto {
  ingredientId: number;
  quantity: number;
  note?: string;
}

// Summary types
export interface InventorySummary {
  totalIngredients: number;
  lowStockCount: number;
  totalTransactions: number;
  totalStockValue: number;
}