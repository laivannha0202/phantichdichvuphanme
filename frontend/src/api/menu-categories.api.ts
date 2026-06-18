import apiClient from './client';
import type { ApiResponse } from '../types/api.types';
import type {
  MenuCategory,
  CreateMenuCategoryRequest,
  UpdateMenuCategoryRequest,
} from '../types/sprint2.types';

export const menuCategoriesApi = {
  getAll: async (): Promise<ApiResponse<MenuCategory[]>> => {
    const response = await apiClient.get<ApiResponse<MenuCategory[]>>('/menu-categories');
    return response.data;
  },

  getOne: async (id: number): Promise<ApiResponse<MenuCategory>> => {
    const response = await apiClient.get<ApiResponse<MenuCategory>>(`/menu-categories/${id}`);
    return response.data;
  },

  create: async (data: CreateMenuCategoryRequest): Promise<ApiResponse<MenuCategory>> => {
    const response = await apiClient.post<ApiResponse<MenuCategory>>('/menu-categories', data);
    return response.data;
  },

  update: async (
    id: number,
    data: UpdateMenuCategoryRequest,
  ): Promise<ApiResponse<MenuCategory>> => {
    const response = await apiClient.patch<ApiResponse<MenuCategory>>(
      `/menu-categories/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/menu-categories/${id}`);
    return response.data;
  },
};
