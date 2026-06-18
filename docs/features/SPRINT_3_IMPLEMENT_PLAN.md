# Sprint 3 Implement Plan — Gọi Món / Phục Vụ

## 1. Mục tiêu

Triển khai chức năng Gọi Món / Phục Vụ: tạo đơn, thêm/sửa/xóa món, cập nhật trạng thái đơn/món.

## 2. Phạm vi Sprint 3

### Làm

- [x] SQL schema + seed cho orders, order_items
- [x] TypeORM migration
- [x] Entity Order, OrderItem
- [x] Backend API orders + order items
- [x] Frontend UI gọi món

### Không làm

- Thanh toán/hóa đơn
- Kitchen screen
- Đặt bàn trước
- Báo cáo doanh thu
- Kho nguyên liệu
- QR nâng cao
- Multi-branch
- Upload ảnh thật

## 3. Database Schema

### orders

| Column | Type | Note |
|--------|------|------|
| id | INT AUTO_INCREMENT | PK |
| table_id | INT NOT NULL | FK → tables.id |
| order_code | VARCHAR(50) NOT NULL UNIQUE | Mã đơn |
| status | VARCHAR(50) NOT NULL DEFAULT 'DANG_CHUAN_BI' | Trạng thái |
| note | TEXT NULL | Ghi chú |
| created_by_user_id | INT NULL | FK → users.id |
| created_at | DATETIME(3) | DEFAULT CURRENT_TIMESTAMP(3) |
| updated_at | DATETIME(3) | ON UPDATE CURRENT_TIMESTAMP(3) |
| completed_at | DATETIME(3) NULL | Thời gian hoàn thành |
| cancelled_at | DATETIME(3) NULL | Thời gian hủy |
| deleted_at | DATETIME(3) NULL | Soft delete |

Trạng thái: DANG_CHUAN_BI, DANG_PHUC_VU, HOAN_THANH, DA_HUY

### order_items

| Column | Type | Note |
|--------|------|------|
| id | INT AUTO_INCREMENT | PK |
| order_id | INT NOT NULL | FK → orders.id |
| menu_item_id | INT NOT NULL | FK → menu_items.id |
| quantity | INT NOT NULL DEFAULT 1 | Số lượng |
| unit_price | DECIMAL(12,2) NOT NULL | Giá tại thời điểm gọi |
| note | TEXT NULL | Ghi chú |
| status | VARCHAR(50) NOT NULL DEFAULT 'CHO_CHE_BIEN' | Trạng thái |
| created_at | DATETIME(3) | DEFAULT CURRENT_TIMESTAMP(3) |
| updated_at | DATETIME(3) | ON UPDATE CURRENT_TIMESTAMP(3) |
| cancelled_at | DATETIME(3) NULL | Thời gian hủy |
| deleted_at | DATETIME(3) NULL | Soft delete |

Trạng thái: CHO_CHE_BIEN, DANG_CHE_BIEN, HOAN_THANH, DA_PHUC_VU, DA_HUY

## 4. API Endpoints

### Orders

| Method | Endpoint | RBAC | Mô tả |
|--------|----------|------|--------|
| GET | /api/orders | QUAN_TRI, QUAN_LY, PHUC_VU | Danh sách đơn |
| GET | /api/orders/open | QUAN_TRI, QUAN_LY, PHUC_VU | Đơn đang mở |
| GET | /api/orders/:id | QUAN_TRI, QUAN_LY, PHUC_VU | Chi tiết đơn |
| GET | /api/tables/:tableId/order | QUAN_TRI, QUAN_LY, PHUC_VU | Đơn theo bàn |
| POST | /api/orders | QUAN_TRI, QUAN_LY, PHUC_VU | Tạo đơn |
| PATCH | /api/orders/:id | QUAN_TRI, QUAN_LY, PHUC_VU | Sửa đơn |
| PATCH | /api/orders/:id/status | QUAN_TRI, QUAN_LY, PHUC_VU | Cập nhật trạng thái |
| DELETE | /api/orders/:id | QUAN_TRI, QUAN_LY | Hủy đơn |

### Order Items

| Method | Endpoint | RBAC | Mô tả |
|--------|----------|------|--------|
| POST | /api/orders/:orderId/items | QUAN_TRI, QUAN_LY, PHUC_VU | Thêm món |
| PATCH | /api/orders/:orderId/items/:itemId | QUAN_TRI, QUAN_LY, PHUC_VU | Sửa món |
| PATCH | /api/orders/:orderId/items/:itemId/status | QUAN_TRI, QUAN_LY, PHUC_VU | Cập nhật trạng thái món |
| DELETE | /api/orders/:orderId/items/:itemId | QUAN_TRI, QUAN_LY, PHUC_VU | Hủy món |

## 5. Business Rules

- Một bàn chỉ có tối đa 1 order đang mở
- Order đang mở: DANG_CHUAN_BI hoặc DANG_PHUC_VU
- Khi tạo order, bàn chuyển CO_KHACH
- Không thêm món NGUNG_BAN/HET_MON
- unit_price = price hiện tại menu_items
- Không sửa/xóa item nếu order HOAN_THANH/DA_HUY
- Khi order HOAN_THANH, bàn chuyển DANG_DON
- Chưa giải phóng bàn về TRONG trong Sprint 3

## 6. File Changes

### Backend

- `database/05-schema-sprint-3-order.sql`
- `database/06-seed-sprint-3-order.sql`
- `backend/src/database/migrations/<ts>-CreateOrdersOrderItems.ts`
- `backend/src/database/entities/order.entity.ts`
- `backend/src/database/entities/order-item.entity.ts`
- `backend/src/database/entities/index.ts` (update)
- `backend/src/modules/orders/` (module, controller, service, dto)
- `backend/src/app.module.ts` (update)

### Frontend

- `frontend/src/types/sprint3.types.ts`
- `frontend/src/api/orders.api.ts`
- `frontend/src/pages/OrdersPage.tsx`
- `frontend/src/pages/OrderDetailPage.tsx`
- `frontend/src/routes/AppRoutes.tsx` (update)
- `frontend/src/layouts/MainLayout.tsx` (update)

## 7. Verification

- Backend build pass
- Frontend build pass
- API test theo checklist
- SQL chạy từ đầu được
