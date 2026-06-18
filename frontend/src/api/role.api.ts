import apiClient from './client';
import type { RoleRecord } from '../types/staffUsers.types';

export const getRoles = async (): Promise<RoleRecord[]> => {
  const response = await apiClient.get('/roles');
  return response.data;
};
