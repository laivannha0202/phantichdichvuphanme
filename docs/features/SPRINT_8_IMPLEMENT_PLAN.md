# SPRINT_8_IMPLEMENT_PLAN.md — Kế hoạch triển khai Sprint 8

## Tổng quan

Sprint 8: Quản lý Kho Nguyên liệu MVP

- **Thời gian:** 2026-06-18
- **Mục tiêu:** Triển khai chức năng quản lý kho nguyên liệu cơ bản
- **Phạm vi:** Theo yêu cầu user — 10 nhiệm vụ

---

## 1. Phạm vi Sprint 8

### 1.1 Bao gồm

1. Quản lý nguyên liệu (CRUD)
2. Quản lý nhà cung cấp cơ bản
3. Nhập kho nguyên liệu
4. Xuất kho nguyên liệu thủ công
5. Xem tồn kho hiện tại
6. Cảnh báo nguyên liệu sắp hết
7. Lịch sử giao dịch kho
8. Frontend màn hình kho

### 1.2 Không bao gồm

- Không tự động trừ kho theo món ăn
- Không tạo công thức/định mức nguyên liệu cho món
- Không làm báo cáo lợi nhuận
- Không làm kiểm kê nâng cao/phê duyệt chênh lệch
- Không làm đặt hàng nhà cung cấp nâng cao
- Không làm QR/kitchen/payment/report nâng cao
- Không sửa/tạo lại backend/.env
- Không ghi DB_PASSWORD/JWT/accessToken/refreshToken/password_hash
- Không in secret/password/token ra output
- Không drop/reset quanlynhahang
- Không động QuanNhaHang
- Không commit/push

---

## 2. Database Design

### 2.1 Bảng mới

#### `suppliers` — Nhà cung cấp

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | Khóa chính |
| supplier_code | VARCHAR(50) | Mã nhà cung cấp, duy nhất |
| name | VARCHAR(200) | Tên nhà cung cấp |
| phone | VARCHAR(20) | Số điện thoại |
| email | VARCHAR(100) | Email (nullable) |
| address | VARCHAR(500) | Địa chỉ (nullable) |
| note | TEXT | Ghi chú (nullable) |
| status | VARCHAR(50) | DANG_HOP_TAC, NGUNG_HOP_TAC |
| created_at | DATETIME(3) | |
| updated_at | DATETIME(3) | |
| deleted_at | DATETIME(3) | Soft delete |

#### `ingredients` — Nguyên liệu

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | Khóa chính |
| ingredient_code | VARCHAR(50) | Mã nguyên liệu, duy nhất |
| name | VARCHAR(200) | Tên nguyên liệu |
| unit | VARCHAR(50) | Đơn vị tính |
| current_stock | DECIMAL(12,3) | Tồn kho hiện tại |
| min_stock | DECIMAL(12,3) | Tồn tối thiểu |
| status | VARCHAR(50) | CON_HANG, SAP_HET, HET_HANG, NGUNG_SU_DUNG |
| note | TEXT | Ghi chú (nullable) |
| created_at | DATETIME(3) | |
| updated_at | DATETIME(3) | |
| deleted_at | DATETIME(3) | Soft delete |

#### `inventory_transactions` — Giao dịch kho

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT | Khóa chính |
| transaction_code | VARCHAR(50) | Mã giao dịch, duy nhất |
| ingredient_id | INT | FK → ingredients.id |
| supplier_id | INT | FK → suppliers.id (nullable) |
| type | VARCHAR(50) | NHAP_KHO, XUAT_KHO, DIEU_CHINH |
| quantity | DECIMAL(12,3) | Số lượng |
| unit_price | DECIMAL(12,2) | Đơn giá (nullable) |
| total_amount | DECIMAL(14,2) | Tổng tiền (nullable) |
| note | TEXT | Ghi chú (nullable) |
| created_by_user_id | INT | FK → users.id (nullable) |
| created_at | DATETIME(3) | |
| updated_at | DATETIME(3) | |

### 2.2 Enum/Status

- `suppliers.status`: DANG_HOP_TAC, NGUNG_HOP_TAC
- `ingredients.status`: CON_HANG, SAP_HET, HET_HANG, NGUNG_SU_DUNG
- `inventory_transactions.type`: NHAP_KHO, XUAT_KHO, DIEU_CHINH

### 2.3 Quy tắc SQL

- MySQL 8.x
- utf8mb4
- Có FK/index hợp lý
- Không chứa password/token/secret
- Seed idempotent nếu có thể
- Không tạo bảng ngoài Sprint 8

---

## 3. Backend Design

### 3.1 Module Structure

```
backend/src/modules/inventory/
├── inventory.module.ts
├── inventory.controller.ts
├── inventory.service.ts
├── dto/
│   ├── create-supplier.dto.ts
│   ├── update-supplier.dto.ts
│   ├── create-ingredient.dto.ts
│   ├── update-ingredient.dto.ts
│   ├── create-transaction.dto.ts
│   └── export-transaction.dto.ts
└── entities/
    ├── supplier.entity.ts
    ├── ingredient.entity.ts
    └── inventory-transaction.entity.ts
```

### 3.2 API Endpoints

#### Suppliers

| Method | Endpoint | RBAC | Mô tả |
|--------|----------|------|-------|
| GET | /api/inventory/suppliers | QUAN_TRI_HE_THONG, QUAN_LY, KHO | Danh sách NCC |
| GET | /api/inventory/suppliers/:id | QUAN_TRI_HE_THONG, QUAN_LY, KHO | Chi tiết NCC |
| POST | /api/inventory/suppliers | QUAN_TRI_HE_THONG, QUAN_LY, KHO | Tạo NCC |
| PATCH | /api/inventory/suppliers/:id | QUAN_TRI_HE_THONG, QUAN_LY, KHO | Sửa NCC |

#### Ingredients

| Method | Endpoint | RBAC | Mô tả |
|--------|----------|------|-------|
| GET | /api/inventory/ingredients | QUAN_TRI_HE_THONG, QUAN_LY, KHO | Danh sách nguyên liệu |
| GET | /api/inventory/ingredients/:id | QUAN_TRI_HE_THONG, QUAN_LY, KHO | Chi tiết nguyên liệu |
| POST | /api/inventory/ingredients | QUAN_TRI_HE_THONG, QUAN_LY, KHO | Tạo nguyên liệu |
| PATCH | /api/inventory/ingredients/:id | QUAN_TRI_HE_THONG, QUAN_LY, KHO | Sửa nguyên liệu |

#### Transactions

| Method | Endpoint | RBAC | Mô tả |
|--------|----------|------|-------|
| GET | /api/inventory/transactions | QUAN_TRI_HE_THONG, QUAN_LY, KHO | Lịch sử GD |
| POST | /api/inventory/transactions/import | QUAN_TRI_HE_THONG, QUAN_LY, KHO | Nhập kho |
| POST | /api/inventory/transactions/export | QUAN_TRI_HE_THONG, QUAN_LY, KHO | Xuất kho |

#### Dashboard

| Method | Endpoint | RBAC | Mô tả |
|--------|----------|------|-------|
| GET | /api/inventory/low-stock | QUAN_TRI_HE_THONG, QUAN_LY, KHO | Cảnh báo sắp hết |
| GET | /api/inventory/summary | QUAN_TRI_HE_THONG, QUAN_LY, KHO | Tổng quan kho |

### 3.3 Business Rules

- Mã nguyên liệu không trùng
- Tên nguyên liệu không để trống
- Đơn vị tính bắt buộc
- current_stock không âm
- min_stock không âm
- Nhập kho quantity > 0
- Xuất kho quantity > 0
- Không cho xuất kho vượt quá current_stock
- Sau nhập kho: current_stock tăng
- Sau xuất kho: current_stock giảm
- Tự suy diễn status:
  - current_stock = 0 → HET_HANG
  - 0 < current_stock <= min_stock → SAP_HET
  - current_stock > min_stock → CON_HANG
- Không xóa cứng nguyên liệu đã có giao dịch kho
- Lịch sử giao dịch kho không bị xóa
- Không tự động trừ kho theo món trong Sprint 8

### 3.4 RBAC

| Role | Quyền |
|------|-------|
| QUAN_TRI_HE_THONG | Toàn quyền |
| QUAN_LY | Toàn quyền nghiệp vụ kho |
| KHO | Xem, tạo/sửa nguyên liệu, nhập kho, xuất kho |
| THU_NGAN | Không có quyền kho |
| PHUC_VU | Không có quyền kho |
| BEP | Không có quyền kho |

### 3.5 Swagger

- ApiTags('Inventory')
- DTO có ApiProperty
- Bearer auth
- Validation rõ ràng

---

## 4. Frontend Design

### 4.1 Route

- /inventory

### 4.2 Sidebar

- Bật menu "Kho"
- Chỉ hiển thị cho: QUAN_TRI_HE_THONG, QUAN_LY, KHO

### 4.3 Trang /inventory

Tabs:

1. **Nguyên liệu:**
   - Mã, Tên, Đơn vị, Tồn kho hiện tại, Tồn tối thiểu, Trạng thái, Ghi chú
   - Tạo/sửa

2. **Nhà cung cấp:**
   - Mã, Tên, SĐT, Email, Địa chỉ, Trạng thái
   - Tạo/sửa

3. **Nhập kho:**
   - Chọn nguyên liệu
   - Chọn nhà cung cấp nếu có
   - Số lượng
   - Đơn giá
   - Ghi chú

4. **Xuất kho:**
   - Chọn nguyên liệu
   - Số lượng
   - Ghi chú
   - Không cho xuất vượt tồn

5. **Cảnh báo sắp hết:**
   - Hiển thị nguyên liệu SAP_HET hoặc HET_HANG

### 4.4 UI Requirements

- Ant Design
- Loading/error/empty state
- Notification khi thành công/thất bại
- Format tiền Việt Nam
- Không thêm chart library mới
- Không làm export Excel/PDF trong Sprint 8

---

## 5. Implementation Plan

### Phase 1: Database

1. Tạo SQL: `database/15-schema-sprint-8-inventory.sql`
2. Tạo seed: `database/16-seed-sprint-8-inventory.sql`
3. Tạo migration TypeORM

### Phase 2: Backend

1. Tạo entities
2. Tạo DTOs
3. Tạo service
4. Tạo controller
5. Tạo module
6. Đăng ký module vào app.module.ts
7. Build & test

### Phase 3: Frontend

1. Tạo types
2. Tạo API client
3. Tạo page components
4. Thêm route
5. Sửa sidebar
6. Build & test

### Phase 4: Verify

1. Build backend
2. Build frontend
3. Test API
4. Verify RBAC
5. Verify business rules

---

## 6. Files Expected

### Database

- `database/15-schema-sprint-8-inventory.sql`
- `database/16-seed-sprint-8-inventory.sql`

### Backend

- `backend/src/database/migrations/<timestamp>-CreateInventory.ts`
- `backend/src/database/entities/supplier.entity.ts`
- `backend/src/database/entities/ingredient.entity.ts`
- `backend/src/database/entities/inventory-transaction.entity.ts`
- `backend/src/modules/inventory/inventory.module.ts`
- `backend/src/modules/inventory/inventory.controller.ts`
- `backend/src/modules/inventory/inventory.service.ts`
- `backend/src/modules/inventory/dto/create-supplier.dto.ts`
- `backend/src/modules/inventory/dto/update-supplier.dto.ts`
- `backend/src/modules/inventory/dto/create-ingredient.dto.ts`
- `backend/src/modules/inventory/dto/update-ingredient.dto.ts`
- `backend/src/modules/inventory/dto/create-transaction.dto.ts`
- `backend/src/modules/inventory/dto/export-transaction.dto.ts`

### Frontend

- `frontend/src/types/inventory.types.ts`
- `frontend/src/api/inventory.api.ts`
- `frontend/src/pages/InventoryPage.tsx`

### Docs

- `docs/features/SPRINT_8_IMPLEMENT_PLAN.md` (file này)
- `docs/features/TEST_VERIFY_SPRINT_8.md`
- `docs/features/HARD_VERIFY_SPRINT_8.md`

---

## 7. Timeline

| Phase | Task | Estimate |
|-------|------|----------|
| 1 | Database SQL + Seed | 30 min |
| 2 | Backend Migration + Entity + DTO + Service + Controller + Module | 2h |
| 3 | Frontend Types + API + Page + Route + Sidebar | 1.5h |
| 4 | Verify Build + Test + RBAC | 30 min |
| 5 | Cleanup + Report | 30 min |

**Tổng estimate:** ~5h

---

## 8. Risk

| Risk | Mitigation |
|------|------------|
| Migration conflict | Tạo timestamp mới, không sửa migration cũ |
| RBAC sai | Test kỹ từng role |
| Business rule sai | Verify theo BR-INV-xx |
| Frontend route conflict | Kiểm tra AppRoutes.tsx trước |

---

## 9. Acceptance Criteria

### AC-INV-01

- Nhân viên kho nhập kho với số lượng lớn hơn 0
- Nhập số lượng = 0 hoặc âm → Hệ thống thông báo "Số lượng nhập phải lớn hơn 0"

### AC-INV-02

- Nhân viên kho xuất kho với số lượng lớn hơn 0
- Xuất số lượng = 0 hoặc âm → Hệ thống thông báo "Số lượng xuất phải lớn hơn 0"

### AC-INV-03

- Không cho phép xuất kho vượt quá tồn kho
- Xuất số lượng > tồn kho hiện tại → Hệ thống thông báo "Số lượng xuất vượt quá tồn kho"

### AC-INV-04

- Tồn kho được cập nhật sau nhập/xuất/kiểm kê
- Nhập 50 → tồn kho = 50
- Xuất 30 → tồn kho = 20

### AC-INV-05

- Hệ thống cảnh báo khi tồn kho nhỏ hơn hoặc bằng mức tối thiểu
- Xuất kho làm tồn kho giảm xuống ≤ mức tối thiểu → Hiển thị cảnh báo

### AC-INV-06

- Trạng thái nguyên liệu được tự động suy diễn theo tồn kho
- current_stock = 0 → HET_HANG
- 0 < current_stock <= min_stock → SAP_HET
- current_stock > min_stock → CON_HANG

---

## 10. Checklist

- [ ] SQL Sprint 8 tạo đúng 3 bảng
- [ ] Migration khớp SQL 100%
- [ ] Entity khớp SQL
- [ ] Backend API đủ 12 endpoints
- [ ] RBAC đúng: KHO, QUAN_LY, QUAN_TRI_HE_THONG
- [ ] Business rules đúng
- [ ] Frontend route /inventory tồn tại
- [ ] Sidebar chỉ hiển thị Kho cho đúng role
- [ ] Backend build pass
- [ ] Frontend build pass
- [ ] Không tạo/sửa backend/.env
- [ ] Không dùng CLI MySQL password
- [ ] Không in secret/password/token
- [ ] Không drop/reset quanlynhahang
- [ ] Không động QuanNhaHang
- [ ] Không commit/push