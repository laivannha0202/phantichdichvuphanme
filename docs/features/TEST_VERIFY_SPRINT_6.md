# TEST_VERIFY_SPRINT_6.md — Kiểm thử Sprint 6

**Ngày:** 2026-06-16
**Sprint:** 6 — Đặt bàn trước (Reservation)

---

## 1. Build Verification

### Backend Build

```bash
cd backend && npm run build
```

**Result:** PASS ✅

### Frontend Build

```bash
cd frontend && npm run build
```

**Result:** PASS ✅

---

## 2. Database Verification

### Schema Files

| File | Status |
|------|--------|
| `database/11-schema-sprint-6-reservation.sql` | Created ✅ |
| `database/12-seed-sprint-6-reservation.sql` | Created ✅ |

### Migration File

| File | Status |
|------|--------|
| `backend/src/database/migrations/1770000000000-CreateReservations.ts` | Created ✅ |

### Entity File

| File | Status |
|------|--------|
| `backend/src/database/entities/reservation.entity.ts` | Created ✅ |

---

## 3. API Endpoints

| Method | Path | Status |
|--------|------|--------|
| POST | /api/reservations | Created ✅ |
| GET | /api/reservations | Created ✅ |
| GET | /api/reservations/:id | Created ✅ |
| PATCH | /api/reservations/:id | Created ✅ |
| PATCH | /api/reservations/:id/confirm | Created ✅ |
| PATCH | /api/reservations/:id/check-in | Created ✅ |
| PATCH | /api/reservations/:id/cancel | Created ✅ |
| PATCH | /api/reservations/:id/no-show | Created ✅ |
| DELETE | /api/reservations/:id | Created ✅ |

---

## 4. Frontend Routes

| Route | Component | Status |
|-------|-----------|--------|
| /reservations | ReservationsPage | Created ✅ |

### Sidebar Menu

- "Đặt bàn" (CalendarOutlined) — Added ✅

---

## 5. Business Rules Verification

| Rule | Status |
|------|--------|
| Chỉ đặt bàn cho bàn tồn tại | Implemented ✅ |
| Không đặt bàn BAO_TRI | Implemented ✅ |
| guest_count >= 1 | Implemented ✅ |
| guest_count <= capacity | Implemented ✅ |
| Không đặt bàn quá khứ | Implemented ✅ |
| Không trùng reservation cùng bàn/thời gian | Implemented ✅ |
| Xác nhận: CHO_XAC_NHAN → DA_XAC_NHAN | Implemented ✅ |
| Xác nhận: bàn TRONG → DA_DAT | Implemented ✅ |
| Check-in: DA_XAC_NHAN → DA_NHAN_BAN | Implemented ✅ |
| Check-in: bàn DA_DAT → CO_KHACH | Implemented ✅ |
| Hủy: CHO_XAC_NHAN/DA_XAC_NHAN → DA_HUY | Implemented ✅ |
| No-show: DA_XAC_NHAN → KHONG_DEN | Implemented ✅ |
| Hoàn thành: DA_NHAN_BAN → HOAN_THANH | Implemented ✅ |

---

## 6. Test Commands

```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build

# Database (sau khi chạy SQL)
# mysql -u root -p quanlynhahang < database/11-schema-sprint-6-reservation.sql
# mysql -u root -p quanlynhahang < database/12-seed-sprint-6-reservation.sql

# API Test (sau khi chạy backend)
# GET /api/reservations
# POST /api/reservations
# GET /api/reservations/:id
# PATCH /api/reservations/:id/confirm
# PATCH /api/reservations/:id/check-in
# PATCH /api/reservations/:id/cancel
# PATCH /api/reservations/:id/no-show
```

---

## 7. Notes

- Không thể chạy MySQL CLI (cần password) — SQL cần chạy thủ công
- Backend/.env không tồn tại — không sửa
- Không dùng CLI MySQL password
- Không in secret/password/token

---

**Hết kiểm thử.**
