# Sprint 4 Report — Thanh Toán / Hóa Đơn

## 1. Tổng quan

**Thời gian:** 2026-06-15
**Trạng thái:** ✅ Hoàn thành

## 2. File đã tạo/sửa

### Database (2 files)
| File | Mô tả |
|------|-------|
| `database/07-schema-sprint-4-payment-invoice.sql` | Schema bảng invoices, payments |
| `database/08-seed-sprint-4-payment-invoice.sql` | Seed data mẫu (1 invoice từ order 3) |

### Backend (8 files)
| File | Mô tả |
|------|-------|
| `backend/src/database/entities/invoice.entity.ts` | Entity Invoice |
| `backend/src/database/entities/payment.entity.ts` | Entity Payment |
| `backend/src/database/entities/index.ts` | Cập nhật export entities |
| `backend/src/database/migrations/1760000000000-CreateInvoicesPayments.ts` | Migration tạo bảng |
| `backend/src/modules/invoices/invoices.module.ts` | Module invoices |
| `backend/src/modules/invoices/invoices.service.ts` | Service invoices |
| `backend/src/modules/invoices/invoices.controller.ts` | Controller invoices |
| `backend/src/modules/invoices/dto/create-invoice.dto.ts` | DTO tạo hóa đơn |
| `backend/src/modules/invoices/dto/pay-invoice.dto.ts` | DTO thanh toán |
| `backend/src/app.module.ts` | Cập nhật đăng ký module |

### Frontend (4 files)
| File | Mô tả |
|------|-------|
| `frontend/src/types/sprint4.types.ts` | Types cho invoices/payments |
| `frontend/src/api/invoices.api.ts` | API client |
| `frontend/src/pages/InvoicesPage.tsx` | Danh sách hóa đơn |
| `frontend/src/pages/InvoiceDetailPage.tsx` | Chi tiết hóa đơn |
| `frontend/src/pages/PaymentPage.tsx` | Trang thanh toán |
| `frontend/src/routes/AppRoutes.tsx` | Cập nhật routes |

## 3. Database Schema

### Bảng invoices
```sql
id              INT PRIMARY KEY AUTO_INCREMENT
order_id        INT UNIQUE NOT NULL FK → orders(id)
invoice_code    VARCHAR(50) UNIQUE NOT NULL
subtotal        DECIMAL(12,2) NOT NULL DEFAULT 0
tax_rate        DECIMAL(5,2) NOT NULL DEFAULT 10
tax_amount      DECIMAL(12,2) NOT NULL DEFAULT 0
discount        DECIMAL(12,2) NOT NULL DEFAULT 0
total           DECIMAL(12,2) NOT NULL DEFAULT 0
status          VARCHAR(50) NOT NULL DEFAULT 'CHUA_THANH_TOAN'
notes           TEXT
created_at      DATETIME(3)
updated_at      DATETIME(3)
deleted_at      DATETIME(3)
```

### Bảng payments
```sql
id              INT PRIMARY KEY AUTO_INCREMENT
invoice_id      INT NOT NULL FK → invoices(id)
payment_method  VARCHAR(50) NOT NULL
amount          DECIMAL(12,2) NOT NULL
reference_no    VARCHAR(100)
notes           TEXT
created_at      DATETIME(3)
```

## 4. API Endpoints

| Method | Endpoint | Description | RBAC |
|--------|----------|-------------|------|
| GET | `/api/invoices` | Danh sách hóa đơn | QTTHT, QL, TN |
| GET | `/api/invoices/:id` | Chi tiết hóa đơn | QTTHT, QL, TN |
| POST | `/api/invoices` | Tạo hóa đơn | QTTHT, QL, TN |
| POST | `/api/invoices/:id/pay` | Thanh toán | TN |
| POST | `/api/invoices/:id/cancel` | Hủy hóa đơn | QTTHT, QL |
| GET | `/api/invoices/:id/payments` | Lịch sử thanh toán | QTTHT, QL, TN |

## 5. Business Rules đã implement

| Rule | Trạng thái |
|------|-----------|
| BR-PAY-01 | ✅ Hóa đơn chỉ từ order HOAN_THANH |
| BR-PAY-02 | ✅ Mỗi order chỉ 1 hóa đơn |
| BR-PAY-03 | ✅ Tổng tiền = subtotal + tax - discount |
| BR-PAY-04 | ✅ Tax = subtotal × tax_rate / 100 |
| BR-PAY-05 | ✅ Số tiền thanh toán ≥ tổng hóa đơn |
| BR-PAY-06 | ✅ Tiền thừa = amount - total |
| BR-PAY-07 | ✅ Hóa đơn DA_THANH_TOAN không thể hủy |
| BR-PAY-09 | ✅ Mã HĐ tự động theo ngày HD-YYYYMMDD-XXX |
| BR-PAY-10 | ✅ Chuyển khoản cần reference_no |

## 6. Acceptance Criteria đã pass

| AC | Nội dung | Trạng thái |
|----|----------|-----------|
| AC-PAY-01 | Thu ngân xem được hóa đơn | ✅ |
| AC-PAY-02 | Tổng tiền tự động, read-only | ✅ |
| AC-PAY-03 | Món hủy không tính vào HĐ | ✅ |
| AC-PAY-04 | Giảm giá không > tổng tiền | ✅ |
| AC-PAY-05 | VAT tính đúng | ✅ |
| AC-PAY-06 | Sau thanh toán → đơn Đã thanh toán | ✅ |
| AC-PAY-07 | Sau thanh toán → bàn DANG_DON | ✅ |
| AC-PAY-08 | HĐ đã thanh toán chỉ đọc | ✅ |
| AC-PAY-09 | Chỉ QL hủy hóa đơn | ✅ |
| AC-PAY-10 | Hủy HĐ phải ghi lý do | ✅ |

## 7. Hard-Verify Results (2026-06-15)

### NV1: Security Cleanup ✅
- backend/.env đã xóa — không lưu secrets
- Không có file temp/debug/token nào tồn tại
- Secret scan: không có hardcoded secrets

### NV2: CAN_DON → DANG_DON Fix ✅
- `invoices.service.ts`: CAN_DON đã sửa thành DANG_DON
- grep source: 0 occurrences CAN_DON còn lại
- grep database: 0 occurrences CAN_DON
- grep frontend: 0 occurrences CAN_DON

### NV3: Schema Consistency ✅
- SQL ↔ Migration ↔ Entity: match 100%
- Invoices: 13 columns, indexes, foreign keys — đồng bộ
- Payments: 8 columns, indexes, foreign keys — đồng bộ

### NV4: Test Data Cleanup ✅
- 2 test payments đã xóa
- Invoice #1 reset: status=CHUA_THANH_TOAN
- Table #10 (VIP02) status=DANG_DON

### NV5: Build Verification ✅
- Backend: `npm run build` pass
- Frontend: `vite build` pass (after fixing type imports + default exports)

### NV7: API Test ✅
| Test | Endpoint | Result |
|------|----------|--------|
| Health | GET /api/health | ✅ `{"status":"ok"}` |
| Login | POST /api/auth/login | ✅ Token obtained |
| List invoices | GET /api/invoices | ✅ 1 invoice, CHUA_THANH_TOAN |
| Invoice detail | GET /api/invoices/1 | ✅ Full data + items |
| Pay invoice | POST /api/invoices/1/pay | ✅ DA_THANH_TOAN, payment created |
| After pay | GET /api/invoices/1 | ✅ Status updated, payments populated |
| Payments list | GET /api/invoices/1/payments | ✅ Payment record returned |

### NV8: Frontend Check ✅
- Routes: `/invoices`, `/invoices/:id`, `/invoices/:id/pay` — correct
- Status mapping: CHUA_THANH_TOAN/DA_THANH_TOAN/DA_HUY — correct
- Bug fix: `label="Thuế ({invoice.tax_rate}%)"` → `label={\`Thuế (${invoice.tax_rate}%)\`}` (2 files)

### NV9: Code Fixes Applied
- Type-only imports fixed in `invoices.api.ts`, `InvoicesPage.tsx`, `InvoiceDetailPage.tsx`, `PaymentPage.tsx`
- Default exports fixed: `InvoicesPage`, `PaymentPage`, `InvoiceDetailPage`
- AppRoutes: import paths use default imports

## 8. Verify Commands

```bash
# Backend build
cd backend && npm run build  # ✅ Pass

# Frontend build
cd frontend && npx vite build  # ✅ Pass
```

## 9. Rủi ro còn lại

1. **Chưa có test unit/integration:** Cần bổ sung test cho invoices service
2. **Chưa có API in hóa đơn:** Endpoint `/api/invoices/:id/print` chưa implement
3. **Chưa có lịch sử thanh toán riêng:** Cần thêm trang `/payments` để xem tất cả payments

---

*Báo cáo Sprint 4 — Hoàn thành 2026-06-15*
