import apiClient from './client';
import type {
  AuditLogListResponse,
  AuditLogDetailResponse,
  AuditLogQueryParams,
} from '../types/auditLog.types';

export async function getAuditLogs(
  params: AuditLogQueryParams,
): Promise<AuditLogListResponse> {
  const response = await apiClient.get('/audit-logs', { params });
  return response.data;
}

export async function getAuditLog(
  id: number,
): Promise<AuditLogDetailResponse> {
  const response = await apiClient.get(`/audit-logs/${id}`);
  return response.data;
}
