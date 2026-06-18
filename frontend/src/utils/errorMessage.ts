import { message as antMessage } from 'antd';
import type { AxiosError } from 'axios';

/**
 * Kiểu error response chuẩn từ backend.
 */
export interface ApiErrorResponse {
  data: null;
  message: string;
  statusCode: number;
  errorCode: string;
  path: string;
  timestamp: string;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Lấy message lỗi từ backend response.
 * Ưu tiên: errors[0].message → message → statusCode text
 */
export function extractErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const axiosErr = error as AxiosError<ApiErrorResponse>;
    const data = axiosErr.response?.data;

    if (data) {
      // Nếu có errors array, lấy message đầu tiên
      if (data.errors && data.errors.length > 0) {
        return data.errors[0].message;
      }
      // Nếu có message
      if (data.message) {
        return data.message;
      }
    }

    // Network error (không có response)
    if (!axiosErr.response) {
      return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
    }
  }

  // Lỗi JavaScript thông thường
  if (error instanceof Error) {
    return error.message;
  }

  return 'Có lỗi xảy ra, vui lòng thử lại sau';
}

/**
 * Kiểm tra có phải Axios error không
 */
function isAxiosError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as any).isAxiosError === true
  );
}

/**
 * Xử lý lỗi từ API và hiển thị thông báo phù hợp.
 * Gọi trong catch hoặc onError của mutation/query.
 */
export function handleApiError(error: unknown): void {
  if (isAxiosError(error)) {
    const axiosErr = error as AxiosError<ApiErrorResponse>;
    const status = axiosErr.response?.status;
    const data = axiosErr.response?.data;

    switch (status) {
      case 401:
        // Xử lý 401 đã có trong interceptor client.ts (redirect login)
        // Không cần hiển thị message ở đây vì đã được xử lý global
        break;
      case 403:
        antMessage.error('Bạn không có quyền truy cập chức năng này');
        return;
      case 400:
      case 409:
        if (data?.message) {
          antMessage.error(data.message);
        } else {
          antMessage.error('Dữ liệu không hợp lệ, vui lòng kiểm tra lại');
        }
        return;
      case 404:
        antMessage.error('Không tìm thấy dữ liệu yêu cầu');
        return;
      case 429:
        antMessage.warning('Quá nhiều yêu cầu. Vui lòng thử lại sau');
        return;
    }
  }

  // Network error
  if (isAxiosError(error) && !(error as AxiosError).response) {
    antMessage.error('Không thể kết nối đến máy chủ');
    return;
  }

  // Fallback
  antMessage.error(extractErrorMessage(error));
}

/**
 * Lấy status code từ error object
 */
export function getHttpStatus(error: unknown): number | undefined {
  if (isAxiosError(error)) {
    return (error as AxiosError).response?.status;
  }
  return undefined;
}
