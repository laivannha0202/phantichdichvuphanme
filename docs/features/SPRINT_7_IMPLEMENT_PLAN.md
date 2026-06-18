# SPRINT_7_IMPLEMENT_PLAN.md — Kế hoạch triển khai Báo cáo Doanh thu

**Ngày:** 2026-06-16
**Sprint:** 7 — Báo cáo doanh thu cơ bản

---

## 1. Mục tiêu Sprint 7

Triển khai chức năng **Báo cáo doanh thu cơ bản** cho quản lý nhà hàng.
Tính năng read-only, không tạo bảng mới, đọc dữ liệu từ invoices, payments, orders, order_items.

---

## 2. Phạm vi Sprint 7

### Làm

1. Tổng quan doanh thu (summary)
2. Doanh thu theo ngày/khoảng thời gian (daily)
3. Số hóa đơn đã thanh toán
4. Tổng số đơn hàng
5. Top món bán chạy (top-items)
6. Doanh thu theo phương thức thanh toán (payment-methods)
7. Frontend màn hình báo cáo doanh thu

### Không làm

- Không kho nguyên liệu
- Không voucher/tích điểm
- Không nhân viên/tài khoản nâng cao
- Không AI analytics
- Không biểu đồ phức tạp ngoài MVP
- Không tạo bảng mới
- Không tạo backend/.env
- Không commit/push

---

## 3. API Endpoints

| Method | Endpoint | Mô tả | RBAC |
|--------|----------|-------|------|
| GET | /api/reports/revenue/summary | Tổng quan doanh thu | QUAN_TRI_HE_THONG, QUAN_LY, THU_NGAN |
| GET | /api/reports/revenue/daily | Doanh thu theo ngày | QUAN_TRI_HE_THONG, QUAN_LY, THU_NGAN |
| GET | /api/reports/revenue/top-items | Top món bán chạy | QUAN_TRI_HE_THONG, QUAN_LY, THU_NGAN |
| GET | /api/reports/revenue/payment-methods | Doanh thu theo phương thức thanh toán | QUAN_TRI_HE_THONG, QUAN_LY, THU_NGAN |

### Query Parameters

- `fromDate`: YYYY-MM-DD (optional, mặc định 30 ngày trước)
- `toDate`: YYYY-MM-DD (optional, mặc định hôm nay)
- `limit`: number (optional, mặc định 10, cho top-items)

---

## 4. Backend Module Structure

```
backend/src/modules/reports/
├── reports.module.ts
├── reports.controller.ts
├── reports.service.ts
└── dto/
    └── revenue-query.dto.ts
```

---

## 5. Business Rules

| Rule | Mô tả |
|------|-------|
| BR-RPT-01 | Báo cáo chỉ tính từ hóa đơn DA_THANH_TOAN |
| BR-RPT-02 | Hóa đơn DA_HUY không tính vào doanh thu |
| BR-RPT-03 | Top món dựa trên order_items không bị DA_HUY |
| BR-RPT-04 | Chỉ QUAN_TRI_HE_THONG, QUAN_LY, THU_NGAN được xem |
| BR-RPT-05 | BEP, KHO, PHUC_VU không được xem báo cáo |

---

## 6. Frontend

| Route | Component | Mô tả |
|-------|-----------|-------|
| /reports/revenue | RevenueReportPage | Báo cáo doanh thu |

Sidebar: "Báo cáo doanh thu" (icon: BarChartOutlined) — enabled.

### UI Elements

1. Bộ lọc thời gian (fromDate, toDate)
2. Cards tổng quan (Tổng doanh thu, Số HĐ, Số đơn hàng, Giá trị TB)
3. Bảng doanh thu theo ngày (ngày, số HĐ, doanh thu)
4. Bảng top món bán chạy (tên món, số lượng bán, doanh thu ước tính)
5. Bảng phương thức thanh toán (phương thức, số giao dịch, tổng tiền)

---

## 7. Files cần tạo/sửa

### Files mới

| File | Mô tả |
|------|-------|
| `database/13-note-sprint-7-revenue-report-no-new-table.sql` | Note không tạo bảng mới |
| `backend/src/modules/reports/reports.module.ts` | Module reports |
| `backend/src/modules/reports/reports.controller.ts` | Controller reports |
| `backend/src/modules/reports/reports.service.ts` | Service reports |
| `backend/src/modules/reports/dto/revenue-query.dto.ts` | DTO query params |
| `frontend/src/pages/RevenueReportPage.tsx` | Trang báo cáo doanh thu |
| `frontend/src/api/reports.api.ts` | API client reports |
| `frontend/src/types/sprint7.types.ts` | TypeScript types |
| `docs/features/SPRINT_7_IMPLEMENT_PLAN.md` | Kế hoạch này |
| `docs/features/TEST_VERIFY_SPRINT_7.md` | Test plan |

### Files sửa

| File | Thay đổi |
|------|----------|
| `backend/src/app.module.ts` | Thêm ReportsModule |
| `frontend/src/routes/AppRoutes.tsx` | Thêm route /reports/revenue |
| `frontend/src/layouts/MainLayout.tsx` | Thêm menu "Báo cáo doanh thu" |

---

## 8. Verify Commands

```bash
cd backend && npm run build
cd frontend && npm run build
```

---

## 9. Definition of Done

- [ ] Backend API 4 endpoints hoạt động
- [ ] Frontend page /reports/revenue hiển thị đúng
- [ ] Sidebar có menu "Báo cáo doanh thu"
- [ ] Business rules enforced (RBAC, chỉ DA_THANH_TOAN)
- [ ] Backend build pass
- [ ] Frontend build pass
- [ ] Không tạo bảng mới
- [ ] Không có secret leak
- [ ] Không commit/push
