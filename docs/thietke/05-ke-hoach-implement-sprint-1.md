# Kế hoạch Implement Sprint 1 — Auth, Role, User nền tảng

> ⚠️ **Tài liệu Thiết kế Kỹ thuật** — Dành cho Developer/Tech Lead.
> **Không phải tài liệu nghiệp vụ chính thức.** Không dùng cho khách hàng/PM/BA.
> Xem `docs/nghiepvu/` cho tài liệu nghiệp vụ.

---

## 1. Mục đích tài liệu

* File này dùng để hướng dẫn triển khai code Sprint 1 cho hệ thống quản lý nhà hàng.
* Sprint 1 tập trung nền tảng **Auth + Role + User** — xây dựng cơ chế xác thực, phân quyền theo vai trò, và tài khoản người dùng.
* Thứ tự triển khai: **Backend + Database trước**, test API bằng Postman/curl, sau đó mới làm **Frontend**.
* File này **không phải source code** và **không chứa code triển khai**. Đây là tài liệu kế hoạch ở mức kiến trúc và nghiệp vụ, đủ để nhóm phát triển implement mà không cần hỏi lại.
* Kế hoạch này kế thừa từ:
  * `docs/nghiepvu/08-pham-vi-mvp-va-backlog.md` — Phạm vi MVP, backlog BL-AUTH-01/02/04
  * `docs/nghiepvu/09-user-stories-va-sprint-goi-y.md` — US-AUTH-01, US-AUTH-02, US-AUTH-04
  * `docs/nghiepvu/12-quyet-dinh-gia-dinh-mvp.md` — Quyết định giả định auth
  * `docs/thietke/01-kien-truc-he-thong.md` — Kiến trúc 3 lớp, JWT strategy
  * `docs/thietke/02-thiet-ke-co-so-du-lieu.md` — Mô hình roles, users, staff
  * `docs/thietke/03-ke-hoach-setup-sprint-1.md` — Kế hoạch setup dự án
  * `docs/thietke/04-cong-nghe-be-fe.md` — Danh sách công nghệ chốt

---

## 2. Phạm vi Sprint 1

### 2.1 Trong phạm vi

| # | Chức năng | Ghi chú |
|---|-----------|---------|
| 1 | Setup backend NestJS | Khởi tạo project, cấu trúc module |
| 2 | Setup kết nối MySQL bằng TypeORM | Config database, migration |
| 3 | Tạo migration/entity cho 3 bảng | `roles`, `staff`, `users` |
| 4 | Seed 6 roles | QUAN_TRI_HE_THONG, QUAN_LY, PHUC_VU, THU_NGAN, BEP, KHO |
| 5 | Seed tài khoản QUAN_TRI_HE_THONG local/dev | Tài khoản admin mặc định để test |
| 6 | Làm login | API đăng nhập bằng username + password |
| 7 | Làm refresh token | Gia hạn access token qua httpOnly cookie |
| 8 | Làm logout | Clear refresh token cookie |
| 9 | Làm API lấy thông tin user hiện tại | GET /me — trả user + role, KHÔNG trả password_hash |
| 10 | Chuẩn bị RBAC theo role | Guard, decorator phân quyền cơ bản |
| 11 | Setup frontend React/Vite | Khởi tạo project sau khi backend chạy ổn |
| 12 | Tạo LoginPage | Form đăng nhập gọi API backend |
| 13 | Tạo AuthContext, ProtectedRoute | Quản lý trạng thái auth phía frontend |
| 14 | Tạo MainLayout cơ bản | Sidebar + Header + Content (sidebar rỗng) |
| 15 | Tạo README và .env.example | Hướng dẫn chạy dự án, mẫu biến môi trường |

### 2.2 Ngoài phạm vi

| # | Chức năng | Lý do loại |
|---|-----------|------------|
| 1 | CRUD bàn | Sprint 2 |
| 2 | CRUD thực đơn | Sprint 2 |
| 3 | Gọi món | Sprint 3 |
| 4 | Bếp | Sprint 4 |
| 5 | Thanh toán | Sprint 5 |
| 6 | Báo cáo | Sprint 6 |
| 7 | Kho | Sprint 6 |
| 8 | QR order | Để sau MVP |
| 9 | Voucher/tích điểm | Để sau MVP |
| 10 | Nhiều chi nhánh | Để sau MVP |
| 11 | Tách/gộp hóa đơn | Để sau MVP |
| 12 | Tạo toàn bộ 15 bảng MVP | Sprint 1 chỉ làm 3 bảng |
| 13 | Dùng PHP | Không dùng PHP |
| 14 | Dùng Adminer/phpMyAdmin | Dùng DBeaver/Workbench/CLI |

---

## 3. Thứ tự implement đề xuất

| Bước | Nội dung | Kết quả mong đợi |
|:----:|----------|-------------------|
| 1 | Chuẩn bị root project files | Có `.gitignore`, `README.md`, `.env.example` |
| 2 | Setup MySQL local | MySQL 8.x chạy trên host port `3307` (Docker map đến container `3306`), database `quanlynhahang`. MCP MySQL đã cấu hình sẵn trong OpenCode. |
| 3 | Setup backend NestJS | Project backend chạy được `npm run start:dev` trên port 5011 |
| 4 | Cấu hình env/config/database | Kết nối MySQL thành công qua TypeORM, có `.env.example` |
| 5 | Tạo entity/migration roles, staff, users | 3 bảng roles, staff, users tồn tại trong database |
| 6 | Seed roles và tài khoản admin dev | 6 roles + 1 tài khoản QUAN_TRI_HE_THONG (admin/Admin@123) |
| 7 | Implement AuthModule | Login, logout, refresh, me — tất cả API chạy được |
| 8 | Implement JWT access token và refresh token | Access token 15 phút, refresh token httpOnly cookie 7 ngày |
| 9 | Implement RBAC guard/decorator ở mức nền tảng | Guard kiểm tra role, decorator gắn role cho route |
| 10 | Test API backend | Login thành công, login sai bị từ chối, me trả user không có password |
| 11 | Setup frontend React/Vite | Project frontend chạy được trên port 5173 |
| 12 | Implement LoginPage | Form đăng nhập, gọi API login, hiển thị lỗi |
| 13 | Implement AuthContext/ProtectedRoute | Lưu access token trong memory, chặn truy cập chưa login |
| 14 | Test tích hợp FE-BE | Login từ frontend → vào MainLayout → logout → về LoginPage |

---

## 4. Backend implement plan

### 4.1 Thư mục backend dự kiến

```
backend/
├── src/
│   ├── main.ts                          # Entry point, bootstrap NestJS
│   ├── app.module.ts                    # Root module
│   ├── config/
│   │   ├── database.config.ts           # TypeORM config
│   │   ├── jwt.config.ts               # JWT config (secret, expiry)
│   │   └── app.config.ts               # Port, CORS, etc.
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts       # @Roles('QUAN_LY', ...)
│   │   │   └── current-user.decorator.ts # @CurrentUser() param decorator
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts        # Xác thực JWT
│   │   │   └── roles.guard.ts           # Kiểm tra role
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts # Format lỗi nhất quán
│   │   └── interceptors/
│   │       └── transform.interceptor.ts # Wrap response { data, message }
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts           # POST login, POST refresh, POST logout, GET me
│   │   ├── auth.service.ts              # Business logic auth
│   │   ├── dto/
│   │   │   └── login.dto.ts             # Validate username + password
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts          # Access token strategy
│   │   │   └── jwt-refresh.strategy.ts  # Refresh token strategy
│   │   └── interfaces/
│   │       └── jwt-payload.interface.ts  # { sub, username, role }
│   ├── roles/
│   │   ├── roles.module.ts
│   │   ├── role.entity.ts               # Entity roles
│   │   └── roles.service.ts             # Find role by code
│   ├── staff/
│   │   ├── staff.module.ts
│   │   └── staff.entity.ts              # Entity staff
│   └── users/
│       ├── users.module.ts
│       ├── user.entity.ts               # Entity users
│       └── users.service.ts             # FindByUsername, FindById
├── migrations/                           # TypeORM migration files
│   └── 1718200000000-CreateAuthTables.ts
├── seeds/                                # Seed scripts
│   └── seed-roles-and-admin.ts
├── test/                                 # Jest tests
├── .env.example                          # Mẫu biến môi trường
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
└── package.json
```

**Ghi chú:**

* Đây là kế hoạch implement, chưa tạo code ở bước này.
* Sprint 1 chỉ làm module cần cho auth/role/user.
* Các module tables, menu, orders, kitchen, payments, reports, inventory để Sprint 2+.

### 4.2 Backend modules Sprint 1

| Module | Trách nhiệm | Sprint 1 làm đến đâu |
|--------|-------------|----------------------|
| **AppModule** | Root module, inject ConfigModule, TypeOrmModule | Hoàn thiện — cấu hình tất cả module con |
| **ConfigModule** | Đọc biến môi trường từ `.env` | Hoàn thiện — dùng `@nestjs/config` với `isGlobal: true` |
| **Database/TypeORM** | Kết nối MySQL, chạy migration | Hoàn thiện — kết nối MySQL, dùng TypeORM migration để tạo schema |
| **AuthModule** | Login, logout, refresh token, xác thực | Hoàn thiện — 4 API logic: login, refresh, logout, me |
| **RolesModule** | Quản lý role entity, seed roles | Hoàn thiện — entity + seed 6 roles |
| **UsersModule** | Tìm user theo username/id | Hoàn thiện — findByUsername, findById |
| **StaffModule** | Entity staff, seed admin staff | Sprint 1 chỉ seed admin, CRUD staff để Sprint 6 |
| **CommonModule** | Guard, decorator, filter, interceptor | Hoàn thiện — JWT guard, Roles guard, HttpException filter |

### 4.3 Entity/database Sprint 1

#### Bảng `roles`

| Cột | Kiểu | Ràng buộc | Ghi chú |
|-----|------|-----------|---------|
| `id` | INT | PK, auto-increment | |
| `code` | VARCHAR(50) | UNIQUE, NOT NULL | Mã vai trò: QUAN_TRI_HE_THONG, QUAN_LY... |
| `name` | VARCHAR(100) | NOT NULL | Tên hiển thị: "Quản trị hệ thống"... |
| `created_at` | DATETIME(3) | DEFAULT NOW() | |

#### Bảng `staff`

| Cột | Kiểu | Ràng buộc | Ghi chú |
|-----|------|-----------|---------|
| `id` | INT | PK, auto-increment | |
| `full_name` | VARCHAR(100) | NOT NULL | Họ tên nhân viên |
| `phone` | VARCHAR(20) | | Số điện thoại |
| `position` | VARCHAR(50) | | Chức vụ |
| `status` | VARCHAR(50) | DEFAULT 'ACTIVE' | Trạng thái làm việc |
| `created_at` | DATETIME(3) | DEFAULT NOW() | |
| `updated_at` | DATETIME(3) | DEFAULT NOW(), onUpdate | |
| `deleted_at` | DATETIME(3) | NULLABLE | Soft delete |

#### Bảng `users`

| Cột | Kiểu | Ràng buộc | Ghi chú |
|-----|------|-----------|---------|
| `id` | INT | PK, auto-increment | |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL | Tên đăng nhập |
| `password_hash` | VARCHAR(255) | NOT NULL | bcrypt hash |
| `role_id` | INT | FK → roles.id, NOT NULL | Vai trò |
| `staff_id` | INT | FK → staff.id, NULLABLE | Hồ sơ nhân viên (có thể chưa có) |
| `status` | VARCHAR(50) | DEFAULT 'ACTIVE' | ACTIVE / INACTIVE / LOCKED |
| `created_at` | DATETIME(3) | DEFAULT NOW() | |
| `updated_at` | DATETIME(3) | DEFAULT NOW(), onUpdate | |
| `deleted_at` | DATETIME(3) | NULLABLE | Soft delete |

**Quy tắc quan trọng:**

* Không lưu password plain text — luôn hash bằng bcrypt (cost ≥ 10).
* Không trả `password_hash` ra response API (sử dụng `class-transformer` với `@Exclude()` hoặc excludePlainToClass).
* Một user có một role (1-N relationship).
* Một user có thể gắn staff hoặc chưa gắn (optional relationship).
* Sprint 1 chỉ seed admin dev — chưa CRUD staff chi tiết.

### 4.4 Role seed

6 roles mặc định theo tài liệu `02-thiet-ke-co-so-du-lieu.md`:

| code | name | Ghi chú |
|------|------|---------|
| `QUAN_TRI_HE_THONG` | Quản trị hệ thống | Quản lý tài khoản, cấu hình, audit log |
| `QUAN_LY` | Quản lý nhà hàng | Quản lý thực đơn, bàn, báo cáo |
| `PHUC_VU` | Nhân viên phục vụ | Gọi món, xem bàn, đặt bàn |
| `THU_NGAN` | Thu ngân | Thanh toán, hóa đơn |
| `BEP` | Nhân viên bếp | Xem món chế biến, cập nhật trạng thái |
| `KHO` | Nhân viên kho | Quản lý nguyên liệu, nhập/xuất |

**Seed tài khoản admin dev:**

| Field | Giá trị |
|-------|---------|
| username | `admin` |
| password | `Admin@123` (hash bằng bcrypt) |
| role_id | → QUAN_TRI_HE_THONG |
| staff_id | NULL (tài khoản quản trị chưa cần hồ sơ nhân viên) |
| status | `ACTIVE` |

> **Cảnh báo:** Đây là tài khoản mẫu cho local/dev, **không phải secret thật**, bắt buộc đổi mật khẩu khi triển khai thật. Không đưa thông tin này vào environment production.

### 4.5 Auth API tối thiểu cần có

| API logic | Mục đích | Auth required | Ghi chú |
|-----------|----------|:------------:|---------|
| **POST /auth/login** | Đăng nhập bằng username + password | Không | Trả access token + set refresh token trong httpOnly cookie |
| **POST /auth/refresh** | Làm mới access token | Cookie refresh token | Kiểm tra refresh token hợp lệ, trả access token mới |
| **POST /auth/logout** | Đăng xuất | Có | Clear refresh token cookie |
| **GET /auth/me** | Lấy thông tin user hiện tại | Có | Trả user + role, KHÔNG trả password_hash |
| **GET /health** | Health check | Không | Trả status OK — dùng cho monitoring |

**Format response chuẩn (đề xuất):**

```json
// Thành công
{
  "data": { ... },
  "message": "Đăng nhập thành công",
  "statusCode": 200
}

// Lỗi
{
  "message": "Tên đăng nhập hoặc mật khẩu không đúng",
  "statusCode": 401
}
```

**Login request/response dự kiến:**

```json
// Request
POST /auth/login
{
  "username": "admin",
  "password": "Admin@123"
}

// Response (thành công)
{
  "data": {
    "accessToken": "eyJ...",
    "user": {
      "id": 1,
      "username": "admin",
      "role": {
        "code": "QUAN_TRI_HE_THONG",
        "name": "Quản trị hệ thống"
      }
    }
  },
  "message": "Đăng nhập thành công",
  "statusCode": 200
}

// Response (sai)
{
  "message": "Tên đăng nhập hoặc mật khẩu không đúng",
  "statusCode": 401
}
```

**Refresh token request/response dự kiến:**

```json
// Request — cookie tự gửi
POST /auth/refresh

// Response
{
  "data": {
    "accessToken": "eyJ... (mới)"
  },
  "message": "Làm mới token thành công",
  "statusCode": 200
}
```

**Logout request/response dự kiến:**

```json
// Request
POST /auth/logout

// Response
{
  "message": "Đăng xuất thành công",
  "statusCode": 200
}
```

**Me request/response dự kiến:**

```json
// Request — header Authorization: Bearer <accessToken>
GET /auth/me

// Response
{
  "data": {
    "id": 1,
    "username": "admin",
    "role": {
      "code": "QUAN_TRI_HE_THONG",
      "name": "Quản trị hệ thống"
    },
    "staff": null
  },
  "message": "Thành công",
  "statusCode": 200
}
```

### 4.6 Token strategy

| Thuộc tính | Access Token | Refresh Token |
|------------|:------------:|:-------------:|
| **Nội dung** | user id, username, role code | user id |
| **Thời hạn** | 15 phút | 7 ngày |
| **Lưu ở đâu** | Memory phía frontend (React state) | httpOnly cookie trên backend |
| **Algorithm** | HS256 | HS256 |
| **Secret** | Từ `.env` (`JWT_ACCESS_SECRET`) | Từ `.env` (`JWT_REFRESH_SECRET`) |

**Nguyên tắc bảo mật:**

* Access token lưu trong **memory** (React state/context) — **KHÔNG** lưu trong `localStorage`.
* Refresh token gửi qua **httpOnly cookie** — JavaScript không đọc được cookie này.
* Khi logout, backend **clear cookie refresh token** bằng cách set cookie hết hạn.
* Frontend clear access token khỏi memory.
* CORS phải cấu hình đúng: `credentials: true` + origin cụ thể (http://localhost:5173).

**Refresh token rotation (Sprint 1):**

* Sprint 1 có thể đơn giản: mỗi lần refresh, phát hành refresh token mới thay thế.
* Nếu chưa làm rotation kịp, ghi TODO rõ trong code và plan Sprint 2.
* Quan trọng: refresh endpoint phải kiểm tra refresh token hợp lệ (chưa hết hạn, chưa bị thu hồi).

### 4.7 Backend validation & security

| Hạng mục | Chi tiết |
|----------|---------|
| **Validate login DTO** | Dùng `class-validator`: `@IsString()`, `@IsNotEmpty()`, `@MinLength(3)` cho username; `@IsString()`, `@IsNotEmpty()`, `@MinLength(6)` cho password |
| **Hash password** | Dùng `bcrypt` với cost factor ≥ 10. Không dùng MD5/SHA1/plaintext |
| **Helmet** | Dùng `helmet()` middleware trong `main.ts` — tăng bảo mật HTTP headers |
| **CORS** | Chỉ mở origin `http://localhost:5173`. Có `credentials: true` để cookie được gửi |
| **Không log password/token** | Không log request body login, không log access token, không log password |
| **Không dùng synchronize=true** | Không dùng `synchronize=true` trong production; ưu tiên migration cho cả môi trường dev để tránh lệch schema. Nếu bắt buộc dùng tạm ở dev, PHẢI ghi rõ warning trong code và `.env.example` |
| **Soft delete** | Query luôn filter `WHERE deleted_at IS NULL` |
| **Error response** | Không trả stack trace ra response. Dùng `HttpException` với status code chuẩn (400/401/403/404/500) |

---

## 5. Frontend implement plan

### 5.1 Thư mục frontend dự kiến

```
frontend/
├── src/
│   ├── main.tsx                          # Entry point
│   ├── App.tsx                           # Root component, provider
│   ├── routes/
│   │   └── AppRoutes.tsx                 # Route configuration
│   ├── api/
│   │   ├── client.ts                     # Axios instance + interceptor
│   │   └── auth.api.ts                   # API calls: login, refresh, logout, me
│   ├── auth/
│   │   ├── AuthContext.tsx                # Provider quản lý auth state
│   │   ├── ProtectedRoute.tsx            # Component bảo vệ route
│   │   └── useAuth.ts                    # Hook truy cập auth context
│   ├── layouts/
│   │   └── MainLayout.tsx                # Sidebar + Header + Content
│   ├── pages/
│   │   ├── LoginPage.tsx                 # Form đăng nhập
│   │   └── DashboardPage.tsx             # Trang chủ sau login (đơn giản)
│   ├── components/                       # Component chung (nếu có)
│   ├── types/
│   │   ├── auth.types.ts                 # LoginRequest, LoginResponse, User, Role
│   │   └── api.types.ts                  # ApiResponse<T>
│   └── utils/
│       └── token.ts                      # Lưu/get access token trong memory
├── .env.example                          # VITE_API_BASE_URL=http://localhost:5011
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

**Ghi chú:**

* Đây là cấu trúc đề xuất, chưa tạo code.
* Sprint 1 chỉ cần `LoginPage`, `AuthContext`, `ProtectedRoute`, `MainLayout` cơ bản.
* Các page CRUD (bàn, thực đơn, đơn hàng...) sẽ thêm ở Sprint 2+.

### 5.2 Trang/chức năng frontend Sprint 1

| Thành phần | Mục đích | Ghi chú |
|------------|----------|---------|
| **LoginPage** | Form nhập username + password, gọi API login | Hiển thị lỗi nếu sai, redirect vào MainLayout nếu đúng |
| **AuthContext** | Quản lý state auth: user, isAuthenticated, login, logout | Access token lưu trong memory (state), refresh token trong httpOnly cookie |
| **useAuth** | Hook truy cập AuthContext | Trả user, isAuthenticated, login, logout |
| **ProtectedRoute** | Component bọc route cần auth | Nếu chưa login → redirect `/login` |
| **MainLayout** | Layout chung sau login | Sidebar (rỗng Sprint 1), Header (tên user + nút logout), Content area |
| **DashboardPage** | Trang chủ đơn giản sau login | Hiển thị "Xin chào, [tên user]" + thông tin role |
| **Logout button** | Nút đăng xuất ở Header | Gọi API logout, clear state, redirect `/login` |
| **Axios client** | Instance Axios có interceptor | Gắn access token vào header, tự refresh khi 401 |

### 5.3 Frontend auth flow

**Luồng đăng nhập:**

1. User nhập username + password vào `LoginPage`.
2. `LoginPage` gọi `authApi.login({ username, password })`.
3. Backend xác thực thành công → trả `accessToken` + set `refreshToken` trong httpOnly cookie.
4. Frontend lưu `accessToken` trong memory (AuthContext state).
5. Frontend gọi `authApi.me()` để lấy thông tin user + role (nếu cần hiển thị).
6. Redirect vào `MainLayout` (DashboardPage).

**Luồng gọi API authenticated:**

1. Axios interceptor gắn `Authorization: Bearer <accessToken>` vào mọi request.
2. Nếu backend trả 401 → Axios interceptor gọi `/auth/refresh` (cookie tự gửi).
3. Backend trả access token mới → Axios interceptor retry request gốc.
4. Nếu refresh thất bại → clear state, redirect `/login`.

**Luồng refresh sau reload trang:**

1. User reload trang → access token mất (memory cleared).
2. AuthContext useEffect gọi `/auth/me` (không cần access token — dùng refresh cookie).
3. Nếu refresh cookie hợp lệ → backend trả user info + frontend tự lấy access token mới.
4. Nếu refresh cookie hết hạn → redirect `/login`.

**Luồng đăng xuất:**

1. User click "Đăng xuất" ở Header.
2. Gọi `authApi.logout()` → backend clear refresh cookie.
3. Frontend clear access token khỏi memory.
4. Redirect `/login`.

---

## 6. Env và port

| Thành phần | Giá trị chốt | Ghi chú |
|------------|:------------:|---------|
| Backend port | **5011** | NestJS `main.ts` listen port 5011 |
| Frontend port | **5173** | Vite default |
| MySQL port | **3306** (internal) | MySQL internal/default port. Môi trường Docker local dùng host port `3307` (map đến container `3306`). MCP MySQL đã cấu hình sẵn trong OpenCode dùng port `3307`. |
| DB name | **quanlynhahang** | Tên database MySQL. Đồng bộ trong `.env.example` và README |
| JWT_ACCESS_SECRET | secret-string-sprint1 | Ưu tiên generate ngẫu nhiên trong .env |
| JWT_REFRESH_SECRET | another-secret-string-sprint1 | Khác với access secret |
| JWT_ACCESS_EXPIRY | 15m | Access token hết hạn sau 15 phút |
| JWT_REFRESH_EXPIRY | 7d | Refresh token hết hạn sau 7 ngày |
| CORS_ORIGIN | http://localhost:5173 | Frontend origin |
| DB_HOST | localhost | MySQL host |
| DB_PORT | 3306 | MySQL internal port. Docker local dùng host port `3307` map đến container `3306`. MCP MySQL đã cấu hình sẵn dùng port `3307`. |
| DB_USERNAME | root | MySQL user |
| DB_PASSWORD | password | MySQL password (dev) |
| DB_DATABASE | quanlynhahang | Tên database |

**Lưu ý quan trọng:**

* **Không commit `.env` thật** — chỉ commit `.env.example`.
* `.env.example` chứa mẫu giá trị, không chứa secret thật.
* MySQL chạy local trên máy dev. Đảm bảo MySQL 8.0+ đang chạy trên host port `3307` (Docker map đến container `3306`). MCP MySQL đã cấu hình sẵn trong OpenCode.

---

## 7. Test checklist Backend

- [ ] Backend start được trên port 5011 không lỗi
- [ ] Kết nối MySQL thành công (kiểm tra log)
- [ ] Migration tạo 3 bảng: roles, staff, users
- [ ] Seed đủ 6 roles (QUAN_TRI_HE_THONG, QUAN_LY, PHUC_VU, THU_NGAN, BEP, KHO)
- [ ] Seed admin dev: username = admin, role = QUAN_TRI_HE_THONG
- [ ] Login đúng username/password → trả access token + set refresh cookie
- [ ] Login sai username/password → trả lỗi 401
- [ ] Login username không tồn tại → trả lỗi 401
- [ ] API `/auth/me` trả user info KHÔNG có password_hash
- [ ] API `/auth/me` không có token → trả lỗi 401
- [ ] API `/auth/refresh` với cookie hợp lệ → trả access token mới
- [ ] API `/auth/refresh` không có cookie → trả lỗi 401
- [ ] API `/auth/logout` → clear refresh cookie
- [ ] Role guard từ chối user không có quyền (test với route giả lập)
- [ ] Không có secret/password/token trong git diff
- [ ] Không có Adminer/phpMyAdmin/PHP trong dependency
- [ ] Health check `/health` trả status OK

---

## 8. Test checklist Frontend

- [ ] Frontend start trên port 5173 không lỗi
- [ ] LoginPage hiển thị form username + password
- [ ] Login đúng → chuyển vào MainLayout (DashboardPage)
- [ ] Login sai → hiển thị thông báo lỗi trên form
- [ ] Sau reload trang → kiểm tra cookie refresh, nếu hợp lệ thì giữ đăng nhập
- [ ] ProtectedRoute chặn user chưa login → redirect `/login`
- [ ] Logout → quay về LoginPage, access token cleared
- [ ] Không lưu token trong `localStorage` (kiểm tra DevTools)
- [ ] Axios interceptor gắn header `Authorization: Bearer ...` khi gọi API
- [ ] MainLayout hiển thị tên user và role
- [ ] Nút logout hoạt động đúng

---

## 9. Rủi ro khi implement

| Rủi ro | Ảnh hưởng | Cách xử lý |
|--------|-----------|------------|
| **CORS/cookie sai cấu hình** | Frontend không gửi được cookie refresh token, login bị fail | Cấu hình CORS `credentials: true`, đúng origin. Kiểm tra `SameSite` cookie policy |
| **Refresh token không gửi được do cookie** | Frontend không refresh được token, user bị logout liên tục | Kiểm tra cookie `httpOnly`, `sameSite`, `secure` (dev không cần secure). Đảm bảo Axios `withCredentials: true` |
| **Migration lỗi do MySQL local** | Database không tạo được, backend không start | Kiểm tra MySQL version ≥ 8.0, charset utf8mb4. Đảm bảo MySQL đang chạy trên host port `3307` (Docker map đến container `3306`). MCP MySQL đã cấu hình sẵn trong OpenCode. |
| **FE/BE khác format response** | Frontend parse lỗi data | Thống nhất format `{ data, message, statusCode }` trước khi code. Ghi rõ trong tài liệu |
| **OpenCode làm lan sang module nghiệp vụ ngoài Sprint 1** | Code thừa, khó maintain, trễ tiến độ | Tuân thủ danh sách "Ngoài phạm vi" tại mục 2.2. Không code bàn/menu/order |

---

## 10. Quy tắc kiểm soát phạm vi khi code

1. **Code Backend Sprint 1 trước.** Không làm FE trước khi API auth chạy ổn.
2. **Không làm FE trước khi API auth chạy ổn.** Đảm bảo login/refresh/logout/me hoạt động ở backend trước.
3. **Không làm module bàn/menu/order/payment.** Sprint 2+.
4. **Không tạo full database 15 bảng.** Sprint 1 chỉ làm 3 bảng: roles, staff, users.
5. **Không thêm package ngoài danh sách** nếu không báo lý do. Xem danh sách tại `docs/thietke/04-cong-nghe-be-fe.md`.
6. **Không dùng PHP/Adminer/phpMyAdmin.** Dùng DBeaver/MySQL Workbench/MySQL CLI khi cần xem database.
7. **Không commit `.env` thật.** Chỉ commit `.env.example`.
8. **Không dùng `synchronize: true`.** Ưu tiên TypeORM migration cho cả dev và production để tránh lệch schema.
9. **Không lưu token trong localStorage.** Access token trong memory, refresh token trong httpOnly cookie.

---

## 11. Kết luận

1. Sau file này, bước tiếp theo là **code Backend Sprint 1 trước** — từ setup NestJS, kết nối MySQL, tạo entity/migration, seed roles, đến implement AuthModule.
2. Khi backend **login/refresh/logout/me chạy ổn** (đạt checklist mục 7), mới code **Frontend Sprint 1** — LoginPage, AuthContext, ProtectedRoute, MainLayout.
3. File này là **cơ sở để kiểm tra** OpenCode có làm đúng phạm vi Sprint 1 không — nếu phát hiện code bàn/menu/order/payment, cần dừng lại và hỏi.
4. **Thời gian dự kiến:** 3–5 ngày cho 1 nhóm phát triển full-stack.
5. **User Stories Sprint 1:** US-AUTH-01 (đăng nhập), US-AUTH-02 (phân quyền), US-AUTH-04 (đăng xuất) — tham khảo `docs/nghiepvu/09-user-stories-va-sprint-goi-y.md`.
6. **Backlog Sprint 1:** BL-AUTH-01, BL-AUTH-02, BL-AUTH-04 — tham khảo `docs/nghiepvu/08-pham-vi-mvp-va-backlog.md`.
