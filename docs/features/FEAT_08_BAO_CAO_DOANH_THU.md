# FEAT_08: Báo cáo Doanh thu

## 1. Mục tiêu

Xây dựng tính năng xem báo cáo doanh thu theo ngày/tuần/tháng, thống kê món bán chạy, và phân tích hiệu suất kinh doanh.

## 2. Actor sử dụng

| Actor | Quyền hạn |
|-------|-----------|
| QUAN_TRI_HE_THONG | Xem tất cả báo cáo |
| QUAN_LY | Xem tất cả báo cáo, xuất file |
| PHUC_VU | Không xem được báo cáo |
| BEP | Không xem được báo cáo |
| THU_NGAN | Không xem được báo cáo |
| KHO | Không xem được báo cáo |

## 3. Phạm vi trong feature

- [ ] Báo cáo doanh thu theo ngày/tuần/tháng
- [ ] Thống kê tổng doanh thu, số hoá đơn, doanh thu trung bình
- [ ] Biểu đồ doanh thu theo thời gian
- [ ] Top món bán chạy
- [ ] Doanh thu theo ca (sáng/tối)
- [ ] Xuất báo cáo (PDF/Excel)

## 4. Ngoài phạm vi

- Báo cáo chi tiết theo nhân viên
- Báo cáo lợi nhuận (chưa có chi phí)
- Dự báo doanh thu (forecasting)
- Tích hợp BI tools

## 5. Tài liệu nguồn liên quan

- `docs/nghiepvu/03-use-case-chi-tiet.md` — UC-08 Báo cáo
- `docs/nghiepvu/04-quy-tac-nghiep-vu.md` — BR-RPT-xx
- `docs/nghiepvu/06-acceptance-criteria.md` — AC-RPT-xx
- `docs/nghiepvu/10-test-case-nghiep-vu.md` — TC-RPT-xx
- `docs/nghiepvu/09-user-stories-va-sprint-goi-y.md` — US-51..58

## 6. Quy tắc nghiệp vụ áp dụng

| Rule | Description |
|------|-------------|
| BR-RPT-01 | Chỉ QUAN_LY mới xem được báo cáo |
| BR-RPT-02 | Báo cáo chỉ tính từ invoices DA_THANH_TOAN |
| BR-RPT-03 | Doanh thu = tổng total của invoices trong khoảng thời gian |
| BR-RPT-04 | Ca sáng: 06:00–14:00, Ca chiều: 14:00–18:00, Ca tối: 18:00–23:00 |
| BR-RPT-05 | Xuất báo cáo PDF hoặc Excel |
| BR-RPT-06 | Top items mặc định top 10, có thể thay đổi |

## 7. Trạng thái/enum liên quan

Không có trạng thái riêng — feature read-only từ data có sẵn.

## 8. Database cần dùng

Không tạo table mới. Query read-only từ:
- Table `invoices` (status = DA_THANH_TOAN)
- Table `payments`
- Table `order_items`
- Table `menu_items`

## 9. Backend cần implement

### Module Structure

```
backend/src/modules/
  reports/
    report.module.ts
    report.controller.ts
    report.service.ts
    dto/
      revenue-report.dto.ts
      top-items.dto.ts
```

### Key Queries

```typescript
async getRevenueByDay(from: string, to: string) {
  return this.invoiceRepo.query(`
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as invoices,
      SUM(total) as revenue
    FROM invoices
    WHERE status = 'DA_THANH_TOAN'
      AND created_at >= ? AND created_at <= ?
    GROUP BY DATE(created_at)
    ORDER BY date
  `, [from, to]);
}

async getTopItems(limit: number = 10) {
  return this.orderItemRepo.query(`
    SELECT 
      mi.id as item_id, mi.name,
      SUM(oi.quantity) as quantity_sold,
      SUM(oi.subtotal) as revenue
    FROM order_items oi
    JOIN menu_items mi ON oi.menu_item_id = mi.id
    JOIN orders o ON oi.order_id = o.id
    JOIN invoices i ON i.order_id = o.id
    WHERE i.status = 'DA_THANH_TOAN'
    GROUP BY mi.id, mi.name
    ORDER BY quantity_sold DESC
    LIMIT ?
  `, [limit]);
}
```

## 10. API contract dự kiến

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/reports/revenue` | Báo cáo doanh thu theo ngày | QUAN_LY |
| GET | `/api/reports/revenue/weekly` | Báo cáo doanh thu theo tuần | QUAN_LY |
| GET | `/api/reports/revenue/monthly` | Báo cáo doanh thu theo tháng | QUAN_LY |
| GET | `/api/reports/top-items` | Top món bán chạy | QUAN_LY |
| GET | `/api/reports/revenue-by-shift` | Doanh thu theo ca | QUAN_LY |
| GET | `/api/reports/summary` | Tổng quan doanh thu | QUAN_LY |
| GET | `/api/reports/export` | Xuất báo cáo PDF/Excel | QUAN_LY |

### Query Parameters

```json
// GET /api/reports/revenue?from=2025-01-01&to=2025-01-31
{ "from": "2025-01-01", "to": "2025-01-31", "group_by": "day" }
```

### Response Format

```json
{
  "data": {
    "period": { "from": "2025-01-01", "to": "2025-01-31" },
    "summary": {
      "total_revenue": 15000000,
      "total_invoices": 150,
      "average_invoice": 100000,
      "total_items_sold": 450
    },
    "daily": [
      { "date": "2025-01-01", "revenue": 500000, "invoices": 5 }
    ]
  }
}
```

## 11. Frontend cần implement

### Pages

| Page | Path | Description |
|------|------|-------------|
| Dashboard | `/dashboard` | Tổng quan doanh thu |
| Revenue Report | `/reports/revenue` | Báo cáo chi tiết |
| Top Items | `/reports/top-items` | Món bán chạy |
| Export | `/reports/export` | Xuất báo cáo |

### Components

| Component | Description |
|-----------|-------------|
| `RevenueSummary` | Tổng quan: doanh thu, số HĐ, TB |
| `RevenueChart` | Biểu đồ doanh thu (Line/Bar) |
| `RevenueTable` | Bảng chi tiết theo ngày |
| `TopItemsList` | Top món bán chạy |
| `ShiftRevenue` | Doanh thu theo ca |
| `DateRangePicker` | Chọn khoảng ngày |
| `ExportButton` | Xuất PDF/Excel |
| `PeriodSelector` | Chọn ngày/tuần/tháng |

### UI Flow

```
Dashboard
├── Summary Cards
│   ├── Tổng doanh thu: 15,000,000đ
│   ├── Số HĐ: 150
│   ├── Doanh thu TB: 100,000đ
│   └── Món bán chạy: Phở Bò (120)
├── Revenue Chart (Line)
├── Top Items (Bar)
├── Date Range Picker
│   └── [Tuần này] [Tháng này] [Tùy chỉnh]
└── Export Buttons
    └── [Xuất PDF] [Xuất Excel]
```

### Ant Design Components

- `Card` — Summary cards
- `Table` — Revenue table
- `Tag` — Status badges
- `DateRangePicker` — Date filter
- `Button` — Export actions
- `Row/Col` — Layout

## 12. Validation

| Rule | Description |
|------|-------------|
| from/to | Required, format YYYY-MM-DD, from ≤ to |
| group_by | Optional, default "day", enum day/week/month |
| limit | Optional, default 10, min 1, max 100 |

## 13. Permission/RBAC

| Endpoint | QUAN_TRI_HE_THONG | QUAN_LY | PHUC_VU | BEP | THU_NGAN | KHO |
|----------|:---:|:---:|:---:|:---:|:---:|:---:|
| GET /api/reports/revenue | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/reports/revenue/weekly | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/reports/revenue/monthly | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/reports/top-items | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/reports/revenue-by-shift | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/reports/summary | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/reports/export | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## 14. Test case cần pass

### Unit Tests

| Test | Input | Expected |
|------|-------|----------|
| Revenue by day | from/to dates | Correct totals |
| Revenue by week | Week range | Correct aggregation |
| Top items | limit=5 | Top 5 items |
| Revenue by shift | Today | 3 shifts |
| Empty period | No invoices | 0 revenue |
| Non-QUAN_LY access | PHUC_VU role | 403 |

### Integration Tests

| Test | Steps | Expected |
|------|-------|----------|
| Full report flow | Generate invoices → View report | Correct data |
| Export flow | Generate report → Export PDF | Valid PDF |

## 15. Verify commands

```bash
cd backend && npm run test -- --testPathPattern=report
cd frontend && npm run lint
cd backend && npx tsc --noEmit
cd frontend && npx tsc --noEmit
```

## 16. Bug checklist

- [ ] PHUC_VU truy cập report → 403
- [ ] Báo cáo chỉ tính từ HĐ DA_THANH_TOAN
- [ ] Doanh thu theo ngày đúng
- [ ] Top items đúng thứ tự
- [ ] Xuất PDF hợp lệ
- [ ] Xuất Excel hợp lệ
- [ ] Biểu đồ hiển thị đúng dữ liệu
- [ ] Chọn khoảng ngày linh hoạt

## 17. Definition of Done

- [ ] Code implement đúng acceptance criteria
- [ ] Report queries đúng dữ liệu
- [ ] Chart hiển thị đúng
- [ ] Export PDF hoạt động
- [ ] Export Excel hoạt động
- [ ] Unit test pass
- [ ] Integration test pass
- [ ] Không có regression
- [ ] Code review xong
- [ ] Documentation cập nhật
