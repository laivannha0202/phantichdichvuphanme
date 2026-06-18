import apiClient from './client';
import type {
  Invoice,
  Payment,
  CreateInvoiceRequest,
  PayInvoiceRequest,
  CancelInvoiceRequest,
  PayInvoiceResponse,
} from '../types/sprint4.types';

// ==================== INVOICES ====================

/**
 * Lấy danh sách hóa đơn
 */
export async function getInvoices(status?: string): Promise<Invoice[]> {
  const params = status ? { status } : {};
  const response = await apiClient.get('/invoices', { params });
  return response.data.data;
}

/**
 * Lấy chi tiết hóa đơn
 */
export async function getInvoice(id: number): Promise<Invoice> {
  const response = await apiClient.get(`/invoices/${id}`);
  return response.data.data;
}

/**
 * Tạo hóa đơn từ đơn hàng
 */
export async function createInvoice(data: CreateInvoiceRequest): Promise<Invoice> {
  const response = await apiClient.post('/invoices', data);
  return response.data.data;
}

/**
 * Thanh toán hóa đơn
 */
export async function payInvoice(
  id: number,
  data: PayInvoiceRequest,
): Promise<PayInvoiceResponse> {
  const response = await apiClient.post(`/invoices/${id}/pay`, data);
  return response.data.data;
}

/**
 * Hủy hóa đơn
 */
export async function cancelInvoice(
  id: number,
  data: CancelInvoiceRequest,
): Promise<{ invoice_status: string }> {
  const response = await apiClient.post(`/invoices/${id}/cancel`, data);
  return response.data.data;
}

/**
 * Lấy danh sách thanh toán của hóa đơn
 */
export async function getInvoicePayments(id: number): Promise<Payment[]> {
  const response = await apiClient.get(`/invoices/${id}/payments`);
  return response.data.data;
}
