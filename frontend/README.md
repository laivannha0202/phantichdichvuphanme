# Frontend — Quản lý Nhà hàng

SPA cho hệ thống quản lý nhà hàng. Built with React 19 + Vite 8 + Ant Design 6 + TypeScript.

## Cấu trúc

```
frontend/src/
├── main.tsx               # Entry point
├── App.tsx                # Routes, layout
├── api/                   # API client, unwrap helper
├── components/            # Shared components
├── pages/
│   ├── LoginPage.tsx      # Đăng nhập
│   ├── DashboardPage.tsx  # Tổng quan
│   ├── TablesPage.tsx     # Quản lý bàn
│   ├── MenuItemsPage.tsx  # Món ăn (CRUD + upload ảnh)
│   ├── MenuCategoriesPage.tsx # Danh mục món
│   ├── OrdersPage.tsx     # Đơn hàng
│   ├── KitchenPage.tsx    # KDS — bếp
│   ├── InvoicesPage.tsx   # Hóa đơn
│   ├── ReservationsPage.tsx # Đặt bàn trước
│   ├── InventoryPage.tsx  # Kho nguyên liệu
│   ├── StaffUsersPage.tsx # Nhân viên & tài khoản
│   ├── ReportsPage.tsx    # Báo cáo doanh thu
│   └── AuditLogsPage.tsx  # Nhật ký hoạt động
├── hooks/                 # Custom hooks
├── stores/                # State management
└── utils/                 # Helpers
```

## Chạy local

```bash
# Install
npm install

# Copy env
cp .env.example .env

# Chạy dev
npm run dev
```

Frontend chạy tại `http://localhost:5173`

## Env cần có

```
VITE_API_BASE_URL=http://localhost:5011/api
```

## Build / Lint

```bash
npm run build       # Build production
npm run lint        # ESLint check
```

## Tính năng chính

- Đăng nhập JWT (access token + httpOnly refresh cookie)
- Dashboard tổng quan (bàn, đơn, kho, doanh thu, biểu đồ)
- Quản lý bàn & khu vực
- Thực đơn (CRUD món, danh mục, upload ảnh)
- Gọi món & quản lý đơn hàng
- KDS — bếp xử lý món
- Hóa đơn & thanh toán
- Đặt bàn trước
- Kho nguyên liệu
- Nhân viên & phân quyền
- Báo cáo doanh thu
- Audit log

## Tech Stack

| Library | Version |
|---------|---------|
| React | 19 |
| Vite | 8 |
| Ant Design | 6 |
| TypeScript | 5.x |
| React Router | 7 |
| Axios | 1.x |
