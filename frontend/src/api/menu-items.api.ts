import apiClient from './client';
import type { ApiResponse } from '../types/api.types';
import type {
  MenuItem,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
  UpdateMenuItemStatusRequest,
} from '../types/sprint2.types';

export const menuItemsApi = {
  getAll: async (params?: {
    category_id?: number;
    status?: string;
  }): Promise<ApiResponse<MenuItem[]>> => {
    const response = await apiClient.get<ApiResponse<MenuItem[]>>('/menu-items', { params });
    return response.data;
  },

  getOne: async (id: number): Promise<ApiResponse<MenuItem>> => {
    const response = await apiClient.get<ApiResponse<MenuItem>>(`/menu-items/${id}`);
    return response.data;
  },

  create: async (data: CreateMenuItemRequest): Promise<ApiResponse<MenuItem>> => {
    const response = await apiClient.post<ApiResponse<MenuItem>>('/menu-items', data);
    return response.data;
  },

  update: async (id: number, data: UpdateMenuItemRequest): Promise<ApiResponse<MenuItem>> => {
    const response = await apiClient.patch<ApiResponse<MenuItem>>(`/menu-items/${id}`, data);
    return response.data;
  },

  updateStatus: async (
    id: number,
    data: UpdateMenuItemStatusRequest,
  ): Promise<ApiResponse<MenuItem>> => {
    const response = await apiClient.patch<ApiResponse<MenuItem>>(
      `/menu-items/${id}/status`,
      data,
    );
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/menu-items/${id}`);
    return response.data;
  },
};
