# DEMO_GUIDE.md — Hướng dẫn Demo Hệ thống

## 1. Cách chạy Backend

```bash
cd backend

# Cài dependencies (nếu chưa)
npm install

# Cấu hình .env
cp .env.example .env
# Chỉnh DB_PASSWORD nếu MySQL có password

# Chạy migration
npm run migration:run

# Seed dữ liệu
npm run seed:run

# Khởi động backend
npm run start:dev
```

Backend chạy tại: `http://localhost:5011/api`

## 2. Cách chạy Frontend

```bash
cd frontend

# Cài dependencies (nếu chưa)
npm install

# Cấu hình .env
cp .env.example .env
# Mặc định: VITE_API_BASE_URL=http://localhost:5011/api

# Khởi động frontend
npm run dev
```

Frontend chạy tại: `http://localhost:5173`

## 3. Cách vào Swagger

Mở trình duyệt: `http://localhost:5011/api/docs`

## 4. Tài khoản Demo

| Field | Giá trị |
|-------|---------|
| Username | `admin` |
| Password | `Admin@123` |
| Role | QUAN_TRI_HE_THONG (Quản trị hệ thống) |

> **Lưu ý:** Tài khoản dev/local, KHÔNG dùng trong production.

---

## 5. Các luồng Demo đề xuất

### Luồng 1: Đăng nhập admin/quản lý

1. Mở `http://localhost:5173/login`
2. Nhập username: `admin`, password: `Admin@123`
3. Click "Đăng nhập"
4. Kiểm tra: Chuyển sang Dashboard, sidebar hiển thị đầy đủ menu

### Luồng 2: Xem bàn/thực đơn

1. Click menu "Khu vực & Bàn" trên sidebar
2. Xem danh sách khu vực (4 khu vực) và bàn (14 bàn)
3. Click menu "Thực đơn" trên sidebar
4. Xem danh sách danh mục (4 danh mục) và món ăn (14 món)

### Luồng 3: Tạo đơn gọi món

1. Click menu "Đơn hàng" trên sidebar
2. Click "Tạo đơn hàng mới"
3. Chọn bàn, thêm món ăn vào đơn
4. Lưu đơn hàng
5. Kiểm tra: Đơn hàng xuất hiện trong danh sách với trạng thái "Chờ xử lý"

### Luồng 4: Bếp cập nhật món

1. Đăng nhập bằng tài khoản có role BEP (nếu có)
2. Click menu "Bếp" trên sidebar
3. Xem danh sách món cần chế biến
4. Cập nhật trạng thái món (Đang chế biến → Hoàn thành)

### Luồng 5: Thanh toán hóa đơn

1. Click menu "Hóa đơn" trên sidebar
2. Chọn hóa đơn chưa thanh toán
3. Click "Thanh toán"
4. Chọn phương thức thanh toán (Tiền mặt, Chuyển khoản, etc.)
5. Xác nhận thanh toán
6. Kiểm tra: Hóa đơn chuyển sang "Đã thanh toán"

### Luồng 6: Đặt bàn trước

1. Click menu "Đặt bàn" trên sidebar
2. Click "Đặt bàn mới"
3. Chọn bàn, nhập thông tin khách hàng, thời gian đặt
4. Lưu đặt bàn
5. Kiểm tra: Đặt bàn xuất hiện trong danh sách

### Luồng 7: Báo cáo doanh thu

1. Click menu "Báo cáo doanh thu" trên sidebar (chỉ QUAN_TRI_HE_THONG, QUAN_LY)
2. Xem tổng quan doanh thu (4 stat cards)
3. Xem doanh thu theo ngày, top món, phương thức thanh toán
4. Chọn khoảng ngày bằng Date Range Picker

### Luồng 8: Kho nguyên liệu

1. Click menu "Kho" trên sidebar (chỉ QUAN_TRI_HE_THONG, QUAN_LY, KHO)
2. Xem danh sách nguyên liệu (10 nguyên liệu)
3. Xem nhà cung cấp (3 NCC)
4. Thực hiện nhập kho / xuất kho
5. Kiểm tra cảnh báo sắp hết

### Luồng 9: Nhân viên & tài khoản

1. Click menu "Nhân viên & Tài khoản" trên sidebar (chỉ QUAN_TRI_HE_THONG, QUAN_LY)
2. Xem danh sách nhân viên (5 nhân viên)
3. Xem danh sách tài khoản (6 tài khoản)
4. Xem danh sách vai trò (6 roles)

### Luồng 10: Audit log

1. Click menu "Audit Log" trên sidebar (chỉ QUAN_TRI_HE_THONG, QUAN_LY)
2. Xem danh sách nhật ký hoạt động
3. Lọc theo action, module, thời gian
4. Kiểm tra: Có bản ghi LOGIN_SUCCESS từ lần đăng nhập vừa rồi

### Luồng 11: Error handling / Security demo

1. Thử truy cập endpoint không tồn tại → Kiểm tra format lỗi chuẩn
2. Thử đăng nhập sai password → Kiểm tra 401 + LOGIN_FAILED ghi audit log
3. Thử truy cập endpoint không có quyền → Kiểm tra 403
4. Kiểm tra Swagger tại `/api/docs` → Xem tất cả endpoints

---

## 6. Ghi chú

- **Không đưa token/password thật vào docs/report.**
- Tài khoản demo chỉ dùng cho development/local.
- Database seed có sẵn dữ liệu mẫu để demo.
- Tất cả API đều có validation input (400 Bad Request khi sai format).
- Error response format chuẩn: `{ data, message, statusCode, errorCode, path, timestamp }`.
