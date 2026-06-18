import apiClient from './client';
import type { ApiResponse } from '../types/api.types';
import type {
  Table,
  CreateTableRequest,
  UpdateTableRequest,
  UpdateTableStatusRequest,
} from '../types/sprint2.types';

export const tablesApi = {
  getAll: async (params?: {
    table_area_id?: number;
    status?: string;
  }): Promise<ApiResponse<Table[]>> => {
    const response = await apiClient.get<ApiResponse<Table[]>>('/tables', { params });
    return response.data;
  },

  getOne: async (id: number): Promise<ApiResponse<Table>> => {
    const response = await apiClient.get<ApiResponse<Table>>(`/tables/${id}`);
    return response.data;
  },

  create: async (data: CreateTableRequest): Promise<ApiResponse<Table>> => {
    const response = await apiClient.post<ApiResponse<Table>>('/tables', data);
    return response.data;
  },

  update: async (id: number, data: UpdateTableRequest): Promise<ApiResponse<Table>> => {
    const response = await apiClient.patch<ApiResponse<Table>>(`/tables/${id}`, data);
    return response.data;
  },

  updateStatus: async (
    id: number,
    data: UpdateTableStatusRequest,
  ): Promise<ApiResponse<Table>> => {
    const response = await apiClient.patch<ApiResponse<Table>>(
      `/tables/${id}/status`,
      data,
    );
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/tables/${id}`);
    return response.data;
  },
};
