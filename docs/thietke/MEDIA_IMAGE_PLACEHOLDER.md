# Quy ước Ảnh & Placeholder — Quản lý Nhà hàng

> ⚠️ **Tài liệu Thiết kế Kỹ thuật** — Dành cho Developer/Tech Lead.
> **Không phải tài liệu nghiệp vụ chính thức.**

---

## 1. Tổng quan

Tài liệu này quy định cách xử lý ảnh trong hệ thống, đặc biệt cho
`menu_items.image_url`. Upload ảnh món ăn đã được implement tại Sprint 2+
và hoàn thiện ở các sprint sau.

---

## 2. Trạng thái hiện tại

### 2.1 `menu_items.image_url`

- Kiểu: `VARCHAR(500)` hoặc `TEXT`
- **Nullable**: Có thể NULL
- **Upload ảnh**: Đã implement — `POST /api/uploads/menu-items` (multipart/form-data, field `file`), lưu vào `backend/uploads/menu-items/`

### 2.2 Upload ảnh — Đã implement ✅

- Backend: `UploadsController` dùng `FileInterceptor('file')` + `multer.diskStorage`
- Frontend: `MenuItemsPage` upload qua `formData.append('file', file)`
- Storage: `backend/uploads/menu-items/`, static serve tại `/uploads`
- `image_url` trong DB lưu relative path (ví dụ: `1234567890-image.png`)

---

## 3. Xử lý UI khi hiển thị món ăn

### 3.1 Khi `image_url` là NULL

Hiển thị **placeholder** thay vì ảnh:

```tsx
// React component
{item.image_url ? (
  <img
    src={item.image_url}
    alt={item.name}
    style={{ objectFit: 'cover', width: '100%', height: 200 }}
  />
) : (
  <div className="image-placeholder">
    <PictureOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
    <span>Chưa có ảnh</span>
  </div>
)}
```

**Placeholder requirements:**
- Kích thước bằng với vùng ảnh thật (consistent layout)
- Hiển thị icon (Ant Design: `PictureOutlined` hoặc `ImageOutlined`)
- Text "Chưa có ảnh" hoặc "Không có ảnh"
- Background color: `#fafafa` hoặc `#f5f5f5`
- Border: `1px dashed #d9d9d9` (tùy chọn)

### 3.2 Khi `image_url` có giá trị

```tsx
<img
  src={item.image_url}
  alt={item.name}
  style={{
    objectFit: 'cover',
    width: '100%',
    height: 200,
    borderRadius: 8,
  }}
/>
```

**Requirements:**
- `object-fit: cover` — ảnh lấp đầy vùng, có thể crop
- Kích thước cố định hoặc aspect ratio cố định
- Border radius nhẹ (8px) cho thẩm mỹ
- Lazy loading nếu danh sách dài

### 3.3 Khi `image_url` là URL không hợp lệ

```tsx
// Fallback khi ảnh load lỗi
const handleImageError = (e) => {
  e.target.src = '/placeholder-food.png'; // hoặc render placeholder component
};
```

---

## 4. Vùng ảnh trong Form

### 4.1 Form tạo/sửa món

```
┌─────────────────────────────────┐
│  Tên món: [___________]         │
│  Danh mục: [Select ______]      │
│  Giá: [___________]             │
│  Mô tả: [___________]           │
│                                  │
│  Ảnh món:                       │
│  ┌──────────────────────────┐   │
│  │                          │   │
│  │    [Chưa có ảnh]         │   │
│  │    (placeholder area)    │   │
│  │                          │   │
│  └──────────────────────────┘   │
│  URL ảnh: [___________]         │  ← Nhập URL thủ công hoặc upload
│                                  │
│          [Huỷ]  [Lưu]           │
└─────────────────────────────────┘
```

**Hiện tại:**
- Hiển thị vùng ảnh với placeholder khi chưa có ảnh
- Cho phép nhập `image_url` thủ công (text input)
- Có nút "Upload ảnh" gọi `POST /api/uploads/menu-items`

---

## 5. Không lưu ảnh base64 trong DB

### 5.1 Nguyên tắc

- **KHÔNG** lưu dữ liệu base64 trong database
- Base64 string quá dài, gây chậm query, phình DB
- `image_url` chỉ lưu URL hoặc đường dẫn file

### 5.2 Lưu ý khi nhập URL

- Validate URL format trước khi lưu
- Không cho phép nhập base64 string
- URL phải bắt đầu bằng `http://` hoặc `https://` hoặc `/`

---

## 6. Upload ảnh — Đã implement ✅

| Phần | Quyết định |
|------|-----------|
| **Accept types** | `.jpg`, `.jpeg`, `.png`, `.webp` |
| **Max file size** | 3MB per file |
| **Storage** | Local `backend/uploads/menu-items/` |
| **DB field** | `image_url` — lưu URL path, KHÔNG lưu base64 |
| **Endpoint** | `POST /api/uploads/menu-items` |
| **Static serve** | `/uploads` → `backend/uploads/` qua `express.static` |
| **Response** | `{ url, filename, originalname, size }` |

### 6.3 Flow upload

```
User chọn file → Frontend validate type + size
→ Gửi multipart/form-data lên backend
→ Backend validate → Lưu file vào storage
→ Lưu URL vào DB → Trả về image_url
```

### 6.4 Cleanup

- Khi xoá món → xóa file ảnh tương ứng
- Khi cập nhật ảnh mới → xóa file cũ
- Không auto-resize — frontend tự resize trước khi upload

---

## 7. Checklist khi implement UI ảnh

- [x] Vùng ảnh hiển thị đúng kích thước
- [x] Placeholder hiển thị khi `image_url` là NULL
- [x] Placeholder hiển thị khi ảnh load lỗi
- [x] `object-fit: cover` hoạt động đúng
- [x] Form có input URL
- [x] Có nút upload ảnh (`POST /api/uploads/menu-items`)
- [x] Không lưu base64 trong DB
- [x] Lazy loading cho danh sách dài
