# FEAT_10: Nhân viên / Tài khoản

## 1. Mục tiêu

Xây dựng tính năng quản lý nhân viên và tài khoản: CRUD staff, CRUD users, phân quyền, và quản lý trạng thái active/inactive.

## 2. Actor sử dụng

| Actor | Quyền hạn |
|-------|-----------|
| QUAN_TRI_HE_THONG | Full CRUD users + staff, kích hoạt/vô hiệu化, reset password |
| QUAN_LY | Xem danh sách nhân viên |
| PHUC_VU | Không có quyền quản lý |
| BEP | Không có quyền quản lý |
| THU_NGAN | Không có quyền quản lý |
| KHO | Không có quyền quản lý |

## 3. Phạm vi trong feature

- [ ] CRUD Nhân viên (Staff)
- [ ] CRUD Tài khoản người dùng (Users)
- [ ] Gán role cho user
- [ ] Kích hoạt/vô hiệu hóa tài khoản
- [ ] Đặt lại mật khẩu
- [ ] Xem danh sách nhân viên theo role

## 4. Ngoài phạm vi

- Chấm công (attendance)
- Lương (payroll)
- Phân ca (shift scheduling)
- Profile cá nhân (sẽ làm ở version sau)

## 5. Tài liệu nguồn liên quan

- `docs/nghiepvu/03-use-case-chi-tiet.md` — UC-10 Quản lý nhân viên
- `docs/nghiepvu/04-quy-tac-nghiep-vu.md` — BR-STF-xx
- `docs/nghiepvu/06-acceptance-criteria.md` — AC-STF-xx
- `docs/nghiepvu/10-test-case-nghiep-vu.md` — TC-STF-xx
- `docs/nghiepvu/09-user-stories-va-sprint-goi-y.md` — US-66..72

## 6. Quy tắc nghiệp vụ áp dụng

| Rule | Description |
|------|-------------|
| BR-STF-01 | Username phải là duy nhất |
| BR-STF-02 | Mật khẩu phải ≥ 8 ký tự |
| BR-STF-03 | Mỗi staff gắn với 1 user account |
| BR-STF-04 | User inactive không thể login |
| BR-STF-05 | Chỉ QUAN_TRI_HE_THONG mới tạo/sửa/xoá user |
| BR-STF-06 | Không xoá user đang có order/invoice liên kết |
| BR-STF-07 | Đặt lại mật khẩu → mật khẩu mặc định (ChangeMe@123) |
| BR-STF-08 | Staff position phải nằm trong danh sách cho phép |

## 7. Trạng thái/enum liên quan

| Status | Mô tả |
|--------|-------|
| ACTIVE | Đang hoạt động |
| INACTIVE | Vô hiệu hóa |
| LOCKED | Bị khóa |

## 8. Database cần dùng

### Table: `users` (tham chiếu FEAT_01)

```sql
id              INT PRIMARY KEY AUTO_INCREMENT
username        VARCHAR(50) UNIQUE NOT NULL
password_hash   VARCHAR(255) NOT NULL
role_id         INT NOT NULL FOREIGN KEY → roles(id)
staff_id        INT FOREIGN KEY → staff(id)
status          ENUM('ACTIVE','INACTIVE','LOCKED') DEFAULT 'ACTIVE'
created_at      DATETIME(3)
updated_at      DATETIME(3)
deleted_at      DATETIME(3)
```

### Table: `staff` (tham chiếu FEAT_01)

```sql
id              INT PRIMARY KEY AUTO_INCREMENT
full_name       VARCHAR(100) NOT NULL
phone           VARCHAR(20)
position        VARCHAR(50)
status          VARCHAR(50)
created_at      DATETIME(3)
updated_at      DATETIME(3)
deleted_at      DATETIME(3)
```

### Entity Relationships

```
users (N) ──── (1) roles
users (1) ──── (0..1) staff (optional)
```

## 9. Backend cần implement

### Module Structure

```
backend/src/modules/
  users/
    user.module.ts
    user.controller.ts
    user.service.ts
    user.entity.ts
    dto/
      create-user.dto.ts
      update-user.dto.ts
      reset-password.dto.ts
  staff/
    staff.module.ts
    staff.controller.ts
    staff.service.ts
    staff.entity.ts
    dto/
      create-staff.dto.ts
      update-staff.dto.ts
```

### Key Logic

```typescript
async createStaff(dto: CreateStaffDto) {
  const staff = this.staffRepo.create({
    full_name: dto.full_name,
    phone: dto.phone,
    position: dto.position
  });
  const savedStaff = await this.staffRepo.save(staff);
  const user = this.userRepo.create({
    username: dto.user.username,
    password_hash: await bcrypt.hash(dto.user.password, 10),
    role_id: dto.user.role_id,
    staff_id: savedStaff.id
  });
  return this.userRepo.save(user);
}
```

## 10. API contract dự kiến

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | Danh sách users | QUAN_TRI_HE_THONG, QUAN_LY |
| GET | `/api/users/:id` | Chi tiết user | QUAN_TRI_HE_THONG, QUAN_LY |
| POST | `/api/users` | Tạo user mới | QUAN_TRI_HE_THONG |
| PATCH | `/api/users/:id` | Cập nhật user | QUAN_TRI_HE_THONG |
| PATCH | `/api/users/:id/status` | Kích hoạt/vô hiệu hóa | QUAN_TRI_HE_THONG |
| POST | `/api/users/:id/reset-password` | Đặt lại mật khẩu | QUAN_TRI_HE_THONG |
| DELETE | `/api/users/:id` | Xoá user | QUAN_TRI_HE_THONG |

### Staff

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/staff` | Danh sách nhân viên | QUAN_TRI_HE_THONG, QUAN_LY |
| GET | `/api/staff/:id` | Chi tiết nhân viên | QUAN_TRI_HE_THONG, QUAN_LY |
| POST | `/api/staff` | Thêm nhân viên mới | QUAN_TRI_HE_THONG |
| PATCH | `/api/staff/:id` | Cập nhật nhân viên | QUAN_TRI_HE_THONG |
| PATCH | `/api/staff/:id/status` | Kích hoạt/vô hiệu hóa | QUAN_TRI_HE_THONG |
| DELETE | `/api/staff/:id` | Xoá nhân viên | QUAN_TRI_HE_THONG |

### Request/Response Format

```json
// POST /api/staff
{
  "full_name": "Trần Văn B",
  "phone": "0912345678",
  "position": "Phục vụ",
  "user": {
    "username": "tranvb",
    "password": "Temp@123",
    "role_id": 3
  }
}
```

## 11. Frontend cần implement

### Pages

| Page | Path | Description |
|------|------|-------------|
| Staff List | `/staff` | Danh sách nhân viên |
| Staff Detail | `/staff/:id` | Chi tiết nhân viên |
| New Staff | `/staff/new` | Thêm nhân viên mới |
| User Management | `/users` | Quản lý tài khoản |

### Components

| Component | Description |
|-----------|-------------|
| `StaffList` | Danh sách nhân viên |
| `StaffCard` | Card thông tin nhân viên |
| `StaffForm` | Form thêm/sửa nhân viên |
| `UserList` | Danh sách tài khoản |
| `UserForm` | Form thêm/sửa tài khoản |
| `ResetPasswordModal` | Modal đặt lại mật khẩu |
| `RoleSelect` | Chọn role |

## 12. Validation

| Rule | Description |
|------|-------------|
| username | Required, unique, maxLength 50 |
| password | Required, min 8 chars, regex |
| full_name | Required, maxLength 100 |
| phone | Optional, format VN phone |
| position | Optional, maxLength 50 |
| salary | Optional, min 0 |
| role_id | Required, must exist in roles |

## 13. Permission/RBAC

| Endpoint | QUAN_TRI_HE_THONG | QUAN_LY | PHUC_VU | BEP | THU_NGAN | KHO |
|----------|:---:|:---:|:---:|:---:|:---:|:---:|
| GET /api/users | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| POST /api/users | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| PATCH /api/users/:id | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| PATCH /api/users/:id/status | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| POST /api/users/:id/reset-password | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| DELETE /api/users/:id | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| GET /api/staff | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| POST /api/staff | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| PATCH /api/staff/:id | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| DELETE /api/staff/:id | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

## 14. Test case cần pass

### Unit Tests

| Test | Input | Expected |
|------|-------|----------|
| Create staff success | Valid data | 201 |
| Create duplicate username | Existing username | 409 |
| Create weak password | "123" | 400 |
| Deactivate user | Active user | 200 |
| Reset password | User ID | 200 + default pass |
| Delete user with orders | Has orders | 400 |

### Integration Tests

| Test | Steps | Expected |
|------|-------|----------|
| Full CRUD | Create → Read → Update → Delete | All pass |
| Login after create | Create user → Login | Success |
| Login after deactivate | Deactivate → Login | Fail |

## 15. Verify commands

```bash
cd backend && npm run test -- --testPathPattern=user
cd backend && npm run test -- --testPathPattern=staff
cd frontend && npm run lint
cd backend && npx tsc --noEmit
cd frontend && npx tsc --noEmit
```

## 16. Bug checklist

- [ ] Username trùng →报错 409
- [ ] Mật khẩu yếu →报错 400
- [ ] Vô hiệu hóa user → không login được
- [ ] Kích hoạt lại → login được
- [ ] Reset password → mật khẩu mặc định
- [ ] Xoá user có dữ liệu liên kết →报错 400
- [ ] Soft delete thay vì hard delete

## 17. Definition of Done

- [ ] Code implement đúng acceptance criteria
- [ ] CRUD hoạt động đúng
- [ ] Soft delete hoạt động
- [ ] Password hashing đúng
- [ ] Unit test pass
- [ ] Integration test pass
- [ ] Không có regression
- [ ] Code review xong
- [ ] Commit message đúng format
- [ ] Documentation cập nhật
