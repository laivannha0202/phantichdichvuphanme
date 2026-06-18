-- ============================================================
-- 03-schema-sprint-2-table-menu.sql
-- Sprint 2: Khu vực & Bàn + Thực đơn — Schema
--
-- Hệ thống quản lý nhà hàng
-- Chạy sau: 02-seed-sprint-1-auth-role-user.sql
-- Chạy trước: 04-seed-sprint-2-table-menu.sql
--
-- Bảng: table_areas, tables, menu_categories, menu_items
-- ============================================================

USE quanlynhahang;

-- ============================================================
-- 1. Bảng table_areas — Khu vực (tầng, phòng)
-- ============================================================
CREATE TABLE IF NOT EXISTS table_areas (
  id          INT           NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)  NOT NULL,
  sort_order  INT           NOT NULL DEFAULT 0,
  created_at  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. Bảng tables — Bàn trong từng khu vực
-- ============================================================
CREATE TABLE IF NOT EXISTS tables (
  id              INT           NOT NULL AUTO_INCREMENT,
  table_area_id   INT           NOT NULL,
  name            VARCHAR(50)   NOT NULL,
  capacity        SMALLINT      NOT NULL DEFAULT 4,
  status          VARCHAR(50)   NOT NULL DEFAULT 'TRONG',
  created_at      DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at      DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at      DATETIME(3)   DEFAULT NULL,

  PRIMARY KEY (id),
  INDEX idx_tables_table_area_id (table_area_id),
  INDEX idx_tables_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. Bảng menu_categories — Danh mục món ăn
-- ============================================================
CREATE TABLE IF NOT EXISTS menu_categories (
  id          INT           NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)  NOT NULL,
  sort_order  INT           NOT NULL DEFAULT 0,
  created_at  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at  DATETIME(3)   DEFAULT NULL,

  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. Bảng menu_items — Món ăn
-- ============================================================
CREATE TABLE IF NOT EXISTS menu_items (
  id            INT            NOT NULL AUTO_INCREMENT,
  category_id   INT            NOT NULL,
  name          VARCHAR(200)   NOT NULL,
  description   TEXT           DEFAULT NULL,
  price         DECIMAL(12,2)  NOT NULL,
  cost_price    DECIMAL(12,2)  DEFAULT NULL,
  image_url     VARCHAR(500)   DEFAULT NULL,
  status        VARCHAR(50)    NOT NULL DEFAULT 'DANG_BAN',
  created_at    DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at    DATETIME(3)    DEFAULT NULL,

  PRIMARY KEY (id),
  INDEX idx_menu_items_category_id (category_id),
  INDEX idx_menu_items_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. Foreign Keys
-- ============================================================
ALTER TABLE tables
  ADD CONSTRAINT fk_tables_table_area_id
  FOREIGN KEY (table_area_id) REFERENCES table_areas(id)
  ON DELETE RESTRICT;

ALTER TABLE menu_items
  ADD CONSTRAINT fk_menu_items_category_id
  FOREIGN KEY (category_id) REFERENCES menu_categories(id)
  ON DELETE RESTRICT;
