export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface ApiError {
  data: null;
  message: string;
  statusCode: number;
  errorCode: string;
  path: string;
  timestamp: string;
  errors?: Array<{ field: string; message: string }>;
}
