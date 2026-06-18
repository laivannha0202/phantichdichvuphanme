# Công thức Báo cáo & Metric — Quản lý Nhà hàng

> ⚠️ **Tài liệu Thiết kế Kỹ thuật** — Dành cho Developer/Tech Lead.
> **Không phải tài liệu nghiệp vụ chính thức.**

---

## 1. Tổng quan

Tài liệu này quy định công thức tính toán cho báo cáo doanh thu và các metric
kinh doanh. **Báo cáo doanh thu là Sprint 5**, không implement trong Sprint 2.

---

## 2. Nguyên tắc Báo cáo

### 2.1 Chỉ tính hóa đơn đã thanh toán

- Chỉ tính `invoices` có `payments.status = 'THANH_CONG'`
- Không tính `invoices` chưa có payment
- Không tính `payments.status = 'THAT_BAI'` hoặc `'DA_HOAN_TIEN'`

### 2.2 Không tính hóa đơn hủy

- Hóa đơn có `cancelled_reason IS NOT NULL` → không tính
- Hóa đơn có `cancelled_by IS NOT NULL` → không tính

### 2.3 Không tính order chưa thanh toán

- `orders.status = 'DA_THANH_TOAN'` mới được tính vào báo cáo
- `orders.status = 'DANG_PHUC_VU'` hoặc `'DANG_CHUAN_BI'` → chưa tính

### 2.4 Thứ tự ưu tiên lọc

```
1. invoices.cancelled_reason IS NULL  (không bị hủy)
2. payments.status = 'THANH_CONG'     (đã thanh toán thành công)
3. orders.status = 'DA_THANH_TOAN'    (đã thanh toán)
```

---

## 3. Công thức Tổng hợp

### 3.1 Tổng doanh thu (Revenue)

```sql
SELECT
  SUM(payments.amount) AS total_revenue
FROM payments
JOIN invoices ON payments.invoice_id = invoices.id
JOIN orders ON invoices.order_id = orders.id
WHERE payments.status = 'THANH_CONG'
  AND invoices.cancelled_reason IS NULL
  AND orders.status = 'DA_THANH_TOAN'
```

**Logic:**
```
Tổng doanh thu = SUM(payments.amount)
  WHERE payment.status = 'THANH_CONG'
  AND invoice NOT cancelled
  AND order.status = 'DA_THANH_TOAN'
```

### 3.2 Doanh thu theo ngày

```sql
SELECT
  DATE(payments.created_at) AS date,
  SUM(payments.amount) AS daily_revenue
FROM payments
JOIN invoices ON payments.invoice_id = invoices.id
JOIN orders ON invoices.order_id = orders.id
WHERE payments.status = 'THANH_CONG'
  AND invoices.cancelled_reason IS NULL
  AND orders.status = 'DA_THANH_TOAN'
  AND payments.created_at BETWEEN :fromDate AND :toDate
GROUP BY DATE(payments.created_at)
ORDER BY date ASC
```

### 3.3 Số hóa đơn (Invoice Count)

```sql
SELECT
  COUNT(DISTINCT invoices.id) AS invoice_count
FROM invoices
JOIN payments ON invoices.id = payments.invoice_id
JOIN orders ON invoices.order_id = orders.id
WHERE payments.status = 'THANH_CONG'
  AND invoices.cancelled_reason IS NULL
  AND orders.status = 'DA_THANH_TOAN'
  AND payments.created_at BETWEEN :fromDate AND :toDate
```

### 3.4 Giá trị trung bình hóa đơn (Average Order Value)

```
AOV = Tổng doanh thu / Số hóa đơn
```

```sql
SELECT
  SUM(payments.amount) / COUNT(DISTINCT invoices.id) AS avg_order_value
FROM payments
JOIN invoices ON payments.invoice_id = invoices.id
JOIN orders ON invoices.order_id = orders.id
WHERE payments.status = 'THANH_CONG'
  AND invoices.cancelled_reason IS NULL
  AND orders.status = 'DA_THANH_TOAN'
  AND payments.created_at BETWEEN :fromDate AND :toDate
```

### 3.5 Top món bán chạy theo số lượng

```sql
SELECT
  menu_items.id,
  menu_items.name,
  SUM(order_items.quantity) AS total_quantity
FROM order_items
JOIN menu_items ON order_items.menu_item_id = menu_items.id
JOIN orders ON order_items.order_id = orders.id
JOIN invoices ON orders.id = invoices.order_id
JOIN payments ON invoices.id = payments.invoice_id
WHERE payments.status = 'THANH_CONG'
  AND invoices.cancelled_reason IS NULL
  AND orders.status = 'DA_THANH_TOAN'
  AND order_items.status != 'DA_HUY'
  AND payments.created_at BETWEEN :fromDate AND :toDate
GROUP BY menu_items.id, menu_items.name
ORDER BY total_quantity DESC
LIMIT 10
```

### 3.6 Top món theo doanh thu

```sql
SELECT
  menu_items.id,
  menu_items.name,
  SUM(order_items.quantity * order_items.unit_price) AS total_revenue
FROM order_items
JOIN menu_items ON order_items.menu_item_id = menu_items.id
JOIN orders ON order_items.order_id = orders.id
JOIN invoices ON orders.id = invoices.order_id
JOIN payments ON invoices.id = payments.invoice_id
WHERE payments.status = 'THANH_CONG'
  AND invoices.cancelled_reason IS NULL
  AND orders.status = 'DA_THANH_TOAN'
  AND order_items.status != 'DA_HUY'
  AND payments.created_at BETWEEN :fromDate AND :toDate
GROUP BY menu_items.id, menu_items.name
ORDER BY total_revenue DESC
LIMIT 10
```

---

## 4. Query Parameters

### 4.1 Filter ngày

| Param | Kiểu | Mô tả | Ví dụ |
|-------|------|-------|-------|
| `fromDate` | DATE | Từ ngày | `2026-01-01` |
| `toDate` | DATE | Đến ngày | `2026-01-31` |

### 4.2 Timezone

- Database lưu `DATETIME(3)` UTC
- Query filter theo UTC
- Frontend chuyển đổi múi giờ hiển thị (UTC+7 cho Việt Nam)
- `fromDate` = 00:00:00 UTC của ngày bắt đầu
- `toDate` = 23:59:59.999 UTC của ngày kết thúc

### 4.3 Default range

- Nếu không truyền `fromDate`/`toDate` → mặc định **tháng hiện tại**
- `fromDate` = ngày đầu tháng
- `toDate` = ngày cuối tháng

---

## 5. Biểu đồ (Charts)

### 5.1 Revenue Line/Bar Chart

```
X-axis: Ngày (từ fromDate → toDate)
Y-axis: Doanh thu (VND)
Type: Bar chart hoặc Line chart
```

**Data format:**

```json
[
  { "date": "2026-01-01", "revenue": 5000000 },
  { "date": "2026-01-02", "revenue": 7500000 },
  { "date": "2026-01-03", "revenue": 6200000 }
]
```

### 5.2 Top Dishes Bar Chart

```
X-axis: Tên món
Y-axis: Số lượng bán hoặc Doanh thu
Type: Horizontal bar chart
Sorted: Descending
Limit: Top 10
```

**Data format:**

```json
[
  { "name": "Phở Bò", "quantity": 150, "revenue": 9750000 },
  { "name": "Bún Chả", "quantity": 120, "revenue": 6600000 },
  { "name": "Cơm Tấm", "quantity": 100, "revenue": 5000000 }
]
```

### 5.3 Invoice Count Chart (Optional)

```
X-axis: Ngày
Y-axis: Số hóa đơn
Type: Bar chart hoặc Line chart
```

### 5.4 Library sử dụng

- **Recharts** (đã chốt trong tech stack)
- Responsive: `ResponsiveContainer` wrapper
- Format tiền: `Intl.NumberFormat('vi-VN')` cho VND

---

## 6. Nguồn Dữ liệu

### 6.1 Bảng liên quan

| Bảng | Dùng cho |
|------|---------|
| `payments` | Số tiền thanh toán, trạng thái, thời gian |
| `invoices` | Mã hóa đơn, VAT, trạng thái hủy |
| `orders` | Trạng thái đơn, tổng tiền |
| `order_items` | Chi tiết món, số lượng, giá tại thời điểm gọi |
| `menu_items` | Tên món, danh mục |

### 6.2 Join path

```
payments → invoices → orders → order_items → menu_items
```

### 6.3 Filter conditions

```sql
-- Doanh thu hợp lệ:
WHERE payments.status = 'THANH_CONG'
  AND invoices.cancelled_reason IS NULL
  AND orders.status = 'DA_THANH_TOAN'
  AND payments.created_at BETWEEN :fromDate AND :toDate
```

---

## 7. Ghi chú quan trọng

### 7.1 Sprint 5, không phải Sprint 2

- Báo cáo doanh thu **Sprint 5**
- Sprint 2 chỉ cần biết cấu trúc bảng để implement đúng schema
- **KHÔNG** implement API reports trong Sprint 2

### 7.2 Performance

- Query báo cáo có thể chậm với dữ liệu lớn → cần index:
  - `payments.created_at` (INDEX)
  - `payments.status` (INDEX)
  - `invoices.order_id` (UNIQUE INDEX)
  - `orders.status` (INDEX)
- Xem xét caching kết quả báo cáo nếu cần

### 7.3 VAT Calculation

```
total_before_vat = SUM(order_items.quantity * order_items.unit_price)
vat_amount = total_before_vat * (vat_rate / 100)
total_final = total_before_vat + vat_amount
```

- `vat_rate` mặc định: 10% (có thể cấu hình)
- `discount_amount` trừ trước khi tính VAT

### 7.4 Discount Logic

```
total_before_discount = SUM(order_items.quantity * order_items.unit_price)
total_before_vat = total_before_discount - discount_amount
vat_amount = total_before_vat * (vat_rate / 100)
total_final = total_before_vat + vat_amount
```

---

## 8. Checklist khi implement Report (Sprint 5)

- [ ] Chỉ tính hóa đơn đã thanh toán thành công
- [ ] Không tính hóa đơn hủy
- [ ] Filter theo fromDate/toDate đúng
- [ ] timezone xử lý đúng (UTC storage, UTC+7 display)
- [ ] Revenue chart hoạt động
- [ ] Top dishes chart hoạt động
- [ ] Format tiền VND đúng
- [ ] Export Excel (nếu cần)
- [ ] Performance query tốt với index
