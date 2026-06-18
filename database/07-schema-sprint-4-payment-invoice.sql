-- ============================================================
-- 07-schema-sprint-4-payment-invoice.sql
-- Sprint 4: Thanh Toán / Hóa Đơn — Schema
--
-- Hệ thống quản lý nhà hàng
-- Chạy sau: 06-seed-sprint-3-order.sql
-- Chạy trước: 08-seed-sprint-4-payment-invoice.sql
--
-- Bảng: invoices, payments
-- ============================================================

USE quanlynhahang;

-- ============================================================
-- 1. Bảng invoices — Hóa đơn
-- ============================================================
CREATE TABLE IF NOT EXISTS invoices (
  id                    INT            NOT NULL AUTO_INCREMENT,
  order_id              INT            NOT NULL,
  invoice_code          VARCHAR(50)    NOT NULL,
  subtotal              DECIMAL(12,2)  NOT NULL DEFAULT 0,
  tax_rate              DECIMAL(5,2)   NOT NULL DEFAULT 10.00,
  tax_amount            DECIMAL(12,2)  NOT NULL DEFAULT 0,
  discount              DECIMAL(12,2)  NOT NULL DEFAULT 0,
  total                 DECIMAL(12,2)  NOT NULL DEFAULT 0,
  status                VARCHAR(50)    NOT NULL DEFAULT 'CHUA_THANH_TOAN',
  notes                 TEXT           DEFAULT NULL,
  created_at            DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at            DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at            DATETIME(3)    DEFAULT NULL,

  PRIMARY KEY (id),
  UNIQUE INDEX idx_invoices_invoice_code (invoice_code),
  UNIQUE INDEX idx_invoices_order_id (order_id),
  INDEX idx_invoices_status (status),
  INDEX idx_invoices_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. Bảng payments — Phiếu thanh toán
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id                    INT            NOT NULL AUTO_INCREMENT,
  invoice_id            INT            NOT NULL,
  payment_method        VARCHAR(50)    NOT NULL,
  amount                DECIMAL(12,2)  NOT NULL,
  reference_no          VARCHAR(100)   DEFAULT NULL,
  notes                 TEXT           DEFAULT NULL,
  created_at            DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),
  INDEX idx_payments_invoice_id (invoice_id),
  INDEX idx_payments_payment_method (payment_method),
  INDEX idx_payments_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. Foreign Keys
-- ============================================================
ALTER TABLE invoices
  ADD CONSTRAINT fk_invoices_order_id
  FOREIGN KEY (order_id) REFERENCES orders(id)
  ON DELETE RESTRICT;

ALTER TABLE payments
  ADD CONSTRAINT fk_payments_invoice_id
  FOREIGN KEY (invoice_id) REFERENCES invoices(id)
  ON DELETE RESTRICT;

-- ============================================================
-- 4. Comments
-- ============================================================
ALTER TABLE invoices
  MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'CHUA_THANH_TOAN'
  COMMENT 'Trạng thái: CHUA_THANH_TOAN, DA_THANH_TOAN, DA_HUY';

ALTER TABLE invoices
  MODIFY COLUMN notes TEXT DEFAULT NULL
  COMMENT 'Ghi chú hóa đơn';

ALTER TABLE payments
  MODIFY COLUMN payment_method VARCHAR(50) NOT NULL
  COMMENT 'Phương thức: TIEN_MAT, CHUYEN_KHOAN, THE';

ALTER TABLE payments
  MODIFY COLUMN reference_no VARCHAR(100) DEFAULT NULL
  COMMENT 'Mã giao dịch (bắt buộc cho CHUYEN_KHOAN)';
