import apiClient from './client';
import type { ApiResponse } from '../types/api.types';
import type { LoginRequest, LoginResponse, User, RefreshResponse } from '../types/auth.types';

export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data);
    return response.data;
  },

  refresh: async (): Promise<ApiResponse<RefreshResponse>> => {
    const response = await apiClient.post<ApiResponse<RefreshResponse>>('/auth/refresh');
    return response.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/auth/logout');
    return response.data;
  },

  me: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },
};
