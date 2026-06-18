-- ============================================================================
-- Sprint 7 — Báo cáo Doanh thu cơ bản
-- File: 13-note-sprint-7-revenue-report-no-new-table.sql
-- Ngày: 2026-06-16
-- ============================================================================

-- ============================================================================
-- NOTE: Sprint 7 KHÔNG tạo bảng mới
-- ============================================================================

-- Báo cáo doanh thu Sprint 7 CHỈ ĐỌC dữ liệu từ các bảng đã có:
--   - invoices (status = 'DA_THANH_TOAN')
--   - payments
--   - orders
--   - order_items
--   - menu_items

-- Chỉ tính doanh thu từ invoice đã thanh toán (DA_THANH_TOAN).
-- Không tính hóa đơn DA_HUY hoặc CHUA_THANH_TOAN vào doanh thu.
-- Top món bán chạy dựa trên order_items không bị DA_HUY.

-- Query mẫu tham khảo (không chạy trên production):

-- 1. Tổng quan doanh thu
-- SELECT
--   COUNT(DISTINCT i.id) AS total_invoices,
--   COALESCE(SUM(i.total), 0) AS total_revenue,
--   COUNT(DISTINCT o.id) AS total_orders
-- FROM invoices i
-- JOIN orders o ON i.order_id = o.id
-- WHERE i.status = 'DA_THANH_TOAN'
--   AND i.created_at >= '2026-01-01'
--   AND i.created_at <= '2026-12-31';

-- 2. Doanh thu theo ngày
-- SELECT
--   DATE(i.created_at) AS date,
--   COUNT(DISTINCT i.id) AS invoices,
--   COALESCE(SUM(i.total), 0) AS revenue
-- FROM invoices i
-- WHERE i.status = 'DA_THANH_TOAN'
--   AND i.created_at >= '2026-01-01'
--   AND i.created_at <= '2026-12-31'
-- GROUP BY DATE(i.created_at)
-- ORDER BY date;

-- 3. Top món bán chạy
-- SELECT
--   mi.name,
--   SUM(oi.quantity) AS quantity_sold,
--   SUM(oi.unit_price * oi.quantity) AS revenue
-- FROM order_items oi
-- JOIN menu_items mi ON oi.menu_item_id = mi.id
-- JOIN orders o ON oi.order_id = o.id
-- JOIN invoices i ON i.order_id = o.id
-- WHERE i.status = 'DA_THANH_TOAN'
--   AND oi.status != 'DA_HUY'
-- GROUP BY mi.id, mi.name
-- ORDER BY quantity_sold DESC
-- LIMIT 10;

-- 4. Doanh thu theo phương thức thanh toán
-- SELECT
--   p.payment_method,
--   COUNT(*) AS transaction_count,
--   COALESCE(SUM(p.amount), 0) AS total_amount
-- FROM payments p
-- JOIN invoices i ON p.invoice_id = i.id
-- WHERE i.status = 'DA_THANH_TOAN'
-- GROUP BY p.payment_method;

-- ============================================================================
-- END NOTE
-- ============================================================================
