# FEAT_02: Quản lý Khu vực & Bàn

## 1. Mục tiêu

Xây dựng tính năng quản lý khu vực (table areas) và bàn (tables) trong nhà hàng, bao gồm CRUD, trạng thái bàn, và giao diện trực quan.

## 2. Actor sử dụng

| Actor | Quyền hạn |
|-------|-----------|
| QUAN_TRI_HE_THONG | CRUD khu vực, CRUD bàn, phân quyền |
| QUAN_LY | Xem danh sách, cập nhật trạng thái |
| PHUC_VU | Cập nhật trạng thái bàn (CO_KHACH → DANG_DON → TRONG) |

## 3. Phạm vi trong feature

- [ ] CRUD Khu vực (Table Areas)
- [ ] CRUD Bàn (Tables)
- [ ] Cập nhật trạng thái bàn (TRONG, DA_DAT, CO_KHACH, DANG_DON, BAO_TRI)
- [ ] Giao diện quản lý bàn trực quan (grid/table view)
- [ ] Phân quyền theo role

## 4. Ngoài phạm vi

- Đặt bàn trước (sprint 5 — FEAT_07)
- Tích hợp gọi món (sprint 3 — FEAT_04)
- Tích hợp thanh toán (sprint 4 — FEAT_06)
- QR code cho bàn (Optional/Future — không phải Sprint 2)

## 5. Tài liệu nguồn liên quan

- `docs/nghiepvu/03-use-case-chi-tiet.md` — UC-02 Quản lý bàn
- `docs/nghiepvu/04-quy-tac-nghiep-vu.md` — BR-TBL-xx
- `docs/nghiepvu/05-trang-thai-he-thong.md` — Table states
- `docs/nghiepvu/06-acceptance-criteria.md` — AC-TBL-xx
- `docs/nghiepvu/10-test-case-nghiep-vu.md` — TC-TBL-xx
- `docs/nghiepvu/09-user-stories-va-sprint-goi-y.md` — US-06..11
- `docs/thietke/02-thiet-ke-co-so-du-lieu.md` — Schema tables

## 6. Quy tắc nghiệp vụ áp dụng

| Rule | Description |
|------|-------------|
| BR-TBL-01 | Tên khu vực phải là duy nhất |
| BR-TBL-02 | Bàn phải thuộc một khu vực tồn tại |
| BR-TBL-03 | Sức chứa bàn ≥ 1 |
| BR-TBL-04 | Không xoá khu vực nếu còn bàn thuộc khu vực đó |
| BR-TBL-05 | Chỉ chuyển trạng thái bàn theo flow cho phép |
| BR-TBL-06 | Bàn đang CO_KHACH không thể chuyển sang TRONG trực tiếp |

## 7. Trạng thái/enum liên quan

| Status | Mô tả | Color Code |
|--------|-------|------------|
| TRONG | Bàn trống, sẵn sàng | Green |
| DA_DAT | Đã được đặt trước | Yellow |
| CO_KHACH | Đang có khách | Blue |
| DANG_DON | Đang dọn dẹp | Orange |
| BAO_TRI | Đang bảo trì | Red |

### State Transitions

```
TRONG → DA_DAT (đặt bàn trước)
TRONG → CO_KHACH (khách vào)
DA_DAT → CO_KHACH (khách nhận bàn)
CO_KHACH → DANG_DON (khách rời đi, dọn dẹp)
DANG_DON → TRONG (hoàn thành dọn dẹp)
BAO_TRI → TRONG (hoàn thành bảo trì)
```

## 8. Database cần dùng

### Table: `table_areas`

```sql
id              INT PRIMARY KEY AUTO_INCREMENT
name            VARCHAR(100) NOT NULL
sort_order      INT DEFAULT 0
created_at      DATETIME(3)
updated_at      DATETIME(3)
```

### Table: `tables`

```sql
id              INT PRIMARY KEY AUTO_INCREMENT
table_area_id   INT NOT NULL FOREIGN KEY → table_areas(id)
name            VARCHAR(50) NOT NULL                 -- e.g. "Bàn 1", "Bàn VIP 1"
capacity        INT NOT NULL DEFAULT 4               -- Số chỗ ngồi
status          ENUM('TRONG','DA_DAT','CO_KHACH','DANG_DON','BAO_TRI') DEFAULT 'TRONG'
created_at      DATETIME(3)
updated_at      DATETIME(3)
deleted_at      DATETIME(3)
```

### Entity Relationships

```
table_areas (1) ──── (N) tables
```

## 9. Backend cần implement

### Module Structure

```
backend/src/modules/
  table-areas/
    table-area.module.ts
    table-area.controller.ts
    table-area.service.ts
    table-area.entity.ts
    dto/
      create-table-area.dto.ts
      update-table-area.dto.ts
  tables/
    table.module.ts
    table.controller.ts
    table.service.ts
    table.entity.ts
    dto/
      create-table.dto.ts
      update-table.dto.ts
      update-table-status.dto.ts
```

### Query Examples

```typescript
// Get tables with filters
async findAll(filters: { table_area_id?: number; status?: string }) {
  const qb = this.tableRepo.createQueryBuilder('table');
  
  if (filters.table_area_id) {
    qb.andWhere('table.table_area_id = :tableAreaId', { tableAreaId: filters.table_area_id });
  }
  
  if (filters.status) {
    qb.andWhere('table.status = :status', { status: filters.status });
  }
  
  return qb.getMany();
}
```

## 10. API contract dự kiến

### Table Areas

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/table-areas` | Danh sách khu vực | QUAN_TRI_HE_THONG, QUAN_LY |
| GET | `/api/table-areas/:id` | Chi tiết khu vực | QUAN_TRI_HE_THONG, QUAN_LY |
| POST | `/api/table-areas` | Tạo khu vực mới | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/table-areas/:id` | Cập nhật khu vực | QUAN_TRI_HE_THONG, QUAN_LY |
| DELETE | `/api/table-areas/:id` | Xoá khu vực | QUAN_TRI_HE_THONG |

### Tables

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tables` | Danh sách bàn (filter by area, status) | QUAN_TRI_HE_THONG, QUAN_LY |
| GET | `/api/tables/:id` | Chi tiết bàn | QUAN_TRI_HE_THONG, QUAN_LY |
| POST | `/api/tables` | Tạo bàn mới | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/tables/:id` | Cập nhật bàn | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/tables/:id/status` | Cập nhật trạng thái bàn | QUAN_TRI_HE_THONG, QUAN_LY, PHUC_VU |
| DELETE | `/api/tables/:id` | Xoá bàn | QUAN_TRI_HE_THONG |

### Request/Response Format

```json
// GET /api/tables?table_area_id=1&status=TRONG
{
  "data": [
    {
      "id": 1,
      "name": "Bàn 1",
      "capacity": 4,
      "status": "TRONG",
      "area": {
        "id": 1,
        "name": "Tầng 1"
      }
    }
  ],
  "message": "Lấy danh sách bàn thành công",
  "statusCode": 200
}
```

```json
// POST /api/tables
{
  "name": "Bàn VIP 1",
  "table_area_id": 2,
  "capacity": 8,
  "status": "TRONG"
}
```

## 11. Frontend cần implement

### Pages

| Page | Path | Description |
|------|------|-------------|
| Table Management | `/tables` | Grid/table view hiển thị tất cả bàn |
| Table Area Management | `/table-areas` | CRUD khu vực |

### Components

| Component | Description |
|-----------|-------------|
| `TableGrid` | Grid view hiển thị bàn theo khu vực |
| `TableCard` | Card hiển thị thông tin 1 bàn (tên, trạng thái, sức chứa) |
| `TableStatusBadge` | Badge màu hiển thị trạng thái |
| `TableAreaForm` | Form tạo/sửa khu vực |
| `TableForm` | Form tạo/sửa bàn |
| `TableFilter` | Filter theo khu vực, trạng thái |

### UI Flow

```
Tables Page
├── Filter Bar (Area dropdown, Status dropdown)
├── Table Grid
│   ├── Area Section (Tầng 1)
│   │   ├── TableCard (Bàn 1 - TRONG - Green)
│   │   ├── TableCard (Bàn 2 - CO_KHACH - Blue)
│   │   └── TableCard (Bàn 3 - DA_DAT - Yellow)
│   └── Area Section (Tầng 2)
│       └── ...
└── Action Buttons (Thêm bàn, Quản lý khu vực)
```

### Ant Design Components

- `Card` — Table card display
- `Tag` — Status badge
- `Select` — Area/status filter
- `Modal` — Create/edit forms
- `Form` — Input validation
- `Table` — Table list view
- `Popconfirm` — Delete confirmation

## 12. Validation

| Rule | Description |
|------|-------------|
| Tên khu vực | Required, maxLength 100, unique |
| Tên bàn | Required, maxLength 50 |
| Sức chứa | Required, min 1 |
| Area ID | Required, must exist in table_areas |
| Trạng thái | Phải nằm trong enum TRONG/DA_DAT/CO_KHACH/DANG_DON/BAO_TRI |

## 13. Permission/RBAC

| Endpoint | QUAN_TRI_HE_THONG | QUAN_LY | PHUC_VU | BEP | THU_NGAN | KHO |
|----------|:---:|:---:|:---:|:---:|:---:|:---:|
| GET /api/table-areas | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| POST /api/table-areas | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| PATCH /api/table-areas/:id | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| DELETE /api/table-areas/:id | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| GET /api/tables | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| POST /api/tables | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| PATCH /api/tables/:id/status | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| DELETE /api/tables/:id | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

## 14. Test case cần pass

### Unit Tests

| Test | Input | Expected |
|------|-------|----------|
| Create area success | Valid data | 201 + area object |
| Create area duplicate name | Existing name | 409 Conflict |
| Create table success | Valid data | 201 + table object |
| Create table invalid table_area_id | Non-existent area | 400 |
| Update table status valid transition | TRONG → CO_KHACH | 200 |
| Update table status invalid transition | CO_KHACH → TRONG | 400 |
| Delete area with tables | Area has tables | 400 |
| Delete area without tables | No tables | 200 |

### Integration Tests

| Test | Steps | Expected |
|------|-------|----------|
| Full CRUD flow | Create area → Create table → Update → Delete | All pass |
| State transition flow | TRONG → CO_KHACH → DANG_DON → TRONG | All pass |
| Filter by area | Create 2 areas, filter by table_area_id | Correct results |

## 15. Verify commands

```bash
# Backend tests
cd backend && npm run test -- --testPathPattern=table-area
cd backend && npm run test -- --testPathPattern=table

# Frontend lint
cd frontend && npm run lint

# Type check
cd backend && npx tsc --noEmit
cd frontend && npx tsc --noEmit
```

## 16. Bug checklist

- [ ] Tên khu vực trùng →报错 409
- [ ] Xoá khu vực còn bàn →报错 400
- [ ] Chuyển trạng thái không hợp lệ →报错 400
- [ ] Filter theo khu vực hiển thị đúng
- [ ] Filter theo trạng thái hiển thị đúng
- [ ] Grid view hiển thị đúng màu trạng thái
- [ ] Responsive trên mobile (1 column)

## 17. Definition of Done

- [ ] Code implement đúng acceptance criteria
- [ ] Migration tạo đúng schema
- [ ] Seed data hoạt động đúng
- [ ] Unit test pass
- [ ] Integration test pass
- [ ] Không có regression
- [ ] Code review xong
- [ ] Commit message đúng format
- [ ] Documentation cập nhật
- [ ] Grid view hiển thị đúng trên mọi device
