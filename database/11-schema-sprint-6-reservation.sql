-- ============================================================
-- 11-schema-sprint-6-reservation.sql
-- Sprint 6: Đặt bàn trước — Schema
--
-- Hệ thống quản lý nhà hàng
-- Chạy sau: 10-seed-sprint-5-kitchen.sql
-- Chạy trước: 12-seed-sprint-6-reservation.sql
--
-- Bảng: reservations
-- ============================================================

USE quanlynhahang;

-- ============================================================
-- 1. Bảng reservations — Đặt bàn trước
-- ============================================================
CREATE TABLE IF NOT EXISTS reservations (
  id                    INT           NOT NULL AUTO_INCREMENT,
  reservation_code      VARCHAR(50)   NOT NULL,
  table_id              INT           NOT NULL,
  customer_name         VARCHAR(100)  NOT NULL,
  customer_phone        VARCHAR(20)   NOT NULL,
  guest_count           INT           NOT NULL,
  reservation_time      DATETIME(3)   NOT NULL,
  status                VARCHAR(50)   NOT NULL DEFAULT 'CHO_XAC_NHAN',
  note                  TEXT          DEFAULT NULL,
  created_by_user_id    INT           DEFAULT NULL,
  confirmed_at          DATETIME(3)   DEFAULT NULL,
  seated_at             DATETIME(3)   DEFAULT NULL,
  cancelled_at          DATETIME(3)   DEFAULT NULL,
  no_show_at            DATETIME(3)   DEFAULT NULL,
  completed_at          DATETIME(3)   DEFAULT NULL,
  created_at            DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at            DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at            DATETIME(3)   DEFAULT NULL,

  PRIMARY KEY (id),
  UNIQUE INDEX idx_reservations_code (reservation_code),
  INDEX idx_reservations_table_id (table_id),
  INDEX idx_reservations_customer_phone (customer_phone),
  INDEX idx_reservations_reservation_time (reservation_time),
  INDEX idx_reservations_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. Foreign Keys
-- ============================================================
ALTER TABLE reservations
  ADD CONSTRAINT fk_reservations_table_id
  FOREIGN KEY (table_id) REFERENCES tables(id)
  ON DELETE RESTRICT;

ALTER TABLE reservations
  ADD CONSTRAINT fk_reservations_created_by_user_id
  FOREIGN KEY (created_by_user_id) REFERENCES users(id)
  ON DELETE SET NULL;

-- ============================================================
-- Trạng thái reservations:
--   CHO_XAC_NHAN  — Chờ xác nhận
--   DA_XAC_NHAN   — Đã xác nhận
--   DA_NHAN_BAN   — Đã nhận bàn (khách đã đến)
--   HOAN_THANH    — Hoàn thành
--   KHONG_DEN     — Khách không đến
--   DA_HUY        — Đã hủy
--
-- Quy tắc:
--   - Chỉ đặt bàn cho bàn tồn tại và không BAO_TRI
--   - guest_count >= 1 và <= capacity bàn
--   - reservation_time phải >= thời điểm hiện tại
--   - Một bàn không trùng reservation DA_XAC_NHAN/DA_NHAN_BAN
--   - Xác nhận: CHO_XAC_NHAN → DA_XAC_NHAN, bàn TRONG → DA_DAT
--   - Check-in: DA_XAC_NHAN → DA_NHAN_BAN, bàn DA_DAT → CO_KHACH
--   - Hủy: CHO_XAC_NHAN/DA_XAC_NHAN → DA_HUY, bàn về TRONG nếu hợp lệ
--   - No-show: DA_XAC_NHAN → KHONG_DEN, bàn về TRONG nếu hợp lệ
--   - Hoàn thành: DA_NHAN_BAN → HOAN_THANH
-- ============================================================
