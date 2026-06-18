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

- [ ] CRUD Nguyên liệu (Inventory Items)
- [ ] Nhập kho (Inventory Transactions - IN)
- [ ] Xuất kho (Inventory Transactions - OUT)
- [ ] Kiểm kê kho (Stocktake)
- [ ] Cảnh báo tồn kho thấp
- [ ] Xem lịch sử giao dịch kho

## 4. Ngoài phạm vi

- Tích hợp nhà cung cấp
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
| BR-INV-03 | Kiểm kê → adjust tồn kho theo thực tế |
| BR-INV-04 | Cảnh báo khi current_stock ≤ min_stock |
| BR-INV-05 | Mỗi giao dịch phải có reference_no |
| BR-INV-06 | Giao dịch không thể xóa, chỉ tạo bù (reversal) |
| BR-INV-07 | Giá vốn = (giá cũ * SL cũ + giá mới * SL mới) / tổng |
| BR-INV-08 | Đơn vị đo phải nhất quán cho mỗi nguyên liệu |

## 7. Trạng thái/enum liên quan

| Transaction Type | Mô tả | Ảnh hưởng tồn kho |
|------------------|-------|-------------------|
| IN | Nhập kho | +quantity |
| OUT | Xuất kho | -quantity |
| ADJUST | Điều chỉnh | ±quantity |
| RETURN | Trả lại | +quantity |

## 8. Database cần dùng

### Table: `inventory_items`

```sql
id              INT PRIMARY KEY AUTO_INCREMENT
name            VARCHAR(200) NOT NULL
unit            VARCHAR(50) NOT NULL
current_stock   DECIMAL(12,3) DEFAULT 0
min_stock       DECIMAL(12,3) DEFAULT 0
max_stock       DECIMAL(12,3) DEFAULT 0
cost_price      DECIMAL(12,2) DEFAULT 0
description     TEXT
is_active       BOOLEAN DEFAULT TRUE
created_at      DATETIME(3)
updated_at      DATETIME(3)
```

### Table: `inventory_transactions`

```sql
id              INT PRIMARY KEY AUTO_INCREMENT
item_id         INT NOT NULL FOREIGN KEY → inventory_items(id)
type            ENUM('IN','OUT','ADJUST','RETURN') NOT NULL
quantity        DECIMAL(12,3) NOT NULL
unit_cost       DECIMAL(12,2)
reference_no    VARCHAR(100)
notes           TEXT
created_by      INT NOT NULL FOREIGN KEY → staff(id)
created_at      DATETIME(3)
```

### Entity Relationships

```
inventory_items (1) ──── (N) inventory_transactions
inventory_transactions (N) ──── (1) staff
```

## 9. Backend cần implement

### Module Structure

```
backend/src/modules/
  inventory-items/
    inventory-item.module.ts
    inventory-item.controller.ts
    inventory-item.service.ts
    inventory-item.entity.ts
    dto/
      create-inventory-item.dto.ts
      update-inventory-item.dto.ts
  inventory-transactions/
    inventory-transaction.module.ts
    inventory-transaction.controller.ts
    inventory-transaction.service.ts
    inventory-transaction.entity.ts
    dto/
      create-transaction.dto.ts
      stocktake.dto.ts
```

### Key Logic

```typescript
async createTransaction(dto: CreateTransactionDto, staffId: number) {
  const item = await this.itemRepo.findOne({ where: { id: dto.item_id } });
  if (dto.type === 'OUT' && item.current_stock < dto.quantity) {
    throw new BadRequestException('Không đủ tồn kho');
  }
  let newStock = item.current_stock;
  if (dto.type === 'IN' || dto.type === 'RETURN') {
    newStock += dto.quantity;
  } else if (dto.type === 'OUT') {
    newStock -= dto.quantity;
  } else if (dto.type === 'ADJUST') {
    newStock = dto.quantity;
  }
  await this.itemRepo.update(item.id, { current_stock: newStock });
  const transaction = this.transactionRepo.create({
    ...dto, created_by: staffId,
    unit_cost: dto.unit_cost || item.cost_price
  });
  return this.transactionRepo.save(transaction);
}
```

## 10. API contract dự kiến

### Inventory Items

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/inventory-items` | Danh sách nguyên liệu | KHO, QUAN_LY |
| GET | `/api/inventory-items/:id` | Chi tiết nguyên liệu | KHO, QUAN_LY |
| POST | `/api/inventory-items` | Thêm nguyên liệu mới | KHO |
| PATCH | `/api/inventory-items/:id` | Sửa thông tin | KHO |
| GET | `/api/inventory-items/low-stock` | Nguyên liệu tồn kho thấp | KHO, QUAN_LY |

### Inventory Transactions

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/inventory-transactions` | Lịch sử giao dịch | KHO, QUAN_LY |
| POST | `/api/inventory-transactions` | Tạo giao dịch mới | KHO |
| POST | `/api/inventory-transactions/stocktake` | Kiểm kê kho | KHO |
| GET | `/api/inventory-transactions/summary` | Tổng quan kho | KHO, QUAN_LY |

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

| Rule | Description |
|------|-------------|
| name | Required, maxLength 200 |
| unit | Required, maxLength 50 |
| current_stock | Min 0 |
| min_stock | Min 0 |
| quantity (transaction) | Required, min 0.001 |
| type | Required, enum IN/OUT/ADJUST/RETURN |
| reference_no | Required, maxLength 100 |
| item_id | Required, must exist |

## 13. Permission/RBAC

| Endpoint | QUAN_TRI_HE_THONG | QUAN_LY | KHO | PHUC_VU | BEP | THU_NGAN |
|----------|:---:|:---:|:---:|:---:|:---:|:---:|
| GET /api/inventory-items | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /api/inventory-items/:id | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| POST /api/inventory-items | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| PATCH /api/inventory-items/:id | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| GET /api/inventory-items/low-stock | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /api/inventory-transactions | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| POST /api/inventory-transactions | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| POST /api/inventory-transactions/stocktake | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| GET /api/inventory-transactions/summary | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

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

- [ ] Xuất kho vượt tồn kho →报错 400
- [ ] Tồn kho sau IN đúng = cũ + quantity
- [ ] Tồn kho sau OUT đúng = cũ - quantity
- [ ] Stocktake adjust tồn kho đúng
- [ ] Cảnh báo low stock khi current ≤ min
- [ ] Giao dịch không thể xóa
- [ ] Đơn vị đo nhất quán

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
