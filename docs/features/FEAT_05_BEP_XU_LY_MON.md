# FEAT_05: Bếp xử lý món

## 1. Mục tiêu

Xây dựng tính năng cho bếp nhận order, chế biến món, cập nhật trạng thái, và hiển thị order trên màn hình bếp (Kitchen Display System - KDS).

## 2. Actor sử dụng

| Actor | Quyền hạn |
|-------|-----------|
| QUAN_TRI_HE_THONG | Xem tất cả orders |
| QUAN_LY | Xem tất cả orders |
| BEP | Full access: accept, bắt đầu, hoàn thành, hủy món |
| PHUC_VU | Xem orders đã tạo (read-only trong kitchen) |
| THU_NGAN | Không có quyền trong feature này |
| KHO | Không có quyền trong feature này |

## 3. Phạm vi trong feature

- [ ] Xem danh sách order cần chế biến
- [ ] Accept order (DANG_CHO → CHO_CHE_BIEN)
- [ ] Bắt đầu chế biến (CHO_CHE_BIEN → DANG_CHE_BIEN)
- [ ] Hoàn thành món (DANG_CHE_BIEN → HOAN_THANH)
- [ ] Hủy món (với lý do)
- [ ] Ghi chú đặc biệt cho món (ít cay, không hành...)
- [ ] Auto-refresh danh sách order

## 4. Ngoài phạm vi

- In phiếu bếp (paper ticket)
- Quản lý thời gian chế biến (ETA)
- Tích hợp màn hình bếp vật lý
- Thông báo push realtime (WebSocket)

## 5. Tài liệu nguồn liên quan

- `docs/nghiepvu/03-use-case-chi-tiet.md` — UC-05 Bếp xử lý món
- `docs/nghiepvu/04-quy-tac-nghiep-vu.md` — BR-KIT-xx
- `docs/nghiepvu/05-trang-thai-he-thong.md` — Kitchen states
- `docs/nghiepvu/06-acceptance-criteria.md` — AC-KIT-xx
- `docs/nghiepvu/10-test-case-nghiep-vu.md` — TC-KIT-xx
- `docs/nghiepvu/09-user-stories-va-sprint-goi-y.md` — US-31..37

## 6. Quy tắc nghiệp vụ áp dụng

| Rule | Description |
|------|-------------|
| BR-KIT-01 | Chỉ BEP mới thấy orders cần chế biến |
| BR-KIT-02 | BEP accept order → CHO_CHE_BIEN |
| BR-KIT-03 | BEP có thể accept từng món hoặc cả order |
| BR-KIT-04 | Hủy món phải có lý do |
| BR-KIT-05 | Món đã hoàn thành không thể hủy |
| BR-KIT-06 | Khi tất cả items HOAN_THANH → order tự HOAN_THANH |
| BR-KIT-07 | Món bị hủy không tính vào tổng tiền |
| BR-KIT-08 | Ghi chú món được hiển thị rõ trên KDS |

## 7. Trạng thái/enum liên quan

```
CHO_CHE_BIEN → DANG_CHE_BIEN → HOAN_THANH
     ↓               ↓              ↓
   DA_HUY          DA_HUY         (hoàn thành)
```

## 8. Database cần dùng

Sử dụng chung với FEAT_04:
- Table `orders`: Status `CHO_CHE_BIEN`, `DANG_CHE_BIEN`, `HOAN_THANH`
- Table `order_items`: Status `CHO_CHE_BIEN`, `DANG_CHE_BIEN`, `HOAN_THANH`, `DA_HUY`

## 9. Backend cần implement

### Module Structure

```
backend/src/modules/
  kitchen/
    kitchen.module.ts
    kitchen.controller.ts
    kitchen.service.ts
    dto/
      cancel-item.dto.ts
```

### Key Logic

```typescript
async acceptOrder(orderId: number, staffId: number) {
  const order = await this.orderRepo.findOne({ where: { id: orderId } });
  if (order.status !== 'DANG_CHO') {
    throw new BadRequestException('Order không ở trạng thái DANG_CHO');
  }
  await this.orderRepo.update(orderId, { status: 'CHO_CHE_BIEN' });
  await this.orderItemRepo.update({ order_id: orderId }, { status: 'CHO_CHE_BIEN' });
}

async completeItem(orderId: number, itemId: number) {
  await this.orderItemRepo.update(itemId, { status: 'HOAN_THANH' });
  const items = await this.orderItemRepo.find({ where: { order_id: orderId } });
  const allCompleted = items.every(i => i.status === 'HOAN_THANH' || i.status === 'DA_HUY');
  if (allCompleted) {
    await this.orderRepo.update(orderId, { status: 'HOAN_THANH' });
  }
}
```

## 10. API contract dự kiến

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/kitchen/orders` | Danh sách order cần chế biến | BEP |
| GET | `/api/kitchen/orders/:id` | Chi tiết order | BEP |
| PATCH | `/api/kitchen/orders/:id/accept` | Accept order | BEP |
| PATCH | `/api/kitchen/orders/:id/start` | Bắt đầu chế biến | BEP |
| PATCH | `/api/kitchen/orders/:id/items/:itemId/start` | Bắt đầu món | BEP |
| PATCH | `/api/kitchen/orders/:id/items/:itemId/complete` | Hoàn thành món | BEP |
| PATCH | `/api/kitchen/orders/:id/items/:itemId/cancel` | Hủy món | BEP |
| GET | `/api/kitchen/stats` | Thống kê orders đang xử lý | BEP |

### Request/Response Format

```json
// GET /api/kitchen/orders
{
  "data": [
    {
      "id": 1,
      "table": { "id": 1, "name": "Bàn 1" },
      "status": "CHO_CHE_BIEN",
      "items": [
        {
          "id": 1,
          "menu_item": { "name": "Phở Bò" },
          "quantity": 2,
          "status": "CHO_CHE_BIEN",
          "notes": "Ít cay"
        }
      ],
      "created_at": "2025-01-15T10:30:00.000Z",
      "elapsed_minutes": 5
    }
  ]
}
```

## 11. Frontend cần implement

### Pages

| Page | Path | Description |
|------|------|-------------|
| Kitchen Display | `/kitchen` | Màn hình chính cho bếp |
| Kitchen Stats | `/kitchen/stats` | Thống kê orders |

### Components

| Component | Description |
|-----------|-------------|
| `KitchenDisplay` | Grid hiển thị orders theo trạng thái |
| `KitchenOrderCard` | Card order trên màn hình bếp |
| `KitchenItemCard` | Card món trong order |
| `StatusButtons` | Nút chuyển trạng thái |
| `CancelModal` | Modal hủy món với lý do |
| `ElapsedTimer` | Đếm thời gian chờ |

### UI Flow

```
Kitchen Display
├── Column: CHỜ ACCEPT (Yellow)
│   ├── KitchenOrderCard (Bàn 1 - 3 món - 5 phút)
│   │   ├── Phở Bò x2 - Ít cay [Accept] [Hủy]
│   │   └── Bún Chả x1 [Accept] [Hủy]
├── Column: ĐANG CHẾ BIẾN (Blue)
│   ├── KitchenOrderCard (Bàn 2 - 2 món)
│   │   ├── Cơm Tấm x2 [Hoàn thành]
│   │   └── Canh Chua x1 [Hoàn thành]
└── Column: HOÀN THÀNH (Green)
    └── ...
```

### Ant Design Components

- `Card` — Order/item cards
- `Tag` — Status badges
- `Button` — Action buttons
- `Modal` — Cancel confirmation
- `Input.TextArea` — Cancel reason
- `Badge` — Order count per status
- `Row/Col` — Grid layout

## 12. Validation

| Rule | Description |
|------|-------------|
| order_id | Required, must exist, status phải cho phép |
| item_id | Required, must belong to order |
| cancel_reason | Required when cancel, maxLength 500 |
| Status transitions | Chỉ theo state machine |

## 13. Permission/RBAC

| Endpoint | QUAN_TRI_HE_THONG | QUAN_LY | BEP | PHUC_VU |
|----------|:---:|:---:|:---:|:---:|
| GET /api/kitchen/orders | ✅ | ✅ | ✅ | ❌ |
| GET /api/kitchen/orders/:id | ✅ | ✅ | ✅ | ❌ |
| PATCH /api/kitchen/orders/:id/accept | ❌ | ❌ | ✅ | ❌ |
| PATCH /api/kitchen/orders/:id/start | ❌ | ❌ | ✅ | ❌ |
| PATCH /api/kitchen/orders/:id/items/:itemId/complete | ❌ | ❌ | ✅ | ❌ |
| PATCH /api/kitchen/orders/:id/items/:itemId/cancel | ❌ | ❌ | ✅ | ❌ |
| GET /api/kitchen/stats | ❌ | ❌ | ✅ | ❌ |

## 14. Test case cần pass

### Unit Tests

| Test | Input | Expected |
|------|-------|----------|
| Accept order | DANG_CHO order | CHO_CHE_BIEN |
| Accept invalid order | HOAN_THANH order | 400 |
| Start item | CHO_CHE_BIEN item | DANG_CHE_BIEN |
| Complete item | DANG_CHE_BIEN item | HOAN_THANH |
| Complete all items | Last item complete | Order → HOAN_THANH |
| Cancel item | CHO_CHE_BIEN item + reason | DA_HUY |
| Cancel completed item | HOAN_THANH item | 400 |

### Integration Tests

| Test | Steps | Expected |
|------|-------|----------|
| Full kitchen flow | Create order → Accept → Start → Complete | All steps pass |
| Cancel flow | Create → Accept → Cancel item with reason | Item cancelled |
| Auto-complete | Complete all items | Order auto-completed |

## 15. Verify commands

```bash
cd backend && npm run test -- --testPathPattern=kitchen
cd frontend && npm run lint
cd backend && npx tsc --noEmit
cd frontend && npx tsc --noEmit
```

## 16. Bug checklist

- [ ] Accept order không phải DANG_CHO →报错 400
- [ ] Hủy món đã hoàn thành →报错 400
- [ ] Hủy món không có lý do →报错 400
- [ ] Khi tất cả items HOAN_THANH → order tự HOAN_THANH
- [ ] Ghi chú món hiển thị rõ trên KDS
- [ ] Thời gian chờ hiển thị đúng
- [ ] Auto-refresh 5 giây hoạt động

## 17. Definition of Done

- [ ] Code implement đúng acceptance criteria
- [ ] Kitchen flow hoạt động đúng (full cycle)
- [ ] Auto-refresh hoạt động đúng
- [ ] Unit test pass
- [ ] Integration test pass
- [ ] Không có regression
- [ ] Code review xong
- [ ] Commit message đúng format
- [ ] Documentation cập nhật
