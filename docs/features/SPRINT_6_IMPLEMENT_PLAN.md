# SPRINT_6_IMPLEMENT_PLAN.md — Kế hoạch triển khai Sprint 6

**Ngày:** 2026-06-16
**Sprint:** 6 — Đặt bàn trước (Reservation)

---

## 1. Mục tiêu

Triển khai chức năng đặt bàn trước cho nhà hàng, bao gồm tạo, xác nhận, check-in, hủy, đánh dấu khách không đến, và đồng bộ trạng thái bàn.

## 2. Phạm vi Sprint 6

### 2.1 Bảng mới

| Bảng | Mô tả |
|------|-------|
| `reservations` | Đặt bàn trước |

### 2.2 SQL files

| File | Mô tả |
|------|-------|
| `database/11-schema-sprint-6-reservation.sql` | Schema reservations |
| `database/12-seed-sprint-6-reservation.sql` | Seed 6 reservation mẫu |

### 2.3 Backend

| Component | File |
|-----------|------|
| Migration | `backend/src/database/migrations/1770000000000-CreateReservations.ts` |
| Entity | `backend/src/database/entities/reservation.entity.ts` |
| Module | `backend/src/modules/reservations/reservation.module.ts` |
| Controller | `backend/src/modules/reservations/reservation.controller.ts` |
| Service | `backend/src/modules/reservations/reservation.service.ts` |
| DTOs | `dto/create-reservation.dto.ts`, `dto/update-reservation.dto.ts`, `dto/update-reservation-status.dto.ts` |

### 2.4 Frontend

| Component | File |
|-----------|------|
| Page | `frontend/src/pages/ReservationsPage.tsx` |
| API | `frontend/src/api/reservations.api.ts` |
| Types | `frontend/src/types/sprint6.types.ts` |
| Route | `/reservations` |
| Sidebar | Thêm "Đặt bàn" (CalendarOutlined) |

## 3. API Endpoints

| Method | Path | Mô tả | RBAC |
|--------|------|-------|------|
| POST | /api/reservations | Tạo đặt bàn | QUAN_TRI, QUAN_LY, PHUC_VU |
| GET | /api/reservations | Danh sách đặt bàn | QUAN_TRI, QUAN_LY, PHUC_VU, THU_NGAN |
| GET | /api/reservations/:id | Chi tiết đặt bàn | QUAN_TRI, QUAN_LY, PHUC_VU, THU_NGAN |
| PATCH | /api/reservations/:id | Cập nhật đặt bàn | QUAN_TRI, QUAN_LY, PHUC_VU |
| PATCH | /api/reservations/:id/confirm | Xác nhận | QUAN_TRI, QUAN_LY, PHUC_VU |
| PATCH | /api/reservations/:id/check-in | Check-in | QUAN_TRI, QUAN_LY, PHUC_VU |
| PATCH | /api/reservations/:id/cancel | Hủy | QUAN_TRI, QUAN_LY |
| PATCH | /api/reservations/:id/no-show | Không đến | QUAN_TRI, QUAN_LY |
| DELETE | /api/reservations/:id | Soft delete | QUAN_TRI, QUAN_LY |

## 4. Business Rules

1. Chỉ đặt bàn cho bàn tồn tại và không BAO_TRI
2. guest_count >= 1 và <= capacity bàn
3. reservation_time phải >= thời điểm hiện tại
4. Một bàn không trùng reservation DA_XAC_NHAN/DA_NHAN_BAN
5. Xác nhận: CHO_XAC_NHAN → DA_XAC_NHAN, bàn TRONG → DA_DAT
6. Check-in: DA_XAC_NHAN → DA_NHAN_BAN, bàn DA_DAT → CO_KHACH
7. Hủy: CHO_XAC_NHAN/DA_XAC_NHAN → DA_HUY
8. No-show: DA_XAC_NHAN → KHONG_DEN
9. Hoàn thành: DA_NHAN_BAN → HOAN_THANH

## 5. Trạng thái Reservation

| Status | Mô tả |
|--------|-------|
| CHO_XAC_NHAN | Chờ xác nhận |
| DA_XAC_NHAN | Đã xác nhận |
| DA_NHAN_BAN | Đã nhận bàn |
| HOAN_THANH | Hoàn thành |
| KHONG_DEN | Khách không đến |
| DA_HUY | Đã hủy |

## 6. Acceptance Criteria

- [ ] Tạo đặt bàn thành công
- [ ] Không đặt bàn trong quá khứ
- [ ] Không guest_count vượt capacity
- [ ] Không đặt bàn bảo trì
- [ ] Không trùng reservation cùng bàn/cùng thời gian
- [ ] Xác nhận đặt bàn đổi bàn sang DA_DAT
- [ ] Check-in đổi bàn sang CO_KHACH
- [ ] Hủy/no-show trả bàn về TRONG nếu hợp lệ
- [ ] Frontend hiển thị danh sách đặt bàn
- [ ] Frontend có filter trạng thái/ngày
- [ ] Frontend có nút thao tác theo trạng thái

---

**Hết kế hoạch.**
