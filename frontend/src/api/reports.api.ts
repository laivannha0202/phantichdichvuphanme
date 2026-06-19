import apiClient from './client';
import { unwrapApiData } from './unwrap';
import type {
  RevenueSummary,
  DailyRevenueResponse,
  TopItemsResponse,
  PaymentMethodsResponse,
} from '../types/sprint7.types';

export const reportsApi = {
  /**
   * Tổng quan doanh thu
   */
  async getRevenueSummary(fromDate?: string, toDate?: string): Promise<RevenueSummary> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient.get(`/reports/revenue/summary${query}`);
    return unwrapApiData<RevenueSummary>(response);
  },

  /**
   * Doanh thu theo ngày
   */
  async getRevenueByDay(fromDate?: string, toDate?: string): Promise<DailyRevenueResponse> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient.get(`/reports/revenue/daily${query}`);
    return unwrapApiData<DailyRevenueResponse>(response);
  },

  /**
   * Top món bán chạy
   */
  async getTopItems(fromDate?: string, toDate?: string, limit?: number): Promise<TopItemsResponse> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    if (limit) params.append('limit', limit.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient.get(`/reports/revenue/top-items${query}`);
    return unwrapApiData<TopItemsResponse>(response);
  },

  /**
   * Doanh thu theo phương thức thanh toán
   */
  async getRevenueByPaymentMethod(
    fromDate?: string,
    toDate?: string,
  ): Promise<PaymentMethodsResponse> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient.get(`/reports/revenue/payment-methods${query}`);
    return unwrapApiData<PaymentMethodsResponse>(response);
  },
};
