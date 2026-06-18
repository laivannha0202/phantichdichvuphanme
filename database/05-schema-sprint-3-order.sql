-- ============================================================
-- 05-schema-sprint-3-order.sql
-- Sprint 3: Gọi Món / Phục Vụ — Schema
--
-- Hệ thống quản lý nhà hàng
-- Chạy sau: 04-seed-sprint-2-table-menu.sql
-- Chạy trước: 06-seed-sprint-3-order.sql
--
-- Bảng: orders, order_items
-- ============================================================

USE quanlynhahang;

-- ============================================================
-- 1. Bảng orders — Đơn gọi món
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id                    INT           NOT NULL AUTO_INCREMENT,
  table_id              INT           NOT NULL,
  order_code            VARCHAR(50)   NOT NULL,
  status                VARCHAR(50)   NOT NULL DEFAULT 'DANG_CHUAN_BI',
  note                  TEXT          DEFAULT NULL,
  created_by_user_id    INT           DEFAULT NULL,
  created_at            DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at            DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  completed_at          DATETIME(3)   DEFAULT NULL,
  cancelled_at          DATETIME(3)   DEFAULT NULL,
  deleted_at            DATETIME(3)   DEFAULT NULL,

  PRIMARY KEY (id),
  UNIQUE INDEX idx_orders_order_code (order_code),
  INDEX idx_orders_table_id (table_id),
  INDEX idx_orders_status (status),
  INDEX idx_orders_created_by_user_id (created_by_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. Bảng order_items — Món trong đơn
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id              INT            NOT NULL AUTO_INCREMENT,
  order_id        INT            NOT NULL,
  menu_item_id    INT            NOT NULL,
  quantity        INT            NOT NULL DEFAULT 1,
  unit_price      DECIMAL(12,2)  NOT NULL,
  note            TEXT           DEFAULT NULL,
  status          VARCHAR(50)    NOT NULL DEFAULT 'CHO_CHE_BIEN',
  created_at      DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at      DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  cancelled_at    DATETIME(3)    DEFAULT NULL,
  deleted_at      DATETIME(3)    DEFAULT NULL,

  PRIMARY KEY (id),
  INDEX idx_order_items_order_id (order_id),
  INDEX idx_order_items_menu_item_id (menu_item_id),
  INDEX idx_order_items_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. Foreign Keys
-- ============================================================
ALTER TABLE orders
  ADD CONSTRAINT fk_orders_table_id
  FOREIGN KEY (table_id) REFERENCES tables(id)
  ON DELETE RESTRICT;

ALTER TABLE orders
  ADD CONSTRAINT fk_orders_created_by_user_id
  FOREIGN KEY (created_by_user_id) REFERENCES users(id)
  ON DELETE SET NULL;

ALTER TABLE order_items
  ADD CONSTRAINT fk_order_items_order_id
  FOREIGN KEY (order_id) REFERENCES orders(id)
  ON DELETE RESTRICT;

ALTER TABLE order_items
  ADD CONSTRAINT fk_order_items_menu_item_id
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
  ON DELETE RESTRICT;

-- ============================================================
-- 4. Comments
-- ============================================================
ALTER TABLE orders
  MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'DANG_CHUAN_BI'
  COMMENT 'Trạng thái: DANG_CHUAN_BI, DANG_PHUC_VU, HOAN_THANH, DA_HUY';

ALTER TABLE order_items
  MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'CHO_CHE_BIEN'
  COMMENT 'Trạng thái: CHO_CHE_BIEN, DANG_CHE_BIEN, HOAN_THANH, DA_PHUC_VU, DA_HUY';
