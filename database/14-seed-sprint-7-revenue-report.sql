-- ============================================================================
-- Sprint 7 — Seed dữ liệu demo Báo cáo Doanh thu
-- File: 14-seed-sprint-7-revenue-report.sql
-- Ngày: 2026-06-16
-- ============================================================================

-- Mục đích: Tạo dữ liệu demo để test báo cáo doanh thu.
-- Idempotent: Dùng INSERT IGNORE hoặc kiểm tra trước khi insert.
-- KHÔNG chứa password/token/secret.

-- ============================================================================
-- Seed: Cập nhật invoice hiện có sang DA_THANH_TOAN + tạo payment
-- ============================================================================

-- Invoice #1: Chuyển từ CHUA_THANH_TOAN sang DA_THANH_TOAN
UPDATE invoices
SET status = 'DA_THANH_TOAN'
WHERE id = 1 AND status = 'CHUA_THANH_TOAN';

-- Payment cho invoice #1
INSERT IGNORE INTO payments (invoice_id, payment_method, amount, reference_no, notes)
SELECT 1, 'TIEN_MAT', i.total, NULL, 'Thanh toán tiền mặt'
FROM invoices i
WHERE i.id = 1 AND i.status = 'DA_THANH_TOAN'
  AND NOT EXISTS (SELECT 1 FROM payments p WHERE p.invoice_id = 1);

-- ============================================================================
-- Verify count sau seed
-- ============================================================================

-- SELECT 'invoices' AS tbl, COUNT(*) AS cnt FROM invoices WHERE status = 'DA_THANH_TOAN';
-- SELECT 'payments' AS tbl, COUNT(*) AS cnt FROM payments;
-- SELECT 'orders' AS tbl, COUNT(*) AS cnt FROM orders;
-- SELECT 'order_items' AS tbl, COUNT(*) AS cnt FROM order_items;
-- SELECT 'tables' AS tbl, COUNT(*) AS cnt FROM tables;
-- SELECT 'reservations' AS tbl, COUNT(*) AS cnt FROM reservations;

-- ============================================================================
-- END SEED
-- ============================================================================
