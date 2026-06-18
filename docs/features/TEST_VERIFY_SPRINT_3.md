# Test & Verify Sprint 3 — Gọi Món / Phục Vụ

## 1. Build Verification

```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

## 2. SQL Verification

```bash
# Tạo database tạm
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS quanlynhahang_sql_verify_sprint3 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Chạy full SQL từ đầu
mysql -u root -p quanlynhahang_sql_verify_sprint3 < database/00-create-database.sql
mysql -u root -p quanlynhahang_sql_verify_sprint3 < database/01-schema-sprint-1-auth-role-user.sql
mysql -u root -p quanlynhahang_sql_verify_sprint3 < database/02-seed-sprint-1-auth-role-user.sql
mysql -u root -p quanlynhahang_sql_verify_sprint3 < database/03-schema-sprint-2-table-menu.sql
mysql -u root -p quanlynhahang_sql_verify_sprint3 < database/04-seed-sprint-2-table-menu.sql
mysql -u root -p quanlynhahang_sql_verify_sprint3 < database/05-schema-sprint-3-order.sql
mysql -u root -p quanlynhahang_sql_verify_sprint3 < database/06-seed-sprint-3-order.sql

# Verify
mysql -u root -p quanlynhahang_sql_verify_sprint3 -e "SELECT COUNT(*) FROM orders; SELECT COUNT(*) FROM order_items;"

# Cleanup
mysql -u root -p -e "DROP DATABASE IF EXISTS quanlynhahang_sql_verify_sprint3;"
```

## 3. Migration Verification

```bash
cd backend && npm run migration:run
```

## 4. API Test Checklist

### Sprint 1 Regression

- [ ] POST /api/auth/login → 200
- [ ] GET /api/users → 200
- [ ] GET /api/roles → 200

### Sprint 2 Regression

- [ ] GET /api/tables → 200
- [ ] GET /api/menu-items → 200
- [ ] GET /api/menu-categories → 200
- [ ] GET /api/table-areas → 200

### Sprint 3 New

- [ ] GET /api/orders → 200
- [ ] GET /api/orders/open → 200
- [ ] POST /api/orders (table_id=1) → 201
- [ ] GET /api/orders/:id → 200
- [ ] POST /api/orders/:id/items (menu_item_id=1) → 201
- [ ] PATCH /api/orders/:id/items/:itemId (quantity=3) → 200
- [ ] PATCH /api/orders/:id/items/:itemId/status → 200
- [ ] PATCH /api/orders/:id/status → 200
- [ ] GET /api/tables/:tableId/order → 200
- [ ] POST /api/orders cho bàn đang có order → 400
- [ ] POST thêm món NGUNG_BAN → 400
- [ ] POST thêm món HET_MON → 400
- [ ] PATCH order HOAN_THANH → bàn DANG_DON
- [ ] DELETE /api/orders/:id → 200

## 5. Frontend Route Check

- [ ] /orders → Hiển thị danh sách đơn
- [ ] /orders/:id → Hiển thị chi tiết đơn
- [ ] Sidebar "Đơn hàng" active

## 6. Database Check

```sql
SELECT COUNT(*) FROM orders;
SELECT COUNT(*) FROM order_items;
```
