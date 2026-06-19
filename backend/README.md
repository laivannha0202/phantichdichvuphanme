# Backend — Quản lý Nhà hàng

REST API cho hệ thống quản lý nhà hàng. Built with NestJS 11 + TypeORM + MySQL 8.

## Cấu trúc

```
backend/src/
├── main.ts                 # Bootstrap, Swagger, CORS, static serve
├── app.module.ts           # Root module
├── modules/
│   ├── auth/               # JWT login, refresh, logout, guards
│   ├── staff/              # CRUD nhân viên & vai trò
│   ├── table-areas/        # Quản lý khu vực bàn
│   ├── tables/             # Quản lý bàn
│   ├── menu-categories/    # Danh mục món ăn
│   ├── menu-items/         # Món ăn (CRUD + trạng thái)
│   ├── orders/             # Đơn hàng & chi tiết món
│   ├── kitchen/            # KDS — bếp xử lý món
│   ├── invoices/           # Hóa đơn & thanh toán
│   ├── reservations/       # Đặt bàn trước
│   ├── reports/            # Báo cáo doanh thu
│   ├── inventory/          # Kho nguyên liệu
│   └── uploads/            # Upload ảnh món ăn
├── common/                 # Guards, interceptors, decorators
└── config/                 # ConfigModule, env
```

## Chạy local

```bash
# Install
npm install

# Copy env
cp .env.example .env

# Chạy dev
npm run start:dev
```

Backend chạy tại `http://localhost:5011/api`
Swagger tại `http://localhost:5011/api/docs`

## Env cần có

```
APP_PORT=5011
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=quanlynhahang
```

## Build / Lint / Test

```bash
npm run build       # Compile TypeScript
npm run lint        # ESLint
npm run test        # Jest unit tests
```

## API Endpoints chính

| Module | Path prefix | Mô tả |
|--------|-------------|-------|
| Auth | `/api/auth` | Login, refresh, logout, me |
| Roles | `/api/roles` | Danh sách vai trò |
| Users | `/api/users` | Quản lý người dùng |
| Staff | `/api/staff` | Quản lý nhân viên |
| Table Areas | `/api/areas` | Khu vực bàn |
| Tables | `/api/tables` | Quản lý bàn |
| Menu Categories | `/api/menu-categories` | Danh mục món |
| Menu Items | `/api/menu-items` | Món ăn |
| Orders | `/api/orders` | Đơn hàng |
| Kitchen | `/api/kitchen` | Bếp xử lý |
| Invoices | `/api/invoices` | Hóa đơn |
| Payments | `/api/payments` | Thanh toán |
| Reservations | `/api/reservations` | Đặt bàn trước |
| Reports | `/api/reports` | Báo cáo doanh thu |
| Inventory | `/api/inventory` | Kho nguyên liệu |
| Uploads | `/api/uploads` | Upload ảnh |
| Audit Logs | `/api/audit-logs` | Nhật ký hoạt động |

## Upload ảnh

- Endpoint: `POST /api/uploads/menu-items`
- Field: `file` (multipart/form-data)
- Storage: `backend/uploads/menu-items/`
- Static serve: `/uploads` → `backend/uploads/`
- Accept: `.jpg`, `.jpeg`, `.png`, `.webp`
- Max size: 3MB
