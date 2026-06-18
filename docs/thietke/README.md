# Thư mục Thiết kế Kỹ thuật — Quản lý Nhà hàng

Thư mục này chứa các tài liệu thiết kế kỹ thuật cho hệ thống Quản lý Nhà hàng,
được xây dựng dựa trên tài liệu nghiệp vụ tại `docs/nghiepvu/`.

## Nguồn đầu vào

| Tài liệu | Nội dung |
|----------|----------|
| `docs/nghiepvu/01-tong-quan-yeu-cau-chuan-hoa.md` | Tổng quan yêu cầu chuẩn hóa |
| `docs/nghiepvu/02-actor-va-phan-quyen.md` | 6 actor + ma trận phân quyền |
| `docs/nghiepvu/03-use-case-chi-tiet.md` | 11 use case chi tiết |
| `docs/nghiepvu/04-quy-tac-nghiep-vu.md` | 133 business rules |
| `docs/nghiepvu/05-trang-thai-he-thong.md` | 7 nhóm trạng thái + enum chuẩn |
| `docs/nghiepvu/06-acceptance-criteria.md` | 65 acceptance criteria |
| `docs/nghiepvu/07-cau-hoi-lam-ro.md` | 74 câu hỏi chờ KH xác nhận |
| `docs/nghiepvu/08-pham-vi-mvp-va-backlog.md` | Phạm vi MVP + MoSCoW |
| `docs/nghiepvu/09-user-stories-va-sprint-goi-y.md` | User stories + sprint gợi ý |
| `docs/nghiepvu/10-test-case-nghiep-vu.md` | Test case nghiệp vụ |
| `docs/nghiepvu/11-traceability-matrix-tong-hop.md` | Traceability matrix tổng hợp |
| `docs/nghiepvu/12-quyet-dinh-gia-dinh-mvp.md` | Quyết định giả định MVP |

## Danh sách tài liệu

| File | Nội dung |
|------|----------|
| `01-kien-truc-he-thong.md` | Kiến trúc tổng thể, công nghệ, module, phân luồng |
| `02-thiet-ke-co-so-du-lieu.md` | Thiết kế database: entities, relationships, migration |
| `03-ke-hoach-setup-sprint-1.md` | Kế hoạch setup dự án, sprint 1 chi tiết |
| `04-cong-nghe-be-fe.md` | Danh sách công nghệ backend, frontend, database, dev tools và testing được chốt cho dự án |
| `05-ke-hoach-implement-sprint-1.md` | Kế hoạch implement chi tiết Sprint 1: Backend trước, test API, sau đó Frontend |
| `06-quy-uoc-database-migration-sql.md` | Quy ước SQL-first: file SQL chính thức + TypeORM migration phải khớp |
| `API_CONVENTION_SWAGGER.md` | Quy ước API REST, response format, HTTP status, Swagger setup |
| `UI_UX_ADMIN_GUIDELINE.md` | Hướng dẫn UI/UX: layout, components, responsive, color status |
| `MEDIA_IMAGE_PLACEHOLDER.md` | Quy ước xử lý ảnh & placeholder cho menu_items |
| `REPORT_METRIC_FORMULA.md` | Công thức báo cáo doanh thu, metric, chart (Sprint 5) |

## Nguyên tắc thiết kế

1. **Bám sát MVP** — Chỉ thiết kế những gì thuộc phạm vi MVP đã chốt tại
   `docs/nghiepvu/08-pham-vi-mvp-va-backlog.md` và
   `docs/nghiepvu/12-quyet-dinh-gia-dinh-mvp.md`.
2. **Không vẽ tính năng chưa cần** — Các tính năng "Để sau MVP" (file 12)
   không được đưa vào thiết kế database hay module.
3. **Đánh dấu điểm chưa chốt** — Mọi quyết định đang chờ khách hàng xác nhận
   (từ file 07 và 12) đều được ghi rõ với trạng thái "Cần xác nhận".
4. **Mức thiết kế kiến trúc** — Tài liệu ở mức architecture/BA, không chứa
   code mẫu, endpoint cụ thể, lệnh bash, hay cây thư mục source code chi tiết.
   Đủ để nhóm phát triển implement mà không cần hỏi lại nghiệp vụ.
5. **Thiết kế theo layer** — Database → Backend (NestJS) → Frontend (React).
6. **Dùng đúng actor và trạng thái** — Actor dùng 6 vai trò theo file 02.
   Trạng thái dùng enum tiếng Việt theo file 05.

## Công nghệ nền tảng

| Layer | Công nghệ |
|-------|-----------|
| Frontend | React + Vite + TypeScript |
| Backend | NestJS + TypeScript |
| Database | MySQL 8.0 |
| ORM | TypeORM |
| Auth | JWT (access + refresh token) |
| API | REST (JSON) |

## Luồng đọc tài liệu

1. Đọc `01-kien-truc-he-thong.md` để hiểu tổng quan kiến trúc.
2. Đọc `02-thiet-ke-co-so-du-lieu.md` để nắm cấu trúc database.
3. Đọc `03-ke-hoach-setup-sprint-1.md` để biết kế hoạch setup dự án.
4. Đọc `04-cong-nghe-be-fe.md` để chốt danh sách công nghệ BE/FE trước khi code.
5. Đọc `05-ke-hoach-implement-sprint-1.md` để bắt đầu implement Sprint 1 (Backend trước, sau đó Frontend).
6. Đọc `06-quy-uoc-database-migration-sql.md` trước khi tạo hoặc cập nhật file `.sql`.
7. Đọc `API_CONVENTION_SWAGGER.md` trước khi implement API endpoint.
8. Đọc `UI_UX_ADMIN_GUIDELINE.md` trước khi implement UI/UX.
9. Đọc `MEDIA_IMAGE_PLACEHOLDER.md` trước khi xử lý ảnh menu_items.
10. Đọc `REPORT_METRIC_FORMULA.md` khi implement báo cáo (Sprint 5).
