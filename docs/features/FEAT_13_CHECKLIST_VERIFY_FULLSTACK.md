# FEAT_13: Checklist Verify Toàn bộ Hệ thống

## 1. Mục tiêu

Checklist kiểm tra toàn diện hệ thống sau khi implement xong tất cả sprints, đảm bảo mọi tính năng hoạt động đúng, không có regression, và sẵn sàng deploy.

## 2. Phạm vi

- Kiểm tra toàn bộ 12 features (FEAT_00–FEAT_12)
- Kiểm tra integration giữa các modules
- Kiểm tra performance cơ bản
- Kiểm tra security cơ bản
- Kiểm tra deployment readiness

## 3. Out-of-scope

- Load testing (khi có traffic thực)
- Penetration testing (cần chuyên gia security)
- UAT với khách hàng thực
- Deploy production

## 4. Pre-Deployment Checklist

### 4.1 Environment & Configuration

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | `.env` file đầy đủ (xem `.env.example`) | ☐ | |
| 2 | Database `quanlynhahang` tồn tại | ☐ | |
| 3 | MySQL port đúng: Docker local dùng host `3307` → container `3306`. MCP MySQL đã cấu hình sẵn trong OpenCode dùng port `3307`. | ☐ | |
| 4 | Backend port 5011 đúng | ☐ | |
| 5 | Frontend port 5173 đúng | ☐ | |
| 6 | JWT secret đủ mạnh (≥ 32 ký tự) | ☐ | |
| 7 | CORS origin cấu hình đúng | ☐ | |
| 8 | File upload directory tồn tại | ☐ | *Chỉ kiểm tra nếu feature upload được bật ở phiên bản sau* |

### 4.2 Database

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | TypeORM migrations chạy thành công | ☐ | |
| 2 | Seeds data đầy đủ (roles, users, staff, tables, menu) | ☐ | |
| 3 | Admin demo login được (`admin` / `Admin@123`) | ☐ | |
| 4 | Foreign keys đúng | ☐ | |
| 5 | Indexes đúng | ☐ | |
| 6 | Charset utf8mb4 | ☐ | |

### 4.3 Code Quality

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | TypeScript strict mode | ☐ | |
| 2 | No `any` type | ☐ | |
| 3 | ESLint pass | ☐ | |
| 4 | No console.log trong production code | ☐ | |
| 5 | No hardcoded values | ☐ | |
| 6 | No secrets trong code | ☐ | |
| 7 | Error handling đầy đủ | ☐ | |
| 8 | Input validation cho mọi endpoint | ☐ | |

## 5. Feature Verification Checklist

### 5.1 FEAT_01: Auth/Role/User ✅

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Login thành công với đúng credentials | ☐ | |
| 2 | Login thất bại với sai password | ☐ | |
| 3 | JWT access token trả về đúng format | ☐ | |
| 4 | Refresh token hoạt động đúng | ☐ | |
| 5 | Logout invalidate token | ☐ | |
| 6 | Get profile trả về đúng user info | ☐ | |
| 7 | RBAC: PHUC_VU không access được /api/users | ☐ | |
| 8 | 6 roles seed đúng (QUAN_TRI_HE_THONG, QUAN_LY, PHUC_VU, THU_NGAN, BEP, KHO) | ☐ | |
| 9 | Admin demo login thành công | ☐ | |
| 10 | Protected route redirect về /login khi chưa auth | ☐ | |

### 5.2 FEAT_02: Quản lý Khu vực & Bàn

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | CRUD Khu vực hoạt động đúng | ☐ | |
| 2 | CRUD Bàn hoạt động đúng | ☐ | |
| 3 | Table states đúng (TRONG, DA_DAT, CO_KHACH, DANG_DON, BAO_TRI) | ☐ | |
| 4 | State transitions hợp lệ | ☐ | |
| 5 | QR code mỗi bàn là duy nhất | ☐ | *Chỉ kiểm tra nếu feature QR code được bật ở phiên bản sau* |
| 6 | Filter theo khu vực hoạt động | ☐ | |
| 7 | Filter theo trạng thái hoạt động | ☐ | |
| 8 | Grid view hiển thị đúng màu trạng thái | ☐ | |
| 9 | Không xoá khu vực có bàn | ☐ | |
| 10 | Responsive trên mobile | ☐ | |

### 5.3 FEAT_03: Quản lý Thực đơn

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | CRUD Danh mục hoạt động đúng | ☐ | |
| 2 | CRUD Món ăn hoạt động đúng | ☐ | |
| 3 | Upload ảnh thành công (≤ 5MB, jpg/png/webp) | ☐ | *Chỉ kiểm tra nếu feature upload được bật ở phiên bản sau* |
| 4 | Upload ảnh lỗi (> 5MB) → hiển thị lỗi | ☐ | *Chỉ kiểm tra nếu feature upload được bật ở phiên bản sau* |
| 5 | Menu item states đúng (DANG_BAN, HET_MON, NGUNG_BAN) | ☐ | |
| 6 | is_available = false → ẩn món | ☐ | |
| 7 | Giá ≥ 0 | ☐ | |
| 8 | Tên danh mục/món là duy nhất | ☐ | |
| 9 | Hiển thị theo sort_order | ☐ | |
| 10 | Không xoá danh mục có món | ☐ | |

### 5.4 FEAT_04: Gọi món / Phục vụ

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Tạo order cho bàn CO_KHACH → thành công | ☐ | |
| 2 | Tạo order cho bàn TRONG → lỗi | ☐ | |
| 3 | Thêm món vào order → thành công | ☐ | |
| 4 | Thêm món NGUNG_BAN → lỗi | ☐ | |
| 5 | Sửa số lượng món → thành công | ☐ | |
| 6 | Xoá món DANG_CHO → thành công | ☐ | |
| 7 | Giá món = giá tại thời điểm gọi | ☐ | |
| 8 | Tổng order tính đúng | ☐ | |
| 9 | Order state transitions đúng | ☐ | |
| 10 | Mỗi bàn chỉ 1 order active | ☐ | |

### 5.5 FEAT_05: Bếp xử lý món

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | BEP thấy orders cần chế biến | ☐ | |
| 2 | BEP accept order → CHO_CHE_BIEN | ☐ | |
| 3 | BEP bắt đầu chế biến → DANG_CHE_BIEN | ☐ | |
| 4 | BEP hoàn thành món → HOAN_THANH | ☐ | |
| 5 | Tất cả items HOAN_THANH → order HOAN_THANH | ☐ | |
| 6 | Hủy món với lý do → DA_HUY | ☐ | |
| 7 | Ghi chú món hiển thị đúng | ☐ | |
| 8 | Auto-refresh hoạt động | ☐ | |
| 9 | Thời gian chờ hiển thị đúng | ☐ | |
| 10 | QUAN_LY xem được tất cả orders | ☐ | |

### 5.6 FEAT_06: Thanh toán / Hoá đơn

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Tạo hoá đơn từ order HOAN_THANH → thành công | ☐ | |
| 2 | Tạo hoá đơn từ order DANG_CHO → lỗi | ☐ | |
| 3 | Mỗi order chỉ 1 hoá đơn | ☐ | |
| 4 | Mã HĐ tự động đúng format (HĐ-YYYYMMDD-XXX) | ☐ | |
| 5 | Thanh toán tiền mặt đầy đủ → thành công | ☐ | |
| 6 | Tiền thừa tính đúng | ☐ | |
| 7 | Thanh toán chuyển khoản → thành công | ☐ | |
| 8 | In hoá đơn hiển thị đúng | ☐ | |
| 9 | Huỷ hoá đơn CHUA_THANH_TOAN → thành công | ☐ | |
| 10 | Huỷ hoá đơn DA_THANH_TOAN → lỗi | ☐ | |

### 5.7 FEAT_07: Đặt bàn trước

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Tạo đặt bàn với bàn trống → thành công | ☐ | |
| 2 | Tạo đặt bàn với bàn đã đặt → lỗi | ☐ | |
| 3 | reservation_date ≥ hôm nay | ☐ | |
| 4 | party_size ≤ capacity | ☐ | |
| 5 | Xác nhận đặt bàn → DA_XAC_NHAN | ☐ | |
| 6 | Nhận bàn → table → CO_KHACH | ☐ | |
| 7 | Hủy đặt bàn → table → TRONG | ☐ | |
| 8 | Không đến → KHONG_DEN | ☐ | |
| 9 | Mỗi bàn 1 reservation tại 1 thời điểm | ☐ | |
| 10 | Kiểm tra bàn trống hoạt động | ☐ | |

### 5.8 FEAT_08: Báo cáo Doanh thu

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Tổng quan doanh thu đúng | ☐ | |
| 2 | Doanh thu theo ngày/tuần/tháng đúng | ☐ | |
| 3 | Top món bán chạy đúng | ☐ | |
| 4 | Doanh thu theo ca đúng | ☐ | |
| 5 | Biểu đồ hiển thị đúng | ☐ | |
| 6 | Xuất PDF hoạt động | ☐ | |
| 7 | Xuất Excel hoạt động | ☐ | |
| 8 | Chỉ QUAN_LY xem được | ☐ | |
| 9 | Chỉ tính từ HĐ đã thanh toán | ☐ | |
| 10 | Filter khoảng ngày hoạt động | ☐ | |

### 5.9 FEAT_09: Kho Nguyên liệu

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | CRUD nguyên liệu hoạt động | ☐ | |
| 2 | Nhập kho → tồn kho tăng đúng | ☐ | |
| 3 | Xuất kho → tồn kho giảm đúng | ☐ | |
| 4 | Xuất kho vượt tồn kho → lỗi | ☐ | |
| 5 | Kiểm kê → adjust đúng | ☐ | |
| 6 | Cảnh báo tồn kho thấp | ☐ | |
| 7 | Lịch sử giao dịch đúng | ☐ | |
| 8 | Mỗi giao dịch có reference_no | ☐ | |

### 5.10 FEAT_10: Nhân viên / Tài khoản

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | CRUD nhân viên hoạt động | ☐ | |
| 2 | CRUD tài khoản hoạt động | ☐ | |
| 3 | Username duy nhất | ☐ | |
| 4 | Mật khẩu ≥ 8 ký tự | ☐ | |
| 5 | Vô hiệu hóa tài khoản → không login được | ☐ | |
| 6 | Kích hoạt lại → login được | ☐ | |
| 7 | Đặt lại mật khẩu → password mặc định | ☐ | |
| 8 | Không xoá user có dữ liệu liên kết | ☐ | |

### 5.11 FEAT_11: Audit Log

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | CREATE được log | ☐ | |
| 2 | UPDATE được log (old + new values) | ☐ | |
| 3 | DELETE được log | ☐ | |
| 4 | Filter theo actor hoạt động | ☐ | |
| 5 | Filter theo module hoạt động | ☐ | |
| 6 | Filter theo action hoạt động | ☐ | |
| 7 | Audit log không chỉnh sửa được | ☐ | |
| 8 | Chỉ QUAN_TRI_HE_THONG, QUAN_LY xem được | ☐ | |

### 5.12 FEAT_12: Xử lý Lỗi & Bảo mật

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Error response đúng format | ☐ | |
| 2 | 401 khi không có token | ☐ | |
| 3 | 403 khi không đủ quyền | ☐ | |
| 4 | 404 khi resource không tồn tại | ☐ | |
| 5 | 409 khi dữ liệu trùng lặp | ☐ | |
| 6 | 429 khi vượt rate limit | ☐ | |
| 7 | 500 không expose stack trace | ☐ | |
| 8 | Input validation hoạt động | ☐ | |
| 9 | CORS đúng | ☐ | |
| 10 | Helmet headers có mặt | ☐ | |
| 11 | Password hash đúng (bcrypt ≥ 10) | ☐ | |
| 12 | Rate limit hoạt động | ☐ | |

## 6. Integration Tests

| # | Flow | Steps | Expected | Status |
|---|------|-------|----------|--------|
| 1 | Full order flow | Tạo order → Thêm món → BEP accept → Cook → Complete → Serve → Pay | Happy path | ☐ |
| 2 | Reservation → Order | Đặt bàn → Check-in → Tạo order → Pay | Happy path | ☐ |
| 3 | Kitchen flow | Multiple orders → BEP process → Complete all | Happy path | ☐ |
| 4 | Report flow | Create invoices → View report → Export | Happy path | ☐ |
| 5 | Staff flow | Create staff → Login → Perform actions | Happy path | ☐ |
| 6 | Inventory flow | Create item → IN → OUT → Stocktake | Happy path | ☐ |
| 7 | Error flow | Invalid input → Error → Fix → Success | Happy path | ☐ |
| 8 | Auth flow | Login → Token → Refresh → Logout | Happy path | ☐ |

## 7. Performance Checklist

| # | Item | Target | Actual | Status |
|---|------|--------|--------|--------|
| 1 | Login response time | < 500ms | | ☐ |
| 2 | API average response time | < 300ms | | ☐ |
| 3 | Frontend initial load | < 3s | | ☐ |
| 4 | Database query time (P95) | < 200ms | | ☐ |
| 5 | Image upload time (5MB) | < 5s | | ☐ | *Chỉ kiểm tra nếu feature upload được bật ở phiên bản sau* |
| 6 | Report generation time | < 5s | | ☐ |

## 8. Security Checklist

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | No secrets trong code | ☐ | |
| 2 | No secrets trong git history | ☐ | |
| 3 | Password hash đúng (bcrypt) | ☐ | |
| 4 | JWT secret mạnh | ☐ | |
| 5 | CORS đúng | ☐ | |
| 6 | Rate limiting hoạt động | ☐ | |
| 7 | Helmet headers có mặt | ☐ | |
| 8 | SQL injection prevented (ORM) | ☐ | |
| 9 | XSS prevented (input validation) | ☐ | |
| 10 | Error responses không leak info | ☐ | |

## 9. Deployment Checklist

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Backend build thành công | ☐ | |
| 2 | Frontend build thành công | ☐ | |
| 3 | Database migration script sẵn sàng | ☐ | |
| 4 | Seed data script sẵn sàng | ☐ | |
| 5 | Environment variables sẵn sàng | ☐ | |
| 6 | Health check endpoint hoạt động | ☐ | |
| 7 | Logging hoạt động | ☐ | |
| 8 | Error monitoring sẵn sàng | ☐ | |

## 10. Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | | |
| QA | | | |
| Tech Lead | | | |
| Product Owner | | | |

## 11. Notes

- Checklist này nên được thực hiện SAU khi tất cả sprints hoàn thành
- Mỗi item cần được verify bởi ít nhất 1 người
- Nếu có issue, ghi rõ trong cột Notes và tạo bug ticket
- Sign-off chỉ thực hiện khi tất cả critical items pass

## 12. Definition of Done

- [ ] Tất cả items trong checklist được verify
- [ ] Tất cả integration tests pass
- [ ] Performance targets đạt được
- [ ] Security checklist pass
- [ ] Deployment checklist pass
- [ ] Sign-off từ các bên liên quan
