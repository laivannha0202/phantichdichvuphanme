# Sprint 9 — Quản lý nhân viên & tài khoản

## Mục tiêu

Xây dựng tính năng quản lý nhân viên (staff) và tài khoản (user) cho hệ thống quản lý nhà hàng. Cho phép admin/quản lý xem, tạo, sửa, khóa/mở khóa, đổi mật khẩu, gán vai trò cho nhân viên và tài khoản.

## Phạm vi trong Sprint 9

- Quản lý nhân viên (CRUD + đổi trạng thái).
- Quản lý tài khoản người dùng (CRUD + khóa/mở khóa + đổi role + đổi mật khẩu).
- Gán vai trò (role) cho tài khoản.
- Xem danh sách vai trò (read-only).
- Frontend `/staff-users` với 3 tabs: Nhân viên, Tài khoản, Vai trò.
- Sidebar menu "Nhân viên & Tài khoản" (chỉ QUAN_TRI_HE_THONG và QUAN_LY thấy).

## Ngoài phạm vi (Out of scope)

- Chấm công.
- Tính lương.
- Ca làm việc.
- Audit log nâng cao.
- Báo cáo nhân sự.
- Export Excel/PDF.
- Sprint 10 (audit log / nhật ký hoạt động).

## Database

- **Không tạo bảng mới.** Tái sử dụng 3 bảng đã có từ Sprint 1:
  - `roles` (6 roles: QUAN_TRI_HE_THONG, QUAN_LY, PHUC_VU, THU_NGAN, BEP, KHO)
  - `staff` (thông tin nhân viên)
  - `users` (tài khoản đăng nhập)

## Backend endpoints

### Staff (`/api/staff`)
| Method | Endpoint | Mô tả | RBAC |
|--------|----------|-------|------|
| GET | `/api/staff` | Danh sách nhân viên | QUAN_TRI_HE_THONG, QUAN_LY |
| GET | `/api/staff/:id` | Chi tiết nhân viên | QUAN_TRI_HE_THONG, QUAN_LY |
| POST | `/api/staff` | Tạo nhân viên mới | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/staff/:id` | Cập nhật thông tin | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/staff/:id/status` | Đổi trạng thái (DANG_LAM/NGHI_VIEC/TAM_NGHI) | QUAN_TRI_HE_THONG, QUAN_LY |

### User (`/api/users`)
| Method | Endpoint | Mô tả | RBAC |
|--------|----------|-------|------|
| GET | `/api/users` | Danh sách tài khoản | QUAN_TRI_HE_THONG, QUAN_LY |
| GET | `/api/users/:id` | Chi tiết tài khoản | QUAN_TRI_HE_THONG, QUAN_LY |
| POST | `/api/users` | Tạo tài khoản mới | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/users/:id` | Cập nhật thông tin | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/users/:id/status` | Khóa/mở khóa (ACTIVE/INACTIVE) | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/users/:id/role` | Đổi vai trò | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/users/:id/password` | Đổi mật khẩu | QUAN_TRI_HE_THONG, QUAN_LY |

### Role (`/api/roles`)
| Method | Endpoint | Mô tả | RBAC |
|--------|----------|-------|------|
| GET | `/api/roles` | Danh sách vai trò | Authenticated |
| GET | `/api/roles/:id` | Chi tiết vai trò | Authenticated |

## Frontend route

| Route | Component | Mô tả |
|-------|-----------|-------|
| `/staff-users` | `StaffUsersPage` | 3 tabs: Nhân viên, Tài khoản, Vai trò |

## RBAC

- **QUAN_TRI_HE_THONG:** Toàn quyền — xem, tạo, sửa, khóa, đổi role, đổi mật khẩu tất cả.
- **QUAN_LY:** Xem, tạo, sửa nhân viên/tài khoản nhưng **không được**:
  - Tạo user role QUAN_TRI_HE_THONG.
  - Đổi user khác thành QUAN_TRI_HE_THONG.
  - Khóa user QUAN_TRI_HE_THONG.
- **PHUC_VU, THU_NGAN, BEP, KHO:** Không được truy cập module quản lý nhân viên/tài khoản.

## Verify checklist

1. Backend build pass.
2. Frontend build pass.
3. Database: roles=6, staff=5, users=6.
4. API không trả password_hash.
5. Endpoint có JwtAuthGuard + RolesGuard.
6. Route /staff-users tồn tại.
7. Sidebar chỉ hiện cho QUAN_TRI_HE_THONG và QUAN_LY.
8. Không duplicate route /api/users.
9. Không tạo bảng mới.
10. backend/.env không tồn tại (chỉ .env.example).
