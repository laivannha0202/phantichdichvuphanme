# Sprint 11 — Error handling & Security hardening

## Tổng quan

Sprint 11 chuẩn hóa error response backend (format thống nhất, che stack trace, map DB error), thêm security headers (helmet), validation pipeline, và frontend error handling toàn diện (ErrorBoundary, error message utility, interceptor).

## Files đã sửa/tạo

### Backend

| File | Mô tả |
|------|-------|
| `backend/src/common/filters/http-exception.filter.ts` | Global exception filter — catch HttpException, QueryFailedError, unknown error |
| `backend/src/main.ts` | helmet(), ValidationPipe global, CORS từ config |

### Frontend

| File | Mô tả |
|------|-------|
| `frontend/src/App.tsx` | Wrap ErrorBoundary |
| `frontend/src/api/client.ts` | Response interceptor + refresh queue |
| `frontend/src/types/api.types.ts` | ApiError interface |
| `frontend/src/components/ErrorBoundary.tsx` | React error boundary class component |
| `frontend/src/utils/errorMessage.ts` | extractErrorMessage + handleApiError + getHttpStatus |

## Verify

### Backend build

```bash
cd backend && npm run build
# Output: 0 errors
```

### Frontend build

```bash
cd frontend && npm run build
# Output: 0 errors (chunk size warning không tính fail)
```

### Runtime test

```bash
# 1. Health check
curl -s http://localhost:5011/api/health
# → 200 OK

# 2. 404 error format
curl -s http://localhost:5011/api/nonexistent
# → { data: null, message, statusCode: 404, errorCode: "NOT_FOUND", path, timestamp }

# 3. Validation error
curl -s -X POST http://localhost:5011/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":""}'
# → 400 + VALIDATION_ERROR + errors array

# 4. 401 no token
curl -s http://localhost:5011/api/auth/me
# → 401 + UNAUTHORIZED

# 5. 403 wrong role (nếu có token PHUC_VU)
curl -s http://localhost:5011/api/audit-logs \
  -H "Authorization: Bearer <phuc_vu_token>"
# → 403 + FORBIDDEN
```

### Security test

- [ ] API response không chứa stack trace
- [ ] API response không chứa password/token/password_hash
- [ ] Helmet headers present (X-Content-Type-Options, X-Frame-Options, etc.)
- [ ] CORS origin đúng config
- [ ] Không có file backend/.env
- [ ] Không có log/temp/token file rác

### Frontend test

- [ ] ErrorBoundary component tồn tại
- [ ] errorMessage utility tồn tại (extractErrorMessage + handleApiError)
- [ ] client interceptor xử lý 401 + refresh token

## Kết quả test

| Case | Expected | Actual | Pass |
|------|----------|--------|------|
| Backend build | 0 lỗi | - | - |
| Frontend build | 0 lỗi | - | - |
| GET /api/health | 200 | - | - |
| GET /api/nonexistent | 404 format chuẩn | - | - |
| POST validation sai | 400 + VALIDATION_ERROR + errors[] | - | - |
| No token → 401 | 401 + UNAUTHORIZED | - | - |
| Wrong role → 403 | 403 + FORBIDDEN | - | - |
| No stack trace | Không có stack | - | - |
| Helmet headers | Headers bảo mật | - | - |
| ErrorBoundary | Có trong source | - | - |
| errorMessage util | Có trong source | - | - |
| client interceptor | Có trong source | - | - |
| backend/.env không tồn tại | Không có file | - | - |
