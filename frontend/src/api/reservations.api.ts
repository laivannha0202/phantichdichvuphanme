import apiClient from './client';
import type { ApiResponse } from '../types/api.types';
import type {
  Reservation,
  CreateReservationRequest,
  UpdateReservationRequest,
} from '../types/sprint6.types';

export const reservationsApi = {
  /**
   * Lấy danh sách đặt bàn
   */
  getAll: async (params?: {
    status?: string;
    table_id?: number;
    date?: string;
  }): Promise<ApiResponse<Reservation[]>> => {
    const response = await apiClient.get<ApiResponse<Reservation[]>>(
      '/reservations',
      { params },
    );
    return response.data;
  },

  /**
   * Lấy chi tiết đặt bàn
   */
  getById: async (id: number): Promise<ApiResponse<Reservation>> => {
    const response = await apiClient.get<ApiResponse<Reservation>>(
      `/reservations/${id}`,
    );
    return response.data;
  },

  /**
   * Tạo đặt bàn mới
   */
  create: async (
    data: CreateReservationRequest,
  ): Promise<ApiResponse<Reservation>> => {
    const response = await apiClient.post<ApiResponse<Reservation>>(
      '/reservations',
      data,
    );
    return response.data;
  },

  /**
   * Cập nhật đặt bàn
   */
  update: async (
    id: number,
    data: UpdateReservationRequest,
  ): Promise<ApiResponse<Reservation>> => {
    const response = await apiClient.patch<ApiResponse<Reservation>>(
      `/reservations/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Xác nhận đặt bàn
   */
  confirm: async (id: number): Promise<ApiResponse<Reservation>> => {
    const response = await apiClient.patch<ApiResponse<Reservation>>(
      `/reservations/${id}/confirm`,
    );
    return response.data;
  },

  /**
   * Check-in (khách đến nhận bàn)
   */
  checkIn: async (id: number): Promise<ApiResponse<Reservation>> => {
    const response = await apiClient.patch<ApiResponse<Reservation>>(
      `/reservations/${id}/check-in`,
    );
    return response.data;
  },

  /**
   * Hủy đặt bàn
   */
  cancel: async (id: number): Promise<ApiResponse<Reservation>> => {
    const response = await apiClient.patch<ApiResponse<Reservation>>(
      `/reservations/${id}/cancel`,
    );
    return response.data;
  },

  /**
   * Đánh dấu khách không đến
   */
  noShow: async (id: number): Promise<ApiResponse<Reservation>> => {
    const response = await apiClient.patch<ApiResponse<Reservation>>(
      `/reservations/${id}/no-show`,
    );
    return response.data;
  },

  /**
   * Xóa đặt bàn (soft delete)
   */
  remove: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/reservations/${id}`,
    );
    return response.data;
  },
};
