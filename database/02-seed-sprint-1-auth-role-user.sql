-- ============================================================
-- 02-seed-sprint-1-auth-role-user.sql
-- Sprint 1: Auth + Role + User — Seed Data
--
-- Hệ thống quản lý nhà hàng
-- Chạy sau: 01-schema-sprint-1-auth-role-user.sql
--
-- Seed: 6 roles + 1 admin user
-- ============================================================

USE quanlynhahang;

-- ============================================================
-- 1. Seed 6 Roles
-- ============================================================
INSERT INTO roles (code, name) VALUES
  ('QUAN_TRI_HE_THONG', 'Quản trị hệ thống'),
  ('QUAN_LY',           'Quản lý nhà hàng'),
  ('PHUC_VU',           'Nhân viên phục vụ'),
  ('THU_NGAN',          'Thu ngân'),
  ('BEP',               'Nhân viên bếp'),
  ('KHO',               'Nhân viên kho')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ============================================================
-- 2. Seed Admin User
--
-- Tài khoản: admin
-- Mật khẩu: Admin@123 (bcrypt hash, cost=12)
-- Role:      QUAN_TRI_HE_THONG
-- Status:    ACTIVE
--
-- KHÔNG dùng plain text password trong production.
-- ============================================================
INSERT INTO users (username, password_hash, role_id, staff_id, status)
SELECT
  'admin',
  '$2b$12$SwO1vBkSZFkEzxawfktZCuN/2meWB9YFL32V9Urt0M5zpORsrLIIi',
  r.id,
  NULL,
  'ACTIVE'
FROM roles r
WHERE r.code = 'QUAN_TRI_HE_THONG'
ON DUPLICATE KEY UPDATE username = username;
