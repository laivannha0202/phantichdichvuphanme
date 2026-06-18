# TODO — Tài liệu chờ xử lý

> Các mục dưới đây chờ xác nhận, chưa chốt, hoặc cần bổ sung.
> Cập nhật khi có quyết định.

---

## 1. File chưa tạo

Các file được tham chiếu nhưng chưa tồn tại:

| File dự kiến | Mục đích | Trạng thái |
|-------------|----------|-----------|
| `docs/AUDIT_NGHIEP_VU.md` | Kiểm tra tính nhất quán giữa các tài liệu nghiệp vụ | Chưa tạo — cần xác định scope trước |
| `docs/AUDIT_CODE_THEO_FEAT.md` | Audit code theo feature — kiểm tra code có match spec không | Chưa tạo — cần có code trước |
| `docs/ADR-001-enum-chuan-hoa.md` | Architecture Decision Record — quyết định chuẩn hóa enum | Chưa tạo — đang trong giai đoạn thiết kế |
| `docs/ma-tran-phan-quyen-api.md` | Ma trận phân quyền API — mapping actor × endpoint × permission | Chưa tạo — cần chốt API endpoints trước |

---

## 2. Câu hỏi chờ khách hàng xác nhận

Từ file `docs/nghiepvu/07-cau-hoi-lam-ro.md` — 74 câu hỏi, tất cả trạng thái **"Chưa trả lời"**.

Các nhóm câu hỏi chính:

| Nhóm | Số câu | Chủ đề |
|------|:------:|--------|
| SCOPE | 8 | Phạm vi hệ thống, tích hợp, multi-tenant |
| TBL | 9 | Quản lý bàn, sảnh, khu vực |
| RES | 7 | Đặt bàn, đặt online, deposits |
| ORD | 11 | Gọi món, modifier, ghi chú |
| KIT | 8 | In bill bếp, KOT, priority, allergen |
| PAY | 10 | Thanh toán, split bill, tip, method |
| MNU | 8 | Thực đơn, modifier, giá theo ngày |
| INV | 8 | Kho, unit conversion, cost |
| RPT | 7 | Báo cáo, compliance, export |
| AUTH | 8 | Nhân viên, RBAC, audit log |

**Hành động:** Khi nào khách hàng trả lời → cập nhật `docs/nghiepvu/07-cau-hoi-lam-ro.md` và `docs/nghiepvu/12-quyet-dinh-gia-dinh-mvp.md`.

---

## 3. Quyết định cần xác nhận trước Sprint 2

Từ file `docs/nghiepvu/12-quyet-dinh-gia-dinh-mvp.md` — Theo Phụ lục lịch trình xác nhận:

| Mã | Tóm tắt quyết định | Ảnh hưởng nếu sai |
|----|---------------------|-------------------|
| Q-TBL-01 | Có những khu vực bàn nào? | Ảnh hưởng đến thiết kế dữ liệu bàn |
| Q-RES-03 | Thời gian giữ bàn mặc định là bao lâu? | Ảnh hưởng đến luồng chuyển trạng thái tự động |
| Q-MNU-01 | Có cần quản lý size/topping/combo không? | Ảnh hưởng đến cấu trúc dữ liệu món ăn |

---

## 4. Items cần bổ sung trong docs/nghiepvu/

| File | Cần bổ sung | Lý do |
|------|-----------|-------|
| 01-tong-quan-yeu-cau-chuan-hoa.md | Ghi chú nguồn tham khảo (nếu có) | Hiện tại ghi "N/A" ở phần references |
| 08-pham-vi-mvp-va-backlog.md | Phân tích dependencies giữa các backlog items | Hiện tại chưa có dependency mapping |
| 09-user-stories-va-sprint-goi-y.md | Story point ước lượng chi tiết | Hiện tại chỉ có điểm rough estimate |
| 11-traceability-matrix-tong-hop.md | Verify không có blank cells | Cần check toàn bộ matrix |

---

## 5. Việc đã hoàn thành trong Sprint 1

| Việc | Trạng thái |
|---|---|
| Seed admin ban đầu | ✅ Đã thực hiện ở Sprint 1 — `backend/src/database/seeds/seed.ts` seed 6 roles và admin `admin / Admin@123` |

---

## 6. Cập nhật khi có thay đổi

| Ngày | Thay đổi | Người cập nhật |
|------|----------|----------------|
| 2025-07-11 | Tạo file TODO.md từ phân tích docs/ | Agent |
| | | |
