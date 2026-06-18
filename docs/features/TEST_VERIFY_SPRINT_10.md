# Sprint 10 — Audit Log / Nhật ký hoạt động

## Tổng quan

Sprint 10 triển khai tính năng ghi nhật ký hoạt động (audit log) để theo dõi
các thao tác quan trọng trong hệ thống quản lý nhà hàng.

## Files đã tạo/sửa

### Database (SQL)
| File | Mô tả |
|------|-------|
| `database/19-schema-sprint-10-audit-log.sql` | SQL tạo bảng `audit_logs` |
| `database/20-note-sprint-10-audit-log-seed.sql` | Note về seed |

### Backend (NestJS)
| File | Mô tả |
|------|-------|
| `backend/src/database/entities/audit-log.entity.ts` | TypeORM entity |
| `backend/src/database/migrations/1790000000000-CreateAuditLogs.ts` | Migration |
| `backend/src/database/entities/index.ts` | Cập nhật export |
| `backend/src/modules/audit-logs/audit-logs.module.ts` | Module |
| `backend/src/modules/audit-logs/audit-logs.controller.ts` | Controller (GET, GET/:id) |
| `backend/src/modules/audit-logs/audit-logs.service.ts` | Service (log, findAll, findOne) |
| `backend/src/modules/audit-logs/dto/query-audit-log.dto.ts` | Query DTO (phân trang + lọc) |
| `backend/src/common/interceptors/audit-log.interceptor.ts` | Interceptor tự động ghi audit |
| `backend/src/common/helpers/audit-sanitizer.helper.ts` | Sanitize sensitive data |
| `backend/src/app.module.ts` | Import AuditLogsModule + interceptor |
| `backend/src/auth/auth.service.ts` | Thêm DataSource + ghi LOGIN_SUCCESS/FAILED |

### Frontend (React + Ant Design)
| File | Mô tả |
|------|-------|
| `frontend/src/types/auditLog.types.ts` | Types + label/color mappings |
| `frontend/src/api/audit-logs.api.ts` | API client |
| `frontend/src/pages/AuditLogsPage.tsx` | Page chính (table + modal + filter) |
| `frontend/src/routes/AppRoutes.tsx` | Thêm route /audit-logs |
| `frontend/src/layouts/MainLayout.tsx` | Thêm menu "Nhật ký hoạt động" |

### Controllers đã thêm audit decorator
| Controller | Action |
|------------|--------|
| StaffController | CREATE, UPDATE, STATUS_CHANGE, SOFT_DELETE |
| UserController | CREATE, UPDATE, STATUS_CHANGE, UPDATE_ROLE, CHANGE_PASSWORD, SOFT_DELETE |
| InvoicesController | CREATE, PAY_INVOICE, CANCEL_INVOICE |
| OrdersController | CREATE, STATUS_CHANGE |
| ReservationController | CREATE, UPDATE, STATUS_CHANGE (confirm/cancel) |
| InventoryController | IMPORT_STOCK, EXPORT_STOCK |

## Kiến trúc

```
Request
  → AuthService (ghi LOGIN_SUCCESS/LOGIN_FAILED qua DataSource)
  → AuditLogInterceptor (global, POST/PATCH/DELETE + @Audit decorator)
    → sanitize metadata (xoá password, token)
    → AuditLogsService.log() (INSERT raw query)
  → Response (200/201)
```

- **Interceptor**: global, chỉ intercept POST/PATCH/DELETE, check metadata
- **AuthService**: dùng DataSource trực tiếp, tránh circular dep
- **Sanitizer**: che dấu password, token, authorization, secret trong metadata

## API Endpoints

| Method | Path | Quyền | Mô tả |
|--------|------|-------|-------|
| GET | /api/audit-logs | QUAN_TRI_HE_THONG, QUAN_LY | Danh sách + phân trang + lọc |
| GET | /api/audit-logs/:id | QUAN_TRI_HE_THONG, QUAN_LY | Chi tiết |

### Query params: page, limit, username, role_code, action, module, entity_type, entity_id, from_date, to_date, sort

## Database

```sql
audit_logs (
  id INT PK AUTO_INCREMENT,
  user_id INT FK → users ON DELETE SET NULL,
  username VARCHAR(50),
  role_code VARCHAR(50),
  action VARCHAR(80) NOT NULL,
  module VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id VARCHAR(100),
  method VARCHAR(10),
  path VARCHAR(255),
  status_code INT,
  ip_address VARCHAR(64),
  user_agent VARCHAR(255),
  description VARCHAR(255),
  metadata JSON,
  created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  deleted_at DATETIME(3),
  7 indexes
)
```

## Verify

### Backend build
```bash
cd backend && npm run build
# Output: No errors
```

### Migration
```bash
# Dùng env var DB_PASSWORD (không hardcode)
# DB_PASSWORD='<your-password>' npm run migration:run
# Output: Migration CreateAuditLogs1790000000000 executed successfully
```

### Runtime test
```bash
# 1. LOGIN_FAILED
curl -s POST http://localhost:5011/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrong"}'

# 2. LOGIN_SUCCESS
TOKEN=$(curl -s POST http://localhost:5011/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}' | python3 -c \
  "import sys,json; print(json.load(sys.stdin)['data']['accessToken'])")

# 3. GET audit logs
curl -s http://localhost:5011/api/audit-logs \
  -H "Authorization: Bearer $TOKEN"

# 4. RBAC guard
# Dùng token của PHUC_VU → 403 Forbidden
```

### Frontend build
```bash
cd frontend && npm run build
# Output: No errors
```

## Kết quả test

| Case | Expected | Actual | Pass |
|------|----------|--------|------|
| Login sai password (401) | Ghi LOGIN_FAILED | audit_logs count tăng | ✓ |
| Login đúng password (200) | Token + LOGIN_SUCCESS | audit_logs count tăng | ✓ |
| GET /audit-logs | 200 + pagination | 7 bản ghi | ✓ |
| GET /audit-logs/:id | Chi tiết bản ghi | Trả về đúng | ✓ |
| Filter action=LOGIN_FAILED | Lọc đúng action | 2 bản ghi | ✓ |
| PHUC_VU xem audit-logs | 403 Forbidden | 403 (source verify) | ✓ |
| Backend build | 0 lỗi | 0 lỗi | ✓ |
| Frontend build | 0 lỗi | 0 lỗi | ✓ |

## Audit actions

- LOGIN_SUCCESS, LOGIN_FAILED — ghi từ AuthService
- CREATE, UPDATE, STATUS_CHANGE, DELETE, SOFT_DELETE — ghi từ interceptor
- PAY_INVOICE, CANCEL_INVOICE — ghi từ interceptor
- IMPORT_STOCK, EXPORT_STOCK — ghi từ interceptor
- UPDATE_ROLE, CHANGE_PASSWORD — ghi từ interceptor

## Security

- **Không log password/token**: sanitizer che dấu 15 key nhạy cảm
- **RBAC**: chỉ QUAN_TRI_HE_THONG và QUAN_LY mới xem được
- **Audit log là INSERT-only**: không sửa/xoá bản ghi
- **Interceptor không ghi audit khi response fail**
- **AuditLogService không throw**: fail silent để không crash request chính

## Rủi ro còn lại

1. Không có unit test cho AuditLogsService (cần mock DataSource)
2. Interceptor dùng `request.body` trực tiếp — nếu body lớn có thể tốn bộ nhớ
3. Không có log rotation / archive cho audit_logs table (có thể cần sau)
