import apiClient from './client';
import type { ApiResponse } from '../types/api.types';
import type {
  KitchenItem,
  UpdateKitchenItemStatusRequest,
} from '../types/sprint5.types';

export const kitchenApi = {
  /**
   * Lấy danh sách món cần bếp xử lý
   */
  getAllItems: async (params?: {
    status?: string;
  }): Promise<ApiResponse<KitchenItem[]>> => {
    const response = await apiClient.get<ApiResponse<KitchenItem[]>>(
      '/kitchen/items',
      { params },
    );
    return response.data;
  },

  /**
   * Lấy danh sách món chờ chế biến (CHO_CHE_BIEN)
   */
  getPendingItems: async (): Promise<ApiResponse<KitchenItem[]>> => {
    const response = await apiClient.get<ApiResponse<KitchenItem[]>>(
      '/kitchen/items/pending',
    );
    return response.data;
  },

  /**
   * Cập nhật trạng thái món trong bếp
   */
  updateItemStatus: async (
    itemId: number,
    data: UpdateKitchenItemStatusRequest,
  ): Promise<ApiResponse<{ id: number; status: string }>> => {
    const response = await apiClient.patch<
      ApiResponse<{ id: number; status: string }>
    >(`/kitchen/items/${itemId}/status`, data);
    return response.data;
  },
};
