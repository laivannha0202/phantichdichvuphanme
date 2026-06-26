# Thiết kế Cơ sở Dữ liệu — Quản lý Nhà hàng

> ⚠️ **Tài liệu Thiết kế Kỹ thuật** — Dành cho Developer/Tech Lead.
> **Không phải tài liệu nghiệp vụ chính thức.** Không dùng cho khách hàng/PM/BA.
> Xem `docs/nghiepvu/` cho tài liệu nghiệp vụ.

---

## 1. Tổng quan

Tài liệu này mô tả thiết kế cơ sở dữ liệu ở mức kiến trúc (trừu tượng),
liệt kê các bảng, mối quan hệ, kiểu dữ liệu đề xuất, và enum trạng thái.

Thiết kế chi tiết (column level) do nhóm phát triển thực hiện trong
quá trình implement, dựa trên các nguyên tắc trong tài liệu này.

---

## 2. Bảng dữ liệu MVP

### 2.1 Danh sách bảng (16 bảng)

| # | Bảng | Loại | Mô tả | Mức độ |
|---|------|------|-------|--------|
| 1 | `roles` | Reference | Mã vai trò + tên vai trò | Must |
| 2 | `users` | Master | Tài khoản đăng nhập | Must |
| 3 | `staff` | Master | Hồ sơ nhân viên | Must |
| 4 | `table_areas` | Master | Khu vực (tầng, phòng) | Must |
| 5 | `tables` | Master | Bàn trong từng khu vực | Must |
| 6 | `reservations` | Transaction | Đặt bàn trước | Must |
| 7 | `menu_categories` | Master | Danh mục món ăn | Must |
| 8 | `menu_items` | Master | Món ăn | Must |
| 9 | `orders` | Transaction | Đơn hàng — gọi món | Must |
| 10 | `order_items` | Transaction | Chi tiết món trong đơn | Must |
| 11 | `invoices` | Transaction | Hóa đơn xuất cho khách | Must |
| 12 | `payments` | Transaction | Giao dịch thanh toán | Must |
| 13 | `suppliers` | Master | Nhà cung cấp nguyên liệu | Should |
| 14 | `ingredients` | Master | Nguyên liệu tồn kho | Should |
| 15 | `inventory_transactions` | Transaction | Nhập/xuất nguyên liệu | Should |
| 16 | `audit_logs` | Transaction | Nhật ký hoạt động (INSERT-only) | Must |

**Bảng đã loại bỏ khỏi thiết kế MVP:**
- `order_history` — lịch sử đơn có thể ghi nhận qua `audit_logs` trong MVP. Nếu sau này cần phân tích thời gian bếp chi tiết, có thể tách bảng trạng thái riêng ở giai đoạn sau.
- `order_item_status_log` — lịch sử trạng thái món ghi nhận qua audit_logs (xem ghi chú bên dưới)
- `menu_item_variants` — không thuộc MVP
- `shifts` — không thuộc MVP
- `shift_assignments` — không thuộc MVP
- `payment_details` — không thuộc MVP. MVP mặc định một invoice có một payment. Thanh toán kết hợp nhiều hình thức thiết kế sau MVP.

*Tham khảo: docs/nghiepvu/08-pham-vi-mvp-va-backlog.md*

---

## 3. Mô tả bảng

### 3.1 Reference Data

#### `roles` — Vai trò

Lưu mã vai trò và tên vai trò. Mỗi user gắn một role.

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | Khóa chính |
| code | VARCHAR(50) | Mã vai trò, duy nhất |
| name | VARCHAR(100) | Tên hiển thị |
| created_at | DATETIME(3) | |

**Dữ liệu mặc định (6 actor):**

| code | name |
|------|------|
| QUAN_TRI_HE_THONG | Quản trị hệ thống |
| QUAN_LY | Quản lý nhà hàng |
| PHUC_VU | Nhân viên phục vụ |
| THU_NGAN | Thu ngân |
| BEP | Nhân viên bếp |
| KHO | Nhân viên kho |

### 3.2 Master Data

#### `users` — Tài khoản đăng nhập

Lưu tài khoản đăng nhập, mật khẩu mã hóa, gắn role và nhân viên.

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | Khóa chính |
| username | VARCHAR(50) | Duy nhất, không dấu |
| password_hash | VARCHAR(255) | bcrypt hash |
| role_id | INT | FK → roles.id |
| staff_id | INT | FK → staff.id (nullable — tài khoản quản trị có thể chưa có hồ sơ nhân viên) |
| status | ENUM(VARCHAR) | ACTIVE, INACTIVE, LOCKED |
| created_at | DATETIME(3) | |
| updated_at | DATETIME(3) | |
| deleted_at | DATETIME(3) | Soft delete |

Quy tắc:
- Một user có một role.
- Một staff có thể có một user (hoặc chưa có).
- Không lưu token, OTP, session trong bảng này.

#### `staff` — Hồ sơ nhân viên

Lưu thông tin hồ sơ nhân viên: họ tên, số điện thoại, chức vụ, trạng thái làm việc.

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | Khóa chính |
| full_name | VARCHAR(100) | Họ tên nhân viên |
| phone | VARCHAR(20) | Số điện thoại |
| position | VARCHAR(50) | Chức vụ (VD: Phục vụ, Bếp, Thu ngân) |
| status | VARCHAR(50) | Trạng thái làm việc (giá trị do nhóm phát triển định nghĩa trong code) |
| created_at | DATETIME(3) | |
| updated_at | DATETIME(3) | |
| deleted_at | DATETIME(3) | Soft delete |

*Lưu ý: `staff.status` quản lý trạng thái làm việc của nhân viên. Giá trị cụ thể do nhóm phát triển định nghĩa trong code, không ghi cứng trong tài liệu này. Trạng thái tài khoản (ACTIVE/INACTIVE/LOCKED) quản lý ở `users.status`.*

#### `table_areas` — Khu vực

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | Khóa chính |
| name | VARCHAR(100) | Tên khu vực (VD: Tầng 1, Sân vườn) |
| sort_order | INT | Thứ tự hiển thị |
| created_at | DATETIME(3) | |
| updated_at | DATETIME(3) | |

#### `tables` — Bàn

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | Khóa chính |
| table_area_id | INT | FK → table_areas.id |
| name | VARCHAR(50) | Tên bàn (VD: B01, B02) |
| capacity | SMALLINT | Số ghế |
| status | ENUM(VARCHAR) | TRONG, DA_DAT, CO_KHACH, DANG_DON, BAO_TRI |
| created_at | DATETIME(3) | |
| updated_at | DATETIME(3) | |
| deleted_at | DATETIME(3) | Soft delete |

#### `menu_categories` — Danh mục món

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | Khóa chính |
| name | VARCHAR(100) | Tên danh mục (VD: Món khai vị, Đồ uống) |
| sort_order | INT | Thứ tự hiển thị |
| created_at | DATETIME(3) | |
| updated_at | DATETIME(3) | |
| deleted_at | DATETIME(3) | Soft delete |

#### `menu_items` — Món ăn

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | Khóa chính |
| category_id | INT | FK → menu_categories.id |
| name | VARCHAR(200) | Tên món |
| description | TEXT | Mô tả món |
| price | DECIMAL(12,2) | Giá bán |
| cost_price | DECIMAL(12,2) | Giá vốn (nullable) |
| image_url | VARCHAR(500) | Hình ảnh (nullable) |
| status | ENUM(VARCHAR) | DANG_BAN, HET_MON, NGUNG_BAN |
| created_at | DATETIME(3) | |
| updated_at | DATETIME(3) | |
| deleted_at | DATETIME(3) | Soft delete |

#### `suppliers` — Nhà cung cấp (Should Have)

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | Khóa chính |
| supplier_code | VARCHAR(50) | Mã NCC, duy nhất |
| name | VARCHAR(200) | Tên nhà cung cấp |
| phone | VARCHAR(20) | Số điện thoại (nullable) |
| email | VARCHAR(100) | Email (nullable) |
| address | VARCHAR(500) | Địa chỉ (nullable) |
| note | TEXT | Ghi chú (nullable) |
| status | VARCHAR(50) | DANG_HOP_TAC, NGUNG_HOP_TAC |
| created_at | DATETIME(3) | |
| updated_at | DATETIME(3) | |
| deleted_at | DATETIME(3) | Soft delete |

#### `ingredients` — Nguyên liệu (Should Have)

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | Khóa chính |
| ingredient_code | VARCHAR(50) | Mã nguyên liệu, duy nhất |
| name | VARCHAR(200) | Tên nguyên liệu |
| unit | VARCHAR(50) | Đơn vị tính (kg, lít, cái...) |
| current_stock | DECIMAL(12,3) | Tồn kho hiện tại |
| min_stock | DECIMAL(12,3) | Tồn tối thiểu (cảnh báo) |
| status | VARCHAR(50) | CON_HANG, SAP_HET, HET_HANG, NGUNG_SU_DUNG |
| note | TEXT | Ghi chú (nullable) |
| created_at | DATETIME(3) | |
| updated_at | DATETIME(3) | |
| deleted_at | DATETIME(3) | Soft delete |

---

### 3.3 Transaction Data

#### `orders` — Đơn hàng

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | Khóa chính |
| table_id | INT | FK → tables.id |
| created_by | INT | FK → users.id (PHUC_VU) |
| customer_count | SMALLINT | Số khách (nullable) |
| note | TEXT | Ghi chú (nullable) |
| status | ENUM(VARCHAR) | DANG_CHUAN_BI, DANG_PHUC_VU, HOAN_THANH, DA_THANH_TOAN, DA_HUY |
| total_amount | DECIMAL(14,2) | Tổng tiền |
| discount_amount | DECIMAL(12,2) | Giảm giá (mặc định 0) |
| discount_reason | VARCHAR(200) | Lý do giảm giá (nullable) |
| created_at | DATETIME(3) | |
| updated_at | DATETIME(3) | |

#### `order_items` — Món trong đơn

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | Khóa chính |
| order_id | INT | FK → orders.id |
| menu_item_id | INT | FK → menu_items.id |
| quantity | SMALLINT | Số lượng |
| unit_price | DECIMAL(12,2) | Giá tại thời điểm gọi |
| note | TEXT | Ghi chú món (nullable) |
| status | ENUM(VARCHAR) | CHO_CHE_BIEN, DANG_CHE_BIEN, HOAN_THANH, DA_PHUC_VU, DA_HUY |
| created_at | DATETIME(3) | |
| updated_at | DATETIME(3) | |

*Lưu ý: Lịch sử trạng thái món trong MVP ghi nhận qua `audit_logs`.
Nếu sau này cần phân tích thời gian bếp chi tiết, có thể tách bảng trạng thái riêng ở giai đoạn sau.*

#### `invoices` — Hóa đơn

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | Khóa chính |
| invoice_code | VARCHAR(50) | Mã hóa đơn (có thể sinh tự động) |
| order_id | INT | FK → orders.id, UNIQUE (một order chỉ một hóa đơn) |
| vat_rate | DECIMAL(5,2) | VAT (VD: 10%) |
| total_before_vat | DECIMAL(14,2) | Tổng trước VAT |
| vat_amount | DECIMAL(14,2) | Tiền VAT |
| total_final | DECIMAL(14,2) | Tổng thanh toán cuối |
| cancelled_reason | VARCHAR(500) | Lý do hủy (nullable — chỉ có giá trị khi hóa đơn bị hủy) |
| cancelled_by | INT | FK → users.id — người hủy (nullable — chỉ có giá trị khi hóa đơn bị hủy) |
| cancelled_at | DATETIME(3) | Thời gian hủy (nullable — chỉ có giá trị khi hóa đơn bị hủy) |
| created_at | DATETIME(3) | |

*Lưu ý: Các trường `cancelled_reason`, `cancelled_by`, `cancelled_at` chỉ được ghi khi hóa đơn bị hủy. Nếu chưa hủy, các trường này để NULL. Khi hủy hóa đơn phải đồng thời ghi vào `audit_logs`.*

#### `payments` — Thanh toán

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | Khóa chính |
| invoice_id | INT | FK → invoices.id (MVP: 1 invoice = 1 payment) |
| paid_by | INT | FK → users.id (THU_NGAN) |
| amount | DECIMAL(14,2) | Số tiền thu |
| payment_method | ENUM(VARCHAR) | TIEN_MAT, CHUYEN_KHOAN, THE |
| status | ENUM(VARCHAR) | CHUA_THANH_TOAN, THANH_CONG, THAT_BAI, DA_HOAN_TIEN |
| note | TEXT | Ghi chú (nullable) |
| created_at | DATETIME(3) | |
| updated_at | DATETIME(3) | |

#### `reservations` — Đặt bàn

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | Khóa chính |
| table_id | INT | FK → tables.id (nullable nếu chưa chọn bàn) |
| customer_name | VARCHAR(100) | Tên khách |
| customer_phone | VARCHAR(20) | SĐT khách |
| guest_count | SMALLINT | Số lượng khách |
| reservation_time | DATETIME(3) | Thời gian đến dự kiến |
| status | ENUM(VARCHAR) | CHO_XAC_NHAN, DA_XAC_NHAN, DA_NHAN_BAN, HOAN_THANH, KHONG_DEN, DA_HUY |
| created_by | INT | FK → users.id (PHUC_VU) |
| note | TEXT | Ghi chú (nullable) |
| created_at | DATETIME(3) | |
| updated_at | DATETIME(3) | |
| deleted_at | DATETIME(3) | Soft delete |

#### `inventory_transactions` — Giao dịch kho (Should Have)

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | Khóa chính |
| transaction_code | VARCHAR(50) | Mã giao dịch, duy nhất (GD-YYYYMMDD-XXX) |
| ingredient_id | INT | FK → ingredients.id |
| supplier_id | INT | FK → suppliers.id (nullable) |
| type | VARCHAR(50) | NHAP_KHO, XUAT_KHO, DIEU_CHINH |
| quantity | DECIMAL(12,3) | Số lượng (+ nhập, − xuất) |
| unit_price | DECIMAL(12,2) | Đơn giá (nullable) |
| total_amount | DECIMAL(14,2) | Thành tiền (nullable) |
| note | TEXT | Ghi chú (nullable) |
| created_by_user_id | INT | FK → users.id (nullable) |
| created_at | DATETIME(3) | |
| updated_at | DATETIME(3) | |

#### `audit_logs` — Nhật ký hoạt động

INSERT-only (không UPDATE/DELETE).

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | BIGINT | Khóa chính (auto-increment lớn) |
| user_id | INT | FK → users.id (nullable — cho action không xác thực) |
| action | VARCHAR(100) | Hành động (VD: LOGIN, CREATE_USER, PAYMENT) |
| entity_type | VARCHAR(50) | Loại đối tượng (VD: order, payment, user) |
| entity_id | INT | ID đối tượng (nullable) |
| detail | JSON | Chi tiết (nullable) |
| ip_address | VARCHAR(45) | Địa chỉ IP (nullable) |
| created_at | DATETIME(3) | |

---

## 4. Enum trạng thái

Tất cả enum là chuỗi VARCHAR lưu trong DB.
Giá trị enum do nhóm phát triển định nghĩa trong code (class/enum TS).

| Bảng | Cột | Giá trị enum |
|------|-----|-------------|
| `users` | `status` | `ACTIVE`, `INACTIVE`, `LOCKED` |
| `tables` | `status` | `TRONG`, `DA_DAT`, `CO_KHACH`, `DANG_DON`, `BAO_TRI` |
| `menu_items` | `status` | `DANG_BAN`, `HET_MON`, `NGUNG_BAN` |
| `ingredients` | `status` | `CON_HANG`, `SAP_HET`, `HET_HANG`, `NGUNG_SU_DUNG` |
| `suppliers` | `status` | `DANG_HOP_TAC`, `NGUNG_HOP_TAC` |
| `orders` | `status` | `DANG_CHUAN_BI`, `DANG_PHUC_VU`, `HOAN_THANH`, `DA_THANH_TOAN`, `DA_HUY` |
| `order_items` | `status` | `CHO_CHE_BIEN`, `DANG_CHE_BIEN`, `HOAN_THANH`, `DA_PHUC_VU`, `DA_HUY` |
| `payments` | `status` | `CHUA_THANH_TOAN`, `THANH_CONG`, `THAT_BAI`, `DA_HOAN_TIEN` |
| `payments` | `payment_method` | `TIEN_MAT`, `CHUYEN_KHOAN`, `THE` |
| `reservations` | `status` | `CHO_XAC_NHAN`, `DA_XAC_NHAN`, `DA_NHAN_BAN`, `HOAN_THANH`, `KHONG_DEN`, `DA_HUY` |
| `inventory_transactions` | `type` | `NHAP_KHO`, `XUAT_KHO`, `DIEU_CHINH` |

*Tham khảo: docs/nghiepvu/05-trang-thai-he-thong.md*

---

## 5. Mối quan hệ

```
roles 1──N users 1──1 staff (optional)

table_areas 1──N tables 1──N orders 1──N order_items N──1 menu_items N──1 menu_categories

orders 1──1 invoices 1──1 payments

tables 1──N reservations

suppliers 1──N inventory_transactions
ingredients 1──N inventory_transactions
users 1──N inventory_transactions

users 1──N audit_logs
```

### Mô tả các quan hệ chính:

- **roles → users**: Mỗi user thuộc một role.
- **users → staff**: Mỗi user có thể gắn một hồ sơ nhân viên (hoặc chưa có).
- **table_areas → tables**: Một khu vực có nhiều bàn.
- **menu_categories → menu_items**: Một danh mục có nhiều món.
- **tables → orders**: Một bàn có thể có nhiều đơn (qua thời gian — mỗi lần khách ngồi là một đơn mới).
- **orders → order_items**: Một đơn có nhiều món.
- **menu_items → order_items**: Một món có thể có trong nhiều đơn.
- **orders → invoices**: Một đơn có một hóa đơn.
- **invoices → payments**: Một hóa đơn có một thanh toán (MVP).
- **tables → reservations**: Một bàn có thể có nhiều đặt bàn.
- **users → audit_logs**: Mỗi user có thể tạo nhiều audit log.
- **suppliers → inventory_transactions**: Một nhà cung cấp có thể có nhiều giao dịch nhập kho.
- **ingredients → inventory_transactions**: Một nguyên liệu có thể có nhiều giao dịch.
- **users → inventory_transactions**: Một user có thể tạo nhiều giao dịch kho.

---

## 6. Migration Strategy (SQL-first)

- **SQL-first**: File `.sql` trong `database/` là script chính thức dựng database.
- **Công cụ**: TypeORM migration (bản tương ứng trong code, phải khớp SQL).
- **Nguyên tắc**: Không dùng `synchronize` ở production. Mỗi migration là một file riêng, có up và down.
- **Soft delete**: Trách nhiệm của application, không phải DB trigger.
- **Seed data**: Tách riêng trong migration hoặc script riêng.
- Chi tiết quy ước: `docs/thietke/06-quy-uoc-database-migration-sql.md`

---

## 7. Chỉ mục (Index) đề xuất

| Bảng | Cột | Lý do |
|------|-----|-------|
| `users` | `username` | UNIQUE — đăng nhập |
| `users` | `role_id` | JOIN roles |
| `users` | `staff_id` | JOIN staff |
| `tables` | `table_area_id` | JOIN khu vực |
| `tables` | `status` | Filter bàn trống/đang dùng |
| `menu_items` | `category_id` | JOIN filter theo danh mục |
| `menu_items` | `status` | Chỉ lấy món đang bán |
| `orders` | `table_id` | Tìm đơn theo bàn |
| `orders` | `status` | Filter đơn theo trạng thái |
| `orders` | `created_at` | Báo cáo doanh thu theo ngày |
| `order_items` | `order_id` | JOIN |
| `order_items` | `status` | Bếp lọc món chờ chế biến |
| `invoices` | `order_id` | UNIQUE — JOIN |
| `payments` | `invoice_id` | JOIN |
| `reservations` | `table_id` | JOIN |
| `reservations` | `status` | Filter đặt bàn đang hiệu lực |
| `audit_logs` | `user_id` | Tra cứu |
| `audit_logs` | `created_at` | Sắp xếp thời gian |
| `ingredients` | `ingredient_code` | UNIQUE — mã nguyên liệu |
| `ingredients` | `status` | Filter theo trạng thái |
| `ingredients` | `current_stock` | Filter tồn kho thấp |
| `suppliers` | `supplier_code` | UNIQUE — mã nhà cung cấp |
| `suppliers` | `status` | Filter theo trạng thái |
| `inventory_transactions` | `ingredient_id` | JOIN ingredients |
| `inventory_transactions` | `supplier_id` | JOIN suppliers |
| `inventory_transactions` | `type` | Filter theo loại giao dịch |
| `inventory_transactions` | `created_at` | Sắp xếp theo thời gian |

---

## 8. Ràng buộc (Constraint) quan trọng

- `users.username`: UNIQUE
- `invoices.order_id`: UNIQUE (một order chỉ một hóa đơn)
- `orders`: Một bàn tại một thời điểm chỉ có 1 order đang phục vụ (kiểm tra ở service layer)
- `reservations`: Một bàn tại một thời điểm chỉ có 1 reservation đang hiệu lực (kiểm tra overlap ở service layer)
- `order_items`: quantity ≥ 1
- `payments.amount`: > 0

---

## 9. Ghi chú cho nhóm phát triển

### Về timestamp

- Tất cả bảng dùng `DATETIME(3)` UTC — độ chính xác milliseconds.
- Server DB set `time_zone='+00:00'`.
- Chuyển đổi múi giờ do frontend thực hiện.

### Về charset

- `utf8mb4` + `utf8mb4_unicode_ci`.
- Không dùng `utf8` (MySQL utf8 chỉ hỗ trợ 3 byte, không đủ emoji).

### Về soft delete

- Các bảng master (users, staff, tables, menu_categories, menu_items, reservations, suppliers, ingredients) có `deleted_at`.
- Các bảng transaction (orders, order_items, invoices, payments, audit_logs, inventory_transactions) không soft delete — dùng status.
- Khi truy vấn luôn filter `WHERE deleted_at IS NULL`.

### Về JSON columns

- `audit_logs.detail` dùng kiểu JSON.
- MySQL 8.0 hỗ trợ JSON native — có thể query được.
- Không nên dùng JSON cho dữ liệu cần filter/index thường xuyên.

---

## 10. Điểm cần xác nhận

| ID | Vấn đề | Đề xuất | Cần xác nhận |
|----|--------|---------|-------------|
| Q-DB-01 | ID dùng INT hay UUID? | INT (đơn giản, JOIN nhanh) | File 07 |
| Q-DB-02 | Soft delete cho bảng transaction? | Không — dùng status | File 12 |
| Q-DB-03 | Một invoice chỉ một payment hay thanh toán từng phần? | Một lần (toàn bộ đơn) | File 07, Q-PAY-03 |
| Q-DB-04 | staff và users tách riêng hay gộp? | Tách — tài khoản ≠ hồ sơ nhân viên | File 07, Q-AUTH-01 |
| Q-DB-05 | ingredients có cần link với menu_items không? | Chưa (Should Have) | File 07, Q-INV-02 |
| Q-DB-06 | reservation cho phép một người đặt nhiều bàn? | Có (cùng số điện thoại) | Cần xác nhận |
| Q-DB-07 | Một tài khoản có thể có nhiều role? | Không — 1 user = 1 role | File 07, Q-AUTH-01 |
