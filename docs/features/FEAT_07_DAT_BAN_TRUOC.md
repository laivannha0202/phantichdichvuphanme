# FEAT_07: Đặt bàn trước

## 1. Mục tiêu

Xây dựng tính năng đặt bàn trước (reservation) cho khách hàng, quản lý trạng thái đặt bàn, và tích hợp với quản lý bàn.

## 2. Actor sử dụng

| Actor | Quyền hạn |
|-------|-----------|
| QUAN_TRI_HE_THONG | Full CRUD reservations |
| QUAN_LY | CRUD reservations, xác nhận, huỷ, no-show |
| PHUC_VU | Tạo đặt bàn, xác nhận, nhận bàn |
| BEP | Không có quyền trong feature này |
| THU_NGAN | Không có quyền trong feature này |
| KHO | Không có quyền trong feature này |

## 3. Phạm vi trong feature

- [ ] Tạo đặt bàn mới
- [ ] Xác nhận đặt bàn
- [ ] Hủy đặt bàn
- [ ] Đánh dấu khách không đến (no-show)
- [ ] Nhận bàn (convert reservation → table status)
- [ ] Xem danh sách đặt bàn theo ngày
- [ ] Kiểm tra bàn trống

## 4. Ngoài phạm vi

- Đặt bàn online qua website/app
- Đặt bàn qua điện thoại (call center)
- Tích hợp Google Calendar
- Nhắc nhở đặt bàn (SMS, email)

## 5. Tài liệu nguồn liên quan

- `docs/nghiepvu/03-use-case-chi-tiet.md` — UC-07 Đặt bàn trước
- `docs/nghiepvu/04-quy-tac-nghiep-vu.md` — BR-RES-xx
- `docs/nghiepvu/05-trang-thai-he-thong.md` — Reservation states
- `docs/nghiepvu/06-acceptance-criteria.md` — AC-RES-xx
- `docs/nghiepvu/10-test-case-nghiep-vu.md` — TC-RES-xx
- `docs/nghiepvu/09-user-stories-va-sprint-goi-y.md` — US-44..50

## 6. Quy tắc nghiệp vụ áp dụng

| Rule | Description |
|------|-------------|
| BR-RES-01 | Bàn phải trống (TRONG) tại thời điểm đặt |
| BR-RES-02 | reservation_date ≥ ngày hôm nay |
| BR-RES-03 | party_size ≤ capacity của bàn |
| BR-RES-04 | Chỉ xác nhận đặt bàn CHO_XAC_NHAN |
| BR-RES-05 | Nhận bàn chuyển table_status → CO_KHACH |
| BR-RES-06 | Hủy đặt bàn → table_status về TRONG |
| BR-RES-07 | Khách không đến → KHONG_DEN |
| BR-RES-08 | Mỗi bàn chỉ 1 reservation tại 1 thời điểm |
| BR-RES-09 | Không đặt bàn cho ngày đã qua |
| BR-RES-10 | Kiểm tra trùng lặp reservation |

## 7. Trạng thái/enum liên quan

| Status | Mô tả | Color |
|--------|-------|-------|
| CHO_XAC_NHAN | Chờ xác nhận | Yellow |
| DA_XAC_NHAN | Đã xác nhận | Blue |
| DA_NHAN_BAN | Đã nhận bàn | Green |
| HOAN_THANH | Hoàn thành | Gray |
| KHONG_DEN | Khách không đến | Red |
| DA_HUY | Đã hủy | Red |

## 8. Database cần dùng

### Table: `reservations`

```sql
id              INT PRIMARY KEY AUTO_INCREMENT
table_id        INT NOT NULL FOREIGN KEY → tables(id)
customer_name   VARCHAR(100) NOT NULL
customer_phone  VARCHAR(20) NOT NULL
customer_email  VARCHAR(100)
party_size      INT NOT NULL
reservation_date DATE NOT NULL
reservation_time TIME NOT NULL
status          ENUM('CHO_XAC_NHAN','DA_XAC_NHAN','DA_NHAN_BAN','HOAN_THANH','KHONG_DEN','DA_HUY') DEFAULT 'CHO_XAC_NHAN'
notes           TEXT
created_by      INT FOREIGN KEY → staff(id)
confirmed_by    INT FOREIGN KEY → staff(id)
cancelled_by    INT FOREIGN KEY → staff(id)
created_at      DATETIME(3)
updated_at      DATETIME(3)
```

### Entity Relationships

```
reservations (N) ──── (1) tables
reservations (N) ──── (1) staff (created_by)
```

## 9. Backend cần implement

### Module Structure

```
backend/src/modules/
  reservations/
    reservation.module.ts
    reservation.controller.ts
    reservation.service.ts
    reservation.entity.ts
    dto/
      create-reservation.dto.ts
      update-reservation-status.dto.ts
      check-available.dto.ts
```

### Key Logic

```typescript
async checkAvailability(dto: CheckAvailableDto) {
  const conflicting = await this.reservationRepo.findOne({
    where: {
      table_id: dto.table_id,
      reservation_date: dto.reservation_date,
      status: In(['CHO_XAC_NHAN', 'DA_XAC_NHAN']),
    }
  });
  return { available: !conflicting };
}

async checkin(reservationId: number) {
  const reservation = await this.reservationRepo.findOne({ where: { id: reservationId } });
  await this.tableRepo.update(reservation.table_id, { status: 'CO_KHACH' });
  await this.reservationRepo.update(reservationId, { status: 'DA_NHAN_BAN' });
}
```

## 10. API contract dự kiến

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/reservations` | Tạo đặt bàn mới | QUAN_LY, PHUC_VU |
| GET | `/api/reservations` | Danh sách đặt bàn (filter) | QUAN_TRI_HE_THONG, QUAN_LY, PHUC_VU |
| GET | `/api/reservations/:id` | Chi tiết đặt bàn | QUAN_TRI_HE_THONG, QUAN_LY, PHUC_VU |
| PATCH | `/api/reservations/:id/confirm` | Xác nhận đặt bàn | QUAN_LY, PHUC_VU |
| PATCH | `/api/reservations/:id/checkin` | Nhận bàn | QUAN_LY, PHUC_VU |
| PATCH | `/api/reservations/:id/cancel` | Hủy đặt bàn | QUAN_LY |
| PATCH | `/api/reservations/:id/no-show` | Đánh dấu không đến | QUAN_LY |
| GET | `/api/reservations/available` | Kiểm tra bàn trống | QUAN_TRI_HE_THONG, QUAN_LY, PHUC_VU |

## 11. Frontend cần implement

### Pages

| Page | Path | Description |
|------|------|-------------|
| Reservations | `/reservations` | Danh sách đặt bàn |
| New Reservation | `/reservations/new` | Tạo đặt bàn mới |
| Reservation Calendar | `/reservations/calendar` | Xem theo lịch |

### Components

| Component | Description |
|-----------|-------------|
| `ReservationList` | Danh sách đặt bàn |
| `ReservationForm` | Form tạo đặt bàn |
| `ReservationCard` | Card hiển thị thông tin đặt bàn |
| `CalendarView` | Xem đặt bàn theo lịch |
| `AvailableTableSelector` | Chọn bàn trống |
| `StatusButtons` | Nút chuyển trạng thái |
| `DatePicker` | Chọn ngày giờ đặt bàn |

### UI Flow

```
Reservations Page
├── Filter (Today, Tomorrow, This Week, Custom)
├── Calendar View (optional)
├── Reservation List
│   ├── Reservation Card (19:00 - Bàn 5 - Nguyễn Văn A - 4 khách)
│   │   └── [Xác nhận] [Nhận bàn] [Hủy] [Không đến]
│   └── Reservation Card (20:00 - Bàn VIP 2 - Trần Thị B - 6 khách)
└── New Reservation Button
```

## 12. Validation

| Rule | Description |
|------|-------------|
| table_id | Required, must exist, status = TRONG |
| customer_name | Required, maxLength 100 |
| customer_phone | Required, format Vietnamese phone |
| party_size | Required, min 1, max capacity bàn |
| reservation_date | Required, ≥ hôm nay |
| reservation_time | Required |
| notes | Optional, maxLength 500 |

## 13. Permission/RBAC

| Endpoint | QUAN_TRI_HE_THONG | QUAN_LY | PHUC_VU | BEP | THU_NGAN | KHO |
|----------|:---:|:---:|:---:|:---:|:---:|:---:|
| POST /api/reservations | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /api/reservations | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /api/reservations/:id | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| PATCH /api/reservations/:id/confirm | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| PATCH /api/reservations/:id/checkin | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| PATCH /api/reservations/:id/cancel | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| PATCH /api/reservations/:id/no-show | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/reservations/available | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

## 14. Test case cần pass

### Unit Tests

| Test | Input | Expected |
|------|-------|----------|
| Create reservation success | Valid data, table available | 201 |
| Create reservation table occupied | Table DA_DAT/CO_KHACH | 400 |
| Create reservation past date | yesterday | 400 |
| Create reservation party > capacity | party_size > capacity | 400 |
| Confirm reservation | CHO_XAC_NHAN | 200 |
| Check-in | DA_XAC_NHAN | 200 + table → CO_KHACH |
| Cancel reservation | CHO_XAC_NHAN/DA_XAC_NHAN | 200 |
| No-show | DA_XAC_NHAN | 200 |
| Check availability | table_id + date/time | 200 |

### Integration Tests

| Test | Steps | Expected |
|------|-------|----------|
| Full reservation flow | Create → Confirm → Check-in → Complete | All pass |
| Cancel flow | Create → Cancel → Table free | All pass |
| No-show flow | Create → Confirm → No-show | Table freed |

## 15. Verify commands

```bash
cd backend && npm run test -- --testPathPattern=reservation
cd frontend && npm run lint
cd backend && npx tsc --noEmit
cd frontend && npx tsc --noEmit
```

## 16. Bug checklist

- [ ] Đặt bàn đã đặt →报错 400
- [ ] Đặt bàn ngày quá khứ →报错 400
- [ ] Party size > capacity →报错 400
- [ ] Check-in → table_status = CO_KHACH
- [ ] Cancel → table_status = TRONG
- [ ] Mỗi bàn 1 reservation tại 1 thời điểm
- [ ] Không đặt bàn quá 30 ngày trước

## 17. Definition of Done

- [ ] Code implement đúng acceptance criteria
- [ ] Reservation flow hoạt động đúng (full cycle)
- [ ] Table status sync đúng
- [ ] Unit test pass
- [ ] Integration test pass
- [ ] Không có regression
- [ ] Code review xong
- [ ] Commit message đúng format
- [ ] Documentation cập nhật
