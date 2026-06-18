-- ============================================================
-- 08-seed-sprint-4-payment-invoice.sql
-- Sprint 4: Thanh Toán / Hóa Đơn — Seed Data
--
-- Hệ thống quản lý nhà hàng
-- Chạy sau: 07-schema-sprint-4-payment-invoice.sql
--
-- Seed: 1 invoice mẫu (từ order 3 - HOAN_THANH)
-- ============================================================

USE quanlynhahang;

-- ============================================================
-- 1. Seed Invoices — Hóa đơn mẫu
-- ============================================================

-- Hóa đơn 1: Từ order 3 (ORD-20260615-003) — Bàn VIP02
-- Order 3 có 2 món đã hoàn thành:
--   - Nem Chua Rán x1 @ 50,000 = 50,000
--   - Bánh Flan x2 @ 25,000 = 50,000
-- Subtotal = 100,000
-- Tax (10%) = 10,000
-- Discount = 0
-- Total = 110,000
INSERT INTO invoices (order_id, invoice_code, subtotal, tax_rate, tax_amount, discount, total, status, notes, created_at) VALUES
  (3, 'HD-20260615-001', 100000.00, 10.00, 10000.00, 0.00, 110000.00, 'CHUA_THANH_TOAN', NULL, NOW(3));

-- ============================================================
-- 2. Verify
-- ============================================================
-- SELECT COUNT(*) AS total_invoices FROM invoices;
-- SELECT i.invoice_code, i.status, o.order_code, t.name AS table_name, i.total
--   FROM invoices i
--   JOIN orders o ON i.order_id = o.id
--   JOIN tables t ON o.table_id = t.id;
