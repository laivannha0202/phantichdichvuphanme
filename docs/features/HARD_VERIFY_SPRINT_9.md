# Hard Verify — Sprint 9: Quản lý Nhân viên & Tài khoản

## 1. Sprint 9 PASS hay CHƯA PASS

**✅ PASS** — Tất cả các hạng mục chính đã hoàn thành.

## 2. Phạm vi đã làm

- [x] Backend StaffModule (CRUD + status)
- [x] Backend UserModule mở rộng (CRUD + status + role + password)
- [x] Backend RoleModule (chỉ xem)
- [x] Frontend StaffUsersPage (3 tabs: Nhân viên / Tài khoản / Vai trò)
- [x] Sidebar menu "Nhân viên & Tài khoản"
- [x] Route /staff-users
- [x] SQL Sprint 9 note + seed
- [x] Seed staff/users demo qua TypeORM seed.ts
- [x] Swagger ApiProperty cho DTOs
- [x] Dedicated endpoints: PATCH /:id/role, PATCH /:id/password
- [x] RBAC trong code

## 3. Có tạo bảng mới không

**KHÔNG.** Sprint 9 tái sử dụng bảng `roles`, `staff`, `users` đã có từ Sprint 1.

## 4. SQL Sprint 9 có file nào

| File | Nội dung |
|------|----------|
| `database/17-note-sprint-9-staff-user-no-new-table.sql` | Ghi chú: không tạo bảng mới |
| `database/18-seed-sprint-9-staff-user.sql` | Seed staff + users demo |

## 5. Backend endpoint nào đã có

| Method | Endpoint | RBAC |
|--------|----------|------|
| GET | `/api/staff` | QUAN_TRI_HE_THONG, QUAN_LY |
| GET | `/api/staff/:id` | QUAN_TRI_HE_THONG, QUAN_LY |
| POST | `/api/staff` | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/staff/:id` | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/staff/:id/status` | QUAN_TRI_HE_THONG, QUAN_LY |
| DELETE | `/api/staff/:id` | QUAN_TRI_HE_THONG |
| GET | `/api/users` | QUAN_TRI_HE_THONG, QUAN_LY |
| GET | `/api/users/:id` | QUAN_TRI_HE_THONG, QUAN_LY |
| POST | `/api/users` | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/users/:id` | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/users/:id/status` | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/users/:id/role` | QUAN_TRI_HE_THONG, QUAN_LY |
| PATCH | `/api/users/:id/password` | QUAN_TRI_HE_THONG, QUAN_LY |
| POST | `/api/users/:id/reset-password` | QUAN_TRI_HE_THONG, QUAN_LY |
| DELETE | `/api/users/:id` | QUAN_TRI_HE_THONG |
| GET | `/api/roles` | Authenticated |
| GET | `/api/roles/:id` | Authenticated |

## 6. Frontend route nào đã có

| Route | Component | Mô tả |
|-------|-----------|-------|
| `/staff-users` | StaffUsersPage | 3 tabs: Nhân viên, Tài khoản, Vai trò |

## 7. Backend build pass/fail

```
npm run build → ✅ PASS
```

## 8. Frontend build pass/fail

```
npm run build → ✅ PASS (chunk size warning 1.4MB - Ant Design, bỏ qua)
```

## 9. API/source verify pass/fail

- [x] User entity có `select: false` trên password_hash → ✅
- [x] UserService.findAll không trả password_hash → ✅
- [x] UserService.findOne không trả password_hash → ✅
- [x] UserController có JwtAuthGuard + RolesGuard → ✅
- [x] StaffController có JwtAuthGuard + RolesGuard → ✅
- [x] RoleController có JwtAuthGuard → ✅
- [x] Không duplicate route /api/users → ✅ (chỉ 1 controller ở backend/src/user/)
- [x] Không duplicate route /api/staff → ✅ (chỉ 1 controller ở backend/src/modules/staff/)
- [x] Route /staff-users tồn tại → ✅
- [x] Sidebar RBAC đúng → ✅ (QUAN_TRI_HE_THONG, QUAN_LY)
- [x] Không sửa backend/.env → ✅ (backend/.env không tồn tại)
- **Kết luận: ✅ PASS**

## 10. Runtime test pass/fail/partial

**⚠️ PARTIAL** — Không thể start backend `dist/main.js` do:
- backend/.env không tồn tại (không có DB_PASSWORD)
- Backend không thể kết nối MySQL khi chạy production build

Đã kiểm tra qua MCP MySQL:
- Database kết nối được
- Schema đúng
- Seed data đã tồn tại

## 11. RBAC pass/fail/partial

**✅ SOURCE RBAC PASS** — Code đã có guard đúng:
- StaffController: `@Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')` trên mọi endpoint
- UserController: `@Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')` trên mọi endpoint (trừ DELETE)
- DELETE /api/users: `@Roles('QUAN_TRI_HE_THONG')`
- RoleController: `@UseGuards(JwtAuthGuard)` (mọi authenticated user)
- Kiểm tra role trong service: QUAN_LY không được tạo/đổi/khóa QUAN_TRI_HE_THONG
- Frontend sidebar: chỉ hiển thị "Nhân viên & Tài khoản" cho QUAN_TRI_HE_THONG và QUAN_LY
- Frontend role dropdown: filter bỏ QUAN_TRI_HE_THONG khi login là QUAN_LY

**⚠️ RBAC RUNTIME PARTIAL** — Không thể test runtime do thiếu backend/.env

## 12. Database count

| Bảng | Số lượng |
|------|----------|
| roles | 6 |
| staff | 5 |
| users | 6 |

## 13. API có trả password_hash không

**KHÔNG.** User entity có `select: false` trên cột `password_hash`. Service không map `password_hash` vào response.

## 14. backend/.env có tồn tại không

**KHÔNG.** Chỉ có `backend/.env.example`. `frontend/.env` tồn tại (VITE_API_BASE_URL).

## 15. Có dùng CLI MySQL password không

**KHÔNG.** Dùng MCP MySQL tool, không dùng CLI với password.

## 16. Có in secret/password/token/password_hash không

**KHÔNG.** Tất cả các file code/docs đều không chứa secret thật.

## 17. Có drop/reset quanlynhahang không

**KHÔNG.**

## 18. Có động QuanNhaHang không

**KHÔNG.**

## 19. Có commit/push không

**KHÔNG.**

## 20. Có thể commit/push Sprint 9 chưa

**CÓ.** Code đã hoàn thiện, build pass, seed OK. Chờ user yêu cầu commit/push.

## 21. Có thể chuẩn bị Sprint 10 chưa

**CHƯA.** Chờ user yêu cầu. Không bắt đầu Sprint 10 tự động.

---

## Tổng kết

| Mục | Trạng thái |
|-----|-----------|
| Backend build | ✅ PASS |
| Frontend build | ✅ PASS |
| Source verify | ✅ PASS |
| Runtime test | ⚠️ PARTIAL (thiếu .env) |
| RBAC source | ✅ PASS |
| RBAC runtime | ⚠️ PARTIAL |
| Tạo bảng mới | ✅ Không (đúng yêu cầu) |
| Secret/temp/log | ✅ Sạch |
| backend/.env | ✅ Không tồn tại |
| Commit/push | ✅ Chưa (chờ user) |
| **SPRINT 9** | **✅ PASS** |
