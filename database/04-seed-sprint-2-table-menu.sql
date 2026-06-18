-- ============================================================
-- 04-seed-sprint-2-table-menu.sql
-- Sprint 2: Khu vực & Bàn + Thực đơn — Seed Data
--
-- Hệ thống quản lý nhà hàng
-- Chạy sau: 03-schema-sprint-2-table-menu.sql
--
-- Seed: 4 khu vực, 12+ bàn, 4 danh mục, 12+ món ăn
-- ============================================================

USE quanlynhahang;

-- ============================================================
-- 1. Seed Table Areas — 4 khu vực
-- ============================================================
INSERT INTO table_areas (name, sort_order) VALUES
  ('Tầng 1',    1),
  ('Tầng 2',    2),
  ('Phòng VIP', 3),
  ('Sân vườn',  4);

-- ============================================================
-- 2. Seed Tables — 14 bàn, đủ 5 trạng thái
-- ============================================================
INSERT INTO tables (table_area_id, name, capacity, status) VALUES
  -- Tầng 1: 4 bàn
  (1, 'B01', 4, 'TRONG'),
  (1, 'B02', 4, 'TRONG'),
  (1, 'B03', 6, 'CO_KHACH'),
  (1, 'B04', 4, 'DANG_DON'),
  -- Tầng 2: 4 bàn
  (2, 'B05', 4, 'TRONG'),
  (2, 'B06', 4, 'DA_DAT'),
  (2, 'B07', 8, 'CO_KHACH'),
  (2, 'B08', 4, 'TRONG'),
  -- Phòng VIP: 3 bàn
  (3, 'VIP01', 10, 'TRONG'),
  (3, 'VIP02', 12, 'CO_KHACH'),
  (3, 'VIP03', 8, 'BAO_TRI'),
  -- Sân vườn: 3 bàn
  (4, 'SV01', 4, 'TRONG'),
  (4, 'SV02', 6, 'TRONG'),
  (4, 'SV03', 4, 'DA_DAT');

-- ============================================================
-- 3. Seed Menu Categories — 4 danh mục
-- ============================================================
INSERT INTO menu_categories (name, sort_order) VALUES
  ('Món khai vị', 1),
  ('Món chính',   2),
  ('Đồ uống',     3),
  ('Tráng miệng', 4);

-- ============================================================
-- 4. Seed Menu Items — 14 món, đủ 3 trạng thái
-- ============================================================
INSERT INTO menu_items (category_id, name, description, price, cost_price, image_url, status) VALUES
  -- Món khai vị (category_id = 1)
  (1, 'Gỏi Cuốn',       'Gỏi cuốn tôm thịt tươi',              45000.00,  20000.00, '/images/goi-cuon.jpg',      'DANG_BAN'),
  (1, 'Chả Giò',        'Chả giò giòn tan, chấm nước mắm',     40000.00,  18000.00, '/images/cha-gio.jpg',       'DANG_BAN'),
  (1, 'Nem Chua Rán',   'Nem chua rán giòn, ăn kèm rau sống',  50000.00,  25000.00, NULL,                       'DANG_BAN'),
  -- Món chính (category_id = 2)
  (2, 'Phở Bò',         'Phở bò truyền thống, nước dùng đậm đà', 65000.00, 30000.00, '/images/pho-bo.jpg',       'DANG_BAN'),
  (2, 'Bún Chả',        'Bún chả Hà Nội, thịt nướng than hoa',  55000.00, 28000.00, '/images/bun-cha.jpg',      'DANG_BAN'),
  (2, 'Cơm Tấm',        'Cơm tấm sườn bì chả, nước mắm pha',    50000.00, 22000.00, '/images/com-tam.jpg',      'DANG_BAN'),
  (2, 'Gà Quay',        'Gà quay nguyên con, da giòn thịt mềm',  85000.00, 45000.00, '/images/ga-quay.jpg',      'HET_MON'),
  (2, 'Mì Quảng',       'Mì Quảng Đà Nẵng, tôm thịt đầy đủ',    60000.00, 28000.00, '/images/mi-quang.jpg',     'DANG_BAN'),
  -- Đồ uống (category_id = 3)
  (3, 'Coca Cola',       'Coca Cola 330ml',                       15000.00,  8000.00, '/images/coca-cola.jpg',    'DANG_BAN'),
  (3, 'Trà Đá',         'Trà đá miễn phí',                       10000.00,  2000.00, NULL,                       'DANG_BAN'),
  (3, 'Nước Cam',       'Nước cam ép tươi, không đường',          25000.00, 12000.00, '/images/nuoc-cam.jpg',     'NGUNG_BAN'),
  -- Tráng miệng (category_id = 4)
  (4, 'Bánh Flan',      'Bánh flan cà phê, mềm mịn',            25000.00, 10000.00, '/images/banh-flan.jpg',    'DANG_BAN'),
  (4, 'Chè',            'Chè đậu đỏ, chè bưởi',                 20000.00,  8000.00, '/images/che.jpg',          'DANG_BAN'),
  (4, 'Kem',            'Kem vani / sô cô la / dâu',             30000.00, 15000.00, NULL,                       'DANG_BAN');
