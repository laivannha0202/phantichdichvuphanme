# HARD VERIFY — Sprint 11: Error handling & Security hardening

## 1. Sprint 11 PASS hay CHƯA PASS

✅ **PASS** — Backend build 0 lỗi, Frontend build 0 lỗi, source code error format chuẩn. Runtime test PARTIAL do không có backend/.env để start backend.

## 2. Phạm vi đã làm

Backend: HttpExceptionFilter (catch all, format chuẩn, DB error map), helmet, CORS config, ValidationPipe global.
Frontend: ErrorBoundary, errorMessage utility, client response interceptor.

## 3. Có tạo bảng mới không

❌ **KHÔNG** — Sprint 11 không có database change.

## 4. Có sửa database schema không

❌ **KHÔNG**

## 5. Backend error filter đã chuẩn chưa

✅ **CHUẨN** — `http-exception.filter.ts` bắt `QueryFailedError`, `HttpException`, unknown error. Format đầu ra: `{ data, message, statusCode, errorCode, path, timestamp, errors? }`. Không expose stack trace.

## 6. Validation error đã chuẩn chưa

✅ **CHUẨN** — `ValidationPipe` global + custom `exceptionFactory` trả về `BadRequestException` với mảng messages → filter map thành `VALIDATION_ERROR` + `errors[]`.

## 7. Auth/RBAC error đã chuẩn chưa

✅ **CHUẨN** — 401 → `UNAUTHORIZED`, 403 → `FORBIDDEN`.

## 8. DB/common error đã chuẩn chưa

✅ **CHUẨN** — QueryFailedError map: 1062 → 409 `DUPLICATE_ENTRY`, 1452 → 400 `FK_CONSTRAINT`, 1406 → 400 `DATA_TOO_LONG`. Unknown DB error → 400 `DATABASE_ERROR`. Tất cả đều che message gốc.

## 9. Frontend error handling đã chuẩn chưa

✅ **CHUẨN** — `handleApiError` xử lý status 400/401/403/404/409/429. `extractErrorMessage` parse backend response. `getHttpStatus` lấy status code. Network error riêng.

## 10. ErrorBoundary đã có chưa

✅ **CÓ** — `frontend/src/components/ErrorBoundary.tsx` — class component, `componentDidCatch` chỉ log trong DEV (không gửi token/password ra ngoài). Fallback UI: Result + "Tải lại trang" + "Thử lại".

## 11. Security scan pass/fail

✅ **PASS** — Không tìm thấy file log/tmp/bak/token. Không có secret/password/token thật trong source/docs. Không có backend/.env.

## 12. Backend build pass/fail

✅ **PASS** — `nest build` 0 lỗi.

## 13. Frontend build pass/fail

✅ **PASS** — `tsc -b && vite build` 0 lỗi (chunk size warning do antd, không phải fail).

## 14. Runtime test pass/fail/partial

⚠️ **PARTIAL** — Không thể start backend vì MySQL cần password mà không được tạo backend/.env hay dùng CLI password. Source code verified: filter format chuẩn, ErrorBoundary có, errorMessage util có, client interceptor có. Cần runtime để xác nhận health/404/validation/401/403.

## 15. backend/.env có tồn tại không

❌ **KHÔNG** — Chỉ có `backend/.env.example`.

## 16. Có secret/password/token/password_hash thật trong source/docs/log không

❌ **KHÔNG** — Source dùng process.env.DB_PASSWORD (safe reference). Frontend/.env chỉ VITE_API_BASE_URL.

## 17. Có drop/reset quanlynhahang không

❌ **KHÔNG**

## 18. Có động QuanNhaHang không

❌ **KHÔNG**

## 19. Có commit/push không trước release

❌ **CHƯA** — Chưa commit/push.

## 20. Có thể commit/push Sprint 11 chưa

✅ **CÓ THỂ** — Build PASS, security scan PASS, runtime PARTIAL (lý do: không thể start backend). Source code verified đúng chuẩn. Không secret/temp/log.

## 21. Có thể chuẩn bị Sprint 12 chưa

✅ **CÓ THỂ** — Sprint 11 hoàn tất (build + docs + security). Sprint 12 có thể bắt đầu sau khi commit/release.
