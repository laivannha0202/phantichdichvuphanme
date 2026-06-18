export interface AuditLogRecord {
  id: number;
  userId: number | null;
  username: string | null;
  roleCode: string | null;
  action: string;
  module: string;
  entityType: string | null;
  entityId: string | null;
  method: string | null;
  path: string | null;
  statusCode: number | null;
  ipAddress: string | null;
  userAgent: string | null;
  description: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface AuditLogPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AuditLogListResponse {
  data: AuditLogRecord[];
  pagination: AuditLogPagination;
  message: string;
}

export interface AuditLogDetailResponse {
  data: AuditLogRecord | null;
  message: string;
}

export interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  username?: string;
  role_code?: string;
  action?: string;
  module?: string;
  entity_type?: string;
  entity_id?: string;
  from_date?: string;
  to_date?: string;
  sort?: 'asc' | 'desc';
}

// Mapping action → label tiếng Việt
export const AUDIT_ACTION_LABELS: Record<string, string> = {
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  LOGIN_FAILED: 'Đăng nhập thất bại',
  CREATE: 'Tạo mới',
  UPDATE: 'Cập nhật',
  STATUS_CHANGE: 'Đổi trạng thái',
  DELETE: 'Xóa',
  SOFT_DELETE: 'Xóa tạm thời',
  PAY_INVOICE: 'Thanh toán hóa đơn',
  CANCEL_INVOICE: 'Hủy hóa đơn',
  IMPORT_STOCK: 'Nhập kho',
  EXPORT_STOCK: 'Xuất kho',
  UPDATE_ROLE: 'Cập nhật vai trò',
  CHANGE_PASSWORD: 'Đổi mật khẩu',
};

// Mapping module → label tiếng Việt
export const AUDIT_MODULE_LABELS: Record<string, string> = {
  AUTH: 'Xác thực',
  STAFF: 'Nhân viên',
  USERS: 'Người dùng',
  ROLES: 'Vai trò',
  TABLES: 'Bàn',
  MENU: 'Thực đơn',
  ORDERS: 'Đơn hàng',
  KITCHEN: 'Bếp',
  INVOICES: 'Hóa đơn',
  RESERVATIONS: 'Đặt bàn',
  REPORTS: 'Báo cáo',
  INVENTORY: 'Kho',
  AUDIT_LOGS: 'Nhật ký',
};

// Color mapping for actions
export const AUDIT_ACTION_COLORS: Record<string, string> = {
  LOGIN_SUCCESS: 'green',
  LOGIN_FAILED: 'red',
  CREATE: 'blue',
  UPDATE: 'orange',
  STATUS_CHANGE: 'purple',
  DELETE: 'red',
  SOFT_DELETE: 'volcano',
  PAY_INVOICE: 'green',
  CANCEL_INVOICE: 'red',
  IMPORT_STOCK: 'cyan',
  EXPORT_STOCK: 'magenta',
  UPDATE_ROLE: 'geekblue',
  CHANGE_PASSWORD: 'gold',
};
