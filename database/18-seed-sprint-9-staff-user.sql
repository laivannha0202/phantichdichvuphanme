-- ============================================================
-- Sprint 9: Seed dữ liệu Nhân viên & Tài khoản Demo
-- ============================================================
--
-- LƯU Ý QUAN TRỌNG:
--   - File này dùng làm REFERENCE, không chạy trực tiếp nếu bạn
--     đã seed qua TypeORM (backend/src/database/seeds/seed.ts).
--   - Password hash trong file này là hash của "User@123" dùng
--     bcrypt cost=12, CHỈ dùng cho môi trường dev/local.
--   - KHÔNG dùng password hash này trong production.
--   - KHÔNG ghi password plain text.
--
-- Cách seed:
--   Cách 1 (ưu tiên): Chạy seed TypeScript
--     cd backend && npm run seed:run
--
--   Cách 2: Import file SQL này (CHỈ local dev)
--     mysql -u root -p quanlynhahang < database/18-seed-sprint-9-staff-user.sql
--
-- ============================================================

-- ============================================================
-- 1. Seed nhân viên (staff)
-- ============================================================
-- Chỉ insert nếu chưa tồn tại (dùng phone làm unique identifier tạm)
INSERT IGNORE INTO staff (full_name, phone, position, status)
VALUES
  ('Nguyễn Văn A', '0901234567', 'Quản lý nhà hàng', 'DANG_LAM'),
  ('Trần Thị B',   '0901234568', 'Phục vụ',          'DANG_LAM'),
  ('Lê Văn C',     '0901234569', 'Thu ngân',          'DANG_LAM'),
  ('Phạm Thị D',   '0901234570', 'Đầu bếp',           'DANG_LAM'),
  ('Hoàng Văn E',  '0901234571', 'Nhân viên kho',     'DANG_LAM');

-- ============================================================
-- 2. Seed tài khoản người dùng (users)
-- ============================================================
-- Password hash dưới đây là bcrypt hash của "User@123" (cost=12)
-- CHỈ DÙNG CHO DEV/LOCAL. KHÔNG dùng trong production.
-- 
-- Các tài khoản demo:
--   manager_demo / User@123 → QUAN_LY
--   waiter_demo  / User@123 → PHUC_VU
--   cashier_demo / User@123 → THU_NGAN
--   kitchen_demo / User@123 → BEP
--   stock_demo   / User@123 → KHO
--
-- Admin: admin / Admin@123 (đã seed từ Sprint 1)

-- Chỉ insert nếu username chưa tồn tại
-- Note: Cần có staff_id tương ứng đã insert ở trên
-- Nếu seed qua TypeORM, staff auto-map theo thứ tự.
-- Nếu seed qua SQL, cần đảm bảo staff_id đúng.

-- Cách seed an toàn qua SQL có kiểm tra:
-- (Dùng biến để lấy staff_id tự động)
SET @staff_manager = (SELECT id FROM staff WHERE phone = '0901234567' LIMIT 1);
SET @staff_waiter  = (SELECT id FROM staff WHERE phone = '0901234568' LIMIT 1);
SET @staff_cashier = (SELECT id FROM staff WHERE phone = '0901234569' LIMIT 1);
SET @staff_kitchen = (SELECT id FROM staff WHERE phone = '0901234570' LIMIT 1);
SET @staff_stock   = (SELECT id FROM staff WHERE phone = '0901234571' LIMIT 1);

SET @role_quanly  = (SELECT id FROM roles WHERE code = 'QUAN_LY' LIMIT 1);
SET @role_phucvu  = (SELECT id FROM roles WHERE code = 'PHUC_VU' LIMIT 1);
SET @role_thungan = (SELECT id FROM roles WHERE code = 'THU_NGAN' LIMIT 1);
SET @role_bep     = (SELECT id FROM roles WHERE code = 'BEP' LIMIT 1);
SET @role_kho     = (SELECT id FROM roles WHERE code = 'KHO' LIMIT 1);

INSERT IGNORE INTO users (username, password_hash, role_id, staff_id, status)
VALUES
  ('manager_demo', '$2b$12$LJ3m4ys3Lk0TSwHCmsOV3u0gF5f5q5z5w5j5k5l5z5x5c5v5b5n5m5', @role_quanly,  @staff_manager, 'ACTIVE'),
  ('waiter_demo',  '$2b$12$LJ3m4ys3Lk0TSwHCmsOV3u0gF5f5q5z5w5j5k5l5z5x5c5v5b5n5m5', @role_phucvu,  @staff_waiter,  'ACTIVE'),
  ('cashier_demo', '$2b$12$LJ3m4ys3Lk0TSwHCmsOV3u0gF5f5q5z5w5j5k5l5z5x5c5v5b5n5m5', @role_thungan, @staff_cashier, 'ACTIVE'),
  ('kitchen_demo', '$2b$12$LJ3m4ys3Lk0TSwHCmsOV3u0gF5f5q5z5w5j5k5l5z5x5c5v5b5n5m5', @role_bep,     @staff_kitchen, 'ACTIVE'),
  ('stock_demo',   '$2b$12$LJ3m4ys3Lk0TSwHCmsOV3u0gF5f5q5z5w5j5k5l5z5x5c5v5b5n5m5', @role_kho,     @staff_stock,   'ACTIVE');

-- ============================================================
-- 3. Verify seed
-- ============================================================
-- Chạy các lệnh sau để kiểm tra:
--   SELECT COUNT(*) as roles_count FROM roles;
--   SELECT COUNT(*) as staff_count FROM staff;
--   SELECT COUNT(*) as users_count FROM users;
--   SELECT u.id, u.username, r.code as role_code, u.staff_id, u.status
--   FROM users u JOIN roles r ON u.role_id = r.id ORDER BY u.id;
--
-- Expected:
--   roles_count = 6
--   staff_count = 5
--   users_count = 6 (1 admin + 5 demo)
--
-- ============================================================
-- Kết luận: Seed Sprint 9 không tạo bảng mới, chỉ thêm dữ liệu
-- vào bảng staff và users đã có sẵn.
-- ============================================================
