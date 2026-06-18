# Sprint 11 — Error handling & Security hardening

## Goal

Chuẩn hóa error response backend, bảo mật HTTP headers, validation pipeline, frontend error handling toàn diện.

## Scope

### Backend

- **Chuẩn hóa error response**: HttpExceptionFilter bắt mọi exception → format `{ data: null, message, statusCode, errorCode, path, timestamp, errors? }`
- **Chuẩn hóa validation error**: ValidationPipe global + custom `exceptionFactory` → 400 + `VALIDATION_ERROR` + `errors[]`
- **Chuẩn hóa Auth/RBAC error**: 401 `UNAUTHORIZED`, 403 `FORBIDDEN`
- **Chuẩn hóa DB/common error**: QueryFailedError map (1062 → 409 DUPLICATE_ENTRY, 1452 → 400 FK_CONSTRAINT, 1406 → 400 DATA_TOO_LONG)
- **Unknown error**: 500 INTERNAL_SERVER_ERROR — không expose stack trace
- **Helmet**: security headers
- **CORS**: origin từ config, credentials: true
- **ValidationPipe**: whitelist + forbidNonWhitelisted + transform global

### Frontend

- **ErrorBoundary**: bắt lỗi render React
- **Error message utility**: `extractErrorMessage`, `handleApiError`, `getHttpStatus`
- **Response interceptor**: auto refresh token, 401 redirect, queue failed requests

## Out-of-scope

- Không tạo bảng mới
- Không sửa database schema
- Không thêm nghiệp vụ mới
- Không làm Sprint 12

## Files đã sửa/tạo

### Backend

| File | Mô tả |
|------|-------|
| `backend/src/common/filters/http-exception.filter.ts` | Global exception filter — catch all, format chuẩn, DB error map |
| `backend/src/main.ts` | Thêm helmet, CORS config, ValidationPipe global |

### Frontend

| File | Mô tả |
|------|-------|
| `frontend/src/App.tsx` | Wrap ErrorBoundary |
| `frontend/src/api/client.ts` | Response interceptor auto refresh + queue |
| `frontend/src/types/api.types.ts` | ApiError interface |
| `frontend/src/components/ErrorBoundary.tsx` | Class-based React error boundary |
| `frontend/src/utils/errorMessage.ts` | extractErrorMessage + handleApiError |

## Verify checklist

- [ ] Backend build pass
- [ ] Frontend build pass
- [ ] Runtime: health endpoint 200
- [ ] Runtime: 404 error format chuẩn
- [ ] Runtime: validation error 400 + VALIDATION_ERROR + errors array
- [ ] No stack trace in response
- [ ] Helmet headers present
- [ ] CORS config đúng
- [ ] ErrorBoundary render khi error
- [ ] errorMessage utility hoạt động
- [ ] Security scan: không secret/temp/log/backend.env
- [ ] README updated
