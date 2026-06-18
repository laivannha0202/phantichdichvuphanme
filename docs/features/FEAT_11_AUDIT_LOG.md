# FEAT_11: Audit Log & Log theo dõi

## 1. Mục tiêu

Xây dựng hệ thống audit log ghi lại các thao tác quan trọng trong hệ thống: ai, làm gì, khi nào, dữ liệu thay đổi ra sao.

## 2. Actor sử dụng

| Actor | Quyền hạn |
|-------|-----------|
| QUAN_TRI_HE_THONG | Xem tất cả audit log, xuất file |
| QUAN_LY | Xem audit log, filter, xem chi tiết |
| PHUC_VU | Không xem được audit log |
| BEP | Không xem được audit log |
| THU_NGAN | Không xem được audit log |
| KHO | Không xem được audit log |

## 3. Phạm vi trong feature

- [ ] Ghi log tự động cho các thao tác CRUD quan trọng
- [ ] Log theo actor (user/staff)
- [ ] Log theo module (order, invoice, payment, inventory, etc.)
- [ ] Xem lịch sử audit log
- [ ] Filter audit log theo actor, module, thời gian
- [ ] Export audit log

## 4. Ngoài phạm vi

- Log chi tiết request/response (HTTP logs)
- Log lỗi hệ thống (error logs)
- Real-time notification trên audit log

### Cross-sprint Login Audit Scope

- Login success/fail được audit (module: `auth`, action: `LOGIN_SUCCESS` / `LOGIN_FAIL`)
- Không log password, token, refresh token
- Audit log vẫn INSERT-only — không sửa/xóa audit log

## 5. Tài liệu nguồn liên quan

- `docs/nghiepvu/03-use-case-chi-tiet.md` — UC-11 Audit Log
- `docs/nghiepvu/04-quy-tac-nghiep-vu.md` — BR-AUD-xx
- `docs/nghiepvu/06-acceptance-criteria.md` — AC-AUD-xx
- `docs/nghiepvu/10-test-case-nghiep-vu.md` — TC-AUD-xx
- `docs/nghiepvu/09-user-stories-va-sprint-goi-y.md` — US-73..76

## 6. Quy tắc nghiệp vụ áp dụng

| Rule | Description |
|------|-------------|
| BR-AUD-01 | Mọi thao tác CREATE, UPDATE, DELETE trên entity quan trọng phải được log |
| BR-AUD-02 | Audit log không thể chỉnh sửa hoặc xoá |
| BR-AUD-03 | old_values lưu giá trị trước khi thay đổi |
| BR-AUD-04 | new_values lưu giá trị sau khi thay đổi |
| BR-AUD-05 | actor_name là snapshot tại thời điểm log |
| BR-AUD-06 | Chỉ QUAN_TRI_HE_THONG, QUAN_LY mới xem được audit log |
| BR-AUD-07 | Audit log lưu IP address và user agent |
| BR-AUD-08 | Log giữ ít nhất 1 năm |

## 7. Trạng thái/enum liên quan

| Action | Mô tả |
|--------|-------|
| CREATE | Tạo mới |
| UPDATE | Cập nhật |
| DELETE | Xoá |
| LOGIN_SUCCESS | Đăng nhập thành công |
| LOGIN_FAIL | Đăng nhập thất bại |

| Module | Entity | Actions |
|--------|--------|---------|
| auth | User | LOGIN_SUCCESS, LOGIN_FAIL |
| order | Order | CREATE, UPDATE, DELETE |
| order-item | OrderItem | CREATE, UPDATE, DELETE |
| invoice | Invoice | CREATE, PAY, CANCEL |
| payment | Payment | CREATE |
| reservation | Reservation | CREATE, CONFIRM, CHECKIN, CANCEL, NO_SHOW |
| inventory | InventoryItem | CREATE, UPDATE, DELETE |
| inventory-transaction | InventoryTransaction | CREATE |
| menu-item | MenuItem | CREATE, UPDATE, DELETE |
| table | Table | CREATE, UPDATE, DELETE |
| staff | Staff | CREATE, UPDATE, DELETE |
| user | User | CREATE, UPDATE, DELETE, ACTIVATE, DEACTIVATE |

## 8. Database cần dùng

### Table: `audit_logs`

```sql
id              INT PRIMARY KEY AUTO_INCREMENT
actor_id        INT FOREIGN KEY → users(id)
actor_name      VARCHAR(100)
action          VARCHAR(50) NOT NULL
module          VARCHAR(50) NOT NULL
entity_id       INT
entity_type     VARCHAR(50)
old_values      JSON
new_values      JSON
ip_address      VARCHAR(45)
user_agent      VARCHAR(500)
created_at      DATETIME(3)
```

## 9. Backend cần implement

### Module Structure

```
backend/src/modules/
  audit-logs/
    audit-log.module.ts
    audit-log.controller.ts
    audit-log.service.ts
    audit-log.entity.ts
    audit-log.interceptor.ts
    dto/
      query-audit-log.dto.ts
  common/
    interceptors/
      audit.interceptor.ts
```

### Audit Interceptor

```typescript
@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private auditService: AuditLogService) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { method, body, params, user, ip, headers } = request;
    const handler = context.getHandler();
    const auditMeta = Reflect.getMetadata('audit', handler);
    if (!auditMeta) return next.handle();
    const result = await next.handle().toPromise();
    await this.auditService.log({
      actor_id: user?.id,
      actor_name: user?.username || 'System',
      action: auditMeta.action,
      module: auditMeta.module,
      entity_id: result?.id || params?.id,
      entity_type: auditMeta.entityType,
      old_values: auditMeta.oldValues,
      new_values: result,
      ip_address: ip,
      user_agent: headers['user-agent']
    });
    return result;
  }
}
```

### Implementation Schedule

| Sprint | Modules to Audit |
|--------|------------------|
| Sprint 1 | User, Role |
| Sprint 2 | Table, TableArea, MenuItem, MenuCategory |
| Sprint 3 | Order, OrderItem |
| Sprint 4 | Invoice, Payment |
| Sprint 5 | Reservation |
| Sprint 6 | InventoryItem, InventoryTransaction, Staff |

## 10. API contract dự kiến

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/audit-logs` | Danh sách audit logs | QUAN_TRI_HE_THONG, QUAN_LY |
| GET | `/api/audit-logs/:id` | Chi tiết audit log | QUAN_TRI_HE_THONG, QUAN_LY |
| GET | `/api/audit-logs/export` | Xuất audit log | QUAN_TRI_HE_THONG |

### Query Parameters

```json
// GET /api/audit-logs?module=order&actor_id=1&from=2025-01-01&to=2025-01-31
{
  "module": "order",
  "actor_id": 1,
  "action": "UPDATE",
  "from": "2025-01-01",
  "to": "2025-01-31",
  "page": 1,
  "limit": 50
}
```

## 11. Frontend cần implement

### Pages

| Page | Path | Description |
|------|------|-------------|
| Audit Logs | `/audit-logs` | Danh sách audit logs |
| Audit Log Detail | `/audit-logs/:id` | Chi tiết thay đổi |

### Components

| Component | Description |
|-----------|-------------|
| `AuditLogList` | Danh sách audit logs |
| `AuditLogDetail` | Chi tiết (old vs new values) |
| `AuditFilter` | Filter theo actor, module, action, ngày |
| `AuditDiffView` | Hiển thị diff giữa old/new values |
| `ExportButton` | Xuất audit log |

### UI Flow

```
Audit Logs Page
├── Filter Bar
│   ├── Actor dropdown
│   ├── Module dropdown
│   ├── Action dropdown
│   └── Date range picker
├── Audit Log Table
│   ├── Row: [15/01 10:30] Admin - UPDATE - Order #5 - DANG_CHO → CHO_CHE_BIEN
│   └── ...
└── Pagination
```

## 12. Validation

| Rule | Description |
|------|-------------|
| module | Optional, filter string |
| actor_id | Optional, integer |
| action | Optional, enum CREATE/UPDATE/DELETE |
| from/to | Optional, date format |
| page | Optional, min 1 |
| limit | Optional, min 1, max 100 |

## 13. Permission/RBAC

| Endpoint | QUAN_TRI_HE_THONG | QUAN_LY | PHUC_VU | BEP | THU_NGAN | KHO |
|----------|:---:|:---:|:---:|:---:|:---:|:---:|
| GET /api/audit-logs | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/audit-logs/:id | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/audit-logs/export | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

## 14. Test case cần pass

### Unit Tests

| Test | Input | Expected |
|------|-------|----------|
| Log CREATE | Create order | Log created with new_values |
| Log UPDATE | Update order status | Log with old/new values |
| Log DELETE | Delete item | Log with old_values |
| Query by module | module=order | Filtered results |
| Query by actor | actor_id=1 | Filtered results |
| Non-QUAN_LY access | PHUC_VU | 403 |

### Integration Tests

| Test | Steps | Expected |
|------|-------|----------|
| Full flow | Perform actions → Query logs | Correct logs |
| Export flow | Query → Export CSV | Valid file |

## 15. Verify commands

```bash
cd backend && npm run test -- --testPathPattern=audit
cd frontend && npm run lint
cd backend && npx tsc --noEmit
cd frontend && npx tsc --noEmit
```

## 16. Bug checklist

- [ ] Mọi CREATE/UPDATE/DELETE được log tự động
- [ ] Log chứa actor, action, module, entity
- [ ] old_values lưu đúng giá trị trước
- [ ] new_values lưu đúng giá trị sau
- [ ] Audit log không thể chỉnh sửa
- [ ] Filter hoạt động đúng
- [ ] Không log password/token/sensitive data
- [ ]_actor_name snapshot đúng tại thời điểm log

## 17. Definition of Done

- [ ] Audit interceptor hoạt động đúng
- [ ] Log đúng thông tin (actor, action, module, entity)
- [ ] old_values/new_values chính xác
- [ ] Filter hoạt động đúng
- [ ] Unit test pass
- [ ] Integration test pass
- [ ] Không có performance regression
- [ ] Code review xong
- [ ] Commit message đúng format
- [ ] Documentation cập nhật
