import apiClient from './client';
import { unwrapApiData } from './unwrap';
import type {
  StaffRecord,
  CreateStaffDto,
  UpdateStaffDto,
} from '../types/staffUsers.types';

export const getStaffList = async (): Promise<StaffRecord[]> => {
  const response = await apiClient.get('/staff');
  return unwrapApiData<StaffRecord[]>(response);
};

export const getStaff = async (id: number): Promise<StaffRecord> => {
  const response = await apiClient.get(`/staff/${id}`);
  return unwrapApiData<StaffRecord>(response);
};

export const createStaff = async (data: CreateStaffDto): Promise<StaffRecord> => {
  const response = await apiClient.post('/staff', data);
  return unwrapApiData<StaffRecord>(response);
};

export const updateStaff = async (id: number, data: UpdateStaffDto): Promise<StaffRecord> => {
  const response = await apiClient.patch(`/staff/${id}`, data);
  return unwrapApiData<StaffRecord>(response);
};

export const updateStaffStatus = async (id: number, status: string): Promise<StaffRecord> => {
  const response = await apiClient.patch(`/staff/${id}/status`, { status });
  return unwrapApiData<StaffRecord>(response);
};

export const deleteStaff = async (id: number): Promise<void> => {
  await apiClient.delete(`/staff/${id}`);
};
