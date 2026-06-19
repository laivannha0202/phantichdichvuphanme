import apiClient from './client';
import { unwrapApiData } from './unwrap';
import type {
  UserRecord,
  CreateUserDto,
  UpdateUserDto,
} from '../types/staffUsers.types';

export const getUsersList = async (): Promise<UserRecord[]> => {
  const response = await apiClient.get('/users');
  return unwrapApiData<UserRecord[]>(response);
};

export const getUser = async (id: number): Promise<UserRecord> => {
  const response = await apiClient.get(`/users/${id}`);
  return unwrapApiData<UserRecord>(response);
};

export const createUser = async (data: CreateUserDto): Promise<UserRecord> => {
  const response = await apiClient.post('/users', data);
  return unwrapApiData<UserRecord>(response);
};

export const updateUser = async (id: number, data: UpdateUserDto): Promise<UserRecord> => {
  const response = await apiClient.patch(`/users/${id}`, data);
  return unwrapApiData<UserRecord>(response);
};

export const updateUserStatus = async (id: number, status: string): Promise<UserRecord> => {
  const response = await apiClient.patch(`/users/${id}/status`, { status });
  return unwrapApiData<UserRecord>(response);
};

export const resetUserPassword = async (id: number, newPassword: string): Promise<void> => {
  await apiClient.post(`/users/${id}/reset-password`, { new_password: newPassword });
};

export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};
