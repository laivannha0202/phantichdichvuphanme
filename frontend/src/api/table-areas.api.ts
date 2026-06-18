import apiClient from './client';
import type { ApiResponse } from '../types/api.types';
import type {
  TableArea,
  CreateTableAreaRequest,
  UpdateTableAreaRequest,
} from '../types/sprint2.types';

export const tableAreasApi = {
  getAll: async (): Promise<ApiResponse<TableArea[]>> => {
    const response = await apiClient.get<ApiResponse<TableArea[]>>('/table-areas');
    return response.data;
  },

  getOne: async (id: number): Promise<ApiResponse<TableArea>> => {
    const response = await apiClient.get<ApiResponse<TableArea>>(`/table-areas/${id}`);
    return response.data;
  },

  create: async (data: CreateTableAreaRequest): Promise<ApiResponse<TableArea>> => {
    const response = await apiClient.post<ApiResponse<TableArea>>('/table-areas', data);
    return response.data;
  },

  update: async (id: number, data: UpdateTableAreaRequest): Promise<ApiResponse<TableArea>> => {
    const response = await apiClient.patch<ApiResponse<TableArea>>(`/table-areas/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/table-areas/${id}`);
    return response.data;
  },
};
