# Quy ước cấu trúc thư mục và đặt tên file — Dự án Quản lý Nhà hàng

## 1. Mục đích tài liệu

- Tài liệu này dùng để thống nhất cách tạo thư mục, đặt tên file và nhóm file trong dự án.
- Mục tiêu là tránh rối file khi dự án mở rộng nhiều module.
- Áp dụng cho backend, frontend, database, docs và skill.
- Tài liệu viết tiếng Việt để nhóm dễ hiểu.
- Tên thư mục/file code nên dùng tiếng Anh không dấu để tránh lỗi import/path/build.
- `docs/skill` là nơi lưu tài liệu hướng dẫn OpenCode, MCP, workflow và quy ước phát triển.

## 2. Nguyên tắc chung

| Nguyên tắc | Quy định |
|---|---|
| Ngôn ngữ tên file code | Không đặt tên file code bằng tiếng Việt có dấu |
| Khoảng trắng | Không dùng khoảng trắng trong tên file/thư mục code |
| Tên chung chung | Không dùng tên chung chung như `test.ts`, `new.ts`, `final.ts`, `copy.ts`, `temp.ts` |
| File ở root | Không tạo file trực tiếp ở root nếu không phải config cấp dự án |
| Module ngoài sprint | Không tạo module ngoài phạm vi sprint hiện tại |
| File nghiệp vụ/tài liệu | Có thể dùng tiếng Việt không dấu hoặc tiếng Việt có dấu nếu là markdown |
| Source code | Ưu tiên tiếng Anh: folder/file/method/class/interface |
| UI text | Hiển thị cho người dùng có thể là tiếng Việt |
| Kiểm tra trước khi tạo | Khi tạo file mới phải kiểm tra thư mục/module hiện có trước |
| Cập nhật tài liệu | Khi tạo module mới phải cập nhật README hoặc tài liệu liên quan nếu cần |

## 3. Quy ước root project

Mô tả vai trò các thư mục/file root:

| Đường dẫn | Mục đích | Ghi chú |
|---|---|---|
| `backend/` | Source backend NestJS | API, auth, database config |
| `frontend/` | Source frontend React/Vite | UI web quản trị |
| `database/` | File SQL chính thức dựng database | SQL-first, TypeORM migration phải khớp |
| `docs/` | Tài liệu nghiệp vụ, thiết kế, skill guide | Chia theo nhóm |
| `docs/nghiepvu/` | Tài liệu nghiệp vụ | BA, use case, AC, backlog |
| `docs/thietke/` | Tài liệu thiết kế kỹ thuật | Kiến trúc, DB, BE/FE, SQL convention |
| `docs/skill/` | Hướng dẫn công cụ và quy ước dev | OpenCode, MCP, workflow, naming |
| `README.md` | Hướng dẫn tổng quan dự án | Cập nhật khi cần |
| `.gitignore` | Bỏ qua file không commit | Không commit .env thật |

## 4. Quy ước backend NestJS

### 4.1 Cấu trúc backend đề xuất

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── config/
│   ├── common/
│   │   ├── decorators/
│   │   ├── guards/
│   │   ├── filters/
│   │   └── interceptors/
│   ├── auth/
│   │   ├── dto/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── roles/
│   ├── users/
│   ├── staff/
│   └── database/
│       ├── entities/
│       ├── migrations/
│       └── seeds/
├── test/
├── .env.example
├── package.json
└── tsconfig.json
```

**Ghi chú:**

- Đây là chuẩn định hướng lâu dài.
- Nếu code hiện tại đang dùng `role/` hoặc `user/` dạng số ít, chưa tự đổi ở bước này.
- Nếu muốn đổi tên module cho đồng bộ `roles/`, `users/`, phải làm bằng task refactor riêng và build/test đầy đủ.
- Sprint 1 chưa tạo module bàn/menu/order/payment.

### 4.2 Quy tắc đặt tên backend

| Loại file | Quy tắc | Ví dụ |
|---|---|---|
| Module | kebab/lowercase folder + `.module.ts` | `auth.module.ts` |
| Controller | `[module].controller.ts` | `auth.controller.ts` |
| Service | `[module].service.ts` | `auth.service.ts` |
| Entity | `[singular].entity.ts` | `user.entity.ts`, `role.entity.ts` |
| DTO | `[action]-[entity].dto.ts` hoặc `[name].dto.ts` | `login.dto.ts`, `create-user.dto.ts` |
| Guard | `[purpose].guard.ts` | `jwt-auth.guard.ts`, `roles.guard.ts` |
| Decorator | `[purpose].decorator.ts` | `roles.decorator.ts` |
| Strategy | `[purpose].strategy.ts` | `jwt.strategy.ts` |
| Migration | `[timestamp]-[ActionName].ts` | `1740000000000-CreateRolesUsersStaff.ts` |
| Seed | `seed.ts`, `[module].seed.ts` | `seed.ts`, `roles.seed.ts` |

### 4.3 Quy tắc module backend

- `auth/`: login, refresh token, logout, me.
- `roles/`: quản lý role hoặc API liên quan role.
- `users/`: tài khoản đăng nhập.
- `staff/`: hồ sơ nhân viên.
- `database/entities/`: chỉ chứa entity TypeORM.
- `database/migrations/`: chỉ chứa TypeORM migration.
- `database/seeds/`: chỉ chứa seed script.
- `common/`: dùng chung cho decorator, guard, filter, interceptor.
- Không để controller/service/entity lẫn lộn sai thư mục.
- Không tạo module bàn/menu/order/payment ở Sprint 1.

## 5. Quy ước frontend React/Vite

### 5.1 Cấu trúc frontend đề xuất

```
frontend/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── routes/
│   ├── api/
│   ├── auth/
│   ├── layouts/
│   ├── pages/
│   ├── components/
│   ├── types/
│   └── utils/
├── .env.example
├── package.json
└── vite.config.ts
```

### 5.2 Quy tắc đặt tên frontend

| Loại file | Quy tắc | Ví dụ |
|---|---|---|
| Page | PascalCase + `Page.tsx` | `LoginPage.tsx` |
| Layout | PascalCase + `Layout.tsx` | `MainLayout.tsx` |
| Component | PascalCase `.tsx` | `UserMenu.tsx` |
| Hook | `useX.ts` | `useAuth.ts` |
| Context | PascalCase + `Context.tsx` | `AuthContext.tsx` |
| API file | `[module].api.ts` | `auth.api.ts` |
| Type file | `[module].types.ts` | `auth.types.ts` |
| Utils | camelCase hoặc kebab-case | `formatDate.ts` |

**Ghi chú:**

- Text hiển thị trên UI có thể dùng tiếng Việt.
- Tên component/file code dùng tiếng Anh.
- Không nhét nhiều page/module vào một file lớn.
- Không tạo page nghiệp vụ chưa thuộc sprint.

## 6. Quy ước database và SQL

- **SQL-first**: File `.sql` trong `database/` là script chính thức dựng database.
- TypeORM migration/seed phải **khớp 100%** với SQL.
- File SQL theo sprint (đặt tên theo thứ tự):
  - `database/00-create-database.sql`
  - `database/01-schema-sprint-1-auth-role-user.sql`
  - `database/02-seed-sprint-1-auth-role-user.sql`
  - `database/03-schema-sprint-2-table-menu.sql`
  - `database/04-seed-sprint-2-table-menu.sql`
- Khi tạo bảng mới phải cập nhật cả SQL + TypeORM migration + seed.
- Không dùng `synchronize: true`.
- Không để SQL trong `backend/src/database/migrations/`.
- Chi tiết: `docs/thietke/06-quy-uoc-database-migration-sql.md`

## 7. Quy ước tài liệu docs

- `docs/nghiepvu/`: tài liệu nghiệp vụ.
- `docs/thietke/`: thiết kế kỹ thuật.
- `docs/skill/`: hướng dẫn OpenCode/MCP, workflow, quy ước file, quy trình dev.
- File markdown nên đánh số thứ tự nếu là tài liệu chính:
  - `00-...`
  - `01-...`
  - `02-...`
- Tên file markdown dùng chữ thường, không dấu, phân tách bằng dấu gạch ngang.
- Không tạo lại `docs/dev`.

## 8. Quy tắc chống rối file

- [ ] Trước khi tạo file mới, kiểm tra có file tương tự chưa.
- [ ] Không tạo file trùng chức năng.
- [ ] Không tạo file tạm trong source.
- [ ] Không tạo thư mục chỉ có 1 file nếu chưa cần.
- [ ] Không để file build/dist/node_modules vào git.
- [ ] Không tạo file ngoài phạm vi prompt.
- [ ] Không tạo module nghiệp vụ ngoài sprint.
- [ ] Sau mỗi task phải báo cáo file đã tạo/sửa.
- [ ] Sau mỗi task nên kiểm tra build/lint nếu có sửa code.
- [ ] Khi refactor tên file/thư mục phải sửa import và build lại.

## 9. Quy trình khi AI/OpenCode tạo file mới

1. Đọc docs liên quan.
2. Xác định layer: backend/frontend/database/docs/skill.
3. Xác định module.
4. Kiểm tra file đã tồn tại chưa.
5. Tạo file đúng thư mục.
6. Đặt tên đúng quy tắc.
7. Cập nhật export/import nếu cần.
8. Build/test nếu sửa code.
9. Báo cáo file đã tạo/sửa.
10. Không commit/push nếu user chưa yêu cầu.

## 10. Kết luận

- Tài liệu này là chuẩn đặt tên và nhóm file cho toàn dự án.
- Backend/frontend vẫn dùng tên file code tiếng Anh không dấu.
- Tài liệu/README giải thích bằng tiếng Việt để nhóm dễ đọc.
- Mọi task code sau này phải bám theo quy ước này.
- `docs/skill` là thư mục chuẩn cho tài liệu kỹ năng/công cụ/quy trình dev, không dùng `docs/dev`.
