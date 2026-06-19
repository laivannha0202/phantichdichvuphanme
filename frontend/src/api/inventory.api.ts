import apiClient from './client';
import { unwrapApiData } from './unwrap';
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
  return unwrapApiData<Supplier[]>(response);
};

export const getSupplier = async (id: number): Promise<Supplier> => {
  const response = await apiClient.get(`/inventory/suppliers/${id}`);
  return unwrapApiData<Supplier>(response);
};

export const createSupplier = async (data: CreateSupplierDto): Promise<Supplier> => {
  const response = await apiClient.post('/inventory/suppliers', data);
  return unwrapApiData<Supplier>(response);
};

export const updateSupplier = async (id: number, data: UpdateSupplierDto): Promise<Supplier> => {
  const response = await apiClient.patch(`/inventory/suppliers/${id}`, data);
  return unwrapApiData<Supplier>(response);
};

// ==================== INGREDIENTS ====================

export const getIngredients = async (): Promise<Ingredient[]> => {
  const response = await apiClient.get('/inventory/ingredients');
  return unwrapApiData<Ingredient[]>(response);
};

export const getIngredient = async (id: number): Promise<Ingredient> => {
  const response = await apiClient.get(`/inventory/ingredients/${id}`);
  return unwrapApiData<Ingredient>(response);
};

export const createIngredient = async (data: CreateIngredientDto): Promise<Ingredient> => {
  const response = await apiClient.post('/inventory/ingredients', data);
  return unwrapApiData<Ingredient>(response);
};

export const updateIngredient = async (id: number, data: UpdateIngredientDto): Promise<Ingredient> => {
  const response = await apiClient.patch(`/inventory/ingredients/${id}`, data);
  return unwrapApiData<Ingredient>(response);
};

// ==================== TRANSACTIONS ====================

export const getTransactions = async (): Promise<InventoryTransaction[]> => {
  const response = await apiClient.get('/inventory/transactions');
  return unwrapApiData<InventoryTransaction[]>(response);
};

export const importStock = async (data: CreateTransactionDto): Promise<InventoryTransaction> => {
  const response = await apiClient.post('/inventory/transactions/import', data);
  return unwrapApiData<InventoryTransaction>(response);
};

export const exportStock = async (data: ExportTransactionDto): Promise<InventoryTransaction> => {
  const response = await apiClient.post('/inventory/transactions/export', data);
  return unwrapApiData<InventoryTransaction>(response);
};

// ==================== DASHBOARD ====================

export const getLowStock = async (): Promise<Ingredient[]> => {
  const response = await apiClient.get('/inventory/low-stock');
  return unwrapApiData<Ingredient[]>(response);
};

export const getSummary = async (): Promise<InventorySummary> => {
  const response = await apiClient.get('/inventory/summary');
  return unwrapApiData<InventorySummary>(response);
};
