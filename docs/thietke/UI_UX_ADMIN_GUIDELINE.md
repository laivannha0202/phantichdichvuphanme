# Hướng dẫn UI/UX Admin — Quản lý Nhà hàng

> ⚠️ **Tài liệu Thiết kế Kỹ thuật** — Dành cho Developer/Tech Lead.
> **Không phải tài liệu nghiệp vụ chính thức.**

---

## 1. Layout Tổng Thể

### 1.1 Cấu trúc Layout

```
┌─────────────────────────────────────────────────────┐
│                    Header                            │
│  [Logo]  [Breadcrumb]           [User Info] [Logout] │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │              Content                     │
│          │                                          │
│ Menu 1   │  ┌──────────────────────────────────┐   │
│ Menu 2   │  │                                  │   │
│ Menu 3   │  │        Trang hiện tại            │   │
│ Menu 4   │  │                                  │   │
│ Menu 5   │  │                                  │   │
│          │  └──────────────────────────────────┘   │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

### 1.2 Sidebar

- **Width**: 250px (desktop), 0px (mobile — collapse thành hamburger menu)
- **Background**: White hoặc Dark theme
- **Menu items**: Hiển thị theo role đang đăng nhập

**Menu theo role:**

| Role | Menu items |
|------|-----------|
| QUAN_TRI_HE_THONG | Dashboard, Quản lý tài khoản, Quản lý khu vực/bàn, Quản lý thực đơn, Audit Log |
| QUAN_LY | Dashboard, Quản lý khu vực/bàn, Quản lý thực đơn, Đặt bàn, Báo cáo |
| PHUC_VU | Dashboard, Gọi món, Xem bàn |
| THU_NGAN | Dashboard, Thanh toán, Hóa đơn |
| BEP | Dashboard, Món chế biến |
| KHO | Dashboard, Kho nguyên liệu |

### 1.3 Header

- **Height**: 64px
- **Contents**:
  - Left: Breadcrumb (trang hiện tại)
  - Right: Tên user + avatar + dropdown (Đăng xuất)
- **Sticky**: Không sticky (scroll cùng content)

### 1.4 Content Area

- **Padding**: 24px
- **Max width**: Không giới hạn (fluid)
- **Background**: `#f5f5f5` (Ant Design default)

---

## 2. Quy ước Page CRUD

### 2.1 List Page

```
┌─────────────────────────────────────────────────┐
│  Page Title                    [Button: Thêm mới] │
├─────────────────────────────────────────────────┤
│  Filter Bar                                        │
│  [Search input] [Status dropdown] [Area dropdown]  │
├─────────────────────────────────────────────────┤
│  Table / Grid                                      │
│  ┌─────┬──────┬──────┬──────┬──────────┐        │
│  │ ID  │ Name │ Status│ ...  │ Actions  │        │
│  ├─────┼──────┼──────┼──────┼──────────┤        │
│  │ 1   │ ...  │ Tag  │ ...  │ Edit Del │        │
│  └─────┴──────┴──────┴──────┴──────────┘        │
├─────────────────────────────────────────────────┤
│  Pagination: < 1 2 3 ... 10 >                     │
└─────────────────────────────────────────────────┘
```

**Components:**
- `Table` hoặc `Card.Grid` (tùy loại data)
- `Input.Search` — tìm kiếm
- `Select` — filter dropdown
- `Button` — thêm mới
- `Tag` — hiển thị trạng thái
- `Space` — nhóm action buttons

### 2.2 Create/Edit Modal hoặc Drawer

```
┌─────────────────────────────────┐
│  [Title: Thêm mới / Chỉnh sửa]    │
│                                  │
│  Form:                           │
│  ┌────────────────────────────┐ │
│  │ Label                       │ │
│  │ [Input / Select / etc]     │ │
│  └────────────────────────────┘ │
│  ┌────────────────────────────┐ │
│  │ Label                       │ │
│  │ [Input / Select / etc]     │ │
│  └────────────────────────────┘ │
│                                  │
│          [Hủy]  [Lưu]           │
└─────────────────────────────────┘
```

**Quy tắc:**
- Dùng `Modal` cho form đơn giản (≤ 5 fields)
- Dùng `Drawer` cho form phức tạp (> 5 fields) hoặc form cần nhiều không gian
- Validate real-time khi submit
- Hiển thị lỗi cụ thể cho từng field

### 2.3 Delete Confirm

```
┌─────────────────────────────────┐
│  ⚠️ Xác nhận xoá                  │
│                                  │
│  Bạn có chắc chắn muốn xoá      │
│  "[Tên resource]" không?         │
│                                  │
│  Hành động này không thể hoàn tác.│
│                                  │
│          [Huỷ]  [Xoá]           │
└─────────────────────────────────┘
```

- Dùng `Popconfirm` hoặc `Modal.confirm`
- Luôn hiển thị tên resource cần xoá
- Nút xoá dùng `danger` style (màu đỏ)

### 2.4 Status Badge

```tsx
<Tag color="green">TRONG</Tag>
<Tag color="blue">CO_KHACH</Tag>
<Tag color="yellow">DA_DAT</Tag>
<Tag color="orange">DANG_DON</Tag>
<Tag color="red">BAO_TRI</Tag>
```

---

## 3. Ant Design Components

### 3.1 Danh sách Components thường dùng

| Component | Khi nào dùng | Ví dụ |
|-----------|--------------|-------|
| `Table` | Hiển thị danh sách dữ liệu dạng bảng | Danh sách bàn, danh sách món |
| `Card` | Hiển thị thông tin dạng card | Dashboard stats, table grid |
| `Modal` | Form tạo/sửa đơn giản | Tạo khu vực, sửa tên |
| `Drawer` | Form phức tạp, cần nhiều không gian | Chi tiết đơn hàng |
| `Form` | Form nhập liệu | Mọi form CRUD |
| `Input` | Nhập text | Tên, mô tả |
| `InputNumber` | Nhập số | Giá, số ghế |
| `Select` | Chọn từ dropdown | Chọn khu vực, chọn danh mục |
| `Tag` | Hiển thị trạng thái | TRONG, DANG_BAN, ACTIVE |
| `Button` | Nút thao tác | Thêm, sửa, xoá, lưu |
| `DatePicker` | Chọn ngày | Filter theo ngày |
| `Statistic` | Hiển thị số liệu | Tổng doanh thu, số bàn |
| `Tabs` | Chuyển đổi giữa các view | Danh mục món (tab per category) |
| `Popconfirm` | Xác nhận hành động | Xoá item |
| `message` | Thông báo ngắn | Thành công, lỗi |
| `Spin` | Loading state | Đang tải dữ liệu |
| `Empty` | Không có dữ liệu | Chưa có bàn, chưa có món |
| `Badge` | Hiển thị số | Số đơn chờ |
| `Avatar` | Ảnh đại diện | User avatar |
| `Dropdown` | Menu dropdown | User menu, action menu |

### 3.2 Quy tắc sử dụng

- **Table**: Dùng cho danh sách > 5 items, cần sort/filter/pagination
- **Card.Grid**: Dùng cho grid view (VD: hiển thị bàn dạng lưới)
- **Modal vs Drawer**: Modal cho form ≤ 5 fields, Drawer cho > 5 fields
- **Tag**: Luôn dùng cho status display
- **Button primary**: Chỉ 1 button primary per view (VD: "Thêm mới")
- **Button danger**: Dùng cho destructive actions (xoá)

---

## 4. Quy ước Màu Trạng thái

### 4.1 Bàn (Tables)

| Status | Label | Màu | Ant Design Tag |
|--------|-------|-----|----------------|
| `TRONG` | Trống | Green | `<Tag color="green">Trống</Tag>` |
| `DA_DAT` | Đã đặt | Yellow | `<Tag color="gold">Đã đặt</Tag>` |
| `CO_KHACH` | Có khách | Blue | `<Tag color="blue">Có khách</Tag>` |
| `DANG_DON` | Đang dọn | Orange | `<Tag color="orange">Đang dọn</Tag>` |
| `BAO_TRI` | Bảo trì | Red | `<Tag color="red">Bảo trì</Tag>` |

### 4.2 Món ăn (Menu Items)

| Status | Label | Màu | Ant Design Tag |
|--------|-------|-----|----------------|
| `DANG_BAN` | Đang bán | Green | `<Tag color="green">Đang bán</Tag>` |
| `HET_MON` | Hết món | Orange | `<Tag color="orange">Hết món</Tag>` |
| `NGUNG_BAN` | Ngừng bán | Red | `<Tag color="red">Ngừng bán</Tag>` |

### 4.3 Tài khoản (Users)

| Status | Label | Màu | Ant Design Tag |
|--------|-------|-----|----------------|
| `ACTIVE` | Hoạt động | Green | `<Tag color="green">Hoạt động</Tag>` |
| `INACTIVE` | Vô hiệu | Gray | `<Tag color="default">Vô hiệu</Tag>` |
| `LOCKED` | Khóa | Red | `<Tag color="red">Khóa</Tag>` |

### 4.4 Đơn hàng (Orders)

| Status | Label | Màu |
|--------|-------|-----|
| `DANG_CHUAN_BI` | Đang chuẩn bị | Blue |
| `DANG_PHUC_VU` | Đang phục vụ | Green |
| `HOAN_THANH` | Hoàn thành | Cyan |
| `DA_THANH_TOAN` | Đã thanh toán | Gray |
| `DA_HUY` | Đã hủy | Red |

### 4.5 Hóa đơn (Invoices)

| Status | Label | Màu |
|--------|-------|-----|
| `CHUA_THANH_TOAN` | Chưa thanh toán | Orange |
| `DA_THANH_TOAN` | Đã thanh toán | Green |
| `DA_HUY` | Đã hủy | Red |

---

## 5. Loading / Error / Empty States

### 5.1 Loading State

```tsx
// Dùng khi đang tải danh sách
<Spin size="large" />

// Hoặc skeleton
<Skeleton active paragraph={{ rows: 4 }} />
```

**Quy tắc:**
- Hiển thị loading khi đang fetch API
- Dùng `Spin` cho loading toàn trang
- Dùng `Skeleton` cho loading list (thay thế content thực)
- Không hiển thị loading khi submit form (dùng `Button loading`)

### 5.2 Error State

```tsx
// Lỗi API
<Alert
  type="error"
  message="Không thể tải dữ liệu"
  description="Vui lòng thử lại sau"
  showIcon
  action={<Button onClick={retry}>Thử lại</Button>}
/>
```

**Quy tắc:**
- Hiển thị error message cụ thể từ API
- Có nút "Thử lại" nếu là lỗi transient
- Không hiển thị error message kỹ thuật cho user

### 5.3 Empty State

```tsx
// Không có dữ liệu
<Empty description="Chưa có khu vực nào">
  <Button type="primary" onClick={openCreateModal}>
    Thêm khu vực
  </Button>
</Empty>
```

**Quy tắc:**
- Luôn có hướng dẫn action khi empty
- Hiển thị illustration hoặc icon phù hợp
- Nút action dẫn đến tạo mới

---

## 6. Responsive Design

### 6.1 Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Desktop | ≥ 1200px | Sidebar + Content đầy đủ |
| Tablet | 768px - 1199px | Sidebar collapse (icon only) |
| Mobile | < 768px | Sidebar ẩn (hamburger menu) |

### 6.2 Grid System

Dùng Ant Design Grid (`Row`, `Col`) với 24 columns:

| Screen | Cột |
|--------|-----|
| Desktop | 24 columns |
| Tablet | 12 columns per card |
| Mobile | 6 columns per card |

### 6.3 Table Responsive

- Desktop: Hiển thị đầy đủ columns
- Tablet: Ẩn columns ít quan trọng
- Mobile: Chuyển sang Card view thay vì Table

### 6.4 Form Responsive

- Desktop: 2 columns form
- Tablet/Mobile: 1 column form

---

## 7. Navigation & Routing

### 7.1 Routes

| Path | Page | Component |
|------|------|-----------|
| `/login` | Đăng nhập | LoginPage |
| `/` | Dashboard | DashboardPage |
| `/table-areas` | Quản lý khu vực | TableAreaPage |
| `/tables` | Quản lý bàn | TablePage |
| `/menu/categories` | Quản lý danh mục | MenuCategoryPage |
| `/menu/items` | Quản lý món ăn | MenuItemPage |
| `/orders` | Quản lý đơn hàng | OrderPage |
| `/kitchen` | Màn hình bếp | KitchenPage |
| `/payments` | Thanh toán | PaymentPage |
| `/reports` | Báo cáo | ReportPage |
| `/inventory` | Kho nguyên liệu | InventoryPage |
| `/staff` | Nhân viên | StaffPage |
| `/users` | Tài khoản | UserPage |
| `/audit-logs` | Nhật ký | AuditLogPage |

### 7.2 Protected Routes

- Tất cả routes trừ `/login` đều cần xác thực
- Kiểm tra role để ẩn/hiện menu items
- Nếu không có quyền → redirect về `/` hoặc hiển thị 403

---

## 8. Form Validation

### 8.1 Frontend (Zod + React Hook Form)

```typescript
const schema = z.object({
  name: z.string().min(1, 'Tên không được để trống').max(100),
  capacity: z.number().min(1, 'Sức chứa phải >= 1'),
  area_id: z.number().min(1, 'Phải chọn khu vực'),
});
```

### 8.2 Backend (class-validator)

```typescript
export class CreateTableDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsNumber()
  @Min(1)
  capacity: number;
}
```

### 8.3 Error Display

- Frontend validate trước khi submit
- Backend validate lại và trả lỗi chi tiết
- Hiển thị lỗi ngay bên dưới field lỗi

---

## 9. Theme & Styling

### 9.1 Color Palette

| Purpose | Color | Hex |
|---------|-------|-----|
| Primary | Blue | `#1677ff` |
| Success | Green | `#52c41a` |
| Warning | Orange | `#faad14` |
| Error | Red | `#ff4d4f` |
| Text | Dark Gray | `#262626` |
| Text Secondary | Gray | `#8c8c8c` |
| Background | Light Gray | `#f5f5f5` |
| Border | Gray | `#d9d9d9` |

### 9.2 Typography

| Element | Font Size | Weight |
|---------|-----------|--------|
| Page Title | 24px | 600 |
| Section Title | 16px | 600 |
| Body Text | 14px | 400 |
| Caption | 12px | 400 |

### 9.3 Spacing

| Level | Size |
|-------|------|
| XS | 4px |
| SM | 8px |
| MD | 16px |
| LG | 24px |
| XL | 32px |

---

## 10. Checklist khi implement UI

- [ ] Layout responsive đúng breakpoint
- [ ] Sidebar hiển thị đúng theo role
- [ ] Breadcrumb hiển thị đúng
- [ ] Loading state khi fetch API
- [ ] Error state khi API lỗi
- [ ] Empty state khi không có dữ liệu
- [ ] Form validate cả FE và BE
- [ ] Status badge đúng màu
- [ ] Modal/Drawer mở đúng form
- [ ] Delete confirm hiển thị
- [ ] Table sort/filter/pagination hoạt động
- [ ] Không hiển thị data nhạy cảm (password, token)
