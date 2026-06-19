import apiClient from './client';
import { unwrapApiData } from './unwrap';
import type { RoleRecord } from '../types/staffUsers.types';

export const getRoles = async (): Promise<RoleRecord[]> => {
  const response = await apiClient.get('/roles');
  return unwrapApiData<RoleRecord[]>(response);
};
