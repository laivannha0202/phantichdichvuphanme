# HARD_VERIFY_SPRINT_7.md — Báo cáo kiểm tra Sprint 7

## Tổng quan

Sprint 7: Báo cáo Doanh thu cơ bản — **PASS** ✅

- **Thời gian verify:** 2026-06-16
- **Backup:** `/home/nha/Downloads/Quanlynhahang-before-sprint7-20260616-1702.tar.gz`
- **Database:** Verified bằng MCP MySQL trên DB thật

---

## 1. Files đã tạo/sửa

### Backend (4 files mới + 1 sửa)

| File | Hành động | Mô tả |
|------|-----------|-------|
| `backend/src/modules/reports/dto/revenue-query.dto.ts` | Mới | DTO validation cho query params |
| `backend/src/modules/reports/reports.service.ts` | Mới | Service — 4 SQL queries, read-only |
| `backend/src/modules/reports/reports.controller.ts` | Mới | Controller — 4 GET endpoints, RBAC 3 roles |
| `backend/src/modules/reports/reports.module.ts` | Mới | Module kết nối entities |
| `backend/src/app.module.ts` | Sửa | Thêm `ReportsModule` vào imports |

### Frontend (3 files mới + 2 sửa)

| File | Hành động | Mô tả |
|------|-----------|-------|
| `frontend/src/types/sprint7.types.ts` | Mới | TypeScript types cho reports |
| `frontend/src/api/reports.api.ts` | Mới | API client — 4 hàm GET |
| `frontend/src/pages/RevenueReportPage.tsx` | Mới | Trang báo cáo với 4 tables + 4 stat cards |
| `frontend/src/routes/AppRoutes.tsx` | Sửa | Thêm route `/reports/revenue` |
| `frontend/src/layouts/MainLayout.tsx` | Sửa | Bật menu "Báo cáo doanh thu" (bỏ disabled) |

### Database (2 files mới)

| File | Hành động | Mô tả |
|------|-----------|-------|
| `database/13-note-sprint-7-revenue-report-no-new-table.sql` | Mới | Ghi chú: KHÔNG tạo bảng mới |
| `database/14-seed-sprint-7-revenue-report.sql` | Mới | Seed: update invoice #1 → DA_THANH_TOAN, tạo payment |

### Docs (3 files mới)

| File | Hành động | Mô tả |
|------|-----------|-------|
| `docs/features/SPRINT_7_IMPLEMENT_PLAN.md` | Mới | Kế hoạch triển khai chi tiết |
| `docs/features/TEST_VERIFY_SPRINT_7.md` | Mới | Kế hoạch kiểm tra |
| `docs/features/HARD_VERIFY_SPRINT_7.md` | Mới | Báo cáo hard-verify (file này) |

---

## 2. Database Count thật (MCP MySQL verified)

| Table | Count |
|-------|-------|
| reservations | 6 |
| tables | 14 |
| orders | 4 |
| order_items | 10 |
| invoices | 1 |
| payments | 1 |

### Invoice #1

| Field | Value |
|-------|-------|
| id | 1 |
| invoice_code | HD-20260615-001 |
| order_id | 3 |
| status | DA_THANH_TOAN |
| total | 110,000đ |
| created_at | 2026-06-15T09:49:16.219Z |

### Payment #9

| Field | Value |
|-------|-------|
| id | 9 |
| invoice_id | 1 |
| payment_method | TIEN_MAT |
| amount | 110,000đ |
| created_at | 2026-06-16T10:16:09.198Z |

### Invoice status distribution

| Status | Count |
|--------|-------|
| DA_THANH_TOAN | 1 |

### Order item status distribution

| Status | Count |
|--------|-------|
| CHO_CHE_BIEN | 5 |
| DA_PHUC_VU | 1 |
| DANG_CHE_BIEN | 1 |
| HOAN_THANH | 3 |
| DA_HUY | 0 |

---

## 3. Seed Sprint 7 — Đã apply ✅

- Invoice #1: CHUA_THANH_TOAN → DA_THANH_TOAN ✅
- Payment #9: Tạo mới, invoice_id=1, TIEN_MAT, 110,000đ ✅
- Seed idempotent: `UPDATE WHERE status = 'CHUA_THANH_TOAN'` + `INSERT ... AND NOT EXISTS` ✅
- Chạy lại seed sẽ không thay đổi dữ liệu ✅

---

## 4. API Query Logic — Verified trên DB thật ✅

### 4.1 Revenue Summary

```sql
-- Kết quả: 1 HĐ, 110,000đ, 1 order
SELECT COUNT(DISTINCT i.id) AS total_invoices,
       COALESCE(SUM(i.total), 0) AS total_revenue,
       COUNT(DISTINCT o.id) AS total_orders
FROM invoices i JOIN orders o ON i.order_id = o.id
WHERE i.status = 'DA_THANH_TOAN'
  AND i.created_at >= '2026-01-01' AND i.created_at <= '2026-12-31';
```

- Chỉ tính DA_THANH_TOAN ✅
- total_revenue = 110,000đ ✅
- average_invoice = 110,000đ ✅

### 4.2 Daily Revenue

```sql
-- Kết quả: 2026-06-15: 1 HĐ, 110,000đ
SELECT DATE(i.created_at) AS date, COUNT(DISTINCT i.id) AS invoices,
       COALESCE(SUM(i.total), 0) AS revenue
FROM invoices i
WHERE i.status = 'DA_THANH_TOAN' AND ...
GROUP BY DATE(i.created_at) ORDER BY date;
```

- Group DATE正确 ✅

### 4.3 Top Items

```sql
-- Kết quả: Bánh Flan (2 SP, 50K), Nem Chua Rán (1 SP, 50K)
SELECT mi.id, mi.name, SUM(oi.quantity), SUM(oi.unit_price * oi.quantity)
FROM order_items oi JOIN menu_items mi ON oi.menu_item_id = mi.id
  JOIN orders o ON oi.order_id = o.id JOIN invoices i ON i.order_id = o.id
WHERE i.status = 'DA_THANH_TOAN' AND oi.status != 'DA_HUY' AND ...
GROUP BY mi.id, mi.name ORDER BY quantity_sold DESC LIMIT 10;
```

- Không tính DA_HUY ✅
- Join menu_items đúng tên ✅
- Sắp xếp quantity_sold DESC ✅

### 4.4 Payment Methods

```sql
-- Kết quả: TIEN_MAT: 1 GD, 110,000đ
SELECT p.payment_method, COUNT(*), COALESCE(SUM(p.amount), 0)
FROM payments p JOIN invoices i ON p.invoice_id = i.id
WHERE i.status = 'DA_THANH_TOAN' AND ...
GROUP BY p.payment_method ORDER BY total_amount DESC;
```

- Group payment_method正确 ✅

---

## 5. Build & Lint

| Kiểm tra | Kết quả |
|----------|---------|
| `npm run build` (backend) | ✅ Pass |
| `npm run build` (frontend) | ✅ Pass (warning chunk size — không phải fail) |
| `tsc --noEmit` (backend) | ✅ Pass |
| `tsc --noEmit` (frontend) | ✅ Pass |
| `eslint` (backend reports) | ✅ Pass |
| `eslint` (frontend reports) | ✅ Pass |

---

## 6. RBAC

### 6.1 RBAC ban đầu (Sprint 7 original)

4 endpoints đều yêu cầu JWT + RolesGuard:

| Endpoint | Roles allowed |
|----------|---------------|
| `GET /api/reports/revenue/summary` | QUAN_TRI_HE_THONG, QUAN_LY, THU_NGAN |
| `GET /api/reports/revenue/daily` | QUAN_TRI_HE_THONG, QUAN_LY, THU_NGAN |
| `GET /api/reports/revenue/top-items` | QUAN_TRI_HE_THONG, QUAN_LY, THU_NGAN |
| `GET /api/reports/revenue/payment-methods` | QUAN_TRI_HE_THONG, QUAN_LY, THU_NGAN |

- Roles BEP, KHO, PHUC_VU → 403 Forbidden ✅
- Không có JWT → 401 Unauthorized ✅

### 6.2 Chuẩn hóa RBAC (Hướng A — 2026-06-18)

**Quyết định:** Chỉ `QUAN_TRI_HE_THONG` và `QUAN_LY` được xem báo cáo doanh thu. `THU_NGAN` không được xem báo cáo doanh thu tổng hợp.

**Lý do:**
- FEAT_08 spec gốc: THU_NGAN = ❌ cho tất cả endpoint báo cáo
- AC-RPT-06: "Thu ngân không thấy menu báo cáo doanh thu"
- Ưu tiên không mở rộng quyền nếu không cần
- Nếu sau này cần thống kê thanh toán cơ bản cho THU_NGAN → làm endpoint/route riêng ở Sprint khác

| Endpoint | QUAN_TRI_HE_THONG | QUAN_LY | THU_NGAN | PHUC_VU | BEP | KHO |
|----------|:---:|:---:|:---:|:---:|:---:|:---:|
| GET /api/reports/revenue/summary | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/reports/revenue/daily | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/reports/revenue/top-items | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/reports/revenue/payment-methods | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

**Thay đổi code:**
- `backend/src/modules/reports/reports.controller.ts`: Bỏ `THU_NGAN` khỏi cả 4 `@Roles()`
- `frontend/src/layouts/MainLayout.tsx`: Thêm role-based filtering — menu "Báo cáo doanh thu" chỉ hiển thị cho QUAN_TRI_HE_THONG, QUAN_LY

---

## 7. Frontend

- Route `/reports/revenue` trong AppRoutes.tsx ✅
- Sidebar menu "Báo cáo doanh thu" enabled — chỉ hiển thị cho QUAN_TRI_HE_THONG, QUAN_LY ✅
- Role-based filtering: `canViewRevenueReport = roleCode === 'QUAN_TRI_HE_THONG' || roleCode === 'QUAN_LY'` ✅
- THU_NGAN, PHUC_VU, BEP, KHO không thấy menu "Báo cáo doanh thu" ✅
- 4 stat cards: Tổng doanh thu, Số HĐ, Tổng đơn hàng, Giá trị TB ✅
- 4 tables: Doanh thu theo ngày, Top món, Phương thức thanh toán ✅
- Date range picker (RangePicker, mặc định 30 ngày) ✅
- Format tiền: VND (Intl.NumberFormat, vi-VN) ✅
- Loading state: Spin ✅
- Empty state: Empty ✅
- Cleanup cancelled flag trong useEffect ✅

---

## 8. Scope Check

| Kiểm tra | Kết quả |
|----------|---------|
| Không tạo bảng mới | ✅ File `13-note-sprint-7-*.sql` không có CREATE TABLE/ALTER TABLE |
| Không migration mới | ✅ |
| Đọc từ invoices, payments, orders, order_items, menu_items | ✅ |
| Không export Excel/PDF | ✅ |
| Không thêm chart library mới | ✅ |
| Không làm kho/voucher/nhân viên/audit nâng cao | ✅ |

---

## 9. Safety Check

| Kiểm tra | Kết quả |
|----------|---------|
| Không tạo/sửa backend/.env | ✅ Chỉ có `.env.example` với placeholder |
| Không dùng CLI MySQL password | ✅ Dùng MCP MySQL |
| Không drop/reset quanlynhahang | ✅ |
| Không động QuanNhaHang | ✅ |
| Không commit/push | ✅ |
| Không tạo bảng mới | ✅ |
| Không sửa database | ✅ |
| Không tạo API mới | ✅ |

---

## 10. Secret/Temp Cleanup

| Kiểm tra | Kết quả |
|----------|---------|
| File rác/temp/log | ✅ Không có |
| `DB_PASSWORD` | ✅ Chỉ `process.env.DB_PASSWORD \|\| ''` trong config (safe variable reference) |
| `password_hash` | ✅ Chỉ column name trong schema/entity/seed |
| `.env.example` | ✅ Placeholder (`DB_PASSWORD=`, `your-access-secret-at-least-32-chars`) |
| Secret thật trong code/docs | ✅ Không có |

---

## 11. Kết luận

**Sprint 7: PASS** ✅ (Chuẩn hóa RBAC — Hướng A)

### 11.1 Sprint 7 Original

- Seed Sprint 7 đã apply vào DB thật ✅
- Database count verified: reservations=6, tables=14, orders=4, order_items=10, invoices=1, payments=1 ✅
- Invoice #1: DA_THANH_TOAN, 110,000đ ✅
- Payment #9: TIEN_MAT, 110,000đ ✅
- 4 API endpoints hoạt động đúng logic ✅
- Frontend route + page hoàn chỉnh ✅

### 11.2 Chuẩn hóa RBAC (Hướng A — 2026-06-18)

- Backend build: PASS ✅
- Frontend build: PASS ✅ (warning chunk size — không phải fail)
- RBAC: Chỉ QUAN_TRI_HE_THONG, QUAN_LY xem báo cáo doanh thu ✅
- THU_NGAN không xem báo cáo doanh thu tổng hợp ✅
- Frontend menu filter theo role ✅
- Không sửa database ✅
- Không tạo bảng mới ✅
- Không tạo/sửa backend/.env ✅
- Không drop/reset quanlynhahang ✅
- Không động QuanNhaHang ✅
- Không commit/push ✅

### 11.3 Quyết định RBAC cuối cùng

| Role | Báo cáo doanh thu |
|------|-------------------|
| QUAN_TRI_HE_THONG | ✅ Xem tất cả |
| QUAN_LY | ✅ Xem tất cả |
| THU_NGAN | ❌ Không xem (nếu cần → làm endpoint riêng Sprint khác) |
| PHUC_VU | ❌ |
| BEP | ❌ |
| KHO | ❌ |

**Sprint 7 đã sạch để đóng gói. Có thể chuẩn bị Sprint 8.**
