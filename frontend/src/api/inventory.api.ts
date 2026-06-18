import apiClient from './client';
import type {
  Supplier,
  CreateSupplierDto,
  UpdateSupplierDto,
  Ingredient,
  CreateIngredientDto,
  UpdateIngredientDto,
  InventoryTransaction,
  CreateTransactionDto,
  ExportTransactionDto,
  InventorySummary,
} from '../types/inventory.types';

// ==================== SUPPLIERS ====================

export const getSuppliers = async (): Promise<Supplier[]> => {
  const response = await apiClient.get('/inventory/suppliers');
  return response.data;
};

export const getSupplier = async (id: number): Promise<Supplier> => {
  const response = await apiClient.get(`/inventory/suppliers/${id}`);
  return response.data;
};

export const createSupplier = async (data: CreateSupplierDto): Promise<Supplier> => {
  const response = await apiClient.post('/inventory/suppliers', data);
  return response.data;
};

export const updateSupplier = async (id: number, data: UpdateSupplierDto): Promise<Supplier> => {
  const response = await apiClient.patch(`/inventory/suppliers/${id}`, data);
  return response.data;
};

// ==================== INGREDIENTS ====================

export const getIngredients = async (): Promise<Ingredient[]> => {
  const response = await apiClient.get('/inventory/ingredients');
  return response.data;
};

export const getIngredient = async (id: number): Promise<Ingredient> => {
  const response = await apiClient.get(`/inventory/ingredients/${id}`);
  return response.data;
};

export const createIngredient = async (data: CreateIngredientDto): Promise<Ingredient> => {
  const response = await apiClient.post('/inventory/ingredients', data);
  return response.data;
};

export const updateIngredient = async (id: number, data: UpdateIngredientDto): Promise<Ingredient> => {
  const response = await apiClient.patch(`/inventory/ingredients/${id}`, data);
  return response.data;
};

// ==================== TRANSACTIONS ====================

export const getTransactions = async (): Promise<InventoryTransaction[]> => {
  const response = await apiClient.get('/inventory/transactions');
  return response.data;
};

export const importStock = async (data: CreateTransactionDto): Promise<InventoryTransaction> => {
  const response = await apiClient.post('/inventory/transactions/import', data);
  return response.data;
};

export const exportStock = async (data: ExportTransactionDto): Promise<InventoryTransaction> => {
  const response = await apiClient.post('/inventory/transactions/export', data);
  return response.data;
};

// ==================== DASHBOARD ====================

export const getLowStock = async (): Promise<Ingredient[]> => {
  const response = await apiClient.get('/inventory/low-stock');
  return response.data;
};

export const getSummary = async (): Promise<InventorySummary> => {
  const response = await apiClient.get('/inventory/summary');
  return response.data;
};