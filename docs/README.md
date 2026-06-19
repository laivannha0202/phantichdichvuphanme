# Tài liệu dự án — Quản lý Nhà hàng

> **Mục lục tổng** cho toàn bộ tài liệu docs/. Chọn đúng thư mục theo nhu cầu.

---

## Cấu trúc thư mục

```
docs/
├── README.md              ← Bạn đang đọc đây
├── TODO.md                ← Các mục chờ xác nhận / chưa chốt
├── nghiepvu/              ← Tài liệu Nghiệp vụ (business docs)
├── thietke/               ← Thiết kế Kỹ thuật (technical appendix)
├── features/              ← Đặc tả Tính năng (feature specifications)
└── skill/                 ← Hướng dẫn công cụ & quy trình dev
```

---

## 1. Tài liệu Nghiệp vụ (`nghiepvu/`)

> **Dành cho:** Business Analyst, Product Owner, khách hàng, PM.
> **Không chứa:** Code, endpoint API, controller, service, migration, commit.

| File | Nội dung | Khi nào đọc |
|------|----------|-------------|
| [00-kiem-tra-va-danh-gia-yeu-cau.md](nghiepvu/00-kiem-tra-va-danh-gia-yeu-cau.md) | Đánh giá, góp ý và kiểm tra chất lượng yêu cầu | Khi review lại yêu cầu |
| [01-tong-quan-yeu-cau-chuan-hoa.md](nghiepvu/01-tong-quan-yeu-cau-chuan-hoa.md) | **Tài liệu chính** — Tổng quan yêu cầu đã chuẩn hóa | Bắt đầu dự án |
| [02-actor-va-phan-quyen.md](nghiepvu/02-actor-va-phan-quyen.md) | 6 actor + ma trận phân quyền | Khi thiết kế RBAC |
| [03-use-case-chi-tiet.md](nghiepvu/03-use-case-chi-tiet.md) | 11 Use Case chi tiết (UC-01 → UC-11) | Khi implement chức năng |
| [04-quy-tac-nghiep-vu.md](nghiepvu/04-quy-tac-nghiep-vu.md) | 133 quy tắc nghiệp vụ theo module | Khi code logic nghiệp vụ |
| [05-trang-thai-he-thong.md](nghiepvu/05-trang-thai-he-thong.md) | Trạng thái + luồng chuyển trạng thái (7 nhóm thực thể) | Khi thiết kế state machine |
| [06-acceptance-criteria.md](nghiepvu/06-acceptance-criteria.md) | 65 tiêu chí nghiệm thu | Khi viết test / UAT |
| [07-cau-hoi-lam-ro.md](nghiepvu/07-cau-hoi-lam-ro.md) | 74 câu hỏi chờ khách hàng xác nhận | Khi cần làm rõ yêu cầu |
| [08-pham-vi-mvp-va-backlog.md](nghiepvu/08-pham-vi-mvp-va-backlog.md) | Phạm vi MVP + MoSCoW (34 Must, 14 Should) | Khi chốt scope |
| [09-user-stories-va-sprint-goi-y.md](nghiepvu/09-user-stories-va-sprint-goi-y.md) | 48 User Story + gợi ý 6 Sprint | Khi lập kế hoạch sprint |
| [10-test-case-nghiep-vu.md](nghiepvu/10-test-case-nghiep-vu.md) | Test case nghiệp vụ theo module | Khi chạy UAT / regression |
| [11-traceability-matrix-tong-hop.md](nghiepvu/11-traceability-matrix-tong-hop.md) | Ma trận truy vết FR → UC → AC → TC → US | Khi kiểm tra bao phủ |
| [12-quyet-dinh-gia-dinh-mvp.md](nghiepvu/12-quyet-dinh-gia-dinh-mvp.md) | 42 quyết định giả định MVP (24 tạm chốt + 13 chờ xác nhận + 5 để sau) | Khi thiết kế database / API |

---

## 2. Thiết kế Kỹ thuật (`thietke/`)

> **Dành cho:** Developer, Tech Lead, DevOps.
> **Có chứa:** Code structure, migration, architecture, tech stack.
> **⚠️ Tài liệu tham khảo kỹ thuật** — không phải tài liệu nghiệp vụ chính thức.

| File | Nội dung | Khi nào đọc |
|------|----------|-------------|
| [01-kien-truc-he-thong.md](thietke/01-kien-truc-he-thong.md) | Kiến trúc tổng thể, module, phân luồng | Bắt đầu setup |
| [02-thiet-ke-co-so-du-lieu.md](thietke/02-thiet-ke-co-so-du-lieu.md) | Database schema, relationships, indexes | Khi tạo migration |
| [03-ke-hoach-setup-sprint-1.md](thietke/03-ke-hoach-setup-sprint-1.md) | Kế hoạch setup dự án, sprint 1 | Khi bắt đầu dev |
| [04-cong-nghe-be-fe.md](thietke/04-cong-nghe-be-fe.md) | Danh sách công nghệ BE/FE/DB được chốt | Khi install dependencies |
| [05-ke-hoach-implement-sprint-1.md](thietke/05-ke-hoach-implement-sprint-1.md) | Kế hoạch implement chi tiết Sprint 1 | Khi code Sprint 1 |
| [06-quy-uoc-database-migration-sql.md](thietke/06-quy-uoc-database-migration-sql.md) | Quy ước SQL-first: file SQL chính thức + TypeORM migration phải khớp | Khi tạo migration |

---

## 3. Đặc tả Tính năng (`features/`)

> **Dành cho:** Developer, AI Agent, Tech Lead.
> **Chứa:** Đặc tả chi tiết từng tính năng, API endpoints, DB schema, test cases, acceptance criteria.
> **Mỗi file self-sufficient:** Dev/AI có thể implement BE + FE + test từ 1 file.

| File | Nội dung | Sprint |
|------|----------|--------|
| [README.md](features/README.md) | **Mục lục** đặc tả tính năng | — |
| [FEAT_00_TONG_QUAN_IMPLEMENT.md](features/FEAT_00_TONG_QUAN_IMPLEMENT.md) | Tổng quan Implement & Quy trình Fix Bug | — |
| [FEAT_01_AUTH_ROLE_USER.md](features/FEAT_01_AUTH_ROLE_USER.md) | Đăng nhập / Phân quyền / Quản lý Tài khoản | Sprint 1 ✅ |
| [FEAT_02_QUAN_LY_BAN_KHU_VUC.md](features/FEAT_02_QUAN_LY_BAN_KHU_VUC.md) | Quản lý Khu vực & Bàn | Sprint 2 |
| [FEAT_03_QUAN_LY_THUC_DON.md](features/FEAT_03_QUAN_LY_THUC_DON.md) | Quản lý Thực đơn | Sprint 2 |
| [FEAT_04_GOI_MON_PHUC_VU.md](features/FEAT_04_GOI_MON_PHUC_VU.md) | Gọi món / Phục vụ | Sprint 3 |
| [FEAT_05_BEP_XU_LY_MON.md](features/FEAT_05_BEP_XU_LY_MON.md) | Bếp xử lý món | Sprint 5 |
| [FEAT_06_THANH_TOAN_HOA_DON.md](features/FEAT_06_THANH_TOAN_HOA_DON.md) | Thanh toán / Hoá đơn | Sprint 4 |
| [FEAT_07_DAT_BAN_TRUOC.md](features/FEAT_07_DAT_BAN_TRUOC.md) | Đặt bàn trước | Sprint 6 |
| [FEAT_08_BAO_CAO_DOANH_THU.md](features/FEAT_08_BAO_CAO_DOANH_THU.md) | Báo cáo Doanh thu | Sprint 7 |
| [FEAT_09_KHO_NGUYEN_LIEU.md](features/FEAT_09_KHO_NGUYEN_LIEU.md) | Kho Nguyên liệu | Sprint 8 |
| [FEAT_10_NHAN_VIEN_TAI_KHOAN.md](features/FEAT_10_NHAN_VIEN_TAI_KHOAN.md) | Nhân viên / Tài khoản | Sprint 9 |
| [FEAT_11_AUDIT_LOG.md](features/FEAT_11_AUDIT_LOG.md) | Audit Log & Log theo dõi | Sprint 10 |
| [FEAT_12_ERROR_HANDLING_SECURITY.md](features/FEAT_12_ERROR_HANDLING_SECURITY.md) | Xử lý lỗi & Bảo mật | Sprint 11 |
| [FEAT_13_CHECKLIST_VERIFY_FULLSTACK.md](features/FEAT_13_CHECKLIST_VERIFY_FULLSTACK.md) | Checklist Verify Toàn bộ Hệ thống | Sprint 12 |

---

## 4. Skill / Hướng dẫn (`skill/`)

> **Dành cho:** Dev team, đặc biệt người mới dùng OpenCode/MCP.

| File | Nội dung |
|------|----------|
| [00-huong-dan-su-dung-mcp-opencode.md](skill/00-huong-dan-su-dung-mcp-opencode.md) | Hướng dẫn sử dụng MCP trong OpenCode |
| [01-quy-uoc-cau-truc-thu-muc-va-dat-ten-file.md](skill/01-quy-uoc-cau-truc-thu-muc-va-dat-ten-file.md) | Quy ước cấu trúc thư mục, đặt tên file |

---

## 5. Tài liệu chờ xử lý

| File | Nội dung |
|------|----------|
| [TODO.md](TODO.md) | Các mục chờ xác nhận, chưa chốt, hoặc cần bổ sung |

---

## Luồng đọc gợi ý

```
Khách hàng / PM / BA:
  01 → 03 → 08 → 07 → 12

Developer:
  01 → 03 → 04 → 05 → 06 → 02

Tech Lead / Architect:
  thietke/01 → thietke/02 → thietke/04

Sprint Planning:
  08 → 09 → 12

Implement Sprint:
  features/README → features/FEAT_00 → features/FEAT_XX (theo sprint)
```

---

> **Lưu ý:** Nếu tìm file `AUDIT_NGHIEP_VU.md`, `AUDIT_CODE_THEO_FEAT.md`, `ADR-001-enum-chuan-hoa.md`, hoặc `ma-tran-phan-quyen-api.md` — hiện chưa tồn tại. Xem `TODO.md` để biết kế hoạch tạo chúng.
