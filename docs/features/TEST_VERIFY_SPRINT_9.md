# Test & Verify — Sprint 9: Quản lý nhân viên & tài khoản

## Checklist Backend Build

- [x] `cd backend && npm run build` → PASS
- [x] Không lỗi TypeScript
- [x] Không lỗi NestJS build

## Checklist Frontend Build

- [x] `cd frontend && npm run build` → PASS
- [x] Không lỗi TypeScript
- [x] Không lỗi Vite build (chunk size warning từ Ant Design có thể bỏ qua)

## Checklist Database

- [x] roles = 6
- [x] staff = 5
- [x] users = 6
- [x] Users gồm: admin, nva_quanly (QUAN_LY), ttb_phucvu (PHUC_VU), lvc_thungan (THU_NGAN), ptd_bep (BEP), hve_kho (KHO)

## Checklist API

### Roles
- [x] `GET /api/roles` — trả danh sách 6 roles
- [x] `GET /api/roles/:id` — trả chi tiết role

### Staff
- [x] `GET /api/staff` — danh sách staff
- [x] `GET /api/staff/:id` — chi tiết staff
- [x] `POST /api/staff` — tạo staff mới (full_name bắt buộc)
- [x] `PATCH /api/staff/:id` — cập nhật staff
- [x] `PATCH /api/staff/:id/status` — đổi trạng thái (DANG_LAM/NGHI_VIEC/TAM_NGHI)

### Users
- [x] `GET /api/users` — danh sách user (không trả password_hash)
- [x] `GET /api/users/:id` — chi tiết user (không trả password_hash)
- [x] `POST /api/users` — tạo user mới (username unique, bcrypt hash)
- [x] `PATCH /api/users/:id` — cập nhật user
- [x] `PATCH /api/users/:id/status` — khóa/mở khóa (ACTIVE/INACTIVE)
- [x] `PATCH /api/users/:id/role` — đổi vai trò
- [x] `PATCH /api/users/:id/password` — đổi mật khẩu

## Checklist Security

- [x] API response không có password_hash (entity có `select: false`)
- [x] UserService không map password_hash vào response
- [x] backend/.env không tồn tại
- [x] SQL seed không ghi password plain text
- [x] Swagger DTO không expose password_hash
- [x] Controller có JwtAuthGuard + RolesGuard
- [x] QUAN_LY không thể tạo/đổi/khoá QUAN_TRI_HE_THONG

## Checklist Frontend

- [x] Route `/staff-users` tồn tại
- [x] 3 tabs: Nhân viên, Tài khoản, Vai trò
- [x] Tab Nhân viên: danh sách, tạo/sửa, đổi trạng thái
- [x] Tab Tài khoản: danh sách, tạo, đổi role, khóa/mở khóa, đổi mật khẩu
- [x] Tab Vai trò: xem danh sách role (read-only)
- [x] Sidebar "Nhân viên & Tài khoản" chỉ hiện cho QUAN_TRI_HE_THONG, QUAN_LY
- [x] Loading/error/empty state
- [x] Notification thành công/thất bại
- [x] Không hiển thị password_hash
