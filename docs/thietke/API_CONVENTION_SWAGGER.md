# Quy ước API & Swagger — Quản lý Nhà hàng

> ⚠️ **Tài liệu Thiết kế Kỹ thuật** — Dành cho Developer/Tech Lead.
> **Không phải tài liệu nghiệp vụ chính thức.**

---

## 1. Base URL

```
http://localhost:5011/api
```

Tất cả API endpoint đều bắt đầu bằng `/api`.

---

## 2. Response Format

### 2.1 Response thành công

```json
{
  "data": { ... },
  "message": "Mô tả kết quả",
  "statusCode": 200
}
```

| Field | Kiểu | Ghi chú |
|-------|------|---------|
| `data` | object / array / null | Dữ liệu trả về |
| `message` | string | Thông báo thành công |
| `statusCode` | number | HTTP status code |

### 2.2 Response lỗi

```json
{
  "message": "Mô tả lỗi",
  "statusCode": 400,
  "error": "Bad Request"
}
```

| Field | Kiểu | Ghi chú |
|-------|------|---------|
| `message` | string | Thông báo lỗi chi tiết |
| `statusCode` | number | HTTP status code |
| `error` | string | Tên HTTP error (optional) |

### 2.3 Response lỗi validation (400)

```json
{
  "message": ["Tên khu vực không được để trống", "Sức chứa phải >= 1"],
  "statusCode": 400,
  "error": "Bad Request"
}
```

Khi validate lỗi, `message` là mảng các thông báo lỗi.

---

## 3. HTTP Status Codes

| Code | Ý nghĩa | Khi nào dùng |
|------|---------|---------------|
| `200` | OK | Lấy dữ liệu, cập nhật thành công |
| `201` | Created | Tạo mới thành công |
| `400` | Bad Request | Validate lỗi, dữ liệu đầu vào không hợp lệ |
| `401` | Unauthorized | Chưa đăng nhập hoặc token hết hạn |
| `403` | Forbidden | Đăng nhập nhưng không có quyền |
| `404` | Not Found | Không tìm thấy resource |
| `409` | Conflict | Dữ liệu trùng lặp (VD: tên khu vực đã tồn tại) |
| `500` | Internal Server Error | Lỗi hệ thống, không nên trả chi tiết cho client |

---

## 4. Quy ước REST Endpoint

### 4.1 CRUD Pattern

| Hành động | Method | Endpoint | Response |
|-----------|--------|----------|----------|
| Lấy danh sách | `GET` | `/api/{resource}` | 200 + array |
| Lấy chi tiết | `GET` | `/api/{resource}/:id` | 200 + object |
| Tạo mới | `POST` | `/api/{resource}` | 201 + object |
| Cập nhật | `PATCH` | `/api/{resource}/:id` | 200 + object |
| Xoá | `DELETE` | `/api/{resource}/:id` | 200 + null |

### 4.2 Naming Convention

| Type | Convention | Ví dụ |
|------|-----------|-------|
| Resource | kebab-case, số nhiều | `/api/table-areas`, `/api/menu-items` |
| Query param | snake_case | `?table_area_id=1&status=TRONG` |
| Field name | snake_case trong JSON response | `table_area_id`, `created_at` |

### 4.3 Filter & Pagination

```
GET /api/tables?table_area_id=1&status=TRONG&page=1&limit=20
```

| Param | Kiểu | Ghi chú |
|-------|------|---------|
| `page` | number | Trang hiện tại (mặc định: 1) |
| `limit` | number | Số item / trang (mặc định: 20, max: 100) |

Response pagination:

```json
{
  "data": [...],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 20
  },
  "message": "Lấy danh sách thành công",
  "statusCode": 200
}
```

### 4.4 Soft Delete

- Dùng `DELETE` method cho soft delete (set `deleted_at`).
- Response trả về `200` với `data: null`.
- Không xoá cứng trừ khi có yêu cầu rõ ràng.

### 4.5 Update Status

Đối với cập nhật trạng thái, dùng endpoint riêng:

```
PATCH /api/{resource}/:id/status
```

Ví dụ:
- `PATCH /api/tables/1/status` — cập nhật trạng thái bàn
- `PATCH /api/menu-items/1/status` — cập nhật trạng thái món

---

## 5. Swagger Configuration

### 5.1 Setup

Sử dụng `@nestjs/swagger` để sinh tài liệu API.

```typescript
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Quản lý Nhà hàng API')
  .setDescription('API documentation cho hệ thống quản lý nhà hàng')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

Swagger UI: `http://localhost:5011/api/docs`

### 5.2 Tags

Mỗi controller phải có `@ApiTags` để phân loại endpoint theo module:

```typescript
@ApiTags('Table Areas')
@Controller('table-areas')
export class TableAreaController { ... }
```

Tags chuẩn:

| Tag | Module |
|-----|--------|
| `Auth` | Đăng nhập, refresh, logout |
| `Table Areas` | Quản lý khu vực |
| `Tables` | Quản lý bàn |
| `Menu Categories` | Quản lý danh mục món |
| `Menu Items` | Quản lý món ăn |
| `Orders` | Quản lý đơn hàng |
| `Kitchen` | Màn hình bếp |
| `Payments` | Thanh toán |
| `Reports` | Báo cáo |
| `Inventory` | Kho nguyên liệu |
| `Staff` | Nhân viên |
| `Users` | Tài khoản |

### 5.3 Operation Descriptions

Mỗi endpoint phải có `@ApiOperation`:

```typescript
@Get()
@ApiOperation({ summary: 'Lấy danh sách khu vực' })
async findAll() { ... }

@Post()
@ApiOperation({ summary: 'Tạo khu vực mới' })
async create(@Body() dto: CreateTableAreaDto) { ... }
```

### 5.4 DTO & ApiProperty

Mỗi DTO property phải có `@ApiProperty`:

```typescript
export class CreateTableAreaDto {
  @ApiProperty({ example: 'Tầng 1', description: 'Tên khu vực' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1, description: 'Thứ tự hiển thị', default: 0 })
  @IsOptional()
  sort_order?: number;
}
```

### 5.5 Response Decorators

```typescript
@Post()
@ApiOperation({ summary: 'Tạo khu vực mới' })
@ApiResponse({ status: 201, description: 'Tạo thành công' })
@ApiResponse({ status: 400, description: 'Validate lỗi' })
@ApiResponse({ status: 409, description: 'Tên khu vực đã tồn tại' })
async create(@Body() dto: CreateTableAreaDto) { ... }
```

### 5.6 Auth in Swagger

Endpoint cần auth phải có `@ApiBearerAuth`:

```typescript
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Post()
@ApiOperation({ summary: 'Tạo khu vực mới' })
async create(@Body() dto: CreateTableAreaDto) { ... }
```

---

## 6. Bảo mật trong Swagger

### 6.1 Không expose trong response

Tuyệt đối KHÔNG trả các field nhạy cảm trong Swagger response example:

| Field | Lý do |
|-------|-------|
| `password_hash` | Bảo mật |
| `access_token` | Chỉ trả trong login response |
| `refresh_token` | Lưu trong httpOnly cookie |
| `token` | Không lưu trong DB |

### 6.2 Response Example an toàn

```json
// GET /api/users/1 — KHÔNG trả password_hash
{
  "data": {
    "id": 1,
    "username": "admin",
    "role": { "code": "QUAN_TRI_HE_THONG", "name": "Quản trị hệ thống" },
    "staff": null,
    "status": "ACTIVE"
  }
}
```

### 6.3 Login Response

```json
// POST /api/auth/login — Chỉ trả ở đây
{
  "data": {
    "accessToken": "eyJhbG...",
    "user": {
      "id": 1,
      "username": "admin",
      "role": { "code": "QUAN_TRI_HE_THONG", "name": "Quản trị hệ thống" }
    }
  },
  "message": "Đăng nhập thành công",
  "statusCode": 200
}
```

---

## 7. Error Response Standard

### 7.1 Lỗi validate (400)

```json
{
  "message": ["Tên khu vực không được để trống"],
  "statusCode": 400,
  "error": "Bad Request"
}
```

### 7.2 Lỗi không tìm thấy (404)

```json
{
  "message": "Không tìm thấy khu vực với id 999",
  "statusCode": 404,
  "error": "Not Found"
}
```

### 7.3 Lỗi trùng lặp (409)

```json
{
  "message": "Tên khu vực 'Tầng 1' đã tồn tại",
  "statusCode": 409,
  "error": "Conflict"
}
```

### 7.4 Lỗi không có quyền (403)

```json
{
  "message": "Bạn không có quyền thực hiện thao tác này",
  "statusCode": 403,
  "error": "Forbidden"
}
```

### 7.5 Lỗi server (500)

```json
{
  "message": "Internal server error",
  "statusCode": 500,
  "error": "Internal Server Error"
}
```

> Không trả stack trace ra response ở môi trường production.

---

## 8. Quy ước cho Frontend khi gọi API

### 8.1 Axios Interceptor

- Gắn access token vào header `Authorization: Bearer <token>`.
- Khi nhận 401 → gọi refresh token → retry request.
- Khi refresh thất bại → redirect về login.

### 8.2 Error Handling

```typescript
// Frontend nên xử lý theo format:
try {
  const response = await api.get('/table-areas');
  setData(response.data.data);
} catch (error) {
  if (error.response?.status === 401) {
    // Redirect to login
  } else if (error.response?.status === 403) {
    // Show permission error
  } else {
    // Show general error message
    message.error(error.response?.data?.message || 'Đã có lỗi xảy ra');
  }
}
```

---

## 9. Checklist khi implement API

- [ ] Response format đúng: `{ data, message, statusCode }`
- [ ] HTTP status code đúng
- [ ] DTO có `class-validator` decorators
- [ ] DTO có `@ApiProperty` cho Swagger
- [ ] Controller có `@ApiTags`
- [ ] Endpoint có `@ApiOperation`
- [ ] Auth endpoint có `@ApiBearerAuth`
- [ ] Không expose password_hash/token trong response
- [ ] Error response format đúng
- [ ] Swagger mở được tại `/api/docs`
