# FEAT_04: Gọi món / Phục vụ

## 1. Mục tiêu

Xây dựng tính năng gọi món từ thực đơn, quản lý order theo bàn, theo dõi trạng thái order, và xác nhận món đã phục vụ.

## 2. Actor sử dụng

| Actor | Quyền hạn |
|-------|-----------|
| QUAN_TRI_HE_THONG | Xem tất cả orders, quản lý |
| QUAN_LY | Xem tất cả orders, hủy order |
| PHUC_VU | Tạo order, thêm/sửa/xoá món, xác nhận phục vụ, hủy order |
| BEP | Xem orders cần chế biến, accept, bắt đầu, hoàn thành món |
| THU_NGAN | Không có quyền trong feature này |
| KHO | Không có quyền trong feature này |

## 3. Phạm vi trong feature

- [ ] Tạo order mới cho bàn
- [ ] Thêm/sửa/xoá món trong order
- [ ] Theo dõi trạng thái order (DANG_CHO → CHO_CHE_BIEN → DANG_CHE_BIEN → HOAN_THANH → DA_PHUC_VU)
- [ ] Hủy order món
- [ ] Xem danh sách order theo bàn
- [ ] Phân quyền: PHUC_VU gọi món, BEP xem/chế biến, QUAN_LY xem tất cả

## 4. Ngoài phạm vi

- Thanh toán order (sprint 4 — FEAT_06)
- In hoá đơn
- Đặt bàn trước (sprint 5 — FEAT_07)
- Kitchen Display System chi tiết (FEAT_05 riêng)

## 5. Tài liệu nguồn liên quan

- `docs/nghiepvu/03-use-case-chi-tiet.md` — UC-04 Gọi món
- `docs/nghiepvu/04-quy-tac-nghiep-vu.md` — BR-ORD-xx
- `docs/nghiepvu/05-trang-thai-he-thong.md` — Order states
- `docs/nghiepvu/06-acceptance-criteria.md` — AC-ORD-xx
- `docs/nghiepvu/10-test-case-nghiep-vu.md` — TC-ORD-xx
- `docs/nghiepvu/09-user-stories-va-sprint-goi-y.md` — US-20..30

## 6. Quy tắc nghiệp vụ áp dụng

| Rule | Description |
|------|-------------|
| BR-ORD-01 | Order chỉ tạo được cho bàn có trạng thái CO_KHACH |
| BR-ORD-02 | Mỗi bàn chỉ có 1 order DANG_CHO/CHO_CHE_BIEN/DANG_CHE_BIEN tại 1 thời điểm |
| BR-ORD-03 | Số lượng món ≥ 1 |
| BR-ORD-04 | Giá món = giá tại thời điểm gọi (không phải giá hiện tại) |
| BR-ORD-05 | Không thêm món NGUNG_BAN vào order |
| BR-ORD-06 | Tổng order = tổng (quantity * unit_price) tất cả items |
| BR-ORD-07 | Chỉ có thể huỷ món ở trạng thái DANG_CHO |
| BR-ORD-08 | Order DANG_CHO không thể chuyển sang DA_PHUC_VU trực tiếp |
| BR-ORD-09 | Khi tất cả items HOAN_THANH → order tự chuyển HOAN_THANH |
| BR-ORD-10 | Huỷ order → table_status về TRONG |

## 7. Trạng thái/enum liên quan

| Status | Mô tả | Actor chuyển |
|--------|-------|-------------|
| DANG_CHO | Chờ xác nhận | PHUC_VU tạo |
| CHO_CHE_BIEN | Chờ chế biến | BEP accept |
| DANG_CHE_BIEN | Đang chế biến | BEP bắt đầu |
| HOAN_THANH | Hoàn thành | BEP hoàn thành |
| DA_PHUC_VU | Đã phục vụ | PHUC_VU xác nhận |
| DA_HUY | Đã hủy | PHUC_VU/QUAN_LY hủy |

## 8. Database cần dùng

### Table: `orders`

```sql
id              INT PRIMARY KEY AUTO_INCREMENT
table_id        INT NOT NULL FOREIGN KEY → tables(id)
staff_id        INT NOT NULL FOREIGN KEY → staff(id)
status          ENUM('DANG_CHO','CHO_CHE_BIEN','DANG_CHE_BIEN','HOAN_THANH','DA_PHUC_VU','DA_HUY') DEFAULT 'DANG_CHO'
notes           TEXT
created_at      DATETIME(3)
updated_at      DATETIME(3)
```

### Table: `order_items`

```sql
id              INT PRIMARY KEY AUTO_INCREMENT
order_id        INT NOT NULL FOREIGN KEY → orders(id)
menu_item_id    INT NOT NULL FOREIGN KEY → menu_items(id)
quantity        INT NOT NULL DEFAULT 1
unit_price      DECIMAL(12,2) NOT NULL
subtotal        DECIMAL(12,2) NOT NULL
status          ENUM('DANG_CHO','CHO_CHE_BIEN','DANG_CHE_BIEN','HOAN_THANH','DA_PHUC_VU','DA_HUY') DEFAULT 'DANG_CHO'
notes           TEXT
created_at      DATETIME(3)
updated_at      DATETIME(3)
```

### Entity Relationships

```
orders (1) ──── (N) order_items
orders (N) ──── (1) tables
orders (N) ──── (1) staff
order_items (N) ──── (1) menu_items
```

## 9. Backend cần implement

### Module Structure

```
backend/src/modules/
  orders/
    order.module.ts
    order.controller.ts
    order.service.ts
    order.entity.ts
    dto/
      create-order.dto.ts
      add-order-item.dto.ts
      update-order-item.dto.ts
      update-order-status.dto.ts
  order-items/
    order-item.module.ts
    order-item.service.ts
    order-item.entity.ts
```

### Key Logic

```typescript
// Auto-complete order when all items are done
async updateItemStatus(orderId: number, itemId: number, status: string) {
  await this.orderItemRepo.update(itemId, { status });
  const order = await this.orderRepo.findOne({ where: { id: orderId }, relations: ['items'] });
  const allCompleted = order.items.every(item => item.status === 'HOAN_THANH');
  if (allCompleted) {
    await this.orderRepo.update(orderId, { status: 'HOAN_THANH' });
  }
}
```

## 10. API contract dự kiến

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders` | Tạo order mới cho bàn | PHUC_VU, QUAN_LY |
| GET | `/api/orders` | Danh sách orders (filter) | QUAN_TRI_HE_THONG, QUAN_LY, PHUC_VU, BEP |
| GET | `/api/orders/:id` | Chi tiết order + items | QUAN_TRI_HE_THONG, QUAN_LY, PHUC_VU, BEP |
| POST | `/api/orders/:id/items` | Thêm món vào order | PHUC_VU |
| PATCH | `/api/orders/:id/items/:itemId` | Sửa số lượng/ghi chú | PHUC_VU |
| DELETE | `/api/orders/:id/items/:itemId` | Xoá món khỏi order | PHUC_VU |
| PATCH | `/api/orders/:id/status` | Cập nhật trạng thái order | Theo role |
| PATCH | `/api/orders/:id/items/:itemId/status` | Cập nhật trạng thái món | BEP, PHUC_VU |
| POST | `/api/orders/:id/complete` | Hoàn thành order | PHUC_VU |
| POST | `/api/orders/:id/cancel` | Hủy order | PHUC_VU, QUAN_LY |

### Request/Response Format

```json
// POST /api/orders
{ "table_id": 1, "notes": "Khách yêu cầu ít cay" }
// Response 201
{
  "data": {
    "id": 1,
    "table": { "id": 1, "name": "Bàn 1" },
    "staff": { "id": 1, "full_name": "Nguyễn Văn A" },
    "status": "DANG_CHO",
    "items": [],
    "total": 0
  }
}
```

```json
// POST /api/orders/1/items
{ "menu_item_id": 5, "quantity": 2, "notes": "Ít cay" }
// Response 201
{
  "data": {
    "id": 10,
    "menu_item": { "id": 5, "name": "Phở Bò", "price": 65000 },
    "quantity": 2,
    "unit_price": 65000,
    "subtotal": 130000,
    "status": "DANG_CHO",
    "notes": "Ít cay"
  }
}
```

## 11. Frontend cần implement

### Pages

| Page | Path | Description |
|------|------|-------------|
| Order Taking | `/orders` | Danh sách order đang active |
| Order Detail | `/orders/:id` | Chi tiết order + items |
| Table Order | `/tables/:id/order` | Gọi món cho bàn cụ thể |

### Components

| Component | Description |
|-----------|-------------|
| `OrderList` | Danh sách orders đang active |
| `OrderCard` | Card hiển thị order (bàn, items, trạng thái) |
| `OrderDetail` | Chi tiết order + danh sách items |
| `OrderItemForm` | Form thêm/sửa món trong order |
| `MenuItemSelector` | Chọn món từ thực đơn để thêm |
| `StatusFlowButtons` | Nút chuyển trạng thái theo flow |

### UI Flow

```
Table Order Page (Bàn 1)
├── Order Header (Bàn 1, Trạng thái, Thời gian)
├── Order Items
│   ├── Phở Bò x2 (130k) - ĐANG_CHO - [Hủy]
│   ├── Bún Chả x1 (55k) - CHO_CHE_BIEN
│   └── Cơm Tấm x1 (50k) - DANG_CHE_BIEN
├── Add Item Button (+ Thêm món)
├── Order Total: 235,000đ
└── Action Buttons (Gửi bếp, Hủy order)
```

### Ant Design Components

- `Card` — Order display
- `List` — Order items list
- `Tag` — Status badge
- `Button` — Action buttons
- `Modal` — Add item modal
- `Badge` — Item count
- `Descriptions` — Order details

## 12. Validation

| Rule | Description |
|------|-------------|
| table_id | Required, must exist, status = CO_KHACH |
| menu_item_id | Required, must exist, status ≠ NGUNG_BAN |
| quantity | Required, min 1 |
| notes | Optional, maxLength 500 |
| status transitions | Chỉ cho phép theo state machine |

## 13. Permission/RBAC

| Endpoint | QUAN_TRI_HE_THONG | QUAN_LY | PHUC_VU | BEP | THU_NGAN | KHO |
|----------|:---:|:---:|:---:|:---:|:---:|:---:|
| POST /api/orders | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /api/orders | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| GET /api/orders/:id | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| POST /api/orders/:id/items | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| PATCH /api/orders/:id/items/:itemId | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| DELETE /api/orders/:id/items/:itemId | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| PATCH /api/orders/:id/status | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| PATCH /api/orders/:id/items/:itemId/status | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| POST /api/orders/:id/cancel | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

## 14. Test case cần pass

### Unit Tests

| Test | Input | Expected |
|------|-------|----------|
| Create order success | table_id with CO_KHACH | 201 + order |
| Create order invalid table | table_id with TRONG | 400 |
| Add item success | Valid menu_item_id | 201 + item |
| Add unavailable item | NGUNG_BAN item | 400 |
| Update item quantity | quantity = 3 | 200 + updated |
| Cancel order | DANG_CHO order | 200 |
| Auto-complete order | Last item → HOAN_THANH | Order → HOAN_THANH |

### Integration Tests

| Test | Steps | Expected |
|------|-------|----------|
| Full order flow | Create → Add items → BEP accept → Cook → Complete → Serve | All pass |
| Cancel flow | Create → Add items → Cancel | Order cancelled |
| Multiple items | Add 3 items → Update status individually | Correct auto-complete |

## 15. Verify commands

```bash
# Backend tests
cd backend && npm run test -- --testPathPattern=order

# Frontend lint
cd frontend && npm run lint

# Type check
cd backend && npx tsc --noEmit
cd frontend && npx tsc --noEmit
```

## 16. Bug checklist

- [ ] Order cho bàn TRONG →报错 400
- [ ] Thêm món NGUNG_BAN →报错 400
- [ ] Giá tại thời điểm gọi được lưu đúng (không phải giá hiện tại)
- [ ] Tổng order = tổng (quantity × unit_price)
- [ ] Khi tất cả items HOAN_THANH → order tự HOAN_THANH
- [ ] Huỷ order → table_status về TRONG
- [ ] Kitchen display có thể auto-refresh mỗi 5-10 giây

## 17. Definition of Done

- [ ] Code implement đúng acceptance criteria
- [ ] Migration tạo đúng schema
- [ ] Order flow hoạt động đúng (full cycle)
- [ ] Unit test pass
- [ ] Integration test pass
- [ ] Không có regression
- [ ] Code review xong
- [ ] Commit message đúng format
- [ ] Documentation cập nhật
