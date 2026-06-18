# Quản lý Nhà hàng

Hệ thống quản lý nhà hàng — Full-stack application built with NestJS + React + MySQL.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | NestJS 11 + TypeORM + MySQL 8 |
| Frontend | React 19 + Vite 8 + Ant Design 6 + TypeScript |
| Database | MySQL 8.0 (local) |
| Auth | JWT (access token + httpOnly refresh cookie) |

## Cấu trúc thư mục

```
Quanlynhahang/
├── backend/          # NestJS REST API
├── frontend/         # React SPA
├── database/         # SQL tham khảo (migration là source of truth)
├── docs/             # Tài liệu thiết kế & nghiệp vụ
└── README.md
```

---

## Chạy Sprint 1 — Local

### Prerequisites

- Node.js >= 20
- MySQL 8.0+ chạy local trên máy
- npm >= 10

### Bước 1: Chuẩn bị MySQL local

```bash
# Đăng nhập MySQL CLI
mysql -u root -p

# Tạo database (nếu chưa có)
CREATE DATABASE IF NOT EXISTS quanlynhahang
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

# Nếu MySQL có password root, cập nhật backend/.env accordingly
EXIT;
```

### Bước 2: Cấu hình Backend

```bash
cd backend
cp .env.example .env
```

`.env` mặc định (MySQL local, không password):

```
APP_PORT=5011
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=quanlynhahang
```

> Nếu MySQL local có password root → đổi `DB_PASSWORD=` thành password thực.

### Bước 3: Cấu hình Frontend

```bash
cd frontend
cp .env.example .env
```

`.env` mặc định:

```
VITE_API_BASE_URL=http://localhost:5011/api
```

### Bước 4: Cài dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### Bước 5: Chạy Migration

```bash
cd backend
npm run migration:run
```

Tạo 3 bảng: `roles`, `staff`, `users`.

### Bước 6: Seed dữ liệu

```bash
npm run seed:run
```

Seed:
- 6 roles (QUAN_TRI_HE_THONG, QUAN_LY, PHUC_VU, THU_NGAN, BEP, KHO)
- Tài khoản admin dev

### Bước 7: Chạy Backend

```bash
npm run start:dev
```

Backend chạy tại `http://localhost:5011/api`.

### Bước 8: Chạy Frontend

```bash
cd ../frontend
npm run dev
```

Frontend chạy tại `http://localhost:5173`.

### Bước 9: Test

1. Mở `http://localhost:5173/login`
2. Đăng nhập:
   - Username: `admin`
   - Password: `Admin@123`
3. Sau login → vào Dashboard
4. Kiểm tra API trực tiếp:

```bash
# Health check
curl http://localhost:5011/api/health

# Login
curl -X POST http://localhost:5011/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'

# Me (dùng access token từ login)
curl http://localhost:5011/api/auth/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

## Verify & Reset

### Verify nhanh

```bash
# Backend build
npm --prefix backend run build

# Backend test
npm --prefix backend run test

# Frontend build
npm --prefix frontend run build

# Frontend lint
npm --prefix frontend run lint
```

### Reset database (chạy lại từ đầu)

```bash
cd backend
npm run migration:revert   # Undo migration
npm run migration:run      # Tạo lại bảng
npm run seed:run           # Seed lại dữ liệu
```

### Xóa hoàn toàn

```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS quanlynhahang;"
mysql -u root -p -e "CREATE DATABASE quanlynhahang CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
cd backend
npm run migration:run
npm run seed:run
```

---

## Tài khoản Demo

| Field | Giá trị |
|-------|---------|
| Username | `admin` |
| Password | `Admin@123` |
| Role | QUAN_TRI_HE_THONG (Quản trị hệ thống) |

> **Cảnh báo:** Đây là tài khoản dev/local, KHÔNG dùng trong production.

---

## API Endpoints (Sprint 1)

| Method | Path | Auth | Mô tả |
|--------|------|:----:|-------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/login` | No | Đăng nhập |
| POST | `/api/auth/refresh` | Cookie | Làm mới access token |
| POST | `/api/auth/logout` | No | Đăng xuất |
| GET | `/api/auth/me` | Bearer | Lấy thông tin user hiện tại |
| GET | `/api/roles` | Bearer | Danh sách roles |
| GET | `/api/users` | Bearer + Role | Danh sách users (QUAN_TRI_HE_THONG, QUAN_LY) |

---

## Docs

Xem `docs/README.md` để biết danh sách đầy đủ tài liệu.

| Tài liệu | Mô tả |
|----------|-------|
| `docs/nghiepvu/01-tong-quan-yeu-cau-chuan-hoa.md` | Nghiệp vụ tổng quan |
| `docs/thietke/01-kien-truc-he-thong.md` | Kiến trúc hệ thống |
| `docs/thietke/02-thiet-ke-co-so-du-lieu.md` | Thiết kế database |
| `docs/thietke/05-ke-hoach-implement-sprint-1.md` | Kế hoạch Sprint 1 |

---

## Sprint Status

| Sprint | Trạng thái | Phạm vi |
|--------|:----------:|---------|
| Sprint 1 | ✅ Freeze | Auth, Role, User, Staff |
| Sprint 2 | 🔜 | Bàn, Thực đơn |
| Sprint 3 | 🔜 | Gọi món |
| Sprint 4 | 🔜 | Bếp |
| Sprint 5 | 🔜 | Thanh toán |
| Sprint 6 | 🔜 | Báo cáo, Kho |
