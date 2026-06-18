# Quy ước Database Migration và file SQL — Hệ thống quản lý nhà hàng

> ⚠️ **Tài liệu Thiết kế Kỹ thuật** — Dành cho Developer/Tech Lead.
> **Không phải tài liệu nghiệp vụ chính thức.** Không dùng cho khách hàng/PM/BA.
> Xem `docs/nghiepvu/` cho tài liệu nghiệp vụ.

---

## 1. Mục đích tài liệu

- Tài liệu này giải thích cách dự án quản lý database.
- Dự án dùng **quy ước SQL-first**: file `.sql` trong `database/` là **script chính thức** để dựng database thủ công.
- **TypeORM migration/seed** là bản tương ứng trong code backend, phải **khớp 100%** với SQL.
- Chạy SQL xong phải tạo được database, bảng và dữ liệu nền.
- Backend API phải đọc được dữ liệu sau khi import SQL.

## 2. Nguyên tắc chung

| Nội dung | Quyết định |
|----------|------------|
| **Source chính của schema** | **File `.sql` trong `database/`** |
| TypeORM migration | Bản tương ứng trong code backend, phải khớp SQL |
| Khi thay đổi database | Cập nhật cả SQL + TypeORM migration + seed (nếu có) |
| `synchronize: true` | **KHÔNG dùng** — tắt hoàn toàn |
| Tự tạo bảng ngoài Sprint hiện tại | **KHÔNG** tự tạo nếu chưa được yêu cầu |
| Secret thật trong file SQL | **KHÔNG** đưa secret thật vào (trừ bcrypt hash mẫu admin dev) |

## 3. Quy ước SQL-first

### 3.1 File SQL là chính thức

- File `.sql` trong `database/` là **script chính thức** để dựng database.
- Chạy SQL xong phải tạo được database, bảng và dữ liệu nền.
- Backend API phải đọc được dữ liệu sau khi import SQL.
- Khi nộp đồ án, SQL phải chạy được độc lập trên MySQL 8.x.

### 3.2 TypeORM migration là bản tương ứng

- TypeORM migration/seed vẫn dùng cho dev workflow.
- Migration/seed phải **khớp 100%** với SQL (schema + seed data).
- Khi tạo bảng mới phải cập nhật cả:
  1. `database/*.sql` (SQL chính thức)
  2. TypeORM migration (code backend)
  3. TypeORM seed nếu có dữ liệu nền
  4. `docs/thietke/02` (thiết kế database)
  5. `docs/features` tương ứng

### 3.3 Không dùng synchronize

- `synchronize: true` **tuyệt đối không dùng** ở mọi môi trường.
- Mọi thay đổi schema phải qua migration.

## 4. Phân biệt SQL chính thức và TypeORM migration

| Tiêu chí | File `.sql` (chính thức) | TypeORM migration |
|----------|--------------------------|-------------------|
| Vai trò | **Script chính thức** dựng database | Bản tương ứng trong code backend |
| Khi dùng | Import thủ công, nộp đồ án, kiểm tra | Khi chạy backend, dev workflow |
| Ai dùng | Giảng viên, người kiểm tra, dev | Lập trình viên, CI/CD |
| Là source chính? | **Có** | Không — phải khớp SQL |
| Dùng khi backend chạy thật? | Import trước khi chạy backend | Chạy tự động khi backend khởi tạo |
| Phù hợp nộp đồ án? | **Có** — mở file là xem được | Không — cần chạy code |

> **Chốt:** File `.sql` là source chính. TypeORM migration là bản tương ứng trong code, phải khớp SQL.

## 5. Quy ước thư mục

| Loại | Đường dẫn |
|------|-----------|
| **SQL chính thức** | `database/` |
| TypeORM migration | `backend/src/database/migrations/` |
| Seed script | `backend/src/database/seeds/` |

**Quy ước đặt tên file SQL:**

| STT | File | Nội dung |
|-----|------|----------|
| 00 | `00-create-database.sql` | Tạo database |
| 01 | `01-schema-sprint-1-auth-role-user.sql` | Schema Sprint 1 |
| 02 | `02-seed-sprint-1-auth-role-user.sql` | Seed Sprint 1 |
| 03 | `03-schema-sprint-2-table-menu.sql` | Schema Sprint 2 |
| 04 | `04-seed-sprint-2-table-menu.sql` | Seed Sprint 2 |
| ... | ... | Tương tự cho các Sprint tiếp theo |

## 6. Quy ước file SQL Sprint 1

File `database/01-schema-sprint-1-auth-role-user.sql` **tạo 3 bảng**:

- `roles`
- `staff`
- `users`

File `database/02-seed-sprint-1-auth-role-user.sql` **seed**:

- 6 roles: `QUAN_TRI_HE_THONG`, `QUAN_LY`, `PHUC_VU`, `THU_NGAN`, `BEP`, `KHO`
- Admin user: username `admin`, role `QUAN_TRI_HE_THONG`, status `ACTIVE`

**Không được có trong Sprint 1:**

- Bảng bàn
- Bảng thực đơn
- Bảng gọi món
- Bảng thanh toán
- Bảng bếp
- Bảng kho
- Bảng báo cáo
- QR order
- Voucher / tích điểm

## 7. Quy ước seed admin

- **Không** seed admin bằng mật khẩu plain text trong SQL.
- Nếu SQL có seed admin thì password phải là **bcrypt hash mẫu local/dev**.
- **Ưu tiên** seed admin bằng **TypeORM seed script** để đảm bảo hash bằng `bcrypt`.
- Tài khoản admin local/dev chỉ dùng kiểm thử, **không phải tài khoản production**.

## 8. Quy trình khi thay đổi database

Thứ tự thực hiện khi cần thay đổi database:

1. Cập nhật file `.sql` trong `database/` (schema + seed nếu có).
2. Cập nhật hoặc tạo TypeORM migration khớp với SQL.
3. Cập nhật entity nếu cần.
4. Cập nhật TypeORM seed nếu có dữ liệu nền.
5. Build/test backend.
6. Chạy SQL trên database local để verify.
7. Chạy migration trên database local để verify.
8. Kiểm tra schema SQL và migration khớp nhau.
9. Cập nhật `docs/thietke/02` nếu cần.
10. Cập nhật `docs/features` tương ứng.

## 9. Quy tắc kiểm soát phạm vi

- Sprint nào chỉ tạo SQL cho phạm vi sprint đó.
- **Sprint 1 chỉ Auth + Role + User** — không thêm bảng ngoài phạm vi.
- Không đưa full 15 bảng MVP vào file Sprint 1.
- Không tạo bảng ngoài kế hoạch.
- Không dùng SQL để đi tắt thay migration.
- Không đưa secret thật vào SQL.

## 10. Quy tắc TypeORM migration an toàn (ESM-safe)

| Quy tắc | Chi tiết |
|---------|----------|
| TypeORM config không dùng `__dirname` | Dùng `process.cwd()` thay thế vì Node.js v25+ với `"module": "Node16"` gây lỗi ESM |
| Migration script phải chạy được bằng `npm run migration:run` | Script dùng `tsx node_modules/.bin/typeorm` thay vì `typeorm` trực tiếp |
| Không tạo migration bằng file tạm | Không tạo file `migration-runner.ts` trong source rồi quên xóa |
| Cài `tsx` làm devDependency | `npm install --save-dev tsx` — cần cho ESM compatibility |
| Luôn truyền DB_PASSWORD qua env var | `DB_PASSWORD='xxx' npm run migration:run` — KHÔNG hardcode trong file |

**Cấu hình hiện tại (`package.json`):**
```json
"migration:generate": "tsx node_modules/.bin/typeorm migration:generate -d src/config/typeorm.config.ts",
"migration:run": "tsx node_modules/.bin/typeorm migration:run -d src/config/typeorm.config.ts",
"migration:revert": "tsx node_modules/.bin/typeorm migration:revert -d src/config/typeorm.config.ts"
```

## 11. Kết luận

- Dự án dùng **quy ước SQL-first**: file `.sql` trong `database/` là script chính thức.
- TypeORM migration/seed là bản tương ứng trong code, phải khớp 100% với SQL.
- Sprint 1 đã có file SQL chính thức: `00-create-database.sql`, `01-schema-sprint-1-auth-role-user.sql`, `02-seed-sprint-1-auth-role-user.sql`.
- Sprint 2 trở đi sẽ tạo thêm file SQL theo quy ước đặt tên.
