# FEAT_09: Kho Nguyên liệu

## 1. Mục tiêu

Xây dựng tính năng quản lý kho nguyên liệu: nhập kho, xuất kho, kiểm kê, cảnh báo tồn kho thấp, và theo dõi lịch sử giao dịch.

## 2. Actor sử dụng

| Actor | Quyền hạn |
|-------|-----------|
| QUAN_TRI_HE_THONG | Full CRUD, xem báo cáo |
| QUAN_LY | Xem báo cáo, xem giao dịch |
| KHO | Full access: CRUD nguyên liệu, nhập/xuất, kiểm kê |
| PHUC_VU | Không có quyền trong feature này |
| BEP | Không có quyền trong feature này |
| THU_NGAN | Không có quyền trong feature này |

## 3. Phạm vi trong feature

- [ ] CRUD Nguyên liệu (Ingredients)
- [ ] CRUD Nhà cung cấp (Suppliers)
- [ ] Nhập kho (Inventory Transactions - NHAP_KHO)
- [ ] Xuất kho (Inventory Transactions - XUAT_KHO)
- [ ] Kiểm kê kho (Stocktake)
- [ ] Cảnh báo tồn kho thấp
- [ ] Xem lịch sử giao dịch kho

## 4. Ngoài phạm vi

- Đặt hàng tự động (auto-reorder)
- Barcode/QR scan
- Quản lý hạn sử dụng (expiry)
- Tích hợp POS

## 5. Tài liệu nguồn liên quan

- `docs/nghiepvu/03-use-case-chi-tiet.md` — UC-09 Quản lý kho
- `docs/nghiepvu/04-quy-tac-nghiep-vu.md` — BR-INV-xx
- `docs/nghiepvu/06-acceptance-criteria.md` — AC-INV-xx
- `docs/nghiepvu/10-test-case-nghiep-vu.md` — TC-INV-xx
- `docs/nghiepvu/09-user-stories-va-sprint-goi-y.md` — US-59..65
- `docs/nghiepvu/08-pham-vi-mvp-va-backlog.md` — Should Have

## 6. Quy tắc nghiệp vụ áp dụng

| Rule | Description |
|------|-------------|
| BR-INV-01 | Xuất kho không được vượt tồn kho hiện tại |
| BR-INV-02 | Tồn kho mới = tồn kho cũ ± quantity |
| BR-INV-03 | Cảnh báo khi current_stock ≤ min_stock |
| BR-INV-04 | Đơn vị đo phải nhất quán cho mỗi nguyên liệu |
| BR-INV-05 | Mỗi giao dịch có transaction_code tự động (GD-YYYYMMDD-XXX) |
| BR-INV-06 | Giao dịch không thể xóa, chỉ tạo bù (reversal) |
| BR-INV-07 | Tổng tiền = unit_price × quantity (nếu có unit_price) |

## 7. Trạng thái/enum liên quan

### Ingredient Status

| Status | Mô tả |
|--------|-------|
| CON_HANG | Còn hàng (currentStock > minStock) |
| SAP_HET | Sắp hết (currentStock ≤ minStock, > 0) |
| HET_HANG | Hết hàng (currentStock = 0) |
| NGUNG_SU_DUNG | Ngừng sử dụng |

### Supplier Status

| Status | Mô tả |
|--------|-------|
| DANG_HOP_TAC | Đang hợp tác |
| NGUNG_HOP_TAC | Ngừng hợp tác |

### Transaction Type

| Type | Mô tả | Ảnh hưởng tồn kho |
|------|-------|-------------------|
| NHAP_KHO | Nhập kho | +quantity |
| XUAT_KHO | Xuất kho | -quantity |
| DIEU_CHINH | Điều chỉnh | ±quantity |

## 8. Database cần dùng

### Table: `suppliers` (Nhà cung cấp)

```sql
id              INT PRIMARY KEY AUTO_INCREMENT
supplier_code   VARCHAR(50) NOT NULL UNIQUE
name            VARCHAR(200) NOT NULL
phone           VARCHAR(20)
email           VARCHAR(100)
address         VARCHAR(500)
note            TEXT
status          VARCHAR(50) NOT NULL DEFAULT 'DANG_HOP_TAC'
created_at      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
updated_at      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
deleted_at      DATETIME(3)
```

Indexes: `idx_suppliers_status`, `idx_suppliers_supplier_code`

### Table: `ingredients` (Nguyên liệu)

```sql
id              INT PRIMARY KEY AUTO_INCREMENT
ingredient_code VARCHAR(50) NOT NULL UNIQUE
name            VARCHAR(200) NOT NULL
unit            VARCHAR(50) NOT NULL
current_stock   DECIMAL(12,3) NOT NULL DEFAULT 0
min_stock       DECIMAL(12,3) NOT NULL DEFAULT 0
status          VARCHAR(50) NOT NULL DEFAULT 'CON_HANG'
note            TEXT
created_at      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
updated_at      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
deleted_at      DATETIME(3)
```

Indexes: `idx_ingredients_status`, `idx_ingredients_ingredient_code`, `idx_ingredients_current_stock`

### Table: `inventory_transactions` (Giao dịch kho)

```sql
id                  INT PRIMARY KEY AUTO_INCREMENT
transaction_code    VARCHAR(50) NOT NULL UNIQUE
ingredient_id       INT NOT NULL FK → ingredients(id)
supplier_id         INT FK → suppliers(id)
type                VARCHAR(50) NOT NULL
quantity            DECIMAL(12,3) NOT NULL
unit_price          DECIMAL(12,2)
total_amount        DECIMAL(14,2)
note                TEXT
created_by_user_id  INT FK → users(id)
created_at          DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
updated_at          DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
```

Indexes: `idx_inventory_transactions_ingredient_id`, `idx_inventory_transactions_supplier_id`, `idx_inventory_transactions_type`, `idx_inventory_transactions_created_at`

### Entity Relationships

```
suppliers (1) ──── (N) inventory_transactions
ingredients (1) ──── (N) inventory_transactions
users (1) ──── (N) inventory_transactions
```

## 9. Backend cần implement

### Module Structure

```
backend/src/modules/inventory/
  inventory.module.ts
  inventory.controller.ts
  inventory.service.ts
  dto/
    create-ingredient.dto.ts
    update-ingredient.dto.ts
    create-supplier.dto.ts
    update-supplier.dto.ts
    create-transaction.dto.ts
    export-transaction.dto.ts

backend/src/database/entities/
  ingredient.entity.ts
  supplier.entity.ts
  inventory-transaction.entity.ts
```

### Key Logic

```typescript
async importStock(dto: CreateTransactionDto, userId?: number) {
  const ingredient = await this.findOneIngredient(dto.ingredientId);
  if (dto.quantity <= 0) {
    throw new BadRequestException('Quantity must be greater than 0');
  }
  ingredient.currentStock = Number(ingredient.currentStock) + Number(dto.quantity);
  ingredient.status = this.determineStatus(ingredient.currentStock, ingredient.minStock);
  await this.ingredientRepository.save(ingredient);

  const transactionCode = await this.generateTransactionCode();
  const tx = new InventoryTransaction();
  tx.transactionCode = transactionCode;
  tx.ingredientId = dto.ingredientId;
  tx.supplierId = dto.supplierId || null;
  tx.type = 'NHAP_KHO';
  tx.quantity = dto.quantity;
  tx.unitPrice = dto.unitPrice || null;
  tx.totalAmount = dto.unitPrice ? dto.unitPrice * dto.quantity : null;
  tx.note = dto.note || null;
  tx.createdByUserId = userId || null;
  return this.transactionRepository.save(tx);
}

async exportStock(dto: ExportTransactionDto, userId?: number) {
  const ingredient = await this.findOneIngredient(dto.ingredientId);
  if (dto.quantity <= 0) {
    throw new BadRequestException('Quantity must be greater than 0');
  }
  if (Number(ingredient.currentStock) < Number(dto.quantity)) {
    throw new BadRequestException('Số lượng xuất vượt quá tồn kho');
  }
  ingredient.currentStock = Number(ingredient.currentStock) - Number(dto.quantity);
  ingredient.status = this.determineStatus(ingredient.currentStock, ingredient.minStock);
  await this.ingredientRepository.save(ingredient);

  const transactionCode = await this.generateTransactionCode();
  const tx = new InventoryTransaction();
  tx.transactionCode = transactionCode;
  tx.ingredientId = dto.ingredientId;
  tx.supplierId = null;
  tx.type = 'XUAT_KHO';
  tx.quantity = dto.quantity;
  tx.unitPrice = null;
  tx.totalAmount = null;
  tx.note = dto.note || null;
  tx.createdByUserId = userId || null;
  return this.transactionRepository.save(tx);
}
```

## 10. API contract dự kiến

### Suppliers (Nhà cung cấp)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/inventory/suppliers` | Danh sách nhà cung cấp | KHO, QUAN_LY, QUAN_TRI_HE_THONG |
| GET | `/api/inventory/suppliers/:id` | Chi tiết nhà cung cấp | KHO, QUAN_LY, QUAN_TRI_HE_THONG |
| POST | `/api/inventory/suppliers` | Tạo nhà cung cấp mới | KHO, QUAN_LY, QUAN_TRI_HE_THONG |
| PATCH | `/api/inventory/suppliers/:id` | Cập nhật nhà cung cấp | KHO, QUAN_LY, QUAN_TRI_HE_THONG |

### Ingredients (Nguyên liệu)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/inventory/ingredients` | Danh sách nguyên liệu | KHO, QUAN_LY, QUAN_TRI_HE_THONG |
| GET | `/api/inventory/ingredients/:id` | Chi tiết nguyên liệu | KHO, QUAN_LY, QUAN_TRI_HE_THONG |
| POST | `/api/inventory/ingredients` | Tạo nguyên liệu mới | KHO, QUAN_LY, QUAN_TRI_HE_THONG |
| PATCH | `/api/inventory/ingredients/:id` | Cập nhật nguyên liệu | KHO, QUAN_LY, QUAN_TRI_HE_THONG |

### Transactions (Giao dịch kho)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/inventory/transactions` | Lịch sử giao dịch | KHO, QUAN_LY, QUAN_TRI_HE_THONG |
| POST | `/api/inventory/transactions/import` | Nhập kho | KHO, QUAN_LY, QUAN_TRI_HE_THONG |
| POST | `/api/inventory/transactions/export` | Xuất kho | KHO, QUAN_LY, QUAN_TRI_HE_THONG |

### Dashboard

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/inventory/low-stock` | Nguyên liệu tồn kho thấp | KHO, QUAN_LY, QUAN_TRI_HE_THONG |
| GET | `/api/inventory/summary` | Tổng quan kho | KHO, QUAN_LY, QUAN_TRI_HE_THONG |

## 11. Frontend cần implement

### Pages

| Page | Path | Description |
|------|------|-------------|
| Inventory | `/inventory` | Danh sách nguyên liệu |
| Inventory Detail | `/inventory/:id` | Chi tiết + lịch sử |
| Transactions | `/inventory/transactions` | Lịch sử giao dịch |
| Low Stock | `/inventory/low-stock` | Cảnh báo tồn kho thấp |
| Stocktake | `/inventory/stocktake` | Kiểm kê kho |

### Components

| Component | Description |
|-----------|-------------|
| `InventoryList` | Danh sách nguyên liệu |
| `InventoryItemCard` | Card hiển thị (tên, tồn kho, trạng thái) |
| `TransactionForm` | Form nhập/xuất kho |
| `TransactionList` | Lịch sử giao dịch |
| `StocktakeForm` | Form kiểm kê |
| `LowStockAlert` | Danh sách tồn kho thấp |
| `StockChart` | Biểu đồ tồn kho |

## 12. Validation

### CreateIngredientDto

| Rule | Description |
|------|-------------|
| ingredientCode | Required, String, maxLength 50 |
| name | Required, String, maxLength 200 |
| unit | Required, String, maxLength 50 |
| currentStock | Optional, Number, min 0 |
| minStock | Optional, Number, min 0 |
| note | Optional, String |

### UpdateIngredientDto

| Rule | Description |
|------|-------------|
| name | Optional, String, maxLength 200 |
| unit | Optional, String, maxLength 50 |
| minStock | Optional, Number, min 0 |
| note | Optional, String |
| status | Optional, enum: CON_HANG, SAP_HET, HET_HANG, NGUNG_SU_DUNG |

### CreateSupplierDto

| Rule | Description |
|------|-------------|
| supplierCode | Required, String, maxLength 50 |
| name | Required, String, maxLength 200 |
| phone | Optional, String, maxLength 20 |
| email | Optional, Email, maxLength 100 |
| address | Optional, String, maxLength 500 |
| note | Optional, String |

### UpdateSupplierDto

| Rule | Description |
|------|-------------|
| name | Optional, String, maxLength 200 |
| phone | Optional, String, maxLength 20 |
| email | Optional, Email, maxLength 100 |
| address | Optional, String, maxLength 500 |
| note | Optional, String |
| status | Optional, enum: DANG_HOP_TAC, NGUNG_HOP_TAC |

### CreateTransactionDto (Nhập kho)

| Rule | Description |
|------|-------------|
| ingredientId | Required, Number |
| supplierId | Optional, Number |
| type | Optional, enum: NHAP_KHO, XUAT_KHO, DIEU_CHINH |
| quantity | Required, Number, min 0.001 |
| unitPrice | Optional, Number, min 0 |
| note | Optional, String |

### ExportTransactionDto (Xuất kho)

| Rule | Description |
|------|-------------|
| ingredientId | Required, Number |
| quantity | Required, Number, min 0.001 |
| note | Optional, String |

## 13. Permission/RBAC

| Endpoint | QUAN_TRI_HE_THONG | QUAN_LY | KHO | PHUC_VU | BEP | THU_NGAN |
|----------|:---:|:---:|:---:|:---:|:---:|:---:|
| GET /api/inventory/suppliers | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /api/inventory/suppliers/:id | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| POST /api/inventory/suppliers | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| PATCH /api/inventory/suppliers/:id | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /api/inventory/ingredients | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /api/inventory/ingredients/:id | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| POST /api/inventory/ingredients | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| PATCH /api/inventory/ingredients/:id | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /api/inventory/transactions | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| POST /api/inventory/transactions/import | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| POST /api/inventory/transactions/export | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /api/inventory/low-stock | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /api/inventory/summary | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

## 14. Test case cần pass

### Unit Tests

| Test | Input | Expected |
|------|-------|----------|
| IN transaction | +50kg | Stock = 50 |
| OUT transaction | -30kg (stock=50) | Stock = 20 |
| OUT insufficient | -60kg (stock=50) | Error |
| Stocktake | Actual=45 | Stock = 45 |
| Low stock alert | stock=2, min=10 | Alert |

### Integration Tests

| Test | Steps | Expected |
|------|-------|----------|
| Full flow | Create item → IN → OUT → Stocktake | All pass |
| Low stock flow | Create item → OUT until low | Alert shown |

## 15. Verify commands

```bash
cd backend && npm run test -- --testPathPattern=inventory
cd frontend && npm run lint
cd backend && npx tsc --noEmit
cd frontend && npx tsc --noEmit
```

## 16. Bug checklist

- [ ] Xuất kho vượt tồn kho → lỗi 400
- [ ] Tồn kho sau NHAP_KHO đúng = cũ + quantity
- [ ] Tồn kho sau XUAT_KHO đúng = cũ - quantity
- [ ] Cảnh báo low stock khi current ≤ min
- [ ] Giao dịch không thể xóa
- [ ] Đơn vị đo nhất quán
- [ ] Transaction code tự động đúng format GD-YYYYMMDD-XXX
- [ ] Supplier code trùng → lỗi 400
- [ ] Ingredient code trùng → lỗi 400

## 17. Definition of Done

- [ ] Code implement đúng acceptance criteria
- [ ] CRUD hoạt động đúng
- [ ] Transaction logic đúng (stock update)
- [ ] Low stock alert hoạt động
- [ ] Unit test pass
- [ ] Integration test pass
- [ ] Không có regression
- [ ] Code review xong
- [ ] Commit message đúng format
- [ ] Documentation cập nhật
