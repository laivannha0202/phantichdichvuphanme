# Kế hoạch Implement Sprint 2 — Quản lý Nhà hàng

> ⚠️ **Tài liệu Kế hoạch Implement** — Dành cho Developer/AI Implement.
> Sprint 2 chỉ làm: **FEAT_02 (Khu vực & Bàn)** + **FEAT_03 (Thực đơn)**.

---

## 1. Phạm vi Sprint 2

### 1.1 CÓ làm

| Feature | Nội dung |
|---------|----------|
| FEAT_02 | Quản lý Khu vực (table_areas) & Bàn (tables) |
| FEAT_03 | Quản lý Thực đơn (menu_categories + menu_items) |

### 1.2 KHÔNG làm

| Feature | Lý do |
|---------|-------|
| Orders / Gọi món | Sprint 3 |
| Kitchen / Bếp | Sprint 4 |
| Payments / Thanh toán | Sprint 4/5 |
| Reservations / Đặt bàn | Sprint 5 |
| Reports / Báo cáo | Sprint 5 |
| Inventory / Kho | Sprint 6 |
| Upload ảnh thật | Optional/Future |
| QR code | Optional/Future |

---

## 2. Database — SQL-first (Bắt buộc)

> ⚠️ **Quy ước SQL-first:** Sprint 2 bắt buộc tạo SQL chính thức trước khi implement backend.
> File SQL là source chính, TypeORM migration phải khớp 100%.
> Chi tiết: `docs/thietke/06-quy-uoc-database-migration-sql.md`

### 2.0 File SQL bắt buộc tạo

| File | Nội dung |
|------|----------|
| `database/03-schema-sprint-2-table-menu.sql` | Tạo 4 bảng: table_areas, tables, menu_categories, menu_items |
| `database/04-seed-sprint-2-table-menu.sql` | Seed mẫu: khu vực, bàn, danh mục, món ăn |

**Quy tắc:**
- Chạy SQL xong phải tạo được 4 bảng + seed data.
- Backend API phải đọc được dữ liệu sau khi import SQL.
- TypeORM migration Sprint 2 phải khớp với `03-schema-sprint-2-table-menu.sql`.
- TypeORM seed Sprint 2 phải khớp với `04-seed-sprint-2-table-menu.sql`.
- Không gọi SQL là "tham khảo" — SQL là script chính thức.

### 2.1 Bảng cần tạo

```
Migration: CreateTableAreasTablesMenuCategoriesMenuItems1740000001000
```

| Bảng | Mô tả |
|------|-------|
| `table_areas` | Khu vực (tầng, phòng) |
| `tables` | Bàn trong từng khu vực |
| `menu_categories` | Danh mục món ăn |
| `menu_items` | Món ăn |

### 2.2 Schema

#### `table_areas`

```sql
CREATE TABLE table_areas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
);
```

#### `tables`

```sql
CREATE TABLE tables (
  id INT PRIMARY KEY AUTO_INCREMENT,
  table_area_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  capacity SMALLINT NOT NULL DEFAULT 4,
  status VARCHAR(50) DEFAULT 'TRONG',
  created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at DATETIME(3) NULL,
  FOREIGN KEY (table_area_id) REFERENCES table_areas(id) ON DELETE RESTRICT,
  INDEX idx_tables_table_area_id (table_area_id),
  INDEX idx_tables_status (status)
);
```

#### `menu_categories`

```sql
CREATE TABLE menu_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at DATETIME(3) NULL
);
```

#### `menu_items`

```sql
CREATE TABLE menu_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT NULL,
  price DECIMAL(12,2) NOT NULL,
  cost_price DECIMAL(12,2) NULL,
  image_url VARCHAR(500) NULL,
  status VARCHAR(50) DEFAULT 'DANG_BAN',
  created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at DATETIME(3) NULL,
  FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE RESTRICT,
  INDEX idx_menu_items_category_id (category_id),
  INDEX idx_menu_items_status (status)
);
```

### 2.3 Rollback

Migration phải có `down()` để rollback:
- Drop `menu_items` → `menu_categories` → `tables` → `table_areas`

---

## 3. Backend — Implement Sprint 2

### 3.1 Modules cần tạo

| Module | Entities | Path |
|--------|----------|------|
| `TableAreasModule` | `table_areas` | `src/modules/table-areas/` |
| `TablesModule` | `tables` | `src/modules/tables/` |
| `MenuCategoriesModule` | `menu_categories` | `src/modules/menu-categories/` |
| `MenuItemsModule` | `menu_items` | `src/modules/menu-items/` |

### 3.2 Cấu trúc mỗi module

```
src/modules/{module}/
  {module}.module.ts
  {module}.controller.ts
  {module}.service.ts
  {module}.entity.ts
  dto/
    create-{module}.dto.ts
    update-{module}.dto.ts
    update-{module}-status.dto.ts  (nếu có)
```

### 3.3 Entity files

| Entity | Table | File |
|--------|-------|------|
| `TableArea` | `table_areas` | `table-area.entity.ts` |
| `Table` | `tables` | `table.entity.ts` |
| `MenuCategory` | `menu_categories` | `menu-category.entity.ts` |
| `MenuItem` | `menu_items` | `menu-item.entity.ts` |

### 3.4 API Endpoints

#### Table Areas

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/table-areas` | Danh sách khu vực | QUAN_TRI_HE_THONG, QUAN_LY |
| GET | `/api/table-areas/:id` | Chi tiết khu vực | QUAN_TRI_HE_THONG, QUAN_LY |
| POST | `/api/table-areas` | Tạo khu vực | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/table-areas/:id` | Cập nhật khu vực | QUAN_TRI_HE_THONG, QUAN_LY |
| DELETE | `/api/table-areas/:id` | Xoá khu vực | QUAN_TRI_HE_THONG |

#### Tables

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tables` | Danh sách bàn (filter area/status) | QUAN_TRI_HE_THONG, QUAN_LY |
| GET | `/api/tables/:id` | Chi tiết bàn | QUAN_TRI_HE_THONG, QUAN_LY |
| POST | `/api/tables` | Tạo bàn | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/tables/:id` | Cập nhật bàn | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/tables/:id/status` | Cập nhật trạng thái bàn | QUAN_TRI_HE_THONG, QUAN_LY, PHUC_VU |
| DELETE | `/api/tables/:id` | Xoá bàn | QUAN_TRI_HE_THONG |

#### Menu Categories

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/menu-categories` | Danh sách danh mục | QUAN_TRI_HE_THONG, QUAN_LY |
| GET | `/api/menu-categories/:id` | Chi tiết danh mục + món | QUAN_TRI_HE_THONG, QUAN_LY |
| POST | `/api/menu-categories` | Tạo danh mục | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/menu-categories/:id` | Cập nhật danh mục | QUAN_TRI_HE_THONG, QUAN_LY |
| DELETE | `/api/menu-categories/:id` | Xoá danh mục | QUAN_TRI_HE_THONG |

#### Menu Items

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/menu-items` | Danh sách món (filter category/status) | QUAN_TRI_HE_THONG, QUAN_LY |
| GET | `/api/menu-items/:id` | Chi tiết món | QUAN_TRI_HE_THONG, QUAN_LY |
| POST | `/api/menu-items` | Tạo món | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/menu-items/:id` | Cập nhật món | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/menu-items/:id/status` | Cập nhật trạng thái món | QUAN_TRI_HE_THONG, QUAN_LY, BEP |
| DELETE | `/api/menu-items/:id` | Xoá món | QUAN_TRI_HE_THONG |

### 3.5 Swagger Setup

- Cài `@nestjs/swagger` nếu chưa có
- Setup SwaggerModule ở `main.ts`
- Swagger UI: `http://localhost:5011/api/docs`
- Mỗi controller có `@ApiTags`
- Mỗi endpoint có `@ApiOperation`
- DTO có `@ApiProperty`
- Auth endpoints có `@ApiBearerAuth`

### 3.6 Validation Rules

#### Table Area
- `name`: Required, maxLength 100, unique
- `sort_order`: Optional, integer, min 0

#### Table
- `name`: Required, maxLength 50
- `table_area_id`: Required, must exist in table_areas
- `capacity`: Required, min 1
- `status`: Must be in enum TRONG/DA_DAT/CO_KHACH/DANG_DON/BAO_TRI

#### Menu Category
- `name`: Required, maxLength 100, unique
- `sort_order`: Optional, integer, min 0

#### Menu Item
- `name`: Required, maxLength 200
- `category_id`: Required, must exist in menu_categories
- `price`: Required, min 0
- `cost_price`: Optional, min 0
- `image_url`: Optional, maxLength 500
- `description`: Optional
- `status`: Must be in enum DANG_BAN/HET_MON/NGUNG_BAN

---

## 4. Frontend — Implement Sprint 2

### 4.1 Pages

| Page | Path | Description |
|------|------|-------------|
| Quản lý khu vực | `/table-areas` | CRUD khu vực |
| Quản lý bàn | `/tables` | Grid/table view + CRUD bàn |
| Quản lý danh mục | `/menu/categories` | CRUD danh mục |
| Quản lý món ăn | `/menu/items` | CRUD món ăn |

### 4.2 Routes

```typescript
// AppRoutes.tsx
<Route path="/table-areas" element={<TableAreaPage />} />
<Route path="/tables" element={<TablePage />} />
<Route path="/menu/categories" element={<MenuCategoryPage />} />
<Route path="/menu/items" element={<MenuItemPage />} />
```

### 4.3 Components

| Component | Description |
|-----------|-------------|
| `TableAreaList` | Danh sách khu vực |
| `TableAreaForm` | Form tạo/sửa khu vực |
| `TableGrid` | Grid view hiển thị bàn theo khu vực |
| `TableCard` | Card hiển thị 1 bàn |
| `TableStatusBadge` | Badge màu trạng thái bàn |
| `TableForm` | Form tạo/sửa bàn |
| `MenuCategoryList` | Danh sách danh mục |
| `MenuCategoryForm` | Form tạo/sửa danh mục |
| `MenuItemList` | Danh sách món theo danh mục |
| `MenuItemCard` | Card hiển thị món |
| `MenuItemForm` | Form tạo/sửa món |
| `MenuItemImage` | Vùng ảnh + placeholder |

### 4.4 API Integration

- Dùng Axios instance có sẵn từ Sprint 1
- Tạo `api/table-areas.ts`, `api/tables.ts`, `api/menu-categories.ts`, `api/menu-items.ts`
- Dùng TanStack Query cho data fetching (nếu đã setup)

### 4.5 Ant Design Components

- `Table` — Danh sách khu vực, danh mục
- `Card` — Grid view bàn, món ăn
- `Modal` — Form tạo/sửa
- `Form` — Validation
- `Input`, `InputNumber`, `Select` — Form fields
- `Tag` — Status badge
- `Button` — Actions
- `Tabs` — Danh mục món (tab per category)
- `Popconfirm` — Delete confirm
- `message` — Notifications
- `Empty` — Empty state
- `Spin` — Loading state

---

## 5. Seed Data Sprint 2

### 5.1 Table Areas

| name | sort_order |
|------|------------|
| Tầng 1 | 1 |
| Tầng 2 | 2 |
| Sân vườn | 3 |

### 5.2 Tables

| name | area | capacity | status |
|------|------|----------|--------|
| Bàn 01 | Tầng 1 | 4 | TRONG |
| Bàn 02 | Tầng 1 | 4 | TRONG |
| Bàn 03 | Tầng 1 | 6 | CO_KHACH |
| Bàn 04 | Tầng 2 | 4 | TRONG |
| Bàn 05 | Tầng 2 | 8 | DA_DAT |
| Bàn Sân 01 | Sân vườn | 4 | TRONG |

### 5.3 Menu Categories

| name | sort_order |
|------|------------|
| Món chính | 1 |
| Món khai vị | 2 |
| Đồ uống | 3 |
| Tráng miệng | 4 |

### 5.4 Menu Items

| name | category | price | status |
|------|----------|-------|--------|
| Phở Bò | Món chính | 65000 | DANG_BAN |
| Bún Chả | Món chính | 55000 | DANG_BAN |
| Cơm Tấm | Món chính | 50000 | DANG_BAN |
| Gà Quay | Món chính | 85000 | HET_MON |
| Gỏi Cuốn | Món khai vị | 45000 | DANG_BAN |
| Chả Giò | Món khai vị | 40000 | DANG_BAN |
| Coca Cola | Đồ uống | 15000 | DANG_BAN |
| Trà Đá | Đồ uống | 10000 | DANG_BAN |
| Bánh Flan | Tráng miệng | 25000 | DANG_BAN |
| Chè | Tráng miệng | 20000 | NGUNG_BAN |

---

## 6. Thứ tự Implement

### 6.1 Backend (trước)

1. **Migration**: Tạo 4 bảng (table_areas, tables, menu_categories, menu_items)
2. **Entities**: Tạo 4 entity files
3. **DTOs**: Tạo DTOs cho từng module
4. **Services**: Implement business logic
5. **Controllers**: Implement API endpoints
6. **Guards**: Áp dụng AuthGuard + RolesGuard
7. **Swagger**: Setup + decorators
8. **Seed**: Chạy seed dữ liệu mẫu
9. **Test API**: Dùng curl/Postman test từng endpoint

### 6.2 Frontend (sau)

1. **API files**: Tạo API client cho từng module
2. **Pages**: Tạo 4 trang (table-areas, tables, menu/categories, menu/items)
3. **Components**: Tạo reusable components
4. **Routing**: Cập nhật AppRoutes
5. **Sidebar**: Thêm menu items mới
6. **Test UI**: Mở từng trang, test CRUD

---

## 7. Dependencies cần cài (nếu chưa có)

### Backend

| Package | Purpose |
|---------|---------|
| `@nestjs/swagger` | Swagger API docs |

### Frontend

| Package | Purpose |
|---------|---------|
| `@tanstack/react-query` | Data fetching & cache (nếu chưa setup) |

---

## 8. Checklist Sprint 2

### Backend

- [ ] Migration tạo đúng 4 bảng
- [ ] Entity mapping đúng schema
- [ ] DTO validation đầy đủ
- [ ] Service logic đúng business rules
- [ ] Controller có swagger decorators
- [ ] AuthGuard + RolesGuard hoạt động
- [ ] Seed data chạy đúng
- [ ] API test pass (curl/Postman)
- [ ] Swagger mở được tại `/api/docs`

### Frontend

- [ ] 4 trang CRUD hoạt động
- [ ] Form validate cả FE và BE
- [ ] Status badge đúng màu
- [ ] Grid view bàn hiển thị đúng
- [ ] Placeholder ảnh khi null
- [ ] Responsive trên mobile
- [ ] Sidebar hiển thị menu mới
- [ ] Không có regression từ Sprint 1

### Integration

- [ ] FE gọi API đúng endpoint
- [ ] FE handle error response đúng
- [ ] FE hiển thị loading/empty state
- [ ] RBAC đúng quyền theo role
