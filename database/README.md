# Database

Thư mục này chứa các file SQL chính thức để dựng database cho dự án.

**SQL là script chính thức** — chạy SQL xong phải tạo được database, bảng và dữ liệu nền.

## Thứ tự chạy

| # | File | Nội dung |
|---|------|----------|
| 1 | `00-create-database.sql` | Tạo database `quanlynhahang` |
| 2 | `01-schema-sprint-1-auth-role-user.sql` | Tạo schema Sprint 1: roles, staff, users |
| 3 | `02-seed-sprint-1-auth-role-user.sql` | Seed Sprint 1: 6 roles + admin user |
| 4 | `03-schema-sprint-2-table-menu.sql` | Tạo schema Sprint 2: table_areas, tables, menu_categories, menu_items |
| 5 | `04-seed-sprint-2-table-menu.sql` | Seed Sprint 2: 4 khu vực, 14 bàn, 4 danh mục, 14 món ăn |

## Quy tắc

- **SQL là script chính thức** để dựng database thủ công.
- Chạy SQL xong phải tạo được database, bảng và dữ liệu nền.
- Backend API phải đọc được dữ liệu sau khi import SQL.
- **TypeORM migration/seed** vẫn dùng cho dev, nhưng phải **khớp 100%** với SQL.
- Không dùng `synchronize: true`.
- Khi nộp đồ án, SQL phải chạy được độc lập trên MySQL 8.x.
- **Không dùng database `QuanNhaHang`** — chỉ dùng `quanlynhahang`.
- **Không đưa password/token/secret** vào file SQL (trừ bcrypt hash mẫu cho admin dev).

## Bảng tổng hợp

| Bảng | Sprint | Mô tả |
|------|--------|-------|
| `roles` | 1 | Vai trò hệ thống |
| `staff` | 1 | Hồ sơ nhân viên |
| `users` | 1 | Tài khoản đăng nhập |
| `table_areas` | 2 | Khu vực (tầng, phòng) |
| `tables` | 2 | Bàn trong từng khu vực |
| `menu_categories` | 2 | Danh mục món ăn |
| `menu_items` | 2 | Món ăn |
