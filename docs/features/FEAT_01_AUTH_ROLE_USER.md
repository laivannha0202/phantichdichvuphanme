# FEAT_01: Đăng nhập / Phân quyền / Quản lý Tài khoản Nhân viên

## 1. Mục tiêu

Xây dựng hệ thống xác thực (login/logout), phân quyền (RBAC), và quản lý tài khoản nhân viên cho Sprint 1.

**Trạng thái: ✅ HOÀN THÀNH** — Sprint 1 đã implement xong.

## 2. Actor sử dụng

| Actor | Thao tác |
|-------|----------|
| QUAN_TRI_HE_THONG | Toàn quyền (xem roles, xem users) |
| Tất cả các role | Login, logout, xem profile, refresh token |

## 3. Phạm vi trong feature

- [x] Module Auth: Login (JWT), Logout, Refresh Token (cookie), Get Profile
- [x] Seed Roles: 6 vai trò (QUAN_TRI_HE_THONG, QUAN_LY, PHUC_VU, THU_NGAN, BEP, KHO)
- [x] Seed Users: Admin demo (admin / Admin@123, bcrypt cost=12)
- [x] Auth Guards: JWT Guard + Role Guard
- [x] RBAC: Phân quyền theo module + action qua `@Roles()` decorator
- [x] Frontend: Login page, Protected routes
- [x] Environment: `.env` với cấu hình JWT

## 4. Ngoài phạm vi

- CRUD Roles (chỉ seed 6 roles có sẵn, không tạo/sửa/xoá)
- CRUD Users/Staff (sẽ làm ở Sprint 6 — FEAT_10)
- Quên mật khẩu / Reset password
- 2FA / MFA
- Profile update (cập nhật thông tin cá nhân)

## 5. Tài liệu nguồn liên quan

| File | Nội dung |
|------|----------|
| `docs/nghiepvu/03-use-case-chi-tiet.md` | UC-01 Đăng nhập |
| `docs/nghiepvu/04-quy-tac-nghiep-vu.md` | BR-AUTH-xx |
| `docs/nghiepvu/06-acceptance-criteria.md` | AC-AUTH-xx |
| `docs/nghiepvu/10-test-case-nghiep-vu.md` | TC-AUTH-xx |
| `docs/nghiepvu/09-user-stories-va-sprint-goi-y.md` | US-01..05 |
| `docs/thietke/05-ke-hoach-implement-sprint-1.md` | Chi tiết implement Sprint 1 |

## 6. Quy tắc nghiệp vụ áp dụng

| Rule | Mô tả | Trạng thái |
|------|-------|------------|
| BR-AUTH-01 | Password hash bằng bcrypt (cost = 12) | ✅ |
| BR-AUTH-02 | JWT access token hết hạn 30 phút | ✅ |
| BR-AUTH-03 | Refresh token hết hạn 7 ngày, lưu httpOnly cookie | ✅ |
| BR-AUTH-04 | Mỗi user chỉ thuộc 1 role | ✅ |
| BR-AUTH-05 | Role phải tồn tại trong hệ thống | ✅ |
| BR-AUTH-06 | User có status khác ACTIVE không thể login | ✅ |
| BR-AUTH-07 | password_hash không được trả về API response | ✅ |

## 7. Trạng thái/enum liên quan

### User Status

| Status | Mô tả |
|--------|-------|
| ACTIVE | Đang hoạt động |
| INACTIVE | Đã vô hiệu hóa |

### Roles (6 role chuẩn)

| Code | Tên |
|------|-----|
| QUAN_TRI_HE_THONG | Quản trị hệ thống |
| QUAN_LY | Quản lý nhà hàng |
| PHUC_VU | Nhân viên phục vụ |
| THU_NGAN | Thu ngân |
| BEP | Nhân viên bếp |
| KHO | Nhân viên kho |

## 8. Database cần dùng

### Table: `roles`

```sql
id              INT PRIMARY KEY AUTO_INCREMENT
code            VARCHAR(50) UNIQUE NOT NULL       -- QUAN_TRI_HE_THONG, QUAN_LY, ...
name            VARCHAR(100) NOT NULL              -- Quản trị hệ thống, Quản lý nhà hàng, ...
created_at      DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
```

**Migration:** `backend/src/database/migrations/1740000000000-CreateRolesUsersStaff.ts`
**Entity:** `backend/src/database/entities/role.entity.ts`

### Table: `users`

```sql
id              INT PRIMARY KEY AUTO_INCREMENT
username        VARCHAR(50) UNIQUE NOT NULL
password_hash   VARCHAR(255) NOT NULL              -- select: false (không trả về API)
role_id         INT NOT NULL → FK roles(id) ON DELETE RESTRICT
staff_id        INT NULL → FK staff(id) ON DELETE SET NULL
status          VARCHAR(50) DEFAULT 'ACTIVE'       -- ACTIVE / INACTIVE
created_at      DATETIME(3)
updated_at      DATETIME(3)
deleted_at      DATETIME(3) NULL                   -- Soft delete
```

**Index:** `idx_users_role_id`, `idx_users_staff_id`, `idx_users_status`

### Table: `staff`

```sql
id              INT PRIMARY KEY AUTO_INCREMENT
full_name       VARCHAR(100) NOT NULL
phone           VARCHAR(20) NULL
position        VARCHAR(50) NULL
status          VARCHAR(50) DEFAULT 'ACTIVE'       -- ACTIVE / INACTIVE
created_at      DATETIME(3)
updated_at      DATETIME(3)
deleted_at      DATETIME(3) NULL                   -- Soft delete
```

### Seed Data

```sql
-- Roles (6 rows)
INSERT INTO roles (code, name) VALUES
('QUAN_TRI_HE_THONG', 'Quản trị hệ thống'),
('QUAN_LY', 'Quản lý nhà hàng'),
('PHUC_VU', 'Nhân viên phục vụ'),
('THU_NGAN', 'Thu ngân'),
('BEP', 'Nhân viên bếp'),
('KHO', 'Nhân viên kho');

-- Admin user
INSERT INTO users (username, password_hash, role_id, staff_id, status)
VALUES ('admin', '<bcrypt hash Admin@123 cost=12>', 1, NULL, 'ACTIVE');
```

## 9. Backend cần implement

**Đã hoàn thành Sprint 1.** Cấu trúc hiện tại:

```
backend/src/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts      -- POST login, POST refresh, POST logout, GET me
│   ├── auth.service.ts         -- Business logic JWT + bcrypt
│   └── dto/
│       └── login.dto.ts        -- username, password
├── common/
│   ├── guards/
│   │   ├── jwt-auth.guard.ts   -- Verify JWT access token
│   │   ├── jwt-refresh.guard.ts -- Verify JWT refresh token
│   │   └── roles.guard.ts      -- Check user.roleCode ∈ requiredRoles
│   └── decorators/
│       ├── roles.decorator.ts  -- @Roles('QUAN_TRI_HE_THONG', ...)
│       ├── public.decorator.ts -- @Public() bypass auth
│       └── current-user.decorator.ts -- @CurrentUser('id')
├── role/
│   ├── role.controller.ts
│   ├── role.service.ts
│   └── role.module.ts
├── user/
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── user.module.ts
├── database/
│   ├── entities/
│   │   ├── role.entity.ts
│   │   ├── user.entity.ts
│   │   └── staff.entity.ts
│   ├── migrations/
│   │   └── 1740000000000-CreateRolesUsersStaff.ts
│   └── seeds/
│       └── seed.ts             -- 6 roles + admin user
```

## 10. API contract dự kiến

### Endpoints

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | `/api/auth/login` | Public | Đăng nhập |
| POST | `/api/auth/refresh` | Public (cookie refresh_token) | Làm mới token |
| POST | `/api/auth/logout` | Public | Đăng xuất (xoá cookie) |
| GET | `/api/auth/me` | Bearer JWT | Lấy thông tin user hiện tại |

### POST /api/auth/login

**Request:**
```json
{ "username": "admin", "password": "Admin@123" }
```

**Response 200:**
```json
{
  "data": {
    "accessToken": "eyJ...",
    "user": {
      "id": 1,
      "username": "admin",
      "role": { "code": "QUAN_TRI_HE_THONG", "name": "Quản trị hệ thống" }
    }
  },
  "message": "Đăng nhập thành công"
}
```

**Cookie set:** `refresh_token` (httpOnly, secure, sameSite: lax, path: /api/auth, maxAge: 7d)

**Lưu ý:**
- `password_hash` KHÔNG được trả về API (entity `select: false`)
- Refresh token trả về qua cookie httpOnly, KHÔNG nằm trong response body

### POST /api/auth/refresh

**Request:** Cookie `refresh_token` tự động gửi kèm.

**Response 200:**
```json
{
  "data": { "accessToken": "eyJ..." },
  "message": "Làm mới token thành công"
}
```

### POST /api/auth/logout

**Response 200:**
```json
{ "data": null, "message": "Đăng xuất thành công" }
```

### GET /api/auth/me

**Request Header:** `Authorization: Bearer <accessToken>`

**Response 200:**
```json
{
  "data": {
    "id": 1,
    "username": "admin",
    "role": { "code": "QUAN_TRI_HE_THONG", "name": "Quản trị hệ thống" },
    "staff": null
  },
  "message": "Thành công"
}
```

**Lưu ý:** Nếu user có `staff_id`, response sẽ include thông tin staff.

## 11. Frontend cần implement

**Đã hoàn thành Sprint 1.** Cấu trúc hiện tại:

```
frontend/src/
├── pages/Login/           -- Trang đăng nhập
├── components/
│   └── ProtectedRoute.tsx -- Wrapper route cần auth
├── stores/
│   └── authStore.ts       -- Zustand auth state
├── api/
│   └── axiosClient.ts     -- Axios interceptor attach token
```

## 12. Validation

### LoginDto

| Field | Rules |
|-------|-------|
| username | `@IsString()`, `@IsNotEmpty()` |
| password | `@IsString()`, `@IsNotEmpty()` |

## 13. Permission/RBAC

### RolesGuard

```typescript
@Roles('QUAN_TRI_HE_THONG')
@UseGuards(JwtAuthGuard, RolesGuard)
@Get('users')
findAll() { ... }
```

**Logic:** `requiredRoles.includes(user.roleCode)` — nếu user.roleCode nằm trong danh sách requiredRoles → cho phép.

### Bảo mật

- `password_hash` có `select: false` trong entity → không bao giờ trả về API
- JWT access token: 30 phút
- Refresh token: 7 ngày, httpOnly cookie, secure (production)
- Bcrypt cost = 12

## 14. Test case cần pass

### Unit Tests

| # | Test | Input | Expected |
|---|------|-------|----------|
| 1 | Login success | admin / Admin@123 | 200 + accessToken + user |
| 2 | Login wrong password | admin / wrong | 401 |
| 3 | Login non-existent user | nobody / pass | 401 |
| 4 | Login inactive account | inactive_user / pass | 401 |
| 5 | Refresh token valid | valid cookie | 200 + new accessToken |
| 6 | Refresh token expired | expired cookie | 401 |
| 7 | Get profile | Bearer valid token | 200 + user info |
| 8 | Get profile no token | No header | 401 |
| 9 | Logout | Cookie set | 200 + cookie cleared |

### Integration Tests

| # | Test | Steps | Expected |
|---|------|-------|----------|
| 1 | Full login flow | Login → Get profile → Logout | All 200 |
| 2 | RBAC enforcement | Login as PHUC_VU → access @Roles('QUAN_TRI_HE_THONG') | 403 |
| 3 | Token refresh | Wait → refresh → use new token | 200 |

## 15. Verify commands

```bash
# Kiểm tra seed roles
cd backend && npm run seed

# Kiểm tra login
curl -X POST http://localhost:5011/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'

# Kiểm tra profile
curl http://localhost:5011/api/auth/me \
  -H "Authorization: Bearer <token>"

# Kiểm tra RBAC (phải trả 403)
curl http://localhost:5011/api/users \
  -H "Authorization: Bearer <token_phuc_vu>"
```

## 16. Bug checklist

- [x] password_hash không trả về API
- [x] Admin demo login được (admin / Admin@123)
- [x] 6 roles seed đúng
- [x] JWT flow hoạt động (login → refresh → logout)
- [x] RolesGuard check roleCode đúng
- [x] Refresh token lưu trong httpOnly cookie
- [x] Soft delete users (deleted_at)

## 17. Definition of Done

- [x] Code implement đúng acceptance criteria
- [x] Migration tạo đúng schema (roles, users, staff)
- [x] Seed 6 roles + admin user hoạt động
- [x] Unit test pass
- [x] Integration test pass
- [x] Không có regression
- [x] Code review xong
- [x] Commit message đúng format
- [x] Documentation cập nhật
