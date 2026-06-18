import apiClient from './client';
import type { ApiResponse } from '../types/api.types';
import type {
  Order,
  OrderItem,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  AddOrderItemRequest,
  UpdateOrderItemRequest,
  UpdateOrderItemStatusRequest,
} from '../types/sprint3.types';

export const ordersApi = {
  // ==================== ORDER ====================

  getAll: async (params?: {
    status?: string;
  }): Promise<ApiResponse<Order[]>> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders', { params });
    return response.data;
  },

  getOpen: async (): Promise<ApiResponse<Order[]>> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders/open');
    return response.data;
  },

  getOne: async (id: number): Promise<ApiResponse<Order>> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  },

  getByTable: async (tableId: number): Promise<ApiResponse<Order | null>> => {
    const response = await apiClient.get<ApiResponse<Order | null>>(
      `/tables/${tableId}/order`,
    );
    return response.data;
  },

  create: async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    const response = await apiClient.post<ApiResponse<Order>>('/orders', data);
    return response.data;
  },

  updateStatus: async (
    id: number,
    data: UpdateOrderStatusRequest,
  ): Promise<ApiResponse<Order>> => {
    const response = await apiClient.patch<ApiResponse<Order>>(
      `/orders/${id}/status`,
      data,
    );
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/orders/${id}`);
    return response.data;
  },

  // ==================== ORDER ITEM ====================

  addItem: async (
    orderId: number,
    data: AddOrderItemRequest,
  ): Promise<ApiResponse<OrderItem>> => {
    const response = await apiClient.post<ApiResponse<OrderItem>>(
      `/orders/${orderId}/items`,
      data,
    );
    return response.data;
  },

  updateItem: async (
    orderId: number,
    itemId: number,
    data: UpdateOrderItemRequest,
  ): Promise<ApiResponse<OrderItem>> => {
    const response = await apiClient.patch<ApiResponse<OrderItem>>(
      `/orders/${orderId}/items/${itemId}`,
      data,
    );
    return response.data;
  },

  updateItemStatus: async (
    orderId: number,
    itemId: number,
    data: UpdateOrderItemStatusRequest,
  ): Promise<ApiResponse<OrderItem>> => {
    const response = await apiClient.patch<ApiResponse<OrderItem>>(
      `/orders/${orderId}/items/${itemId}/status`,
      data,
    );
    return response.data;
  },

  deleteItem: async (
    orderId: number,
    itemId: number,
  ): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/orders/${orderId}/items/${itemId}`,
    );
    return response.data;
  },
};
