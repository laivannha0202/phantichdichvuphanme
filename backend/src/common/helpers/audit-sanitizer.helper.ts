/**
 * Danh sách các key nhạy cảm cần che dấu trong audit log.
 * Key được so khớp không phân biệt hoa thường.
 */
const SENSITIVE_KEYS = [
  'password',
  'new_password',
  'password_hash',
  'current_password',
  'confirm_password',
  'accessToken',
  'access_token',
  'refreshToken',
  'refresh_token',
  'token',
  'authorization',
  'cookie',
  'secret',
  'api_key',
  'apiKey',
];

/**
 * Kiểm tra một key có phải sensitive không.
 */
function isSensitiveKey(key: string): boolean {
  const lower = key.toLowerCase();
  return SENSITIVE_KEYS.some(
    (sk) => lower === sk.toLowerCase() || lower.endsWith(`.${sk.toLowerCase()}`),
  );
}

/**
 * Sanitize một object đệ quy để xoá các field nhạy cảm
 * trước khi ghi vào audit log metadata.
 * Trả về object mới đã sanitize.
 */
export function sanitizeAuditMetadata<T>(data: T): T {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeAuditMetadata(item)) as unknown as T;
  }

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (isSensitiveKey(key)) {
      sanitized[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeAuditMetadata(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized as T;
}

/**
 * Tạo description ngắn gọn từ action và entity_type.
 */
export function buildAuditDescription(
  action: string,
  entityType?: string | null,
  entityId?: string | null,
): string {
  const actionLabels: Record<string, string> = {
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

  const label = actionLabels[action] || action;
  let desc = label;

  if (entityType) {
    desc += ` ${entityType}`;
    if (entityId) {
      desc += ` #${entityId}`;
    }
  }

  return desc;
}
