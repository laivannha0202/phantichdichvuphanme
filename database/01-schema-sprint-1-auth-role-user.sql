-- ============================================================
-- 01-schema-sprint-1-auth-role-user.sql
-- Sprint 1: Auth + Role + User — Schema
--
-- Hệ thống quản lý nhà hàng
-- Chạy sau: 00-create-database.sql
-- Chạy trước: 02-seed-sprint-1-auth-role-user.sql
--
-- Bảng: roles, staff, users
-- ============================================================

USE quanlynhahang;

-- ============================================================
-- 1. Bảng roles
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
  id         INT           NOT NULL AUTO_INCREMENT,
  code       VARCHAR(50)   NOT NULL,
  name       VARCHAR(100)  NOT NULL,
  created_at DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),
  UNIQUE INDEX idx_roles_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. Bảng staff
-- ============================================================
CREATE TABLE IF NOT EXISTS staff (
  id         INT           NOT NULL AUTO_INCREMENT,
  full_name  VARCHAR(100)  NOT NULL,
  phone      VARCHAR(20)   DEFAULT NULL,
  position   VARCHAR(50)   DEFAULT NULL,
  status     VARCHAR(50)   NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at DATETIME(3)   DEFAULT NULL,

  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. Bảng users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            INT           NOT NULL AUTO_INCREMENT,
  username      VARCHAR(50)   NOT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  role_id       INT           NOT NULL,
  staff_id      INT           DEFAULT NULL,
  status        VARCHAR(50)   NOT NULL DEFAULT 'ACTIVE',
  created_at    DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at    DATETIME(3)   DEFAULT NULL,

  PRIMARY KEY (id),
  UNIQUE INDEX idx_users_username (username),
  INDEX idx_users_role_id (role_id),
  INDEX idx_users_staff_id (staff_id),
  INDEX idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. Foreign Keys
-- ============================================================
ALTER TABLE users
  ADD CONSTRAINT fk_users_role_id
  FOREIGN KEY (role_id) REFERENCES roles(id)
  ON DELETE RESTRICT;

ALTER TABLE users
  ADD CONSTRAINT fk_users_staff_id
  FOREIGN KEY (staff_id) REFERENCES staff(id)
  ON DELETE SET NULL;
