# Kiến trúc Hệ thống — Quản lý Nhà hàng

> ⚠️ **Tài liệu Thiết kế Kỹ thuật** — Dành cho Developer/Tech Lead.
> **Không phải tài liệu nghiệp vụ chính thức.** Không dùng cho khách hàng/PM/BA.
> Xem `docs/nghiepvu/` cho tài liệu nghiệp vụ.

---

## 1. Tổng quan kiến trúc

Hệ thống sử dụng kiến trúc 3 lớp (3-tier architecture) truyền thống:

```
┌─────────────────────────────────────────────────────┐
│                   React Frontend                     │
│        (SPA - Single Page Application)               │
├─────────────────────────────────────────────────────┤
│                   REST API (JSON)                     │
├─────────────────────────────────────────────────────┤
│                  NestJS Backend                       │
│     Controller → Service → Repository                │
├─────────────────────────────────────────────────────┤
│                  TypeORM (ORM)                        │
├─────────────────────────────────────────────────────┤
│                   MySQL Database                      │
└─────────────────────────────────────────────────────┘
```

### Luồng request điển hình

```
Browser → React App → HTTP Request → NestJS Backend
→ Xác thực & phân quyền → Xử lý nghiệp vụ → Trả về JSON
→ React render
```

### Tại sao chọn kiến trúc 3 lớp?

| Yếu tố | Lý do |
|--------|-------|
| Đơn giản, dễ hiểu | Phù hợp quy mô 1 nhà hàng, 5–10 nhân viên cùng lúc |
| Dễ maintain | MVC pattern quen thuộc, dễ tìm nhân sự |
| NestJS hỗ trợ tốt | Dependency injection, guard, interceptor có sẵn |
| Không over-engineering | Chưa cần microservices, CQRS, event sourcing ở MVP |

*Tham khảo: docs/nghiepvu/12 — mục "Kiến trúc tổng thể"*

---

## 2. Công nghệ

### 2.1 Frontend

| Thành phần | Công nghệ | Lý do |
|------------|-----------|-------|
| Framework | React 18+ | Phổ biến, ecosystem lớn, dễ tuyển |
| Build tool | Vite | Nhanh, HMR mượt |
| Ngôn ngữ | TypeScript strict | Phát hiện lỗi sớm |
| Routing | React Router v6 | Chuẩn cho SPA |
| State management | React Context + useReducer | Đủ dùng cho MVP |
| UI Components | Ant Design (antd) | Bộ component sẵn, phù hợp web quản trị |
| HTTP client | Axios | Interceptor, token refresh dễ dàng |
| Form | React Hook Form + Zod | Validation mạnh, ít re-render |
| Biểu đồ | Recharts | Nhẹ, đơn giản cho báo cáo |

### 2.2 Backend

| Thành phần | Công nghệ | Lý do |
|------------|-----------|-------|
| Framework | NestJS 10+ | Cấu trúc module rõ ràng, DI, guard sẵn |
| Ngôn ngữ | TypeScript strict | Đồng bộ với frontend |
| ORM | TypeORM | Tích hợp tốt với NestJS |
| Validation | class-validator + class-transformer | Decorator-based, gắn vào DTO |
| Auth | @nestjs/passport + JWT | Ổn định, nhiều tài liệu |
| Logging | NestJS Logger (built-in) | Đủ dùng cho MVP |
| Config | @nestjs/config | Environment variables tập trung |

### 2.3 Database

| Thành phần | Công nghệ | Lý do |
|------------|-----------|-------|
| DBMS | MySQL 8.0 | Miễn phí, ổn định, phổ biến |
| Charset | utf8mb4 + utf8mb4_unicode_ci | Hỗ trợ tiếng Việt đầy đủ |
| Timezone | UTC (DATETIME(3)) | Tránh lỗi timezone |
| Migration | TypeORM migration | Tách biệt schema khỏi code |

*Tham khảo: docs/nghiepvu/12 — mục "Công nghệ"*

---

## 3. Cấu trúc module Backend

### 3.1 Danh sách module MVP

Danh sách module ở mức **trách nhiệm**, không phải cây thư mục.

| Module | Trách nhiệm | Actor chính |
|--------|-------------|-------------|
| `AuthModule` | Đăng nhập, refresh token, đăng xuất, xác thực | Tất cả |
| `StaffModule` | Quản lý nhân viên, tài khoản, phân quyền | QUAN_TRI_HE_THONG |
| `TablesModule` | Quản lý khu vực + bàn, chuyển trạng thái bàn | QUAN_LY |
| `ReservationsModule` | Đặt bàn trước, xác nhận, check-in, hủy | PHUC_VU |
| `MenuModule` | Danh mục món + món ăn, trạng thái món | QUAN_LY |
| `OrdersModule` | Tạo/sửa/hủy đơn hàng, thêm/sửa món, lịch sử đơn | PHUC_VU |
| `KitchenModule` | Xem danh sách món chế biến, cập nhật trạng thái | BEP |
| `PaymentsModule` | Thanh toán, hóa đơn | THU_NGAN |
| `ReportsModule` | Báo cáo doanh thu, món bán chạy | QUAN_LY |
| `InventoryModule` | Quản lý kho nguyên liệu, nhập/xuất/kiểm kê | KHO |
| `AuditLogModule` | Nhật ký hoạt động (INSERT-only) | Hệ thống |

### 3.2 Ghi chú về module

- **OrdersModule** quản lý cả `orders` và `order_items`. Lịch sử trạng thái món trong MVP ghi nhận qua `audit_logs`. Nếu sau này cần phân tích thời gian bếp chi tiết, có thể tách bảng trạng thái riêng ở giai đoạn sau.
- **InventoryModule** quản lý cả `inventory_items` và `inventory_transactions`.
- **MenuModule** gộp `menu_categories` và `menu_items`.
- **StaffModule** quản lý cả `roles`, `users` và `staff`.
- **KitchenModule** chỉ đọc danh sách món và cập nhật trạng thái — không tạo/xóa đơn.

*Tham khảo: docs/nghiepvu/08-pham-vi-mvp-va-backlog.md*

---

## 4. Cấu trúc Frontend

### 4.1 Layout tổng thể

```
AppLayout
├── Sidebar (navigation theo actor — mỗi actor thấy menu khác nhau)
├── Header (user info, logout)
└── Content (trang tương ứng)
```

### 4.2 Nguyên tắc routing

- Route `/login` — trang đăng nhập, công khai.
- Các route khác đều phải qua xác thực (ProtectedRoute).
- Sidebar hiển thị menu theo actor đang đăng nhập.
- Chi tiết routing sẽ được thiết kế trong tài liệu UI/UX sau.

---

## 5. Authentication & Authorization

### 5.1 Luồng đăng nhập

```
Login Page → Backend xác thực → Cấp JWT (access + refresh)
→ Frontend lưu access token trong memory, refresh token trong httpOnly cookie
```

### 5.2 Token strategy

| Token | Thời hạn | Lưu ở đâu | Mục đích |
|-------|----------|-----------|----------|
| Access Token | 15 phút | Memory (React state) | Xác thực API |
| Refresh Token | 7 ngày | httpOnly cookie | Cấp access token mới |

**Không lưu token trong localStorage** vì dễ bị XSS attack.

### 5.3 Phân quyền (RBAC) — 6 Actor

Hệ thống có **6 actor** theo file 02:

| Actor | Mô tả | Phạm vi trách nhiệm |
|-------|-------|---------------------|
| `QUAN_TRI_HE_THONG` | Quản trị hệ thống | Quản lý tài khoản, cấu hình hệ thống, audit log |
| `QUAN_LY` | Quản lý nhà hàng | Quản lý thực đơn, bàn, đặt bàn, báo cáo, đặt giá |
| `PHUC_VU` | Nhân viên phục vụ | Gọi món, xem thực đơn, xem bàn, đặt bàn |
| `THU_NGAN` | Thu ngân | Thanh toán, hóa đơn |
| `BEP` | Nhân viên bếp | Xem món chế biến, cập nhật trạng thái món |
| `KHO` | Nhân viên kho | Quản lý nguyên liệu, nhập/xuất/kiểm kê |

**Ma trận quyền chi tiết** (theo docs/nghiepvu/02):

| Tính năng | QUAN_TRI_HE_THONG | QUAN_LY | PHUC_VU | THU_NGAN | BEP | KHO |
|-----------|:-:|:-:|:-:|:-:|:-:|:-:|
| Quản lý tài khoản | CRUD | Xem | - | - | - | - |
| Quản lý thực đơn | - | CRUD | Xem | - | - | - |
| Quản lý bàn | - | CRUD | Xem/đổi TT | - | - | - |
| Đặt bàn | - | ✅ | ✅ | - | - | - |
| Tạo/sửa đơn hàng | - | ✅ | ✅ | - | - | - |
| Hủy đơn hàng | - | ✅ | - | - | - | - |
| Xem đơn hàng | - | ✅ | ✅ | Xem | - | - |
| Xem món chế biến | - | Xem | Xem | - | ✅ | - |
| Cập nhật trạng thái món | - | - | - | - | ✅ | - |
| Thanh toán | - | ✅ | - | ✅ | - | - |
| Hóa đơn | - | ✅ | - | Xem / tạo / ghi nhận thanh toán / in | - | - |
| Báo cáo | - | ✅ | - | - | - | - |
| Kho nguyên liệu | - | ✅ | - | - | - | CRUD |
| Audit log | Xem | Xem | - | - | - | - |
| Cấu hình hệ thống | ✅ | - | - | - | - | - |

**Lưu ý:**
- `QUAN_TRI_HE_THONG` chỉ quản lý tài khoản, cấu hình hệ thống và xem audit log.
  Không can thiệp vào nghiệp vụ nhà hàng (thực đơn, bàn, đơn hàng, thanh toán, báo cáo).
- `THU_NGAN` không xem báo cáo doanh thu tổng hợp (chưa được phân quyền — chờ xác nhận).
- `THU_NGAN` không được hủy hóa đơn. Hủy hóa đơn là quyền của `QUAN_LY` và phải ghi lý do.
- Hóa đơn đã thanh toán không được thu ngân sửa.
- `BEP` không xem báo cáo.
- `KHO` không xem báo cáo doanh thu tổng hợp.
- `PHUC_VU` không tự hủy đơn hàng (chưa có quy trình rõ — chờ xác nhận).

*Tham khảo: docs/nghiepvu/02-actor-va-phan-quyen.md*

### 5.4 Cơ chế phân quyền

- Mọi request phải qua xác thực JWT (trừ login, refresh, health check).
- Sau xác thực, backend kiểm tra actor của user có quyền truy cập nghiệp vụ không.
- Public routes (không cần auth): login, refresh, health check.

---

## 6. Nguyên tắc giao tiếp giữa Frontend và Backend

- Frontend giao tiếp backend qua HTTP/REST ở mức khái niệm.
- Backend kiểm tra xác thực và phân quyền trước khi xử lý nghiệp vụ.
- Backend trả dữ liệu dạng JSON.
- Thiết kế endpoint chi tiết sẽ được thực hiện ở tài liệu API riêng sau này.
- Tài liệu này không liệt kê endpoint cụ thể.

---

## 7. Luồng nghiệp vụ chính

### 7.1 Luồng bán hàng (Gọi món)

```
PHUC_VU chọn bàn → Xem thực đơn → Thêm món vào đơn hàng
→ Gửi món xuống bếp → BEP nhận món → BEP báo hoàn thành
→ PHUC_VU phục vụ món → THU_NGAN thanh toán → Đóng đơn hàng
→ Bàn chuyển về trạng thái DANG_DON
```

### 7.2 Luồng bếp

```
PHUC_VU gọi món → Món vào danh sách chờ chế biến (CHO_CHE_BIEN)
→ BEP xem → DANG_CHE_BIEN → HOAN_THANH
→ Thông báo cho PHUC_VU → Phục vụ khách (DA_PHUC_VU)
```

### 7.3 Luồng đặt bàn trước

```
Khách gọi điện/đến → PHUC_VU tạo đặt bàn
→ Chọn bàn → Xác nhận → Bàn chuyển DA_DAT
→ Khi khách đến → Check-in → Bàn chuyển CO_KHACH
```

### 7.4 Luồng thanh toán

```
THU_NGAN xem hóa đơn bàn → Áp dụng giảm giá (nếu có) + VAT
→ Chọn phương thức thanh toán (TIEN_MAT / CHUYEN_KHOAN / THE)
→ Xác nhận thanh toán → Đơn hàng HOAN_THANH → DA_THANH_TOAN
→ Bàn DANG_DON → PHUC_VU dọn → Bàn TRONG
```

---

## 8. Xử lý lỗi & Logging

### 8.1 Xử lý lỗi

- Backend format response nhất quán cho mọi lỗi.
- Log error + stack trace (ẩn stack khỏi response).
- Không để lỗi stack trace lộ ra cho frontend.

### 8.2 Logger

- Dùng NestJS `Logger` (built-in).
- **Không log:** password, token, số thẻ.
- **Có log:** error stack, business rule violations.

### 8.3 Audit Log

- Ghi lại mọi thao tác quan trọng: đăng nhập/đăng xuất, CRUD dữ liệu master,
  thanh toán, hủy đơn hàng.
- Thông tin: thời gian, người thực hiện, hành động, IP, kết quả.
- **Chỉ INSERT, không UPDATE/DELETE.**

---

## 9. Security

### 9.1 Password

- Hash bằng bcrypt, cost ≥ 10.
- Không trả password trong response.

### 9.2 Database

- **Không dùng sync** — migration là bắt buộc.
- Input validation ở DTO — không tin SQL injection.
- Soft delete cho các bảng master.

### 9.3 CORS

- Chỉ cho phép origin frontend cụ thể.
- Không dùng `*` khi có credential.

---

## 10. Các quyết định kiến trúc

| ID | Quyết định | Lựa chọn | Lý do |
|----|-----------|---------|-------|
| ADR-01 | Kiến trúc tổng thể | 3-tier (Monolith) | Đơn giản, đủ cho MVP |
| ADR-02 | ORM | TypeORM | Tích hợp tốt NestJS |
| ADR-03 | Auth strategy | JWT access + refresh | Stateless, phổ biến |
| ADR-04 | Soft delete | Cột `deleted_at` | Audit, không mất dữ liệu |
| ADR-05 | DB charset | utf8mb4 | Hỗ trợ tiếng Việt |
| ADR-06 | Migration | TypeORM migration files | Không sync, kiểm soát schema |
| ADR-07 | Audit log | Bảng riêng, INSERT-only | Tuân thủ BR-AUTH-06 |

---

## 11. Điểm cần khách hàng xác nhận

| ID | Vấn đề | Đề xuất | Cần xác nhận |
|----|--------|---------|--------------|
| Q-AUTH-01 | Một tài khoản nhiều vai trò? | 1 tài khoản = 1 vai trò | File 07, Q-AUTH-01 |
| Q-AUTH-02 | Tách QUAN_TRI_HE_THONG và QUAN_LY? | Tách riêng | File 07, Q-AUTH-02 |
| Q-AUTH-03 | Lưu token dùng httpOnly cookie? | Có | File 12 |
| Q-AUTH-04 | Audit log cho mọi thao tác quan trọng? | Có | File 07, Q-AUTH-05 |
| Q-ORD-01 | PHUC_VU được hủy đơn hàng không? | Chưa — chờ quy trình | File 07, Q-ORD-01 |
| Q-ORD-02 | Gọi thêm món nhiều lần? | Có | File 07, Q-ORD-03 |
| Q-KIT-01 | Bếp xem màn hình hay in phiếu? | Màn hình | File 07, Q-KIT-01 |
| Q-PAY-01 | Hình thức thanh toán? | Tiền mặt + CK + Thẻ | File 07, Q-PAY-01 |
| Q-PAY-02 | Có tách hóa đơn? | Không (MVP) | File 07, Q-PAY-04 |
| Q-RPT-01 | THU_NGAN xem báo cáo doanh thu? | Chưa — chờ phân quyền | File 02 |
| Q-INV-01 | Có quản lý kho MVP? | Should Have | File 07, Q-INV-01 |

*Tham khảo: docs/nghiepvu/07-cau-hoi-lam-ro.md và docs/nghiepvu/12-quyet-dinh-gia-dinh-mvp.md*
