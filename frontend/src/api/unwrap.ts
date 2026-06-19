/**
 * Helper để unwrap dữ liệu từ API response.
 *
 * Backend NestJS dùng TransformInterceptor, luôn wrap response:
 *   { data: T, message: string, statusCode: number }
 *
 * Axios response.data = HTTP body = { data: T, message, statusCode }
 * Nên apiClient.get() return AxiosResponse<{ data: T, ... }>
 * → response.data = { data: T, message, statusCode }
 *
 * Hàm này extracts T từ wrapper.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function unwrapApiData<T>(response: any): T {
  // Nếu response.data có field 'data' → trả response.data.data (unwrap TransformInterceptor)
  if (
    response?.data !== undefined &&
    response.data !== null &&
    typeof response.data === 'object' &&
    'data' in response.data
  ) {
    return response.data.data as T;
  }
  // Nếu response.data là array/object domain trực tiếp → trả response.data
  return response?.data as T;
}

/**
 * Đảm bảo giá trị luôn là array.
 * Dùng cho dataSource của Table,避免 crash khi data undefined/null/object.
 */
export function ensureArray<T>(value: T | T[] | null | undefined): T[] {
  if (Array.isArray(value)) return value;
  return [];
}

/**
 * Format tiền Việt Nam
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0đ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

/**
 * Format ngày giờ Việt Nam
 */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleString('vi-VN');
  } catch {
    return value;
  }
}

/**
 * Format ngày Việt Nam
 */
export function formatDate(value: string | null | undefined): string {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleDateString('vi-VN');
  } catch {
    return value;
  }
}
