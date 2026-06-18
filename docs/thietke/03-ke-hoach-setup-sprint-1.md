# Kế hoạch Setup & Sprint 1 — Quản lý Nhà hàng

> ⚠️ **Tài liệu Thiết kế Kỹ thuật** — Dành cho Developer/Tech Lead.
> **Không phải tài liệu nghiệp vụ chính thức.** Không dùng cho khách hàng/PM/BA.
> Xem `docs/nghiepvu/` cho tài liệu nghiệp vụ.

---

## 1. Tổng quan Sprint 1

### 1.1 Mục tiêu

Thiết lập nền tảng dự án và hoàn thành xác thực + phân quyền cơ bản.

- Khởi tạo khung backend NestJS.
- Khởi tạo khung frontend React/Vite.
- Cấu hình kết nối MySQL môi trường phát triển.
- Chuẩn bị đăng nhập / đăng xuất.
- Chuẩn bị phân quyền theo 6 actor.
- Chuẩn bị tài khoản quản trị khởi tạo.
- Chuẩn bị README chạy dự án và `.env.example`.

**Không triển khai** bàn, thực đơn, gọi món, bếp, thanh toán trong Sprint 1.

### 1.2 Thời gian dự kiến

**3–5 ngày** (cho 1 nhóm phát triển full-stack)

### 1.3 User stories thuộc Sprint 1

| ID | User Story | Actor chính |
|----|-----------|-------------|
| US-AUTH-01 | Đăng nhập / đăng xuất | Tất cả actor |
| US-AUTH-02 | Làm mới token (refresh) | Tất cả actor |
| US-AUTH-04 | Phân quyền theo vai trò | Tất cả actor |

**Ghi chú:**
- US-EMP-02 (quản lý nhân viên) chỉ triển khai đầy đủ ở Sprint 6.
- Sprint 1 chỉ dùng tài khoản khởi tạo/tài khoản mẫu để phục vụ đăng nhập.

*Tham khảo: docs/nghiepvu/09-user-stories-va-sprint-goi-y.md*

### 1.4 Sprint Backlog

**Trong scope Sprint 1:**
1. Setup project structure (BE + FE)
2. MySQL database + migration đầu tiên
3. Auth module (đăng nhập, refresh token, phân quyền)
4. Seed tài khoản QUAN_TRI_HE_THONG mặc định
5. Frontend: login page + protected route cơ bản
6. README chạy dự án + `.env.example`

**Ngoài scope Sprint 1 (từ Sprint 2 trở đi):**
- CRUD Danh mục món (Sprint 2)
- CRUD Món ăn (Sprint 2)
- CRUD Khu vực & Bàn (Sprint 2)
- Dashboard thống kê (Sprint 3)
- Gọi món (Sprint 3)
- Bếp + trạng thái món (Sprint 3–4)
- Thanh toán (Sprint 4)
- Đặt bàn (Sprint 4–5)
- Báo cáo (Sprint 5)
- Kho nguyên liệu (Sprint 6)
- Quản lý nhân viên (Sprint 6)

*Tham khảo: docs/nghiepvu/08-pham-vi-mvp-va-backlog.md*

---

## 2. Setup Dự án

### 2.1 Yêu cầu môi trường

| Công cụ | Phiên bản tối thiểu | Ghi chú |
|---------|---------------------|---------|
| Node.js | 18+ / 20+ (LTS) | |
| npm | 9+ | hoặc pnpm 8+ |
| MySQL | 8.0+ | Cài local trên máy hoặc qua package manager |
| Git | — | |

### 2.2 Cấu hình môi trường

- Backend: `.env` chứa DB connection, JWT secret, JWT expiry.
- Frontend: `.env` chứa `VITE_API_BASE_URL`.
- **Không commit** file `.env` thật — commit `.env.example`.

**Các port đã chốt:**

| Service | Port | Ghi chú |
|---------|------|---------|
| Backend dev server | 5011 | NestJS |
| Frontend dev server | 5173 | Vite mặc định |
| MySQL | 3306 | MySQL internal/default port. Môi trường Docker local dùng host port `3307` (map đến container `3306`). MCP MySQL đã cấu hình sẵn trong OpenCode dùng port `3307`. |

**Công cụ xem database:** Không dùng Adminer/phpMyAdmin. Khi cần xem database local, dùng DBeaver, MySQL Workbench hoặc MySQL CLI.

---

## 3. Kế hoạch chi tiết

### Ngày 1: Setup dự án + Database

| Task | Mô tả |
|------|-------|
| 1.1 | Khởi tạo backend NestJS |
| 1.2 | Khởi tạo frontend Vite |
| 1.3 | Tạo MySQL database |
| 1.4 | Cấu hình TypeORM + ConfigService |
| 1.5 | Tạo migration đầu tiên (users, roles, staff) |
| 1.6 | Chạy migration + seed tài khoản QUAN_TRI_HE_THONG |

**Checklist hoàn thành Ngày 1:**
- [ ] Backend khởi động được
- [ ] Frontend khởi động được
- [ ] Kết nối MySQL kiểm tra được
- [ ] Có cấu hình biến môi trường mẫu (`.env.example`)
- [ ] Database có bảng roles, users, staff

### Ngày 2: Auth module + Phân quyền

| Task | Mô tả |
|------|-------|
| 2.1 | Auth module: login, refresh, logout |
| 2.2 | JWT strategy + middleware xác thực |
| 2.3 | Phân quyền theo 6 actor |
| 2.4 | Frontend: Login page + AuthContext |
| 2.5 | Frontend: ProtectedRoute cơ bản |

**Kết quả Ngày 2:** Đăng nhập/đăng xuất hoạt động. Phân biệt quyền theo 6 actor.

### Ngày 3: Hoàn thiện + Kiểm thử

| Task | Mô tả |
|------|-------|
| 3.1 | Frontend: AppLayout cơ bản (sidebar rỗng) |
| 3.2 | Kiểm tra toàn bộ luồng đăng nhập/đăng xuất |
| 3.3 | Kiểm tra phân quyền (ai thấy gì, ai làm gì) |
| 3.4 | Chạy lint + typecheck |

---

## 4. Kịch bản kiểm thử Sprint 1

| # | Kịch bản | Kỳ vọng |
|---|----------|---------|
| T1 | Đăng nhập thành công với tài khoản QUAN_TRI_HE_THONG | Token hợp lệ, vào được trang chính |
| T2 | Đăng nhập sai mật khẩu | Báo lỗi, không vào được |
| T3 | Truy cập API không có token | Bị từ chối |
| T4 | PHUC_VU không vào được trang quản lý nhân viên | Bị từ chối quyền |
| T5 | Refresh token | Token mới được cấp |
| T6 | Đăng xuất | Token hết hiệu lực |

---

## 5. Rủi ro & Giảm thiểu

| Rủi ro | Tác động | Giảm thiểu |
|--------|----------|-----------|
| Lưu token không đúng chuẩn bảo mật | Token bị lộ, CSRF/XSS attack | Dùng httpOnly cookie cho refresh token, access token lưu trong memory, không dùng localStorage |
| Nhóm chưa quen NestJS | Chậm tiến độ | Dành 0.5 ngày đầu để học NestJS cơ bản |
| MySQL chưa cài trên máy dev | Mất thời gian setup | Cài MySQL 8.0+ local theo OS (apt/brew/choco) |

---

## 6. Định nghĩa "Done" cho Sprint 1

- [ ] Backend khởi động được không lỗi
- [ ] Frontend khởi động được không lỗi
- [ ] Kết nối MySQL kiểm tra được
- [ ] Có cấu hình biến môi trường mẫu (`.env.example`)
- [ ] Có tài khoản QUAN_TRI_HE_THONG mặc định
- [ ] Đăng nhập / đăng xuất cơ bản chạy được
- [ ] Phân quyền theo vai trò được chuẩn bị
- [ ] Không commit secret
