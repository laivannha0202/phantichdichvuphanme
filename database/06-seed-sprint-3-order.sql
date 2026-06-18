-- ============================================================
-- 06-seed-sprint-3-order.sql
-- Sprint 3: Gọi Món / Phục Vụ — Seed Data
--
-- Hệ thống quản lý nhà hàng
-- Chạy sau: 05-schema-sprint-3-order.sql
--
-- Seed: 3 orders mẫu + order items
-- ============================================================

USE quanlynhahang;

-- ============================================================
-- 1. Seed Orders — 3 đơn mẫu
-- ============================================================

-- Đơn 1: Bàn B03 (id=3, CO_KHACH) — đang chuẩn bị
INSERT INTO orders (table_id, order_code, status, note, created_by_user_id, created_at) VALUES
  (3, 'ORD-20260615-001', 'DANG_CHUAN_BI', 'Khách yêu cầu ít cay', 1, NOW(3));

-- Đơn 2: Bàn B07 (id=7, CO_KHACH) — đang phục vụ
INSERT INTO orders (table_id, order_code, status, note, created_by_user_id, created_at) VALUES
  (7, 'ORD-20260615-002', 'DANG_PHUC_VU', NULL, 1, NOW(3));

-- Đơn 3: Bàn VIP02 (id=10, CO_KHACH) — đã hoàn thành
INSERT INTO orders (table_id, order_code, status, note, created_by_user_id, created_at, completed_at) VALUES
  (10, 'ORD-20260615-003', 'HOAN_THANH', 'Khách đã thanh toán', 1, DATE_SUB(NOW(3), INTERVAL 2 HOUR), DATE_SUB(NOW(3), INTERVAL 1 HOUR));

-- ============================================================
-- 2. Seed Order Items — Món mẫu
-- ============================================================

-- Đơn 1: 2 món
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, note, status) VALUES
  (1, 1, 2, 45000.00, NULL, 'CHO_CHE_BIEN'),    -- Gỏi Cuốn x2
  (1, 4, 1, 65000.00, 'Ít cay', 'CHO_CHE_BIEN'); -- Phở Bò x1

-- Đơn 2: 3 món
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, note, status) VALUES
  (2, 5, 1, 55000.00, NULL, 'DA_PHUC_VU'),       -- Bún Chả x1 (đã phục vụ)
  (2, 6, 2, 50000.00, NULL, 'HOAN_THANH'),        -- Cơm Tấm x2 (hoàn thành)
  (2, 9, 3, 15000.00, NULL, 'DANG_CHE_BIEN');     -- Coca Cola x3 (đang chế biến)

-- Đơn 3: 2 món (đã hoàn thành)
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, note, status) VALUES
  (3, 3, 1, 50000.00, NULL, 'HOAN_THANH'),        -- Nem Chua Rán x1
  (3, 12, 2, 25000.00, NULL, 'HOAN_THANH');       -- Bánh Flan x2

-- ============================================================
-- 3. Verify
-- ============================================================
-- SELECT COUNT(*) AS total_orders FROM orders;
-- SELECT COUNT(*) AS total_order_items FROM order_items;
-- SELECT o.order_code, o.status, t.name AS table_name, COUNT(oi.id) AS item_count
--   FROM orders o
--   JOIN tables t ON o.table_id = t.id
--   LEFT JOIN order_items oi ON oi.order_id = o.id
--   GROUP BY o.id;
