-- ============================================================
-- Sprint 10: Schema Audit Log
-- File: 19-schema-sprint-10-audit-log.sql
-- Mục đích: Tạo bảng audit_logs để ghi nhật ký hoạt động
-- ============================================================

-- Tạo bảng audit_logs
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL COMMENT 'FK → users.id (nullable cho action không xác thực)',
  `username` VARCHAR(50) NULL COMMENT 'Snapshot username tại thời điểm log',
  `role_code` VARCHAR(50) NULL COMMENT 'Snapshot role_code tại thời điểm log',
  `action` VARCHAR(80) NOT NULL COMMENT 'Hành động: LOGIN_SUCCESS, LOGIN_FAILED, CREATE, UPDATE, STATUS_CHANGE, DELETE, SOFT_DELETE, PAY_INVOICE, CANCEL_INVOICE, IMPORT_STOCK, EXPORT_STOCK, UPDATE_ROLE, CHANGE_PASSWORD',
  `module` VARCHAR(100) NOT NULL COMMENT 'Module: AUTH, STAFF, USERS, ROLES, TABLES, MENU, ORDERS, KITCHEN, INVOICES, RESERVATIONS, REPORTS, INVENTORY, AUDIT_LOGS',
  `entity_type` VARCHAR(100) NULL COMMENT 'Loại đối tượng: User, Staff, Order, Invoice, ...',
  `entity_id` VARCHAR(100) NULL COMMENT 'ID đối tượng (string để linh hoạt)',
  `method` VARCHAR(10) NULL COMMENT 'HTTP method: POST, PATCH, DELETE',
  `path` VARCHAR(255) NULL COMMENT 'Đường dẫn API',
  `status_code` INT NULL COMMENT 'HTTP status code',
  `ip_address` VARCHAR(64) NULL COMMENT 'Địa chỉ IP người dùng',
  `user_agent` VARCHAR(255) NULL COMMENT 'User agent trình duyệt',
  `description` VARCHAR(255) NULL COMMENT 'Mô tả ngắn gọn nội dung thao tác',
  `metadata` JSON NULL COMMENT 'Dữ liệu bổ sung (đã sanitize, không chứa password/token)',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT 'Thời gian ghi log',
  `deleted_at` DATETIME(3) NULL COMMENT 'Soft delete (không dùng cho audit_logs)',
  PRIMARY KEY (`id`),
  INDEX `idx_audit_logs_user_id` (`user_id` ASC) COMMENT 'Tra cứu theo người dùng',
  INDEX `idx_audit_logs_username` (`username` ASC) COMMENT 'Tra cứu theo tên đăng nhập',
  INDEX `idx_audit_logs_role_code` (`role_code` ASC) COMMENT 'Tra cứu theo vai trò',
  INDEX `idx_audit_logs_action` (`action` ASC) COMMENT 'Tra cứu theo hành động',
  INDEX `idx_audit_logs_module` (`module` ASC) COMMENT 'Tra cứu theo module',
  INDEX `idx_audit_logs_entity` (`entity_type` ASC, `entity_id` ASC) COMMENT 'Tra cứu theo đối tượng',
  INDEX `idx_audit_logs_created_at` (`created_at` ASC) COMMENT 'Sắp xếp theo thời gian'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Nhật ký hoạt động (audit log) - INSERT-only';
