# Công nghệ Backend/Frontend — Hệ thống quản lý nhà hàng

> ⚠️ **Tài liệu Thiết kế Kỹ thuật** — Dành cho Developer/Tech Lead.
> **Không phải tài liệu nghiệp vụ chính thức.** Không dùng cho khách hàng/PM/BA.
> Xem `docs/nghiepvu/` cho tài liệu nghiệp vụ.

---

## 1. Mục đích tài liệu

Tài liệu này chốt danh sách công nghệ sử dụng cho hệ thống quản lý nhà hàng.
Đây là tài liệu đầu vào trước khi triển khai code Sprint 1.

Mục tiêu là tránh việc OpenCode/AI tự thêm công nghệ ngoài phạm vi.
Tài liệu này không phải hướng dẫn cài đặt chi tiết và không chứa code triển khai.

---

## 2. Nguyên tắc chọn công nghệ

| Tiêu chí | Định hướng lựa chọn |
|----------|----------------------|
| Dễ làm đồ án | Không dùng microservices, không dùng quá nhiều thư viện |
| Dễ demo | Có login, role, dashboard, CRUD rõ ràng |
| Dễ mở rộng | Module hóa backend, chia route/page frontend |
| Dễ kiểm soát lỗi | TypeScript, validation, migration, .env.example |
| Phù hợp stack đã chốt | Node.js + NestJS + React + MySQL |

---

## 3. Backend stack

### 3.1 Core backend

| Nhóm | Công nghệ | Mục đích |
|------|-----------|----------|
| Runtime | Node.js LTS | Chạy backend ổn định |
| Language | TypeScript | Code rõ kiểu dữ liệu |
| Framework | NestJS | Backend module hóa, phù hợp hệ thống nhiều nghiệp vụ |
| Package manager | npm | Đơn giản, dễ chạy |
| Database | MySQL 8.x | Lưu dữ liệu nhà hàng |
| ORM | TypeORM | Kết nối NestJS với MySQL |
| DB driver | mysql2 | Driver MySQL cho Node.js |

### 3.2 Backend dependencies chốt

| Package | Dùng để làm gì | Sprint áp dụng | Ghi chú |
|---------|----------------|----------------|---------|
| `@nestjs/config` | Đọc biến môi trường `.env` | Sprint 1 | |
| `@nestjs/typeorm` | Kết nối TypeORM với NestJS | Sprint 1 | |
| `typeorm` | ORM mapping entity/table | Sprint 1 | |
| `mysql2` | Driver MySQL | Sprint 1 | |
| `class-validator` | Validate DTO đầu vào | Sprint 1 | |
| `class-transformer` | Transform/ẩn field nhạy cảm | Sprint 1 | |
| `@nestjs/jwt` | Tạo JWT access/refresh token | Sprint 1 | |
| `@nestjs/passport` | Tích hợp Passport auth | Sprint 1 | |
| `passport` | Auth middleware | Sprint 1 | |
| `passport-jwt` | JWT strategy | Sprint 1 | |
| `bcrypt` | Hash mật khẩu | Sprint 1 | |
| `cookie-parser` | Đọc refresh token trong cookie (httpOnly) | Sprint 1 | |
| `helmet` | Tăng bảo mật HTTP headers | Sprint 1 hoặc Sprint 2 | |
| `@nestjs/swagger` | Sinh tài liệu API sau này | Sprint 2 trở đi | |
| `multer` | Upload ảnh món ăn | Để sau | |
| `exceljs` | Xuất Excel báo cáo | Để sau | |
| `pdfkit` hoặc `puppeteer` | Xuất/in PDF hóa đơn | Để sau | |

**Ghi chú:** Sprint 1 chỉ cài những package thật sự cần cho Auth + database nền tảng. Các package upload/export/report để sau, không cài vội nếu chưa dùng.

### 3.3 Backend structure đề xuất

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   ├── common/
│   │   ├── decorators/
│   │   ├── guards/
│   │   ├── filters/
│   │   └── interceptors/
│   ├── auth/
│   ├── staff/
│   ├── tables/
│   ├── reservations/
│   ├── menu/
│   ├── orders/
│   ├── kitchen/
│   ├── payments/
│   ├── reports/
│   ├── inventory/
│   └── audit-log/
├── migrations/
├── seeds/
└── test/
```

**Ghi chú:**

- Đây là cấu trúc đề xuất, không tạo code trong bước này.
- Sprint 1 chỉ triển khai auth, roles, staff/users nền tảng.

### 3.4 Backend module theo sprint

| Module | Sprint | Ghi chú |
|--------|--------|---------|
| AuthModule | Sprint 1 | Login/logout/refresh/role |
| StaffModule | Sprint 1 / Sprint 6 | Sprint 1 chỉ seed admin, CRUD nhân viên để sau |
| TablesModule | Sprint 2 | Khu vực bàn, bàn, trạng thái bàn |
| MenuModule | Sprint 2 | Danh mục món, món ăn |
| OrdersModule | Sprint 3 | Gọi món, order_items |
| KitchenModule | Sprint 3 / 4 | Màn hình bếp, trạng thái món |
| PaymentsModule | Sprint 4 | Hóa đơn, thanh toán |
| ReservationsModule | Sprint 4 / 5 | Đặt bàn |
| ReportsModule | Sprint 5 | Doanh thu, món bán chạy |
| InventoryModule | Sprint 6 | Kho cơ bản |
| AuditLogModule | Xuyên suốt | Ghi nhật ký thao tác quan trọng |

---

## 4. Database stack

### 4.1 Công nghệ database

| Phần | Công nghệ đề xuất | Ghi chú |
|------|-------------------|---------|
| DBMS | MySQL 8.x | |
| ORM | TypeORM | |
| Migration | TypeORM migrations | |
| Seed | Script seed riêng hoặc migration seed | |
| Charset | utf8mb4 | |
| Timezone | UTC hoặc thống nhất theo server | |

### 4.2 Bảng Sprint 1

Sprint 1 không tạo toàn bộ 15 bảng MVP. Sprint 1 chỉ cần **3 bảng nền tảng**:

| Bảng | Lý do |
|------|-------|
| `roles` | Lưu 6 vai trò |
| `staff` | Hồ sơ nhân viên |
| `users` | Tài khoản đăng nhập |

### 4.3 Các bảng từ Sprint 2 trở đi

- `table_areas`
- `tables`
- `reservations`
- `menu_categories`
- `menu_items`
- `orders`
- `order_items`
- `invoices`
- `payments`
- `suppliers`
- `ingredients`
- `inventory_transactions`
- `audit_logs`

### 4.4 Enum role

| Enum | Mô tả |
|------|-------|
| `QUAN_TRI_HE_THONG` | Quản trị hệ thống |
| `QUAN_LY` | Quản lý |
| `PHUC_VU` | Phục vụ |
| `THU_NGAN` | Thu ngân |
| `BEP` | Bếp |
| `KHO` | Kho |

### 4.5 Auth database tối thiểu

**roles:**

| Field | Type | Ghi chú |
|-------|------|---------|
| id | INT (PK) | |
| code | VARCHAR | Mã role (VD: QUAN_TRI_HE_THONG) |
| name | VARCHAR | Tên role tiếng Việt |

**staff:**

| Field | Type | Ghi chú |
|-------|------|---------|
| id | INT (PK) | |
| full_name | VARCHAR | Họ tên |
| phone | VARCHAR | Số điện thoại |
| position | VARCHAR | Chức vụ |
| status | VARCHAR | Trạng thái |

**users:**

| Field | Type | Ghi chú |
|-------|------|---------|
| id | INT (PK) | |
| username | VARCHAR | Tên đăng nhập, unique |
| password_hash | VARCHAR | Mật khẩu đã hash |
| role_id | INT (FK) | Liên kết roles |
| staff_id | INT (FK) | Liên kết staff |
| status | VARCHAR | Trạng thái tài khoản |
| created_at | DATETIME(3) | |
| updated_at | DATETIME(3) | |
| deleted_at | DATETIME(3) | Soft delete |

---

## 5. Frontend stack

### 5.1 Core frontend

| Nhóm | Công nghệ | Mục đích |
|------|-----------|----------|
| Framework | React | Xây giao diện web |
| Build tool | Vite | Dev server nhanh, build gọn |
| Language | TypeScript | Type-safe |
| Router | React Router | Chia trang login/dashboard/module |
| UI library | Ant Design | Nhanh làm giao diện quản trị |
| HTTP client | Axios | Gọi API backend |
| Form | React Hook Form | Xử lý form |
| Validation | Zod | Validate form |
| Date | dayjs | Xử lý ngày giờ |
| Chart | Recharts | Báo cáo doanh thu |
| State auth | React Context | Lưu user/role (access token trong memory, refresh token trong httpOnly cookie) |
| Server state | TanStack Query | Quản lý API cache từ Sprint 2 |

### 5.2 Frontend dependencies chốt

| Package | Dùng để làm gì | Sprint áp dụng |
|---------|----------------|----------------|
| `react-router-dom` | Routing | Sprint 1 |
| `axios` | Gọi API | Sprint 1 |
| `antd` | UI component | Sprint 1 |
| `@ant-design/icons` | Icon | Sprint 1 |
| `react-hook-form` | Form login/form CRUD | Sprint 1 |
| `zod` | Validate form | Sprint 1 |
| `@hookform/resolvers` | Nối React Hook Form với Zod | Sprint 1 |
| `dayjs` | Format ngày giờ | Sprint 2 |
| `@tanstack/react-query` | Quản lý dữ liệu API | Sprint 2 |
| `recharts` | Biểu đồ báo cáo | Sprint 5 |
| `vite` | Build tool | Sprint 1 |
| `typescript` | Type-safe | Sprint 1 |

**Ghi chú:** Sprint 1 chỉ cần dependencies phục vụ login/logout/protected route. Không cài thư viện báo cáo nếu chưa dùng.

### 5.3 Frontend structure đề xuất

```
frontend/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── routes/
│   │   └── AppRoutes.tsx
│   ├── api/
│   │   ├── client.ts
│   │   └── auth.api.ts
│   ├── auth/
│   │   ├── AuthContext.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── useAuth.ts
│   ├── layouts/
│   │   └── MainLayout.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   └── DashboardPage.tsx
│   ├── components/
│   ├── types/
│   │   ├── auth.types.ts
│   │   └── user.types.ts
│   └── utils/
└── vite.config.ts
```

**Ghi chú:**

- Đây là cấu trúc đề xuất, chưa tạo code trong bước này.
- Sprint 1 chỉ cần `LoginPage`, `AuthContext`, `ProtectedRoute`, `MainLayout` cơ bản.

---

## 6. Dev tools và root project

### 6.1 Root project files/tools

| File/Tool | Dùng để làm gì |
|-----------|----------------|
| `.gitignore` | Không commit node_modules, .env, build output |
| `.env.example` | Mẫu biến môi trường |
| `README.md` | Hướng dẫn chạy dự án |
| `database/` | Lưu migration/schema/seed note nếu cần |
| `docs/` | Tài liệu nghiệp vụ + thiết kế |

### 6.2 Database local

MySQL chạy local trên máy dev. Khi cần xem database, dùng DBeaver, MySQL Workbench hoặc MySQL CLI (công cụ bên ngoài, không thuộc source code). Chưa cần container hóa backend/frontend trong giai đoạn đầu.

| Service | Có nên dùng? | Lý do |
|---------|--------------|-------|
| MySQL local | Có | Chạy trực tiếp trên máy dev |
| Backend container | Chưa cần | Đồ án local chạy npm dễ hơn |
| Frontend container | Chưa cần | Vite chạy local nhanh |

---

## 7. Testing stack

### 7.1 Backend testing

| Tool | Dùng để làm gì | Sprint |
|------|----------------|--------|
| Jest | Unit test service/guard | Sprint 1 |
| Supertest | E2E test API | Sprint 2 trở đi |
| npm script test / test:e2e | Chạy test | Sprint 1 |

### 7.2 Frontend testing

| Tool | Dùng để làm gì | Sprint |
|------|----------------|--------|
| Vitest | Unit test frontend | Sprint 2 |
| React Testing Library | Test component | Sprint 2 |
| Playwright | E2E login đến thao tác hệ thống | Sprint 4/5 |

**Ghi chú:** Sprint 1 chỉ cần test thủ công login/logout trước. Không cần setup frontend test quá nặng ngay nếu chưa cần.

---

## 8. Stack chốt cho dự án

### 8.1 Backend chốt

- Node.js LTS
- NestJS
- TypeScript
- TypeORM
- MySQL / mysql2
- @nestjs/config
- class-validator
- class-transformer
- @nestjs/jwt
- @nestjs/passport
- passport
- passport-jwt
- bcrypt
- cookie-parser
- helmet
- Jest

### 8.2 Frontend chốt

- React
- Vite
- TypeScript
- React Router
- Axios
- Ant Design
- React Hook Form
- Zod
- dayjs
- TanStack Query
- Recharts
- Vitest
- Playwright

### 8.3 Database/DevOps chốt

- MySQL 8.x
- TypeORM migration
- MySQL local trên máy dev
- .env.example
- .gitignore
- README.md
- Seed roles/users

---

## 9. Thứ tự triển khai BE/FE

| Sprint | Backend | Frontend |
|--------|---------|----------|
| Sprint 1 | Auth, roles, users seed | Login, logout, ProtectedRoute |
| Sprint 2 | Tables + Menu | Quản lý bàn + thực đơn |
| Sprint 3 | Orders + OrderItems | Gọi món |
| Sprint 4 | Kitchen + Payments | Màn hình bếp + thanh toán |
| Sprint 5 | Reservations + Reports | Đặt bàn + báo cáo |
| Sprint 6 | Inventory + Staff CRUD | Kho + nhân viên |

---

## 10. Quy tắc kiểm soát khi code

- Không làm CRUD bàn/menu ngay Sprint 1.
- Không tạo toàn bộ 15 bảng ngay Sprint 1.
- Không thêm QR order.
- Không thêm voucher/tích điểm.
- Không thêm nhiều chi nhánh.
- Không thêm thanh toán online.
- Không tự thêm thư viện ngoài danh sách này nếu chưa có lý do rõ ràng.
- Nếu cần thêm package mới, phải ghi rõ lý do trong báo cáo.

---

## 11. Kết luận

Tài liệu này là cơ sở để setup Sprint 1. Sprint 1 chỉ tập trung nền tảng auth + role + login. Các module nghiệp vụ sẽ triển khai theo từng sprint sau.

### Các quyết định đã chốt

| # | Vấn đề | Quyết định |
|---|--------|------------|
| 1 | Lưu trữ refresh token | Dùng **httpOnly cookie**. Access token lưu trong **memory** phía frontend. Không lưu token trong `localStorage`. |
| 2 | MySQL local | Chạy MySQL trên máy dev. Port mặc định 3306, Docker local dùng host port `3307` (map đến container `3306`). MCP MySQL đã cấu hình sẵn trong OpenCode dùng port `3307`. |
| 3 | Công cụ xem database | Dùng **DBeaver / MySQL Workbench / MySQL CLI** khi cần xem database local. Không dùng Adminer/phpMyAdmin (PHP tool). Các công cụ này chỉ phục vụ kiểm tra, không thuộc source code dự án. |
| 4 | Frontend dev server | Chạy ở **port 5173** (mặc định Vite). |
| 5 | Backend dev server | Chạy ở **port 5011**. |

**Không còn câu hỏi công nghệ nào cần xác nhận trước khi setup code Sprint 1.**
