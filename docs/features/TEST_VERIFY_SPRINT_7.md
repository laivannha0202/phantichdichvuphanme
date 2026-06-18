# TEST_VERIFY_SPRINT_7.md — Kiểm thử Sprint 7

**Ngày:** 2026-06-16
**Sprint:** 7 — Báo cáo doanh thu cơ bản

---

## 1. Backend Build

```bash
cd backend && npm run build
```

**Expected:** nest build → success

---

## 2. Frontend Build

```bash
cd frontend && npm run build
```

**Expected:** tsc -b && vite build → success

---

## 3. API Test Cases

### 3.1 GET /api/reports/revenue/summary

| Case | Input | Expected |
|------|-------|----------|
| Happy path | fromDate=2026-01-01, toDate=2026-12-31 | 200 + summary data |
| No params | (none) | 200 + default 30 ngày |
| No data | fromDate=2099-01-01, toDate=2099-12-31 | 200 + zeros |

### 3.2 GET /api/reports/revenue/daily

| Case | Input | Expected |
|------|-------|----------|
| Happy path | fromDate=2026-01-01, toDate=2026-12-31 | 200 + daily array |
| No data | fromDate=2099-01-01, toDate=2099-12-31 | 200 + empty array |

### 3.3 GET /api/reports/revenue/top-items

| Case | Input | Expected |
|------|-------|----------|
| Happy path | limit=5 | 200 + top 5 items |
| Default | (none) | 200 + top 10 items |

### 3.4 GET /api/reports/revenue/payment-methods

| Case | Input | Expected |
|------|-------|----------|
| Happy path | fromDate=2026-01-01, toDate=2026-12-31 | 200 + payment methods |

### 3.5 RBAC Test

| Case | Role | Expected |
|------|------|----------|
| QUAN_TRI_HE_THONG | Admin | 200 OK |
| QUAN_LY | Manager | 200 OK |
| THU_NGAN | Cashier | 200 OK |
| PHUC_VU | Server | 403 Forbidden |
| BEP | Kitchen | 403 Forbidden |
| KHO | Inventory | 403 Forbidden |

---

## 4. Business Rules Test

| Rule | Test | Expected |
|------|------|----------|
| Chỉ DA_THANH_TOAN | Kiểm tra query chỉ lấy invoice status=DA_THANH_TOAN | Đúng |
| Không tính DA_HUY | Kiểm tra invoice DA_HUY không出现在doanh thu | Đúng |
| Top món không tính DA_HUY | Kiểm tra order_items DA_HUY không trong top | Đúng |

---

## 5. Frontend Test

| Case | Expected |
|------|----------|
| Route /reports/revenue tồn tại | Trang render thành công |
| Sidebar có "Báo cáo doanh thu" | Menu item hiển thị |
| Loading state | Spinners hiển thị khi load |
| Empty state | "Không có dữ liệu" khi không có data |
| Format tiền VN | 100000 → 100.000 ₫ |

---

## 6. Database Count (Sprint 7 không thay đổi)

| Table | Count | Match |
|-------|-------|-------|
| reservations | 6 | ✅ |
| tables | 14 | ✅ |
| orders | 4 | ✅ |
| order_items | 10 | ✅ |
| invoices | 1 | ✅ |
| payments | 0 | ✅ |

---

## 7. Cleanup Checklist

| Item | Expected |
|------|----------|
| Không có *.log | ✅ |
| Không có *.tmp | ✅ |
| Không có *.bak | ✅ |
| Không có debug* | ✅ |
| Không có test-output* | ✅ |
| Không có secret hardcoded | ✅ |
