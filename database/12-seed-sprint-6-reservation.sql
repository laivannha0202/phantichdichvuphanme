-- ============================================================
-- 12-seed-sprint-6-reservation.sql
-- Sprint 6: Đặt bàn trước — Seed Data
--
-- Hệ thống quản lý nhà hàng
-- Chạy sau: 11-schema-sprint-6-reservation.sql
--
-- Seed: 6 reservation mẫu various statuses
-- KHÔNG làm bẩn seed chính Sprint 1-5
-- ============================================================

USE quanlynhahang;

-- ============================================================
-- 1. Seed Reservations — Đặt bàn mẫu
-- ============================================================

-- Reservation 1: CHO_XAC_NHAN — Bàn B01, 4 khách, 18:00 hôm nay
INSERT INTO reservations (reservation_code, table_id, customer_name, customer_phone, guest_count, reservation_time, status, note, created_by_user_id, created_at, updated_at)
VALUES ('RES-20260616-001', 1, 'Nguyễn Văn An', '0901234567', 4, CONCAT(CURDATE(), ' 18:00:00.000'), 'CHO_XAC_NHAN', 'Khách yêu cầu bàn gần cửa sổ', 1, NOW(3), NOW(3));

-- Reservation 2: DA_XAC_NHAN — Bàn B02, 2 khách, 19:00 hôm nay
INSERT INTO reservations (reservation_code, table_id, customer_name, customer_phone, guest_count, reservation_time, status, note, created_by_user_id, confirmed_at, created_at, updated_at)
VALUES ('RES-20260616-002', 2, 'Trần Thị Bình', '0912345678', 2, CONCAT(CURDATE(), ' 19:00:00.000'), 'DA_XAC_NHAN', NULL, 1, NOW(3), NOW(3), NOW(3));

-- Reservation 3: DA_NHAN_BAN — Bàn B05, 3 khách, 12:00 hôm nay (khách đã đến)
INSERT INTO reservations (reservation_code, table_id, customer_name, customer_phone, guest_count, reservation_time, status, note, created_by_user_id, confirmed_at, seated_at, created_at, updated_at)
VALUES ('RES-20260616-003', 5, 'Lê Minh Châu', '0923456789', 3, CONCAT(CURDATE(), ' 12:00:00.000'), 'DA_NHAN_BAN', 'Tiệc sinh nhật', 1, DATE_SUB(NOW(3), INTERVAL 2 HOUR), DATE_SUB(NOW(3), INTERVAL 1 HOUR), NOW(3), NOW(3));

-- Reservation 4: HOAN_THANH — Bàn VIP01, 8 khách, 11:00 hôm nay (đã xong)
INSERT INTO reservations (reservation_code, table_id, customer_name, customer_phone, guest_count, reservation_time, status, note, created_by_user_id, confirmed_at, seated_at, completed_at, created_at, updated_at)
VALUES ('RES-20260616-004', 9, 'Phạm Quốc Dũng', '0934567890', 8, CONCAT(CURDATE(), ' 11:00:00.000'), 'HOAN_THANH', 'Họp công ty', 1, DATE_SUB(NOW(3), INTERVAL 5 HOUR), DATE_SUB(NOW(3), INTERVAL 4 HOUR), DATE_SUB(NOW(3), INTERVAL 2 HOUR), NOW(3), NOW(3));

-- Reservation 5: DA_HUY — Bàn SV01, 4 khách, 17:00 hôm nay (đã hủy)
INSERT INTO reservations (reservation_code, table_id, customer_name, customer_phone, guest_count, reservation_time, status, note, created_by_user_id, cancelled_at, created_at, updated_at)
VALUES ('RES-20260616-005', 12, 'Hoàng Thị Em', '0945678901', 4, CONCAT(CURDATE(), ' 17:00:00.000'), 'DA_HUY', 'Khách đổi ý', 1, DATE_SUB(NOW(3), INTERVAL 3 HOUR), NOW(3), NOW(3));

-- Reservation 6: CHO_XAC_NHAN — Bàn B08, 6 khách, 20:00 ngày mai
INSERT INTO reservations (reservation_code, table_id, customer_name, customer_phone, guest_count, reservation_time, status, note, created_by_user_id, created_at, updated_at)
VALUES ('RES-20260617-001', 8, 'Vũ Thanh Giang', '0956789012', 6, CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), ' 20:00:00.000'), 'CHO_XAC_NHAN', 'Đặt bàn kỷ niệm cưới', 1, NOW(3), NOW(3));

-- ============================================================
-- 2. Verify
-- ============================================================
-- SELECT COUNT(*) AS total_reservations FROM reservations;
-- SELECT reservation_code, customer_name, table_id, status, reservation_time
--   FROM reservations ORDER BY reservation_time;
