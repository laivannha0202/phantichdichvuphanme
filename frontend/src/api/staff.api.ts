import apiClient from './client';
import type {
  StaffRecord,
  CreateStaffDto,
  UpdateStaffDto,
} from '../types/staffUsers.types';

export const getStaffList = async (): Promise<StaffRecord[]> => {
  const response = await apiClient.get('/staff');
  return response.data;
};

export const getStaff = async (id: number): Promise<StaffRecord> => {
  const response = await apiClient.get(`/staff/${id}`);
  return response.data;
};

export const createStaff = async (data: CreateStaffDto): Promise<StaffRecord> => {
  const response = await apiClient.post('/staff', data);
  return response.data;
};

export const updateStaff = async (id: number, data: UpdateStaffDto): Promise<StaffRecord> => {
  const response = await apiClient.patch(`/staff/${id}`, data);
  return response.data;
};

export const updateStaffStatus = async (id: number, status: string): Promise<StaffRecord> => {
  const response = await apiClient.patch(`/staff/${id}/status`, { status });
  return response.data;
};

export const deleteStaff = async (id: number): Promise<void> => {
  await apiClient.delete(`/staff/${id}`);
};
