-- Sprint 8: Seed for Inventory Management
-- Created: 2026-06-18
-- Seed: suppliers, ingredients, inventory_transactions (sample data)

-- 1. Seed Suppliers (Nhà cung cấp mẫu)
INSERT INTO suppliers (supplier_code, name, phone, email, address, note, status)
VALUES
    ('NCC001', 'Công ty TNHH Thực phẩm Sài Gòn', '0901234567', 'info@saigonfood.vn', '123 Nguyễn Huệ, Quận 1, TP.HCM', 'Nhà cung cấp thực phẩm tươi sống', 'DANG_HOP_TAC'),
    ('NCC002', 'Đại lý Rau Củ Quê Hương', '0912345678', 'contact@raucuquehuong.vn', '456 Lê Lợi, Quận 3, TP.HCM', 'Chuyên rau củ quả', 'DANG_HOP_TAC'),
    ('NCC003', 'Công ty Hải Sản Tươi', '0923456789', 'info@haisanfresh.vn', '789 Bến Vân Đồn, Quận 4, TP.HCM', 'Hải sản tươi sống', 'NGUNG_HOP_TAC')
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    phone = VALUES(phone),
    email = VALUES(email),
    address = VALUES(address),
    note = VALUES(note),
    status = VALUES(status);

-- 2. Seed Ingredients (Nguyên liệu mẫu)
INSERT INTO ingredients (ingredient_code, name, unit, current_stock, min_stock, status, note)
VALUES
    ('NL001', 'Thịt bò', 'kg', 50.000, 10.000, 'CON_HANG', 'Thịt bò tươi, nhập hàng ngày'),
    ('NL002', 'Thịt heo', 'kg', 30.000, 10.000, 'CON_HANG', 'Thịt heo nạc'),
    ('NL003', 'Rau cải', 'kg', 20.000, 5.000, 'CON_HANG', 'Rau cải xanh'),
    ('NL004', 'Gạo', 'kg', 100.000, 20.000, 'CON_HANG', 'Gạo Jasmine'),
    ('NL005', 'Dầu ăn', 'lít', 15.000, 5.000, 'CON_HANG', 'Dầu ăn thực vật'),
    ('NL006', 'Muối', 'kg', 5.000, 2.000, 'CON_HANG', 'Muối iod'),
    ('NL007', 'Đường', 'kg', 8.000, 2.000, 'CON_HANG', 'Đường trắng'),
    ('NL008', 'Nước mắm', 'lít', 10.000, 3.000, 'CON_HANG', 'Nước mắm Phú Quốc'),
    ('NL009', 'Sữa tươi', 'lít', 2.000, 5.000, 'SAP_HET', 'Sữa tươi không đường'),
    ('NL010', 'Bột mì', 'kg', 0.000, 5.000, 'HET_HANG', 'Bột mì đa dụng')
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    unit = VALUES(unit),
    current_stock = VALUES(current_stock),
    min_stock = VALUES(min_stock),
    status = VALUES(status),
    note = VALUES(note);

-- 3. Seed Inventory Transactions (Giao dịch kho mẫu)
-- Transaction codes: GD-YYYYMMDD-XXX
INSERT INTO inventory_transactions (transaction_code, ingredient_id, supplier_id, type, quantity, unit_price, total_amount, note, created_by_user_id)
VALUES
    ('GD-20260618-001', 1, 1, 'NHAP_KHO', 50.000, 250000.00, 12500000.00, 'Nhập thịt bò từ NCC001', NULL),
    ('GD-20260618-002', 2, 1, 'NHAP_KHO', 30.000, 150000.00, 4500000.00, 'Nhập thịt heo từ NCC001', NULL),
    ('GD-20260618-003', 3, 2, 'NHAP_KHO', 20.000, 30000.00, 600000.00, 'Nhập rau cải từ NCC002', NULL),
    ('GD-20260618-004', 4, NULL, 'NHAP_KHO', 100.000, 20000.00, 2000000.00, 'Nhập gạo từ kho', NULL),
    ('GD-20260618-005', 9, NULL, 'XUAT_KHO', 3.000, NULL, NULL, 'Xuất sữa tươi cho quán', NULL),
    ('GD-20260618-006', 10, NULL, 'XUAT_KHO', 5.000, NULL, NULL, 'Xuất bột mì cho bếp', NULL)
ON DUPLICATE KEY UPDATE
    ingredient_id = VALUES(ingredient_id),
    supplier_id = VALUES(supplier_id),
    type = VALUES(type),
    quantity = VALUES(quantity),
    unit_price = VALUES(unit_price),
    total_amount = VALUES(total_amount),
    note = VALUES(note),
    created_by_user_id = VALUES(created_by_user_id);