# Test & Verify Sprint 2 — Quản lý Nhà hàng

> ⚠️ **Tài liệu Test Plan** — Dành cho Developer/QA.
> Dùng để verify kết quả Sprint 2: Khu vực, Bàn, Thực đơn.

---

## 1. Verify Database (SQL-first)

> ⚠️ **Quy ước SQL-first:** Kiểm tra rằng file SQL chính thức chạy đúng trên MySQL 8.x.
> File SQL là source chính, TypeORM migration phải khớp.

### 1.0 Verify SQL chính thức

```bash
# Chạy SQL trên MySQL 8.x
mysql -u root -p < database/00-create-database.sql
mysql -u root -p < database/01-schema-sprint-1-auth-role-user.sql
mysql -u root -p < database/02-seed-sprint-1-auth-role-user.sql
mysql -u root -p < database/03-schema-sprint-2-table-menu.sql
mysql -u root -p < database/04-seed-sprint-2-table-menu.sql
```

**Expected:** Chạy thành công không lỗi. Tạo được database, 7 bảng, seed data.

### 1.1 Kiểm tra bảng tồn tại

```sql
SHOW TABLES FROM quanlynhahang;
```

**Expected:** Có các bảng: `table_areas`, `tables`, `menu_categories`, `menu_items`

### 1.2 Kiểm tra schema `table_areas`

```sql
DESCRIBE quanlynhahang.table_areas;
```

**Expected columns:** id, name, sort_order, created_at, updated_at

### 1.3 Kiểm tra schema `tables`

```sql
DESCRIBE quanlynhahang.tables;
```

**Expected columns:** id, table_area_id, name, capacity, status, created_at, updated_at, deleted_at

### 1.4 Kiểm tra schema `menu_categories`

```sql
DESCRIBE quanlynhahang.menu_categories;
```

**Expected columns:** id, name, sort_order, created_at, updated_at, deleted_at

### 1.5 Kiểm tra schema `menu_items`

```sql
DESCRIBE quanlynhahang.menu_items;
```

**Expected columns:** id, category_id, name, description, price, cost_price, image_url, status, created_at, updated_at, deleted_at

### 1.6 Kiểm tra foreign keys

```sql
SELECT
  TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'quanlynhahang'
  AND REFERENCED_TABLE_NAME IS NOT NULL;
```

**Expected:**
- `tables.table_area_id` → `table_areas.id`
- `menu_items.category_id` → `menu_categories.id`

### 1.7 Kiểm tra seed data

```sql
SELECT id, name, sort_order FROM quanlynhahang.table_areas ORDER BY sort_order;
SELECT id, table_area_id, name, capacity, status FROM quanlynhahang.tables;
SELECT id, name, sort_order FROM quanlynhahang.menu_categories ORDER BY sort_order;
SELECT id, category_id, name, price, status FROM quanlynhahang.menu_items;
```

---

## 2. Verify API

### 2.1 Table Areas

#### GET /api/table-areas

```bash
curl -s http://localhost:5011/api/table-areas \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** 200, array of table areas

#### POST /api/table-areas

```bash
curl -s -X POST http://localhost:5011/api/table-areas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "VIP Room", "sort_order": 10}'
```

**Expected:** 201, created area object

#### POST /api/table-areas (duplicate name)

```bash
curl -s -X POST http://localhost:5011/api/table-areas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "VIP Room"}'
```

**Expected:** 409 Conflict

#### PATCH /api/table-areas/:id

```bash
curl -s -X PATCH http://localhost:5011/api/table-areas/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Tầng 1 (Updated)"}'
```

**Expected:** 200, updated area

#### DELETE /api/table-areas/:id (with tables)

```bash
curl -s -X DELETE http://localhost:5011/api/table-areas/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** 400 (area still has tables)

#### DELETE /api/table-areas/:id (without tables)

```bash
# First delete all tables in area, then delete area
curl -s -X DELETE http://localhost:5011/api/table-areas/999 \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** 200

### 2.2 Tables

#### GET /api/tables

```bash
curl -s http://localhost:5011/api/tables \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** 200, array of tables

#### GET /api/tables?table_area_id=1

```bash
curl -s "http://localhost:5011/api/tables?table_area_id=1" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** 200, only tables in area 1

#### GET /api/tables?status=TRONG

```bash
curl -s "http://localhost:5011/api/tables?status=TRONG" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** 200, only tables with status TRONG

#### POST /api/tables

```bash
curl -s -X POST http://localhost:5011/api/tables \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Bàn VIP 1", "table_area_id": 1, "capacity": 8}'
```

**Expected:** 201, created table with status TRONG

#### POST /api/tables (invalid area)

```bash
curl -s -X POST http://localhost:5011/api/tables \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Bàn Test", "table_area_id": 9999, "capacity": 4}'
```

**Expected:** 400 (area not found)

#### PATCH /api/tables/:id/status (valid transition)

```bash
curl -s -X PATCH http://localhost:5011/api/tables/1/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "CO_KHACH"}'
```

**Expected:** 200

#### PATCH /api/tables/:id/status (invalid transition)

```bash
# Try: CO_KHACH → TRONG (must go through DANG_DON first)
curl -s -X PATCH http://localhost:5011/api/tables/1/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "TRONG"}'
```

**Expected:** 400 (invalid transition)

### 2.3 Menu Categories

#### GET /api/menu-categories

```bash
curl -s http://localhost:5011/api/menu-categories \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** 200, array of categories

#### POST /api/menu-categories

```bash
curl -s -X POST http://localhost:5011/api/menu-categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Món Đặc Biệt", "sort_order": 5}'
```

**Expected:** 201

#### DELETE /api/menu-categories/:id (with items)

```bash
curl -s -X DELETE http://localhost:5011/api/menu-categories/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** 400 (category still has items)

### 2.4 Menu Items

#### GET /api/menu-items

```bash
curl -s http://localhost:5011/api/menu-items \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** 200, array of items

#### GET /api/menu-items?category_id=1

```bash
curl -s "http://localhost:5011/api/menu-items?category_id=1" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** 200, only items in category 1

#### GET /api/menu-items?status=DANG_BAN

```bash
curl -s "http://localhost:5011/api/menu-items?status=DANG_BAN" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** 200, only items with status DANG_BAN

#### POST /api/menu-items

```bash
curl -s -X POST http://localhost:5011/api/menu-items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mì Quảng",
    "category_id": 1,
    "description": "Mì Quảng Đà Nẵng",
    "price": 60000,
    "status": "DANG_BAN"
  }'
```

**Expected:** 201

#### POST /api/menu-items (negative price)

```bash
curl -s -X POST http://localhost:5011/api/menu-items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "category_id": 1, "price": -1000}'
```

**Expected:** 400 (validation error)

#### PATCH /api/menu-items/:id/status

```bash
curl -s -X PATCH http://localhost:5011/api/menu-items/1/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "HET_MON"}'
```

**Expected:** 200

---

## 3. Verify Swagger

### 3.1 Mở Swagger UI

```
http://localhost:5011/api/docs
```

**Expected:** Swagger UI hiển thị

### 3.2 Kiểm tra Tags

**Expected:** Có tags: `Table Areas`, `Tables`, `Menu Categories`, `Menu Items`

### 3.3 Kiểm tra DTO Schema

- Mỗi endpoint có request/response schema
- DTO properties có example values
- Auth endpoints có Bearer token input

### 3.4 Kiểm tra Auth

- Click "Authorize" → Nhập Bearer token
- Test authenticated endpoints

---

## 4. Verify Frontend

### 4.1 Trang Quản lý Khu vực (`/table-areas`)

| Test | Expected |
|------|----------|
| Mở trang | Hiển thị danh sách khu vực |
| Thêm khu vực | Mở modal, nhập tên, lưu thành công |
| Sửa khu vực | Mở modal với data cũ, cập nhật thành công |
| Xoá khu vực (không có bàn) | Confirm → xoá thành công |
| Xoá khu vực (có bàn) | Báo lỗi "Còn bàn thuộc khu vực" |
| Tên trùng | Báo lỗi 409 |

### 4.2 Trang Quản lý Bàn (`/tables`)

| Test | Expected |
|------|----------|
| Mở trang | Hiển thị grid/table view bàn |
| Filter theo khu vực | Chỉ hiển thị bàn trong khu vực được chọn |
| Filter theo trạng thái | Chỉ hiển thị bàn có trạng thái được chọn |
| Thêm bàn | Mở modal, chọn khu vực, nhập tên/sức chứa, lưu |
| Sửa bàn | Mở modal, cập nhật thành công |
| Đổi trạng thái TRONG → CO_KHACH | Thành công, badge màu đúng |
| Đổi trạng thái CO_KHACH → TRONG | Báo lỗi (phải qua DANG_DON) |
| Xoá bàn | Confirm → xoá thành công |
| Responsive mobile | Grid 1 column |

### 4.3 Trang Quản lý Danh mục (`/menu/categories`)

| Test | Expected |
|------|----------|
| Mở trang | Hiển thị danh sách danh mục |
| Thêm danh mục | Mở modal, nhập tên, lưu thành công |
| Sửa danh mục | Mở modal, cập nhật thành công |
| Xoá danh mục (không có món) | Confirm → xoá thành công |
| Xoá danh mục (có món) | Báo lỗi "Còn món thuộc danh mục" |
| Tên trùng | Báo lỗi 409 |

### 4.4 Trang Quản lý Món ăn (`/menu/items`)

| Test | Expected |
|------|----------|
| Mở trang | Hiển thị danh sách món theo danh mục |
| Tab danh mục | Chuyển tab hiển thị đúng món |
| Thêm món | Mở modal, chọn danh mục, nhập tên/giá, lưu |
| Sửa món | Mở modal, cập nhật thành công |
| Đổi trạng thái DANG_BAN → HET_MON | Thành công |
| Giá âm | Báo lỗi validation |
| Ảnh null | Hiển thị placeholder "Chưa có ảnh" |
| Ảnh có URL | Hiển thị ảnh với object-fit cover |
| Xoá món | Confirm → xoá thành công |
| Responsive mobile | Card view thay vì table |

### 4.5 Sidebar

| Test | Expected |
|------|----------|
| QUAN_TRI_HE_THONG | Thấy menu: Khu vực, Bàn, Thực đơn |
| QUAN_LY | Thấy menu: Khu vực, Bàn, Thực đơn |
| PHUC_VU | Không thấy menu quản lý (chỉ xem) |
| BEP | Không thấy menu quản lý |

---

## 5. Verify RBAC

### 5.1 QUAN_TRI_HE_THONG

| Action | Expected |
|--------|----------|
| CRUD table areas | ✅ Thành công |
| CRUD tables | ✅ Thành công |
| CRUD menu categories | ✅ Thành công |
| CRUD menu items | ✅ Thành công |
| Delete table area | ✅ Thành công |
| Delete menu category | ✅ Thành công |
| Delete menu item | ✅ Thành công |

### 5.2 QUAN_LY

| Action | Expected |
|--------|----------|
| CRUD table areas | ✅ Thành công |
| CRUD tables | ✅ Thành công |
| CRUD menu categories | ✅ Thành công |
| CRUD menu items | ✅ Thành công |
| Delete table area | ❌ 403 Forbidden |
| Delete menu category | ❌ 403 Forbidden |
| Delete menu item | ❌ 403 Forbidden |
| Update table status | ✅ Thành công |
| Update menu item status | ✅ Thành công |

### 5.3 PHUC_VU

| Action | Expected |
|--------|----------|
| CRUD table areas | ❌ 403 Forbidden |
| CRUD tables | ❌ 403 Forbidden |
| Update table status | ✅ Thành công |
| CRUD menu categories | ❌ 403 Forbidden |
| CRUD menu items | ❌ 403 Forbidden |

### 5.4 BEP

| Action | Expected |
|--------|----------|
| CRUD anything | ❌ 403 Forbidden |
| Update menu item status | ✅ Thành công |

### 5.5 THU_NGAN / KHO

| Action | Expected |
|--------|----------|
| Any Sprint 2 action | ❌ 403 Forbidden |

---

## 6. Verify không có regression

### 6.1 Sprint 1 functionality

| Test | Expected |
|------|----------|
| Login | ✅ Vẫn hoạt động |
| Logout | ✅ Vẫn hoạt động |
| Refresh token | ✅ Vẫn hoạt động |
| Auth/me | ✅ Vẫn trả đúng user info |
| Roles | ✅ 6 roles vẫn đầy đủ |

### 6.2 Database

| Test | Expected |
|------|----------|
| Tables Sprint 1 | ✅ roles, users, staff không thay đổi |
| Tables Sprint 2 | ✅ Tạo đúng 4 bảng mới |
| Foreign keys | ✅ Đúng relationships |

---

## 7. Commands Verify nhanh

```bash
# 1. Kiểm tra database
mysql -u root -p -e "SHOW TABLES FROM quanlynhahang;"

# 2. Kiểm tra seed
mysql -u root -p -e "SELECT code, name FROM quanlynhahang.roles ORDER BY id;"
mysql -u root -p -e "SELECT id, name, sort_order FROM quanlynhahang.table_areas;"
mysql -u root -p -e "SELECT id, name, capacity, status FROM quanlynhahang.tables;"
mysql -u root -p -e "SELECT id, name FROM quanlynhahang.menu_categories;"
mysql -u root -p -e "SELECT id, name, price, status FROM quanlynhahang.menu_items;"

# 3. Test API
curl -s http://localhost:5011/api/health
curl -s http://localhost:5011/api/table-areas -H "Authorization: Bearer $TOKEN"
curl -s http://localhost:5011/api/tables -H "Authorization: Bearer $TOKEN"
curl -s http://localhost:5011/api/menu-categories -H "Authorization: Bearer $TOKEN"
curl -s http://localhost:5011/api/menu-items -H "Authorization: Bearer $TOKEN"

# 4. Test Swagger
curl -s http://localhost:5011/api/docs-json | head -20

# 5. Frontend
cd frontend && npm run lint
cd frontend && npx tsc --noEmit

# 6. Backend
cd backend && npm run lint
cd backend && npx tsc --noEmit
cd backend && npm run test
```

---

## 8. Bug Known Issues

Ghi lại các bug tìm thấy trong quá trình test:

| # | Description | Severity | Status |
|---|-------------|----------|--------|
| | | | |

---

## 9. Definition of Done

- [ ] Database có 4 bảng mới
- [ ] Seed data đúng
- [ ] API CRUD hoạt động cho cả 4 resources
- [ ] Filter/search hoạt động
- [ ] Status transitions đúng business rules
- [ ] Swagger đầy đủ
- [ ] Frontend 4 trang CRUD hoạt động
- [ ] Placeholder ảnh đúng
- [ ] RBAC đúng quyền
- [ ] Không có regression Sprint 1
- [ ] Lint pass (BE + FE)
- [ ] TypeCheck pass (BE + FE)
- [ ] Unit test pass (nếu có)
