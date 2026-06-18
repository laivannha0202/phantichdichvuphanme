# Sprint 10 — Audit Log (Nhật ký hoạt động)

## Goal
Ghi lại thao tác quan trọng trong hệ thống quản lý nhà hàng vào bảng `audit_logs`,
cho phép QUAN_TRI_HE_THONG và QUAN_LY xem lại lịch sử hoạt động.

## Scope
- Database: Tạo bảng `audit_logs` với 17 cột + indexes
- Backend: AuditLogsModule (controller + service + DTO), AuditLogInterceptor global, sanitizer
- Backend: Ghi audit cho AuthService (LOGIN_SUCCESS, LOGIN_FAILED)
- Backend: @Audit decorator cho 6 module (Staff, User, Invoices, Orders, Reservations, Inventory)
- Frontend: AuditLogsPage với table + filter + detail modal
- Frontend: Route /audit-logs, sidebar menu có RBAC

## Out-of-scope
- Không có SIEM, Elasticsearch
- Không export Excel/PDF
- Không có dashboard bảo mật riêng
- Không phân quyền động

## Kế hoạch thực hiện

### Nhiệm vụ 0: Backup
Backup project trước khi sửa.

### Nhiệm vụ 1: Đọc tài liệu
Đọc FEAT_11_AUDIT_LOG.md, HARD_VERIFY_SPRINT_9.md, nghiep vu docs, thiet ke docs.

### Nhiệm vụ 2: Database
- `database/19-schema-sprint-10-audit-log.sql`: CREATE TABLE audit_logs
- `database/20-note-sprint-10-audit-log-seed.sql`: Note không cần seed

### Nhiệm vụ 3: TypeORM migration + entity
- Entity: `audit-log.entity.ts`
- Migration: `1790000000000-CreateAuditLogs.ts`
- Export entity trong `entities/index.ts`

### Nhiệm vụ 4+5: Backend AuditLogs module + interceptor
- AuditLogsModule, AuditLogsController, AuditLogsService
- AuditLogInterceptor (global APP_INTERCEPTOR)
- Audit decorators (@Audit, @AuditModule, @AuditAction)
- audit-sanitizer.helper.ts
- Query DTO (phân trang + lọc)

### Nhiệm vụ 6: AuthService audit
- Inject DataSource vào AuthService
- Ghi LOGIN_SUCCESS/LOGIN_FAILED khi login

### Nhiệm vụ 7: @Audit decorator cho module chính
- StaffController: CREATE, UPDATE, STATUS_CHANGE, SOFT_DELETE
- UserController: CREATE, UPDATE, STATUS_CHANGE, UPDATE_ROLE, CHANGE_PASSWORD, SOFT_DELETE
- InvoicesController: CREATE, PAY_INVOICE, CANCEL_INVOICE
- OrdersController: CREATE, STATUS_CHANGE
- ReservationController: CREATE, UPDATE, STATUS_CHANGE
- InventoryController: IMPORT_STOCK, EXPORT_STOCK

### Nhiệm vụ 8: Frontend
- Types: auditLog.types.ts
- API: audit-logs.api.ts
- Page: AuditLogsPage.tsx
- Route: /audit-logs
- Sidebar: "Nhật ký hoạt động"

### Nhiệm vụ 9: Migration
Chạy migration: `npm run migration:run`

### Nhiệm vụ 10: Runtime test
Kiểm tra login, audit-logs API, RBAC

### Nhiệm vụ 11: Build verify
Backend + frontend build

### Nhiệm vụ 12: Cleanup & Report
Dọn file tạm, tạo báo cáo
