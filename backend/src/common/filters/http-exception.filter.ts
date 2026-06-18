import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

interface ErrorResponse {
  data: null;
  message: string;
  statusCode: number;
  errorCode: string;
  path: string;
  timestamp: string;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Danh sách lỗi DB phổ biến cần che message gốc.
 * TypeORM QueryFailedError.errno:
 *   1062 = Duplicate entry
 *   1452 = Cannot add or update a child row (FK constraint)
 *   1406 = Data too long for column
 */
const DB_ERROR_MAP: Record<number, { status: HttpStatus; message: string; code: string }> = {
  1062: {
    status: HttpStatus.CONFLICT,
    message: 'Dữ liệu đã tồn tại trong hệ thống',
    code: 'DUPLICATE_ENTRY',
  },
  1452: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Dữ liệu tham chiếu không hợp lệ',
    code: 'FK_CONSTRAINT',
  },
  1406: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Dữ liệu nhập vào vượt quá giới hạn cho phép',
    code: 'DATA_TOO_LONG',
  },
};

/**
 * Map HttpStatus → errorCode
 */
function httpStatusToErrorCode(status: number): string {
  const map: Record<number, string> = {
    [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
    [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
    [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
    [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
    [HttpStatus.CONFLICT]: 'CONFLICT',
    [HttpStatus.UNPROCESSABLE_ENTITY]: 'UNPROCESSABLE_ENTITY',
    [HttpStatus.TOO_MANY_REQUESTS]: 'TOO_MANY_REQUESTS',
    [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
  };
  return map[status] || 'UNKNOWN_ERROR';
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const path = request.url;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Có lỗi xảy ra, vui lòng thử lại sau';
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let errors: Array<{ field: string; message: string }> | undefined;

    // ── 1. TypeORM QueryFailedError (DB errors) ──────────────────
    if (exception instanceof QueryFailedError) {
      const driverError = (exception as any).driverError;
      const errno = driverError?.errno as number | undefined;

      if (errno && DB_ERROR_MAP[errno]) {
        const mapped = DB_ERROR_MAP[errno];
        status = mapped.status;
        message = mapped.message;
        errorCode = mapped.code;

        // Trích xuất field name từ message gốc nếu có (ví dụ: 'username' UNIQUE)
        const driverMessage = driverError?.sqlMessage ?? '';
        const fieldMatch = driverMessage.match(/for key '([^']+)'/);
        if (fieldMatch) {
          errors = [{ field: fieldMatch[1], message }];
        }
      } else {
        // DB error không xác định — vẫn ẩn message gốc
        status = HttpStatus.BAD_REQUEST;
        message = 'Lỗi dữ liệu, vui lòng kiểm tra lại thông tin';
        errorCode = 'DATABASE_ERROR';
      }

      this.logger.warn(
        `[DB] ${request.method} ${path} - ${status} ${errorCode}: ${(exception as Error).message}`,
      );
    }

    // ── 2. HttpException (NestJS built-in + custom) ──────────────
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      errorCode = httpStatusToErrorCode(status);
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as Record<string, any>;

        // ValidationPipe error format
        if (Array.isArray(resp.message)) {
          // resp.message là mảng các ràng buộc validation
          message = 'Dữ liệu không hợp lệ';
          errorCode = 'VALIDATION_ERROR';
          errors = resp.message.map((errMsg: string) => {
            // Cố gắng parse field từ message dạng "field should not be empty"
            const colonIdx = errMsg.indexOf(' ');
            const field = colonIdx > 0 ? errMsg.substring(0, colonIdx) : 'unknown';
            return { field, message: errMsg };
          });
          // Lấy message ngắn gọn từ error đầu tiên
          if (errors.length > 0) {
            message = errors[0].message;
          }
        } else if (resp.message) {
          message = String(resp.message);
        }
      }
    }

    // ── 3. Lỗi không xác định ────────────────────────────────────
    else {
      errorCode = 'INTERNAL_SERVER_ERROR';
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Có lỗi xảy ra, vui lòng thử lại sau';
    }

    // Log 5xx errors
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${path} - ${status} ${errorCode}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else if (status >= 400) {
      this.logger.warn(
        `${request.method} ${path} - ${status} ${errorCode}: ${message}`,
      );
    }

    // Build response
    const body: ErrorResponse = {
      data: null,
      message,
      statusCode: status,
      errorCode,
      path,
      timestamp: new Date().toISOString(),
    };

    if (errors && errors.length > 0) {
      body.errors = errors;
    }

    response.status(status).json(body);
  }
}
