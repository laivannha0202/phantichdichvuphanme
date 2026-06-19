# Quy ước Ảnh & Placeholder — Quản lý Nhà hàng

> ⚠️ **Tài liệu Thiết kế Kỹ thuật** — Dành cho Developer/Tech Lead.
> **Không phải tài liệu nghiệp vụ chính thức.**

---

## 1. Tổng quan

Tài liệu này quy định cách xử lý ảnh trong hệ thống, đặc biệt cho
`menu_items.image_url`. Sprint 2 chưa bắt buộc upload ảnh thật —
chỉ cần UI có vùng ảnh và xử lý placeholder đúng cách.

---

## 2. Trạng thái hiện tại

### 2.1 `menu_items.image_url`

- Kiểu: `VARCHAR(500)` hoặc `TEXT`
- **Nullable**: Có thể NULL
- **Sprint 2**: Không upload ảnh thật, để NULL hoặc nhập URL mẫu
- **hiện tại**: Upload ảnh thật đã implement — `POST /api/uploads/menu-items` (multipart/form-data, field `file`), lưu vào `backend/uploads/menu-items/`

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
│  URL ảnh: [___________]         │  ← Nhập URL thủ công (Sprint 2)
│                                  │
│          [Huỷ]  [Lưu]           │
└─────────────────────────────────┘
```

**Sprint 2:**
- Hiển thị vùng ảnh với placeholder
- Cho phép nhập `image_url` thủ công (text input)
- Không có nút "Upload ảnh"

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

## 6. Kế hoạch Upload ảnh (Future)

> **KHÔNG implement ở Sprint 2.** Đây là reference cho sprint sau.

### 6.1 Khi nào cần

- Khi business yêu cầu upload ảnh thật
- Khi đã có storage solution (local filesystem hoặc object storage)

### 6.2 Khi implement

| Phần | Quyết định |
|------|-----------|
| **Accept types** | `jpg`, `jpeg`, `png`, `webp` |
| **Max file size** | 5MB per file |
| **Storage** | Local `/uploads/menu/` hoặc S3/MinIO |
| **DB field** | `image_url` — lưu URL/path, KHÔNG lưu base64 |
| **Endpoint** | `POST /api/menu-items/:id/image` |
| **Response** | `{ "image_url": "/uploads/menu/pho-bo.jpg" }` |

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

- [ ] Vùng ảnh hiển thị đúng kích thước
- [ ] Placeholder hiển thị khi `image_url` là NULL
- [ ] Placeholder hiển thị khi ảnh load lỗi
- [ ] `object-fit: cover` hoạt động đúng
- [ ] Form có input URL (Sprint 2)
- [ ] Không có nút upload (Sprint 2)
- [ ] Không lưu base64 trong DB
- [ ] Lazy loading cho danh sách dài
