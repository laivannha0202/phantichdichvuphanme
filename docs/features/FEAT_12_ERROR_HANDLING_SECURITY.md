# FEAT_12: Xử lý Lỗi & Bảo mật

## 1. Mục tiêu

Thiết lập quy tắc xử lý lỗi chuẩn (error handling), bảo mật ứng dụng (security), và các middleware/guard xuyên suốt hệ thống.

## 2. Actor sử dụng

Feature này là cross-cutting concern — ảnh hưởng đến TẤT CẢ actors:
- Hệ thống tự động xử lý lỗi cho mọi request
- Security middleware bảo vệ mọi endpoint
- Error response format chuẩn cho mọi user

## 3. Phạm vi trong feature

- [ ] Global error handling (Exception Filter)
- [ ] Standardized error response format
- [ ] Input validation (DTO + class-validator)
- [ ] Authentication security (JWT, password hashing)
- [ ] Authorization (RBAC guards)
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Helmet security headers
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection

## 4. Ngoài phạm vi

- WAF (Web Application Firewall)
- DDoS protection
- Penetration testing
- Security audit (sau khi deploy)
- SSL/TLS certificate management

## 5. Tài liệu nguồn liên quan

- `docs/nghiepvu/04-quy-tac-nghiep-vu.md` — BR-AUTH-xx, BR-SEC-xx
- `docs/nghiepvu/06-acceptance-criteria.md` — AC-SEC-xx
- `docs/nghiepvu/10-test-case-nghiep-vu.md` — TC-SEC-xx
- `docs/nghiepvu/09-user-stories-va-sprint-goi-y.md` — US-77..81
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- NestJS Security: https://docs.nestjs.com/security

## 6. Quy tắc nghiệp vụ áp dụng

| Rule | Description |
|------|-------------|
| BR-AUTH-01 | Password hash bằng bcrypt (cost ≥ 10) |
| BR-AUTH-02 | JWT secret đủ mạnh (≥ 32 ký tự) |
| BR-AUTH-03 | Token hết hạn sau 15 phút |
| BR-AUTH-04 | Refresh token hết hạn sau 7 ngày |
| BR-SEC-01 | CORS chỉ allow origin cụ thể (không dùng *) |
| BR-SEC-02 | Rate limit: 100 requests/phút/IP |
| BR-SEC-03 | Login rate limit: 5 lần/phút/IP |
| BR-SEC-04 | Helmet enabled với default config |
| BR-SEC-05 | Body size limit: 10MB |
| BR-SEC-06 | Không expose stack trace trong production |
| BR-SEC-07 | Input validation cho mọi API endpoint |
| BR-SEC-08 | SQL injection prevention qua ORM parameterized queries |

## 7. Trạng thái/enum liên quan

### HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no token / invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate data) |
| 422 | Unprocessable Entity (business logic error) |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

## 8. Database cần dùng

Không tạo table mới — feature là middleware/guards.

## 9. Backend cần implement

### Module Structure

```
backend/src/
  common/
    filters/
      http-exception.filter.ts
      all-errors.filter.ts
    guards/
      jwt-auth.guard.ts
      roles.guard.ts
    interceptors/
      audit.interceptor.ts
      transform.interceptor.ts
    decorators/
      roles.decorator.ts
      public.decorator.ts
    dto/
      error-response.dto.ts
    middleware/
      rate-limiter.middleware.ts
      logger.middleware.ts
  config/
    security.config.ts
    cors.config.ts
```

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Tên đăng nhập đã tồn tại",
  "error": "Bad Request",
  "details": [
    { "field": "username", "message": "Tên đăng nhập đã tồn tại" }
  ],
  "timestamp": "2025-01-15T10:30:00.000Z",
  "path": "/api/users"
}
```

### Security Middleware Stack

```
Request
  ↓
Helmet (security headers)
  ↓
CORS
  ↓
Rate Limiter
  ↓
Body Parser + Validation
  ↓
JWT Auth Guard
  ↓
RBAC Guard
  ↓
Controller
  ↓
Exception Filter (error handling)
  ↓
Response
```

### Implementation Schedule

| Sprint | Security Features |
|--------|-------------------|
| Sprint 1 | JWT, bcrypt, RBAC, Exception Filter |
| Sprint 2 | Input validation, CORS |
| Sprint 3 | Rate limiting, Helmet |
| Sprint 4 | Enhanced error handling |
| Sprint 5 | Audit logging integration |
| Sprint 6 | Final security review |

## 10. API contract dự kiến

Không có endpoint mới — feature là middleware/guards bảo vệ endpoint có sẵn.

### Error Response Format (cho mọi endpoint)

```json
// 400
{ "statusCode": 400, "message": "...", "error": "Bad Request", "details": [...] }

// 401
{ "statusCode": 401, "message": "Unauthorized", "error": "Unauthorized" }

// 403
{ "statusCode": 403, "message": "Forbidden", "error": "Forbidden" }

// 404
{ "statusCode": 404, "message": "Not Found", "error": "Not Found" }

// 429
{ "statusCode": 429, "message": "Quá nhiều yêu cầu", "error": "Too Many Requests" }
```

## 11. Frontend cần implement

### Error Handling

```typescript
// axios interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      message.error('Bạn không có quyền thực hiện thao tác này');
    } else if (error.response?.status === 429) {
      message.warning('Quá nhiều yêu cầu. Vui lòng thử lại sau');
    }
    return Promise.reject(error);
  }
);
```

### Error Components

| Component | Description |
|-----------|-------------|
| `ErrorBoundary` | React error boundary |
| `ErrorPage` | Trang lỗi (404, 403, 500) |
| `ErrorMessage` | Component hiển thị lỗi |

## 12. Validation

### Input Validation (class-validator)

```typescript
export class CreateUserDto {
  @IsString() @IsNotEmpty() @MinLength(3) @MaxLength(50)
  username: string;
  
  @IsString() @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
  password: string;
  
  @IsNumber() @IsPositive()
  role_id: number;
}
```

## 13. Permission/RBAC

Feature này ĐỊNH NGHĨA permission system:
- JWT Auth Guard: Xác thực token
- RBAC Guard: Kiểm tra role
- @Roles() decorator: Gán role cho endpoint
- @Public() decorator: Endpoint không cần auth

## 14. Test case cần pass

### Unit Tests

| Test | Input | Expected |
|------|-------|----------|
| Validation error | Invalid DTO | 400 + details |
| Unauthorized | No token | 401 |
| Forbidden | Wrong role | 403 |
| Not found | Non-existent ID | 404 |
| Conflict | Duplicate data | 409 |
| Rate limit | 101 requests/min | 429 |
| Server error | Unhandled exception | 500 |

### Integration Tests

| Test | Steps | Expected |
|------|-------|----------|
| Error flow | Invalid input → Error response | Correct format |
| Auth flow | No token → 401 → Login → 200 | Flow works |
| Rate limit flow | 100+ requests → 429 | Limiter works |

## 15. Verify commands

```bash
cd backend && npm run test -- --testPathPattern=auth
cd backend && npm run test -- --testPathPattern=guard
cd backend && npm run test -- --testPathPattern=filter
cd frontend && npm run lint
cd backend && npx tsc --noEmit
cd frontend && npx tsc --noEmit
```

## 16. Bug checklist

- [ ] Mọi lỗi trả về đúng format chuẩn
- [ ] 401 khi không có token hoặc token sai
- [ ] 403 khi không đủ quyền
- [ ] 404 khi resource không tồn tại
- [ ] 409 khi dữ liệu trùng lặp
- [ ] 429 khi vượt rate limit
- [ ] 500 không expose stack trace
- [ ] Input validation hoạt động đúng
- [ ] CORS chỉ allow origin cấu hình
- [ ] Password hash đúng (bcrypt ≥ 10)
- [ ] JWT flow hoạt động đúng
- [ ] Helmet headers có mặt

## 17. Definition of Done

- [ ] Exception filter hoạt động đúng
- [ ] Rate limiter hoạt động đúng
- [ ] Input validation cho mọi endpoint
- [ ] CORS config đúng
- [ ] Helmet headers có mặt
- [ ] Password hash đúng
- [ ] JWT flow hoạt động đúng
- [ ] Frontend xử lý lỗi đúng
- [ ] Unit test pass
- [ ] Integration test pass
- [ ] Không có security vulnerability
- [ ] Code review xong
- [ ] Documentation cập nhật
