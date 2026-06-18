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
| 6 | `05-schema-sprint-3-order.sql` | Tạo schema Sprint 3: orders, order_items |
| 7 | `06-seed-sprint-3-order.sql` | Seed Sprint 3: đơn hàng mẫu |
| 8 | `07-schema-sprint-4-payment-invoice.sql` | Tạo schema Sprint 4: invoices, payments |
| 9 | `08-seed-sprint-4-payment-invoice.sql` | Seed Sprint 4: hóa đơn & thanh toán mẫu |
| 10 | `09-note-sprint-5-kitchen-no-new-table.sql` | Ghi chú Sprint 5: không tạo bảng mới |
| 11 | `10-seed-sprint-5-kitchen.sql` | Seed Sprint 5: dữ liệu bếp |
| 12 | `11-schema-sprint-6-reservation.sql` | Tạo schema Sprint 6: reservations |
| 13 | `12-seed-sprint-6-reservation.sql` | Seed Sprint 6: đặt bàn mẫu |
| 14 | `13-note-sprint-7-revenue-report-no-new-table.sql` | Ghi chú Sprint 7: không tạo bảng mới |
| 15 | `14-seed-sprint-7-revenue-report.sql` | Seed Sprint 7: dữ liệu báo cáo |
| 16 | `15-schema-sprint-8-inventory.sql` | Tạo schema Sprint 8: suppliers, ingredients, inventory_transactions |
| 17 | `16-seed-sprint-8-inventory.sql` | Seed Sprint 8: NCC, nguyên liệu, giao dịch kho |
| 18 | `17-note-sprint-9-staff-user-no-new-table.sql` | Ghi chú Sprint 9: không tạo bảng mới |
| 19 | `18-seed-sprint-9-staff-user.sql` | Seed Sprint 9: nhân viên & tài khoản mẫu |
| 20 | `19-schema-sprint-10-audit-log.sql` | Tạo schema Sprint 10: audit_logs |
| 21 | `20-note-sprint-10-audit-log-seed.sql` | Ghi chú Sprint 10: seed audit log |

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
| `orders` | 3 | Đơn hàng |
| `order_items` | 3 | Chi tiết đơn hàng |
| `invoices` | 4 | Hóa đơn |
| `payments` | 4 | Thanh toán |
| `reservations` | 6 | Đặt bàn trước |
| `suppliers` | 8 | Nhà cung cấp |
| `ingredients` | 8 | Nguyên liệu |
| `inventory_transactions` | 8 | Giao dịch kho |
| `audit_logs` | 10 | Nhật ký hoạt động |
