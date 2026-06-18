# TEST_VERIFY_SPRINT_8.md — Kế hoạch kiểm tra Sprint 8

## Tổng quan

Sprint 8: Quản lý Kho Nguyên liệu MVP

- **Thời gian:** 2026-06-18
- **Mục tiêu:** Verify Sprint 8 hoàn chỉnh
- **Phạm vi:** Theo yêu cầu user — Nhiệm vụ 8

---

## 1. Build Verification

### 1.1 Backend Build

```bash
cd backend && npm run build
```

**Expected:** Pass

### 1.2 Frontend Build

```bash
cd frontend && npm run build
```

**Expected:** Pass

---

## 2. Database Verification

### 2.1 MCP MySQL Count

Sử dụng MCP MySQL để kiểm tra:

```sql
SELECT COUNT(*) FROM suppliers;
SELECT COUNT(*) FROM ingredients;
SELECT COUNT(*) FROM inventory_transactions;
```

**Expected:**
- suppliers: ≥ 0
- ingredients: ≥ 0
- inventory_transactions: ≥ 0

### 2.2 Schema Verification

Kiểm tra cấu trúc bảng:

```sql
DESCRIBE suppliers;
DESCRIBE ingredients;
DESCRIBE inventory_transactions;
```

**Expected:**
- Khớp với `database/15-schema-sprint-8-inventory.sql`
- Có đầy đủ columns, FK, index

---

## 3. API Testing

### 3.1 Suppliers API

| Test | Method | Endpoint | Expected |
|------|--------|----------|----------|
| List suppliers | GET | /api/inventory/suppliers | 200 + array |
| Get supplier by id | GET | /api/inventory/suppliers/1 | 200 + object |
| Create supplier | POST | /api/inventory/suppliers | 201 + object |
| Update supplier | PATCH | /api/inventory/suppliers/1 | 200 + object |

### 3.2 Ingredients API

| Test | Method | Endpoint | Expected |
|------|--------|----------|----------|
| List ingredients | GET | /api/inventory/ingredients | 200 + array |
| Get ingredient by id | GET | /api/inventory/ingredients/1 | 200 + object |
| Create ingredient | POST | /api/inventory/ingredients | 201 + object |
| Update ingredient | PATCH | /api/inventory/ingredients/1 | 200 + object |

### 3.3 Transactions API

| Test | Method | Endpoint | Expected |
|------|--------|----------|----------|
| List transactions | GET | /api/inventory/transactions | 200 + array |
| Import stock | POST | /api/inventory/transactions/import | 201 + object |
| Export stock | POST | /api/inventory/transactions/export | 201 + object |

### 3.4 Dashboard API

| Test | Method | Endpoint | Expected |
|------|--------|----------|----------|
| Low stock | GET | /api/inventory/low-stock | 200 + array |
| Summary | GET | /api/inventory/summary | 200 + object |

---

## 4. Business Rules Testing

### 4.1 Import Stock

**Test:** Import 50 kg nguyên liệu ABC

**Steps:**
1. POST /api/inventory/ingredients (tạo nguyên liệu ABC, current_stock = 0)
2. POST /api/inventory/transactions/import (ingredient_id = ABC, quantity = 50)
3. GET /api/inventory/ingredients/ABC

**Expected:**
- current_stock = 50
- status = CON_HANG (nếu min_stock < 50)

### 4.2 Export Stock

**Test:** Export 30 kg nguyên liệu ABC

**Steps:**
1. POST /api/inventory/transactions/export (ingredient_id = ABC, quantity = 30)
2. GET /api/inventory/ingredients/ABC

**Expected:**
- current_stock = 20
- status = CON_HANG (nếu min_stock < 20)

### 4.3 Export Over Stock

**Test:** Export 100 kg nguyên liệu ABC (current_stock = 20)

**Steps:**
1. POST /api/inventory/transactions/export (ingredient_id = ABC, quantity = 100)

**Expected:**
- Error: "Số lượng xuất vượt quá tồn kho"

### 4.4 Auto Status

**Test:** Tự suy diễn status

**Steps:**
1. Tạo nguyên liệu DEF, min_stock = 10
2. Import 100 kg → current_stock = 100 → status = CON_HANG
3. Export 95 kg → current_stock = 5 → status = SAP_HET
4. Export 5 kg → current_stock = 0 → status = HET_HANG

**Expected:**
- CON_HANG → SAP_HET → HET_HANG

### 4.5 Low Stock Alert

**Test:** Cảnh báo tồn kho thấp

**Steps:**
1. GET /api/inventory/low-stock

**Expected:**
- List các nguyên liệu có current_stock <= min_stock

---

## 5. RBAC Testing

### 5.1 QUAN_TRI_HE_THONG

**Test:** Admin có toàn quyền

**Steps:**
1. Login với role QUAN_TRI_HE_THONG
2. Test tất cả endpoints

**Expected:** Tất cả 200/201

### 5.2 QUAN_LY

**Test:** Quản lý có quyền kho

**Steps:**
1. Login với role QUAN_LY
2. Test tất cả endpoints

**Expected:** Tất cả 200/201

### 5.3 KHO

**Test:** Nhân viên kho có quyền kho

**Steps:**
1. Login với role KHO
2. Test tất cả endpoints

**Expected:** Tất cả 200/201

### 5.4 THU_NGAN

**Test:** Thu ngân không có quyền kho

**Steps:**
1. Login với role THU_NGAN
2. Test tất cả endpoints

**Expected:** Tất cả 403

### 5.5 PHUC_VU

**Test:** Nhân viên phục vụ không có quyền kho

**Steps:**
1. Login với role PHUC_VU
2. Test tất cả endpoints

**Expected:** Tất cả 403

### 5.6 BEP

**Test:** Nhân viên bếp không có quyền kho

**Steps:**
1. Login với role BEP
2. Test tất cả endpoints

**Expected:** Tất cả 403

---

## 6. Frontend Testing

### 6.1 Route

**Test:** Route /inventory tồn tại

**Steps:**
1. Mở http://localhost:5173/inventory

**Expected:** Trang hiển thị

### 6.2 Sidebar

**Test:** Sidebar chỉ hiển thị Kho cho đúng role

**Steps:**
1. Login với QUAN_TRI_HE_THONG → Kiểm tra menu "Kho"
2. Login với QUAN_LY → Kiểm tra menu "Kho"
3. Login với KHO → Kiểm tra menu "Kho"
4. Login với THU_NGAN → Kiểm tra menu "Kho"

**Expected:**
- QUAN_TRI_HE_THONG: Có menu "Kho"
- QUAN_LY: Có menu "Kho"
- KHO: Có menu "Kho"
- THU_NGAN: Không có menu "Kho"

### 6.3 Tabs

**Test:** Trang /inventory có đủ tabs

**Expected:**
- Tab "Nguyên liệu"
- Tab "Nhà cung cấp"
- Tab "Nhập kho"
- Tab "Xuất kho"
- Tab "Cảnh báo sắp hết"

### 6.4 CRUD

**Test:** Tạo/sửa nguyên liệu

**Steps:**
1. Tạo nguyên liệu mới
2. Sửa thông tin nguyên liệu

**Expected:**
- Tạo thành công
- Sửa thành công

---

## 7. Safety Check

### 7.1 Secret Check

| Kiểm tra | Expected |
|----------|----------|
| Không tạo/sửa backend/.env | ✅ |
| Không dùng CLI MySQL password | ✅ |
| Không in secret/password/token | ✅ |

### 7.2 Database Safety

| Kiểm tra | Expected |
|----------|----------|
| Không drop/reset quanlynhahang | ✅ |
| Không động QuanNhaHang | ✅ |

### 7.3 Git Safety

| Kiểm tra | Expected |
|----------|----------|
| Không commit/push | ✅ |

---

## 8. Cleanup Check

### 8.1 Temp Files

| Kiểm tra | Expected |
|----------|----------|
| Không có *.log | ✅ |
| Không có *.tmp | ✅ |
| Không có *.bak | ✅ |
| Không có *.old | ✅ |
| Không có *.orig | ✅ |
| Không có debug* | ✅ |
| Không có test-output* | ✅ |

### 8.2 Source Files

| Kiểm tra | Expected |
|----------|----------|
| Không xóa source chính thức | ✅ |

---

## 9. Report Format

```markdown
# HARD_VERIFY_SPRINT_8.md

## Tổng quan
Sprint 8: Quản lý Kho Nguyên liệu MVP — PASS/CHƯA PASS

## 1. Backup
Đã tạo backup ở: ...

## 2. Database
- suppliers: X records
- ingredients: X records
- inventory_transactions: X records

## 3. SQL Files
- database/15-schema-sprint-8-inventory.sql
- database/16-seed-sprint-8-inventory.sql

## 4. Migration/Entity
- Khớp SQL: YES/NO

## 5. Backend API
- 12 endpoints: PASS/FAIL

## 6. Frontend
- Route /inventory: PASS/FAIL
- Sidebar: PASS/FAIL

## 7. Build
- Backend: PASS/FAIL
- Frontend: PASS/FAIL

## 8. API Test
- PASS/FAIL

## 9. Business Rules
- PASS/FAIL

## 10. RBAC
- PASS/FAIL

## 11. Safety
- Không tạo/sửa backend/.env: YES/NO
- Không dùng CLI MySQL password: YES/NO
- Không in secret: YES/NO
- Không drop/reset: YES/NO
- Không động QuanNhaHang: YES/NO
- Không commit/push: YES/NO

## 12. Kết luận
Sprint 8: PASS/CHƯA PASS
Có thể cleanup/đóng gói: YES/NO
```

---

## 10. Checklist

- [ ] Backend build pass
- [ ] Frontend build pass
- [ ] Database count verified
- [ ] API 12 endpoints test pass
- [ ] Business rules test pass
- [ ] RBAC test pass
- [ ] Frontend route /inventory exists
- [ ] Sidebar correct
- [ ] Tabs correct
- [ ] CRUD working
- [ ] Import working
- [ ] Export working
- [ ] Export over stock blocked
- [ ] Auto status working
- [ ] Low stock alert working
- [ ] No secret in output
- [ ] No backend/.env created
- [ ] No MySQL password used
- [ ] No drop/reset
- [ ] No QuanNhaHang touched
- [ ] No commit/push
- [ ] Cleanup temp files
- [ ] Report created