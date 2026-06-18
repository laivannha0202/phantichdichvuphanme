-- =============================================================================
-- Sprint 5: Seed data cho Kitchen Display System
-- =============================================================================
-- Ngày: 2026-06-16
-- Mục đích: Thêm dữ liệu mẫu để bếp có món cần chế biến
-- KHÔNG làm bẩn seed chính Sprint 1-4
-- =============================================================================

-- Thêm 1 order mới cho bếp (DANG_CHUAN_BI = chờ bếp nhận)
INSERT INTO quanlynhahang.orders (order_code, table_id, status, note, created_at, updated_at)
VALUES ('ORD-20260616-001', 5, 'DANG_CHUAN_BI', 'Khách VIP', NOW(3), NOW(3));

-- Thêm items cho order mới (order_id = LAST_INSERT_ID, dùng subquery)
INSERT INTO quanlynhahang.order_items (order_id, menu_item_id, quantity, unit_price, note, status, created_at, updated_at)
VALUES
  ((SELECT id FROM (SELECT MAX(id) AS id FROM quanlynhahang.orders) AS t), 2, 2, 45000, 'Không hành', 'CHO_CHE_BIEN', NOW(3), NOW(3)),
  ((SELECT id FROM (SELECT MAX(id) AS id FROM quanlynhahang.orders) AS t), 7, 1, 55000, NULL, 'CHO_CHE_BIEN', NOW(3), NOW(3)),
  ((SELECT id FROM (SELECT MAX(id) AS id FROM quanlynhahang.orders) AS t), 10, 3, 15000, 'Ít đá', 'CHO_CHE_BIEN', NOW(3), NOW(3));

-- Cập nhật order 1 sang DANG_CHUAN_BI để bếp nhận (nếu chưa đúng)
UPDATE quanlynhahang.orders SET status = 'DANG_CHUAN_BI', updated_at = NOW(3) WHERE id = 1;

-- Đảm bảo items order 1 ở trạng thái CHO_CHE_BIEN
UPDATE quanlynhahang.order_items SET status = 'CHO_CHE_BIEN', updated_at = NOW(3) WHERE order_id = 1 AND status != 'DA_HUY';

-- Seed data summary:
-- Order 1 (ORD-20260615-001): DANG_CHUAN_BI, table 3, 2 items CHO_CHE_BIEN
-- Order MAX (ORD-20260616-001): DANG_CHUAN_BI, table 5, 3 items CHO_CHE_BIEN
-- Tổng: 5 items cần bếp xử lý
-- Lưu ý: order_id tự tăng, dùng subquery để lấy id mới nhất
