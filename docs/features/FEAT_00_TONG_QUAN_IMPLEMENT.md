# FEAT_00: Tổng quan Implement & Quy trình Fix Bug

## 1. Mục tiêu

Thiết lập chiến lược implement theo Sprint, quy trình fix bug chuẩn, và các quy tắc xuyên suốt dự án.

## 2. Phạm vi

- Chiến lược implement theo Sprint (Sprint 1–6)
- Quy trình fix bug chuẩn (Identify → Reproduce → Root Cause → Fix → Verify → Commit)
- Quy tắc code chung: commit message format, code review, testing
- Cấu trúc thư mục code (BE/FE) tham chiếu `docs/thietke/05-ke-hoach-implement-sprint-1.md`

## 3. Out-of-scope

- Chi tiết implement từng feature (xem FEAT_01–FEAT_12)
- Database migration chi tiết (xem `docs/thietke/06-quy-uoc-database-migration-sql.md`)
- Business rules chi tiết (xem `docs/nghiepvu/04-quy-tac-nghiep-vu.md`)

## 4. Yêu cầu kỹ thuật

### 4.1 Tech Stack

| Layer | Công nghệ | Phiên bản |
|-------|-----------|-----------|
| Backend | NestJS | Latest |
| ORM | TypeORM | Latest |
| Database | MySQL | 8.x |
| Frontend | React + Vite | Latest |
| UI Library | Ant Design | Latest |
| Routing | React Router v6 | Latest |
| State Management | Zustand | Latest |
| HTTP Client | Axios | Latest |

### 4.2 Cấu trúc thư mục

```
backend/
  src/
    modules/
      auth/
      table-areas/
      tables/
      menu-categories/
      menu-items/
      orders/
      order-items/
      invoices/
      payments/
      reservations/
      inventory-items/
      inventory-transactions/
      users/
      staff/
      roles/
      audit-logs/
    common/
      guards/
      decorators/
      interceptors/
      filters/
      dto/
    config/
    database/
      migrations/
      seeds/
      factories/

frontend/
  src/
    api/
    components/
    pages/
      Login/
      Dashboard/
      TableManagement/
      OrderManagement/
      Kitchen/
      Payment/
      Reservation/
      Reports/
      Inventory/
      StaffManagement/
      AuditLog/
    hooks/
    stores/
    utils/
    types/
```

### 4.3 Port & Database

| Thông số | Giá trị |
|----------|---------|
| MySQL Port | 3306 |
| Database Name | `quanlynhahang` |
| Backend Port | 5011 |
| Frontend Port | 5173 |
| Admin Demo | `admin` / `Admin@123` |

### 4.4 Quy tắc Database (SQL-first)

- **File `.sql` trong `database/` là script chính thức** để dựng database thủ công
- Chạy SQL xong phải tạo được database, bảng và dữ liệu nền
- Backend API phải đọc được dữ liệu sau khi import SQL
- **TypeORM migration/seed** phải **khớp 100%** với SQL
- Mỗi feature mới → cập nhật cả SQL + TypeORM migration
- Không dùng `synchronize: true`
- Không sửa migration đã chạy trên production
- Rollback phải được test trước khi apply
- Chi tiết: `docs/thietke/06-quy-uoc-database-migration-sql.md`

## 5. Quy trình Fix Bug

### 5.1 Các bước

```
1. Identify    → Đọc bug report, hiểu triệu chứng
2. Reproduce   → Tạo lại lỗi trên local
3. Root Cause  → Phân tích nguyên nhân gốc
4. Fix         → Sửa code tối thiểu nhất
5. Verify      → Test lại + regression test
6. Commit      → Git commit với message chuẩn
```

### 5.2 Commit Message Format

```
<type>(<scope>): <short description>

type: feat | fix | refactor | docs | test | chore
scope: auth | table | order | payment | kitchen | reservation | report | inventory | staff | audit
description: Mô tả ngắn gọn bằng tiếng Việt hoặc tiếng Anh
```

Ví dụ:
- `feat(order): thêm endpoint tạo order mới`
- `fix(payment): sửa lỗi tính tổng tiền không chính xác`
- `refactor(table): tách table service thành module riêng`

### 5.3 Code Review Checklist

- [ ] Code chạy được trên local
- [ ] Không break existing functionality
- [ ] Có input validation
- [ ] Có error handling
- [ ] Commit message đúng format
- [ ] Không hardcode values
- [ ] Không expose secrets

## 6. Quy tắc Testing

### 6.1 Levels

| Level | Công cụ | Phạm vi |
|-------|---------|---------|
| Unit Test | Jest | Service, utility functions |
| Integration Test | Jest + Supertest | API endpoints |
| E2E Test | Playwright | User flows trên frontend |

### 6.2 Coverage Target

- Unit Test: ≥ 80% cho business logic
- Integration Test: ≥ 70% cho API endpoints
- E2E Test:覆盖 critical user flows

## 7. Trạng thái Sprint

| Sprint | Features | Trạng thái |
|--------|----------|------------|
| Sprint 1 | FEAT_01 (Auth/Role/User) | ✅ Hoàn thành |
| Sprint 2 | FEAT_02 (Bàn/Khu vực) + FEAT_03 (Thực đơn) | Chờ |
| Sprint 3 | FEAT_04 (Gọi món) | Chờ |
| Sprint 4 | FEAT_05 (Bếp) + FEAT_06 (Thanh toán) | Chờ |
| Sprint 5 | FEAT_07 (Đặt bàn) + FEAT_08 (Báo cáo) | Chờ |
| Sprint 6 | FEAT_09 (Kho) + FEAT_10 (Nhân viên) | Chờ |
| Cross | FEAT_11 (Audit Log) + FEAT_12 (Error/Security) | Chờ |
| Verify | FEAT_13 (Checklist toàn hệ thống) | Chờ |

## 8. Actors & Phân quyền

| Mã | Vai trò | Mô tả |
|----|---------|-------|
| QUAN_TRI_HE_THONG | Quản trị hệ thống | Toàn quyền, quản lý roles/users |
| QUAN_LY | Quản lý | Quản lý bàn, khu vực, thực đơn, nhân viên, báo cáo |
| PHUC_VU | Phục vụ | Gọi món, quản lý bàn, xem thực đơn |
| THU_NGAN | Thu ngân | Thanh toán, xem hoá đơn |
| BEP | Bếp | Xem/accept/cancel món, đánh dấu hoàn thành |
| KHO | Kho | Quản lý nguyên liệu, nhập/xuất kho |

## 9. Trạng thái Hệ thống

### 9.1 Table States

```
TRONG → DA_DAT → CO_KHACH → DANG_DON → TRONG
                  ↓
              BAO_TRI → TRONG
```

### 9.2 Order States

```
DANG_CHO → CHO_CHE_BIEN → DANG_CHE_BIEN → HOAN_THANH → DA_PHUC_VU
    ↓           ↓              ↓
DA_HUY       DA_HUY         DA_HUY
```

### 9.3 Invoice States

```
CHUA_THANH_TOAN → DA_THANH_TOAN
        ↓
    DA_HUY
```

### 9.4 Reservation States

```
CHO_XAC_NHAN → DA_XAC_NHAN → DA_NHAN_BAN → HOAN_THANH
       ↓              ↓
   DA_HUY          KHONG_DEN → DA_HUY
```

## 10. Definition of Done

- [ ] Code implement đúng acceptance criteria
- [ ] Unit test pass
- [ ] Integration test pass
- [ ] Không có regression
- [ ] Code review xong
- [ ] Commit message đúng format
- [ ] Documentation cập nhật
