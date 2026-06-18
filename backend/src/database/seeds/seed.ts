import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

const ROLES = [
  { code: 'QUAN_TRI_HE_THONG', name: 'Quản trị hệ thống' },
  { code: 'QUAN_LY', name: 'Quản lý nhà hàng' },
  { code: 'PHUC_VU', name: 'Nhân viên phục vụ' },
  { code: 'THU_NGAN', name: 'Thu ngân' },
  { code: 'BEP', name: 'Nhân viên bếp' },
  { code: 'KHO', name: 'Nhân viên kho' },
];

const TABLE_AREAS = [
  { name: 'Tầng 1', sort_order: 1 },
  { name: 'Tầng 2', sort_order: 2 },
  { name: 'Phòng VIP', sort_order: 3 },
  { name: 'Sân vườn', sort_order: 4 },
];

const TABLES = [
  // Tầng 1
  { table_area_id: 1, name: 'B01', capacity: 4, status: 'TRONG' },
  { table_area_id: 1, name: 'B02', capacity: 4, status: 'TRONG' },
  { table_area_id: 1, name: 'B03', capacity: 6, status: 'CO_KHACH' },
  { table_area_id: 1, name: 'B04', capacity: 4, status: 'DANG_DON' },
  // Tầng 2
  { table_area_id: 2, name: 'B05', capacity: 4, status: 'TRONG' },
  { table_area_id: 2, name: 'B06', capacity: 4, status: 'DA_DAT' },
  { table_area_id: 2, name: 'B07', capacity: 8, status: 'CO_KHACH' },
  { table_area_id: 2, name: 'B08', capacity: 4, status: 'TRONG' },
  // Phòng VIP
  { table_area_id: 3, name: 'VIP01', capacity: 10, status: 'TRONG' },
  { table_area_id: 3, name: 'VIP02', capacity: 12, status: 'CO_KHACH' },
  { table_area_id: 3, name: 'VIP03', capacity: 8, status: 'BAO_TRI' },
  // Sân vườn
  { table_area_id: 4, name: 'SV01', capacity: 4, status: 'TRONG' },
  { table_area_id: 4, name: 'SV02', capacity: 6, status: 'TRONG' },
  { table_area_id: 4, name: 'SV03', capacity: 4, status: 'DA_DAT' },
];

const MENU_CATEGORIES = [
  { name: 'Món khai vị', sort_order: 1 },
  { name: 'Món chính', sort_order: 2 },
  { name: 'Đồ uống', sort_order: 3 },
  { name: 'Tráng miệng', sort_order: 4 },
];

const MENU_ITEMS = [
  // Món khai vị (category_id = 1)
  { category_id: 1, name: 'Gỏi Cuốn', description: 'Gỏi cuốn tôm thịt tươi', price: 45000, cost_price: 20000, image_url: '/images/goi-cuon.jpg', status: 'DANG_BAN' },
  { category_id: 1, name: 'Chả Giò', description: 'Chả giò giòn tan, chấm nước mắm', price: 40000, cost_price: 18000, image_url: '/images/cha-gio.jpg', status: 'DANG_BAN' },
  { category_id: 1, name: 'Nem Chua Rán', description: 'Nem chua rán giòn, ăn kèm rau sống', price: 50000, cost_price: 25000, image_url: null, status: 'DANG_BAN' },
  // Món chính (category_id = 2)
  { category_id: 2, name: 'Phở Bò', description: 'Phở bò truyền thống, nước dùng đậm đà', price: 65000, cost_price: 30000, image_url: '/images/pho-bo.jpg', status: 'DANG_BAN' },
  { category_id: 2, name: 'Bún Chả', description: 'Bún chả Hà Nội, thịt nướng than hoa', price: 55000, cost_price: 28000, image_url: '/images/bun-cha.jpg', status: 'DANG_BAN' },
  { category_id: 2, name: 'Cơm Tấm', description: 'Cơm tấm sườn bì chả, nước mắm pha', price: 50000, cost_price: 22000, image_url: '/images/com-tam.jpg', status: 'DANG_BAN' },
  { category_id: 2, name: 'Gà Quay', description: 'Gà quay nguyên con, da giòn thịt mềm', price: 85000, cost_price: 45000, image_url: '/images/ga-quay.jpg', status: 'HET_MON' },
  { category_id: 2, name: 'Mì Quảng', description: 'Mì Quảng Đà Nẵng, tôm thịt đầy đủ', price: 60000, cost_price: 28000, image_url: '/images/mi-quang.jpg', status: 'DANG_BAN' },
  // Đồ uống (category_id = 3)
  { category_id: 3, name: 'Coca Cola', description: 'Coca Cola 330ml', price: 15000, cost_price: 8000, image_url: '/images/coca-cola.jpg', status: 'DANG_BAN' },
  { category_id: 3, name: 'Trà Đá', description: 'Trà đá miễn phí', price: 10000, cost_price: 2000, image_url: null, status: 'DANG_BAN' },
  { category_id: 3, name: 'Nước Cam', description: 'Nước cam ép tươi, không đường', price: 25000, cost_price: 12000, image_url: '/images/nuoc-cam.jpg', status: 'NGUNG_BAN' },
  // Tráng miệng (category_id = 4)
  { category_id: 4, name: 'Bánh Flan', description: 'Bánh flan cà phê, mềm mịn', price: 25000, cost_price: 10000, image_url: '/images/banh-flan.jpg', status: 'DANG_BAN' },
  { category_id: 4, name: 'Chè', description: 'Chè đậu đỏ, chè bưởi', price: 20000, cost_price: 8000, image_url: '/images/che.jpg', status: 'DANG_BAN' },
  { category_id: 4, name: 'Kem', description: 'Kem vani / sô cô la / dâu', price: 30000, cost_price: 15000, image_url: null, status: 'DANG_BAN' },
];

async function runSeed(dataSource: DataSource) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    // ========== Sprint 1: Roles + Admin ==========

    // Seed roles (idempotent via INSERT IGNORE)
    for (const role of ROLES) {
      await queryRunner.query(
        'INSERT IGNORE INTO roles (code, name) VALUES (?, ?)',
        [role.code, role.name],
      );
    }
    console.log('✅ Đã seed 6 roles');

    // Get QUAN_TRI_HE_THONG role id
    const adminRole = await queryRunner.manager
      .createQueryBuilder()
      .select('id')
      .from('roles', 'r')
      .where('r.code = :code', { code: 'QUAN_TRI_HE_THONG' })
      .getRawOne();

    if (!adminRole) {
      console.error('❌ Không tìm thấy role QUAN_TRI_HE_THONG');
      return;
    }

    // Check if admin exists
    const existingAdmin = await queryRunner.manager
      .createQueryBuilder()
      .select('id')
      .from('users', 'u')
      .where('u.username = :username', { username: 'admin' })
      .getRawOne();

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('Admin@123', 12);

      await queryRunner.query(
        'INSERT INTO users (username, password_hash, role_id, staff_id, status) VALUES (?, ?, ?, NULL, ?)',
        ['admin', passwordHash, adminRole.id, 'ACTIVE'],
      );

      console.log('✅ Đã tạo tài khoản admin (admin / Admin@123)');
    } else {
      console.log('ℹ️ Tài khoản admin đã tồn tại, bỏ qua');
    }

    // ========== Sprint 2: Table Areas, Tables, Menu Categories, Menu Items ==========

    // Seed table_areas (idempotent by unique name)
    for (const area of TABLE_AREAS) {
      const existing = await queryRunner.query(
        'SELECT id FROM table_areas WHERE name = ?',
        [area.name],
      );

      if (existing.length === 0) {
        await queryRunner.query(
          'INSERT INTO table_areas (name, sort_order) VALUES (?, ?)',
          [area.name, area.sort_order],
        );
      }
    }
    console.log('✅ Đã seed table_areas');

    // Seed tables (idempotent by unique name)
    for (const table of TABLES) {
      const existing = await queryRunner.query(
        'SELECT id FROM tables WHERE name = ?',
        [table.name],
      );

      if (existing.length === 0) {
        await queryRunner.query(
          'INSERT INTO tables (table_area_id, name, capacity, status) VALUES (?, ?, ?, ?)',
          [table.table_area_id, table.name, table.capacity, table.status],
        );
      }
    }
    console.log('✅ Đã seed tables');

    // Seed menu_categories (idempotent by unique name)
    for (const category of MENU_CATEGORIES) {
      const existing = await queryRunner.query(
        'SELECT id FROM menu_categories WHERE name = ?',
        [category.name],
      );

      if (existing.length === 0) {
        await queryRunner.query(
          'INSERT INTO menu_categories (name, sort_order) VALUES (?, ?)',
          [category.name, category.sort_order],
        );
      }
    }
    console.log('✅ Đã seed menu_categories');

    // Seed menu_items (idempotent by unique name)
    for (const item of MENU_ITEMS) {
      const existing = await queryRunner.query(
        'SELECT id FROM menu_items WHERE name = ?',
        [item.name],
      );

      if (existing.length === 0) {
        await queryRunner.query(
          'INSERT INTO menu_items (category_id, name, description, price, cost_price, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [item.category_id, item.name, item.description, item.price, item.cost_price, item.image_url, item.status],
        );
      }
    }
    console.log('✅ Đã seed menu_items');

    // ========== Sprint 9: Staff + Users ==========

    const SEED_STAFF = [
      { full_name: 'Nguyễn Văn A', phone: '0901234567', position: 'Quản lý nhà hàng' },
      { full_name: 'Trần Thị B', phone: '0901234568', position: 'Phục vụ' },
      { full_name: 'Lê Văn C', phone: '0901234569', position: 'Thu ngân' },
      { full_name: 'Phạm Thị D', phone: '0901234570', position: 'Đầu bếp' },
      { full_name: 'Hoàng Văn E', phone: '0901234571', position: 'Nhân viên kho' },
    ];

    const SEED_USERS = [
      { username: 'manager', role_code: 'QUAN_LY', staff_idx: 0 },
      { username: 'phucvu', role_code: 'PHUC_VU', staff_idx: 1 },
      { username: 'thungan', role_code: 'THU_NGAN', staff_idx: 2 },
      { username: 'bep', role_code: 'BEP', staff_idx: 3 },
      { username: 'kho', role_code: 'KHO', staff_idx: 4 },
    ];

    for (let i = 0; i < SEED_STAFF.length; i++) {
      const s = SEED_STAFF[i];

      // Check staff already exists by phone
      const existingStaff = await queryRunner.query(
        'SELECT id FROM staff WHERE phone = ?',
        [s.phone],
      );

      if (existingStaff.length > 0) {
        console.log(`ℹ️ Nhân viên ${s.full_name} đã tồn tại, bỏ qua`);
        continue;
      }

      const staffResult = await queryRunner.query(
        'INSERT INTO staff (full_name, phone, position, status) VALUES (?, ?, ?, ?)',
        [s.full_name, s.phone, s.position, 'DANG_LAM'],
      );

      const staffId = staffResult.insertId;
      const u = SEED_USERS[i];
      const roleRow = await queryRunner.query(
        'SELECT id FROM roles WHERE code = ?',
        [u.role_code],
      );

      if (roleRow.length > 0) {
        const existingUser = await queryRunner.query(
          'SELECT id FROM users WHERE username = ?',
          [u.username],
        );

        if (existingUser.length === 0) {
          const passwordHash = await bcrypt.hash('User@123', 12);
          await queryRunner.query(
            'INSERT INTO users (username, password_hash, role_id, staff_id, status) VALUES (?, ?, ?, ?, ?)',
            [u.username, passwordHash, roleRow[0].id, staffId, 'ACTIVE'],
          );
          console.log(`✅ Đã tạo nhân viên ${s.full_name} (${u.username} / User@123)`);
        } else {
          console.log(`ℹ️ User ${u.username} đã tồn tại, bỏ qua`);
        }
      }
    }
  } finally {
    await queryRunner.release();
  }
}

export { runSeed };
