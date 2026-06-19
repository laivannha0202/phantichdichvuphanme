# FEAT_03: Quản lý Thực đơn

## 1. Mục tiêu

Xây dựng tính năng quản lý thực đơn nhà hàng bao gồm danh mục món (menu categories) và món ăn (menu items), với CRUD đầy đủ, ảnh (`image_url` nullable), và trạng thái món.

## 2. Actor sử dụng

| Actor | Quyền hạn |
|-------|-----------|
| QUAN_TRI_HE_THONG | CRUD danh mục, CRUD món, phân quyền |
| QUAN_LY | CRUD danh mục, CRUD món, cập nhật trạng thái |
| BEP | Cập nhật trạng thái món (DANG_BAN → HET_MON) |
| PHUC_VU | Xem thực đơn (chỉ DANG_BAN + is_available) |

## 3. Phạm vi trong feature

- [ ] CRUD Danh mục món (Menu Categories)
- [ ] CRUD Món ăn (Menu Items)
- [ ] Quản lý trạng thái món (DANG_BAN, HET_MON, NGUNG_BAN)
- [ ] Sắp xếp món theo danh mục
- [ ] Phân quyền theo role

## 4. Ngoài phạm vi

- Gọi món từ thực đơn (sprint 3 — FEAT_04)
- Quản lý giá/đồng giá (giá trong menu item)
- Chương trình khuyến mãi

## 5. Tài liệu nguồn liên quan

- `docs/nghiepvu/03-use-case-chi-tiet.md` — UC-03 Quản lý thực đơn
- `docs/nghiepvu/04-quy-tac-nghiep-vu.md` — BR-MNU-xx
- `docs/nghiepvu/06-acceptance-criteria.md` — AC-MNU-xx
- `docs/nghiepvu/10-test-case-nghiep-vu.md` — TC-MNU-xx
- `docs/nghiepvu/09-user-stories-va-sprint-goi-y.md` — US-12..19
- `docs/thietke/02-thiet-ke-co-so-du-lieu.md` — Schema tables

## 6. Quy tắc nghiệp vụ áp dụng

| Rule | Description |
|------|-------------|
| BR-MNU-01 | Tên danh mục phải là duy nhất |
| BR-MNU-02 | Món phải thuộc một danh mục tồn tại |
| BR-MNU-03 | Giá món phải ≥ 0 |
| BR-MNU-04 | Không xoá danh mục nếu còn món thuộc danh mục đó |
| BR-MNU-05 | Tên món phải là duy nhất trong cùng danh mục |
| BR-MNU-06 | Mỗi danh mục hiển thị theo sort_order |
| BR-MNU-07 | is_available = false → món không hiển thị cho PHUC_VU |

## 7. Trạng thái/enum liên quan

| Status | Mô tả | Color Code |
|--------|-------|------------|
| DANG_BAN | Đang bán | Green |
| HET_MON | Hết món | Orange |
| NGUNG_BAN | Ngừng bán | Red |

## 8. Database cần dùng

### Table: `menu_categories`

```sql
id              INT PRIMARY KEY AUTO_INCREMENT
name            VARCHAR(100) NOT NULL
sort_order      INT DEFAULT 0
created_at      DATETIME(3)
updated_at      DATETIME(3)
deleted_at      DATETIME(3)
```

### Table: `menu_items`

```sql
id              INT PRIMARY KEY AUTO_INCREMENT
category_id     INT NOT NULL FOREIGN KEY → menu_categories(id)
name            VARCHAR(200) NOT NULL
description     TEXT
price           DECIMAL(12,2) NOT NULL
cost_price      DECIMAL(12,2)
image_url       VARCHAR(500)
status          ENUM('DANG_BAN','HET_MON','NGUNG_BAN') DEFAULT 'DANG_BAN'
created_at      DATETIME(3)
updated_at      DATETIME(3)
deleted_at      DATETIME(3)
```

### Entity Relationships

```
menu_categories (1) ──── (N) menu_items
```

## 9. Backend cần implement

### Module Structure

```
backend/src/modules/
  menu-categories/
    menu-category.module.ts
    menu-category.controller.ts
    menu-category.service.ts
    menu-category.entity.ts
    dto/
      create-menu-category.dto.ts
      update-menu-category.dto.ts
  menu-items/
    menu-item.module.ts
    menu-item.controller.ts
    menu-item.service.ts
    menu-item.entity.ts
    dto/
      create-menu-item.dto.ts
      update-menu-item.dto.ts
      update-menu-item-status.dto.ts
```

## 10. API contract dự kiến

### Menu Categories

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/menu-categories` | Danh sách danh mục | QUAN_TRI_HE_THONG, QUAN_LY |
| GET | `/api/menu-categories/:id` | Chi tiết danh mục + món | QUAN_TRI_HE_THONG, QUAN_LY |
| POST | `/api/menu-categories` | Tạo danh mục mới | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/menu-categories/:id` | Cập nhật danh mục | QUAN_TRI_HE_THONG, QUAN_LY |
| DELETE | `/api/menu-categories/:id` | Xoá danh mục | QUAN_TRI_HE_THONG |

### Menu Items

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/menu-items` | Danh sách món (filter) | QUAN_TRI_HE_THONG, QUAN_LY |
| GET | `/api/menu-items/:id` | Chi tiết món | QUAN_TRI_HE_THONG, QUAN_LY |
| POST | `/api/menu-items` | Tạo món mới | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/menu-items/:id` | Cập nhật món | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/menu-items/:id/status` | Cập nhật trạng thái món | QUAN_TRI_HE_THONG, QUAN_LY, BEP |
| DELETE | `/api/menu-items/:id` | Xoá món | QUAN_TRI_HE_THONG |
| POST | `/api/uploads/menu-items` | Upload ảnh món (multipart/form-data, field: `file`) | QUAN_TRI_HE_THONG, QUAN_LY | ✅ |

### Request/Response Format

```json
// GET /api/menu-items?category_id=1&status=DANG_BAN
{
  "data": [
    {
      "id": 1,
      "name": "Phở Bò",
      "description": "Phở bò truyền thống",
      "price": 65000,
      "image_url": "/uploads/menu/pho-bo.jpg",
      "status": "DANG_BAN",
      "category": {
        "id": 1,
        "name": "Món chính"
      }
    }
  ],
  "message": "Lấy danh sách món thành công",
  "statusCode": 200
}
```

```json
// POST /api/menu-items
{
  "name": "Bún Chả",
  "category_id": 1,
  "description": "Bún chả Hà Nội",
  "price": 55000,
  "status": "DANG_BAN"
}
```

## 11. Frontend cần implement

### Pages

| Page | Path | Description |
|------|------|-------------|
| Menu Management | `/menu` | CRUD thực đơn |
| Menu Categories | `/menu/categories` | Quản lý danh mục |
| Menu Items | `/menu/items` | Quản lý món ăn |

### Components

| Component | Description |
|-----------|-------------|
| `MenuCategoryList` | Danh sách danh mục |
| `MenuCategoryForm` | Form tạo/sửa danh mục |
| `MenuItemList` | Danh sách món theo danh mục |
| `MenuItemCard` | Card hiển thị món (tên, giá, trạng thái) |
| `MenuItemForm` | Form tạo/sửa món |
| `StatusToggle` | Toggle trạng thái món |

### UI Flow

```
Menu Page
├── Category Tabs (Món chính, Món tráng miệng, Đồ uống, ...)
│   ├── Tab: Món chính
│   │   ├── MenuItemCard (Phở Bò - 65k - DANG_BAN)
│   │   ├── MenuItemCard (Bún Chả - 55k - DANG_BAN)
│   │   └── MenuItemCard (Cơm Tấm - 50k - HET_MON)
│   └── Tab: Đồ uống
│       └── ...
├── Action Buttons (Thêm danh mục, Thêm món)
└── Filter (Tất cả, Đang bán, Hết món, Ngừng bán)
```

### Ant Design Components

- `Tabs` — Category tabs
- `Card` — Menu item display
- `Tag` — Status badge
- `Modal` — Create/edit forms
- `Form` — Input validation
- `InputNumber` — Price input
- `Select` — Category select

## 12. Validation

| Rule | Description |
|------|-------------|
| Tên danh mục | Required, maxLength 100, unique |
| Tên món | Required, maxLength 200 |
| Giá | Required, min 0 |
| Category ID | Required, must exist in menu_categories |
| Trạng thái | Phải nằm trong enum DANG_BAN/HET_MON/NGUNG_BAN |
| image_url | Nullable, maxLength 500 |

## 13. Permission/RBAC

| Endpoint | QUAN_TRI_HE_THONG | QUAN_LY | BEP | PHUC_VU | THU_NGAN | KHO |
|----------|:---:|:---:|:---:|:---:|:---:|:---:|
| GET /api/menu-categories | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| POST /api/menu-categories | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| PATCH /api/menu-categories/:id | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| DELETE /api/menu-categories/:id | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| GET /api/menu-items | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| POST /api/menu-items | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| PATCH /api/menu-items/:id/status | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| DELETE /api/menu-items/:id | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

## 14. Test case cần pass

### Unit Tests

| Test | Input | Expected |
|------|-------|----------|
| Create category success | Valid data | 201 + category |
| Create category duplicate name | Existing name | 409 |
| Create item success | Valid data | 201 + item |
| Create item invalid category | Non-existent category | 400 |
| Create item negative price | price = -1000 | 400 |
| Delete category with items | Has items | 400 |
| Update item status | DANG_BAN → HET_MON | 200 |

### Integration Tests

| Test | Steps | Expected |
|------|-------|----------|
| Full CRUD flow | Create category → Create item → Update → Delete | All pass |
| Status filter | Create items with different statuses, filter | Correct results |

## 15. Verify commands

```bash
# Backend tests
cd backend && npm run test -- --testPathPattern=menu-category
cd backend && npm run test -- --testPathPattern=menu-item

# Frontend lint
cd frontend && npm run lint

# Type check
cd backend && npx tsc --noEmit
cd frontend && npx tsc --noEmit
```

## 16. Bug checklist

- [ ] Tên danh mục trùng →报错 409
- [ ] Xoá danh mục còn món →报错 400
- [ ] Giá âm →报错 400
- [ ] is_available = false → PHUC_VU không thấy món
- [ ] Sort theo sort_order hoạt động đúng
- [ ] Placeholder image khi không có ảnh

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
