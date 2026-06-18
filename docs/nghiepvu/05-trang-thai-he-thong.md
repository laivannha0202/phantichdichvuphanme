# Trạng thái hệ thống — Hệ thống quản lý nhà hàng

## 1. Mục đích

Tài liệu này chuẩn hóa cách hiểu về **trạng thái** và **luồng chuyển trạng thái**
của các thực thể chính trong hệ thống quản lý nhà hàng.

Tài liệu này phục vụ:

- Làm căn cứ cho thiết kế giao diện, kiểm thử nghiệp vụ và triển khai sau này.
- Giúp tránh nhầm lẫn khi xử lý đặt bàn, gọi món, bếp, thanh toán và kho.
- Phát hiện sớm các chuyển trạng thái không hợp lệ trước khi triển khai.

**Phạm vi:** 7 nhóm trạng thái — Bàn, Đặt bàn, Món trong đơn hàng, Đơn hàng, Thanh toán,
Thực đơn/Món ăn, Nguyên liệu/Kho.

---

## 2. Quy ước ký hiệu

| Ký hiệu | Ý nghĩa |
|---------|---------|
| `(M)` | Chuyển đổi do hệ thống tự động thực hiện |
| `(NV)` | Chuyển đổi do nhân viên (người dùng) thao tác |
| `(QL)` | Chuyển đổi chỉ dành cho Quản lý nhà hàng |
| `(HT)` | Chuyển đổi chỉ dành cho Quản trị hệ thống |
| ⚠️ | Chuyển đổi có rủi ro nghiệp vụ, cần xác nhận hoặc ghi nhật ký hoạt động |
| 🚫 | Chuyển đổi không hợp lệ |

---

## 3. Trạng thái bàn (Table)

### 3.1. Danh sách trạng thái

| Mã trạng thái | Tên trạng thái | Mô tả | Người tạo/chuyển |
|:--------------:|----------------|-------|:-----------------:|
| TB-TR | Trống | Bàn sẵn sàng phục vụ, chưa có khách, chưa có đặt bàn | Hệ thống |
| TB-DD | Đã đặt | Bàn đã được đặt trước cho một khách hàng cụ thể, đang chờ khách đến | Hệ thống (tự động) |
| TB-DPV | Đang phục vụ | Bàn đang có khách, đã tạo đơn hàng hoặc đã check-in | Nhân viên phục vụ |
| TB-CD | Cần dọn | Khách đã thanh toán/rời bàn, bàn cần được dọn dẹp | Thu ngân (M) |
| TB-BT | Bảo trì | Bàn đang được sửa chữa hoặc ngừng sử dụng tạm thời | Quản lý |

### 3.2. Sơ đồ chuyển trạng thái

```
        ┌──────────────────────────────────────────────┐
        │                                              ▼
  ┌──────────┐     ┌──────────┐     ┌──────────────┐     ┌──────────┐
  │  TB-TR   │────→│  TB-DD   │────→│   TB-DPV     │────→│  TB-CD   │
  │  Trống   │     │ Đã đặt   │     │ Đang phục vụ │     │ Cần dọn  │
  └──────────┘     └──────────┘     └──────────────┘     └──────────┘
       │                                                  │
       │      ┌──────────┐                                │
       └─────→│  TB-BT   │←───────────────────────────────┘
              │ Bảo trì  │
              └──────────┘
```

### 3.3. Ma trận chuyển trạng thái hợp lệ

| Từ \ Đến | TB-TR (Trống) | TB-DD (Đã đặt) | TB-DPV (Đang phục vụ) | TB-CD (Cần dọn) | TB-BT (Bảo trì) |
|-----------|:-------------:|:--------------:|:---------------------:|:----------------:|:----------------:|
| **TB-TR (Trống)** | — | ✔ Khách đặt trước, Xác nhận đặt bàn (M) | ✔ Khách đến trực tiếp, Xếp bàn (NV) | — | ✔ Quản lý yêu cầu bảo trì (QL) |
| **TB-DD (Đã đặt)** | ✔ Hủy đặt bàn / Khách không đến (M) | — | ✔ Khách đến, Check-in (NV) | — | — |
| **TB-DPV (Đang phục vụ)** | — | — | — | ✔ Thanh toán xong (M) | — |
| **TB-CD (Cần dọn)** | ✔ Dọn bàn xong (NV) | — | — | — | ✔ Quản lý yêu cầu bảo trì (QL) |
| **TB-BT (Bảo trì)** | ✔ Sửa xong, mở lại bàn (QL) | — | — | — | — |

### 3.4. Chuyển trạng thái không hợp lệ

| Chuyển đổi | Lý do |
|------------|-------|
| TB-DPV → TB-TR | Bỏ qua bước dọn bàn. Vi phạm quy trình vệ sinh. |
| TB-DPV → TB-DD | Bàn đang có khách, không thể đặt chồng. |
| TB-CD → TB-DPV | Bàn chưa dọn, không thể phục vụ khách mới. |
| TB-DD → TB-CD | Bàn chưa phục vụ, không thể cần dọn. |
| TB-BT → TB-DPV | Bàn đang bảo trì, phải qua Trống trước khi phục vụ lại. |
| TB-BT → TB-DD | Bàn đang bảo trì, không thể nhận đặt. |
| TB-TR → TB-TR | Không có ý nghĩa. |
| Bất kỳ → TB-BT khi bàn đang Đã đặt | Cần hủy đặt bàn trước hoặc đợi qua Trống — không chuyển trực tiếp. |

### 3.5. Ghi chú

- Bàn ở trạng thái `Bảo trì` ẩn khỏi danh sách chọn bàn khi đặt hoặc xếp khách.
- Bàn ở trạng thái `Cần dọn` không hiển thị trên sơ đồ bàn trống.
- Thời gian giữ bàn khi ở trạng thái `Đã đặt` được cấu hình trong hệ thống (mặc định 15 phút).

---

## 4. Trạng thái đặt bàn (Reservation)

### 4.1. Danh sách trạng thái

| Mã trạng thái | Tên trạng thái | Mô tả | Người tạo/chuyển |
|:--------------:|----------------|-------|:-----------------:|
| DB-CXN | Chờ xác nhận | Đặt bàn vừa được tạo, chờ nhân viên xác nhận với khách | Nhân viên phục vụ |
| DB-DXN | Đã xác nhận | Nhân viên đã xác nhận đặt bàn thành công với khách | Nhân viên phục vụ |
| DB-KDN | Khách đã đến | Khách đã đến nhà hàng và nhận bàn | Nhân viên phục vụ |
| DB-KKD | Khách không đến | Quá thời gian giữ bàn, khách không đến | Hệ thống (M) |
| DB-DH | Đã hủy | Đặt bàn bị hủy theo yêu cầu của khách hoặc do nhân viên | Nhân viên phục vụ |

### 4.2. Sơ đồ chuyển trạng thái

```
  ┌──────────┐     ┌──────────┐     ┌──────────┐
  │  DB-CXN  │────→│  DB-DXN  │────→│  DB-KDN  │
  │Chờ xác   │     │Đã xác    │     │Khách đã  │
  │nhận      │     │nhận      │     │đến       │
  └──────────┘     └──────────┘     └──────────┘
       │                │
       │                │    ┌──────────┐
       │                └───→│  DB-KKD  │
       │                     │Khách     │
       │                     │không đến │
       │    ┌──────────┐     └──────────┘
       └───→│  DB-DH   │
            │ Đã hủy   │
            └──────────┘
```

### 4.3. Ma trận chuyển trạng thái hợp lệ

| Từ \ Đến | DB-CXN (Chờ xác nhận) | DB-DXN (Đã xác nhận) | DB-KDN (Khách đã đến) | DB-KKD (Khách không đến) | DB-DH (Đã hủy) |
|-----------|:---------------------:|:--------------------:|:---------------------:|:------------------------:|:---------------:|
| **DB-CXN (Chờ xác nhận)** | — | ✔ Nhân viên xác nhận (NV) | — | — | ✔ Hủy theo yêu cầu (NV) |
| **DB-DXN (Đã xác nhận)** | — | — | ✔ Khách đến check-in (NV) | ✔ Quá giờ giữ bàn (M) | ✔ Hủy theo yêu cầu (NV) |
| **DB-KDN (Khách đã đến)** | — | — | — | — | — |
| **DB-KKD (Khách không đến)** | — | — | — | — | — |
| **DB-DH (Đã hủy)** | — | — | — | — | — |

### 4.4. Chuyển trạng thái không hợp lệ

| Chuyển đổi | Lý do |
|------------|-------|
| DB-CXN → DB-KDN | Bỏ qua bước xác nhận. Nhân viên phải xác nhận với khách trước. |
| DB-CXN → DB-KKD | Chỉ áp dụng cho đã xác nhận. Nếu chưa xác nhận thì hủy, không ghi nhận "không đến". |
| DB-DXN → DB-CXN | Không thể quay lại trạng thái chờ xác nhận sau khi đã xác nhận. |
| DB-KDN → bất kỳ | Trạng thái cuối — khách đã nhận bàn, bắt đầu phục vụ. |
| DB-KKD → bất kỳ | Trạng thái cuối — đã kết thúc. |
| DB-DH → bất kỳ | Trạng thái cuối — đã hủy, không thể phục hồi. |

### 4.5. Ghi chú

- Khi đặt bàn chuyển sang `DB-DXN` (Đã xác nhận) → bàn tương ứng chuyển sang `TB-DD` (Đã đặt).
- Khi đặt bàn chuyển sang `DB-KDN` (Khách đã đến) → bàn tương ứng chuyển sang `TB-DPV` (Đang phục vụ).
- Khi đặt bàn chuyển sang `DB-KKD` hoặc `DB-DH` → bàn tương ứng chuyển về `TB-TR` (Trống).
- Các trạng thái `DB-KDN`, `DB-KKD`, `DB-DH` là trạng thái cuối (terminal state) của một đặt bàn.

---

## 5. Trạng thái món trong đơn hàng (Order Item)

### 5.1. Danh sách trạng thái

| Mã trạng thái | Tên trạng thái | Mô tả | Người tạo/chuyển |
|:--------------:|----------------|-------|:-----------------:|
| MM-CCB | Chờ chế biến | Món đã được gửi xuống bếp, chờ nhân viên bếp chế biến | Hệ thống (M) |
| MM-DCB | Đang chế biến | Nhân viên bếp đang chế biến món | Nhân viên bếp |
| MM-HT | Hoàn thành | Món đã chế biến xong, chờ phục vụ mang lên bàn | Nhân viên bếp |
| MM-DPV | Đã phục vụ | Món đã được mang lên bàn cho khách | Nhân viên phục vụ |
| MM-DH | Đã hủy | Món bị hủy (theo yêu cầu khách hoặc do hết nguyên liệu) | Nhân viên phục vụ |

### 5.2. Sơ đồ chuyển trạng thái

```
  ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
  │  MM-CCB  │────→│  MM-DCB  │────→│  MM-HT   │────→│  MM-DPV  │
  │Chờ chế   │     │Đang chế  │     │Hoàn      │     │Đã phục   │
  │biến      │     │biến      │     │thành     │     │vụ        │
  └──────────┘     └──────────┘     └──────────┘     └──────────┘
       │
       │    ┌──────────┐
       └───→│  MM-DH   │
            │ Đã hủy   │
            └──────────┘
```

### 5.3. Ma trận chuyển trạng thái hợp lệ

| Từ \ Đến | MM-CCB (Chờ chế biến) | MM-DCB (Đang chế biến) | MM-HT (Hoàn thành) | MM-DPV (Đã phục vụ) | MM-DH (Đã hủy) |
|-----------|:---------------------:|:----------------------:|:-------------------:|:-------------------:|:---------------:|
| **MM-CCB (Chờ chế biến)** | — | ✔ Bếp bắt đầu chế biến (NV-Bếp) | — | — | ✔ Hủy món — món chưa chế biến (NV-PV) |
| **MM-DCB (Đang chế biến)** | — | — | ✔ Bếp hoàn thành (NV-Bếp) | — | — |
| **MM-HT (Hoàn thành)** | — | — | — | ✔ Phục vụ mang lên bàn (NV-PV) | — |
| **MM-DPV (Đã phục vụ)** | — | — | — | — | — |
| **MM-DH (Đã hủy)** | — | — | — | — | — |

### 5.4. Chuyển trạng thái không hợp lệ

| Chuyển đổi | Lý do |
|------------|-------|
| MM-DCB → MM-CCB | Không thể quay lại "chờ" khi đã bắt đầu chế biến. |
| MM-DCB → MM-DH | Không thể hủy món khi đã bắt đầu chế biến — cần xử lý với khách và quản lý. |
| MM-HT → MM-DCB | Không thể quay lại chế biến khi đã hoàn thành. |
| MM-DPV → MM-HT | Món đã phục vụ, không thể quay lại. |
| MM-DPV → bất kỳ | Trạng thái cuối của món được phục vụ thành công. |
| MM-DH → bất kỳ | Trạng thái cuối — món đã hủy. |
| MM-CCB → MM-HT | Bỏ qua bước chế biến — vi phạm quy trình bếp. |
| MM-CCB → MM-DPV | Bỏ qua cả chế biến và hoàn thành. |

### 5.5. Ghi chú

- Trạng thái `MM-CCB` là trạng thái duy nhất cho phép sửa số lượng hoặc hủy món.
- Chỉ nhân viên bếp mới được chuyển `MM-CCB → MM-DCB` và `MM-DCB → MM-HT`.
- Chỉ nhân viên phục vụ mới được chuyển `MM-HT → MM-DPV`.
- Khi bếp không thể chế biến (hết nguyên liệu), gắn cờ "Không thể chế biến" để nhân viên phục vụ xử lý — đây không phải chuyển trạng thái tự động mà là tình huống nghiệp vụ đặc biệt.

---

## 6. Trạng thái đơn hàng (Order)

### 6.1. Danh sách trạng thái

| Mã trạng thái | Tên trạng thái | Mô tả | Người tạo/chuyển |
|:--------------:|----------------|-------|:-----------------:|
| DH-HĐ | Đang hoạt động | Đơn hàng đang mở, có thể thêm/sửa món, chưa thanh toán | Nhân viên phục vụ |
| DH-DTT | Đã thanh toán | Đơn hàng đã được thanh toán thành công, chỉ đọc | Hệ thống (M) |
| DH-DH | Đã hủy | Đơn hàng bị hủy (không phát sinh thanh toán) | Quản lý (QL) |

### 6.2. Sơ đồ chuyển trạng thái

```
  ┌──────────────┐
  │   DH-HĐ      │
  │ Đang hoạt    │
  │ động         │
  └──────┬───────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
  ┌──────────┐ ┌──────────┐
  │ DH-DTT   │ │ DH-DH    │
  │ Đã thanh │ │ Đã hủy   │
  │ toán     │ │          │
  └──────────┘ └──────────┘
```

### 6.3. Ma trận chuyển trạng thái hợp lệ

| Từ \ Đến | DH-HĐ (Đang hoạt động) | DH-DTT (Đã thanh toán) | DH-DH (Đã hủy) |
|-----------|:----------------------:|:----------------------:|:---------------:|
| **DH-HĐ (Đang hoạt động)** | — | ✔ Thanh toán thành công (M) | ✔ Hủy đơn hàng (QL) |
| **DH-DTT (Đã thanh toán)** | ✔ ⚠️ Khôi phục khi hủy hóa đơn (QL) | — | ✔ ⚠️ Hủy đơn hàng đã thanh toán (QL) |
| **DH-DH (Đã hủy)** | — | — | — |

### 6.4. Chuyển trạng thái không hợp lệ

| Chuyển đổi | Lý do |
|------------|-------|
| DH-DTT → DH-HĐ (tự động) | Chỉ được phép nếu quản lý hủy hóa đơn và khôi phục đơn hàng (⚠️). Không tự động. |
| DH-DTT → DH-DTT | Đã thanh toán rồi, không thanh toán lại. |
| DH-HĐ → DH-HĐ | Đơn hàng đã tồn tại cho bàn, cần tạo đơn mới nếu khách gọi thêm sau khi thanh toán. |
| DH-DH → bất kỳ (trừ khi có quyền đặc biệt) | Đơn hàng đã hủy là trạng thái cuối. |

### 6.5. Ghi chú

- Mỗi bàn chỉ có **một** đơn hàng ở trạng thái `DH-HĐ` tại một thời điểm.
- Sau khi đơn hàng chuyển sang `DH-DTT`, bàn chuyển sang `TB-CD` (Cần dọn).
- Chuyển `DH-DTT → DH-HĐ` chỉ xảy ra khi quản lý hủy hóa đơn đã thanh toán và hệ thống khôi phục đơn hàng (theo BR-PAY-18). Đây là thao tác nhạy cảm, cần ghi nhật ký hoạt động.
- Khi đơn hàng ở trạng thái `DH-DTT`, tất cả dữ liệu trong đơn hàng trở thành **chỉ đọc (read-only)**.

---

## 7. Trạng thái thanh toán (Payment / Invoice)

### 7.1. Danh sách trạng thái

| Mã trạng thái | Tên trạng thái | Mô tả | Người tạo/chuyển |
|:--------------:|----------------|-------|:-----------------:|
| TT-CTT | Chưa thanh toán | Hóa đơn đã được tạo (tự động khi có đơn hàng), chờ thu ngân xử lý thanh toán | Hệ thống (M) |
| TT-DTT | Đã thanh toán | Khách đã thanh toán thành công, hóa đơn hoàn tất | Thu ngân |
| TT-DH | Đã hủy | Hóa đơn bị hủy (do nhập sai, thanh toán nhầm, ...) | Quản lý (QL) |

### 7.2. Sơ đồ chuyển trạng thái

```
  ┌──────────────┐     ┌──────────────┐
  │   TT-CTT     │────→│   TT-DTT     │
  │ Chưa thanh   │     │ Đã thanh     │
  │ toán         │     │ toán         │
  └──────┬───────┘     └──────┬───────┘
         │                    │
         │    ┌──────────┐    │
         ├───→│  TT-DH   │←───┘
         │    │ Đã hủy   │
         │    └──────────┘
         │      (QL)
         ▼
  (Hủy trước khi TT)
```

### 7.3. Ma trận chuyển trạng thái hợp lệ

| Từ \ Đến | TT-CTT (Chưa thanh toán) | TT-DTT (Đã thanh toán) | TT-DH (Đã hủy) |
|-----------|:------------------------:|:----------------------:|:---------------:|
| **TT-CTT (Chưa thanh toán)** | — | ✔ Thanh toán thành công (NV-Thu ngân) | ✔ Hủy hóa đơn — chưa có giao dịch (QL) |
| **TT-DTT (Đã thanh toán)** | — | — | ✔ ⚠️ Hủy hóa đơn đã thanh toán (QL) |
| **TT-DH (Đã hủy)** | — | — | — |

### 7.4. Chuyển trạng thái không hợp lệ

| Chuyển đổi | Lý do |
|------------|-------|
| TT-DTT → TT-CTT | Không thể "hoàn tác" thanh toán. Chỉ có thể hủy hóa đơn (TT-DH). |
| TT-CTT → TT-CTT | Trùng lặp, không có ý nghĩa. |
| TT-DH → bất kỳ | Hóa đơn đã hủy là trạng thái cuối. |
| TT-DTT → TT-DTT | Đã thanh toán, không thể thanh toán lại. |

### 7.5. Ghi chú

- Hóa đơn được hệ thống tự động tạo khi đơn hàng có ít nhất một món.
- Khi hóa đơn ở trạng thái `TT-CTT`, thu ngân có thể xem và chuẩn bị thanh toán.
- Hủy hóa đơn (`TT-CTT → TT-DH`) khác với hủy hóa đơn đã thanh toán (`TT-DTT → TT-DH`):
  - `TT-CTT → TT-DH`: Không ảnh hưởng tài chính, có thể do nhập sai món.
  - `TT-DTT → TT-DH`: ⚠️ Ảnh hưởng tài chính, bắt buộc ghi nhật ký hoạt động, chỉ quản lý được thực hiện.
- Khi hủy hóa đơn đã thanh toán, hệ thống tạo bản ghi hủy hóa đơn chứa: mã hóa đơn gốc, người hủy, thời gian, lý do.

---

## 8. Trạng thái thực đơn / Món ăn (Menu Item)

### 8.1. Danh sách trạng thái

| Mã trạng thái | Tên trạng thái | Mô tả | Người tạo/chuyển |
|:--------------:|----------------|-------|:-----------------:|
| TD-DB | Đang bán | Món đang được phục vụ, hiển thị trong thực đơn gọi món | Quản lý |
| TD-HM | Hết món | Món tạm thời hết nguyên liệu, không thể gọi nhưng vẫn hiển thị (có nhãn "Hết món") | Quản lý |
| TD-NB | Ngừng bán | Món ngừng kinh doanh, ẩn khỏi thực đơn gọi món | Quản lý |

### 8.2. Sơ đồ chuyển trạng thái

```
  ┌──────────┐
  │  TD-DB   │
  │ Đang bán │
  └────┬─────┘
       │
  ┌────┴────┐
  │         │
  ▼         ▼
┌────────┐ ┌──────────┐
│ TD-HM  │ │ TD-NB    │
│ Hết    │ │ Ngừng    │
│ món    │ │ bán      │
└────┬───┘ └──────────┘
     │
     ▼
  ┌──────────┐
  │  TD-DB   │
  │ Đang bán │
  └──────────┘
```

### 8.3. Ma trận chuyển trạng thái hợp lệ

| Từ \ Đến | TD-DB (Đang bán) | TD-HM (Hết món) | TD-NB (Ngừng bán) |
|-----------|:----------------:|:----------------:|:------------------:|
| **TD-DB (Đang bán)** | — | ✔ Nhập "Hết món" (QL) | ✔ Nhập "Ngừng bán" (QL) |
| **TD-HM (Hết món)** | ✔ Nhập lại "Đang bán" (QL) | — | ✔ Nhập "Ngừng bán" (QL) |
| **TD-NB (Ngừng bán)** | ✔ Nhập lại "Đang bán" (QL) | — | — |

### 8.4. Chuyển trạng thái không hợp lệ

| Chuyển đổi | Lý do |
|------------|-------|
| TD-DB → TD-DB | Không có ý nghĩa. |
| TD-NB → TD-HM | Món đã ngừng bán thì không cần phân biệt "hết món" — nếu muốn bán lại thì chuyển thẳng về Đang bán. |
| TD-HM → TD-HM | Không có ý nghĩa. |

### 8.5. Ghi chú

- Món ở trạng thái `TD-HM` có thể được cấu hình hiển thị (có nhãn "Hết món") hoặc ẩn, tùy chính sách nhà hàng.
- Món ở trạng thái `TD-NB` luôn ẩn khỏi thực đơn gọi món.
- Chỉ Quản lý nhà hàng mới có quyền thay đổi trạng thái món.
- Khi món đã phát sinh đơn hàng, không xóa cứng — chuyển sang `TD-NB`.

---

## 9. Trạng thái nguyên liệu / Kho (Inventory Item)

### 9.1. Danh sách trạng thái

> ⚠️ *Trạng thái nguyên liệu là trạng thái **suy diễn (derived state)** từ số lượng tồn kho và mức tối thiểu,*
> *không phải trạng thái do người dùng gán trực tiếp.*

| Mã trạng thái | Tên trạng thái | Điều kiện | Mô tả |
|:--------------:|----------------|-----------|-------|
| NL-CON | Còn hàng | Tồn kho > Mức tối thiểu | Nguyên liệu đủ dùng, không có cảnh báo |
| NL-SH | Sắp hết | 0 < Tồn kho ≤ Mức tối thiểu | Nguyên liệu sắp hết, hệ thống cảnh báo |
| NL-HET | Hết hàng | Tồn kho = 0 | Nguyên liệu đã hết, cần nhập kho ngay |

### 9.2. Sơ đồ chuyển trạng thái (tự động)

```
  ┌──────────┐     ┌──────────┐     ┌──────────┐
  │  NL-CON  │────→│  NL-SH   │────→│  NL-HET  │
  │ Còn hàng │     │ Sắp hết  │     │ Hết hàng │
  └──────────┘     └──────────┘     └──────────┘
       ▲                │                │
       │                │                │
       └────────────────┴────────────────┘
              (Nhập kho — tăng số lượng)
```

### 9.3. Ma trận chuyển trạng thái

Chuyển đổi trạng thái xảy ra **tự động** khi số lượng tồn kho thay đổi (nhập/xuất/kiểm kê).

| Từ \ Đến | NL-CON (Còn hàng) | NL-SH (Sắp hết) | NL-HET (Hết hàng) |
|-----------|:-----------------:|:----------------:|:------------------:|
| **NL-CON (Còn hàng)** | — | ✔ Do xuất kho/kiểm kê — tồn kho giảm xuống ≤ mức tối thiểu (M) | ✔ Do xuất kho/kiểm kê — tồn kho = 0 (M) |
| **NL-SH (Sắp hết)** | ✔ Do nhập kho — tồn kho > mức tối thiểu (M) | — | ✔ Do xuất kho/kiểm kê — tồn kho = 0 (M) |
| **NL-HET (Hết hàng)** | ✔ Do nhập kho — tồn kho > mức tối thiểu (M) | ✔ Do nhập kho — 0 < tồn kho ≤ mức tối thiểu (M) | — |

### 9.4. Chuyển trạng thái không hợp lệ

| Chuyển đổi | Lý do |
|------------|-------|
| NL-CON → NL-HET (khi xuất kho vượt quá tồn kho) | Xuất kho vượt quá tồn kho là không hợp lệ (BR-INV-06). Tuy nhiên, NL-CON → NL-HET vẫn có thể xảy ra hợp lệ nếu sau thao tác xuất kho hoặc kiểm kê, tồn kho giảm xuống đúng 0. |
| Bất kỳ → bất kỳ (thủ công) | Trạng thái kho là trạng thái suy diễn, không chuyển thủ công. Người dùng chỉ thao tác nhập/xuất/kiểm kê, hệ thống tự tính trạng thái. |

### 9.5. Ghi chú

- Trạng thái nguyên liệu hoàn toàn do hệ thống tính toán, người dùng không gán trực tiếp.
- Khi nguyên liệu ở trạng thái `NL-HET` hoặc `NL-SH`, hệ thống hiển thị cảnh báo cho nhân viên kho và quản lý.
- Nếu hệ thống có chức năng tự động trừ nguyên liệu khi chế biến món (Should Have), khi nguyên liệu xuống `NL-HET`, hệ thống có thể tự động chuyển trạng thái món tương ứng sang `TD-HM`.

---

## 10. Tổng hợp các nhóm trạng thái

### 10.1. Danh sách đầy đủ

| STT | Nhóm | Mã hiệu | Số trạng thái | Loại chuyển đổi | Có trạng thái cuối? |
|:---:|------|:-------:|:--------------:|:----------------:|:-------------------:|
| 1 | Bàn | TB-* | 5 | Thủ công + Tự động | Không (xoay vòng) |
| 2 | Đặt bàn | DB-* | 5 | Thủ công + Tự động | Có (3 trạng thái cuối) |
| 3 | Món trong đơn hàng | MM-* | 5 | Thủ công | Có (2 trạng thái cuối) |
| 4 | Đơn hàng | DH-* | 3 | Thủ công + Tự động | Có (1 trạng thái cuối) |
| 5 | Thanh toán | TT-* | 3 | Thủ công | Có (1 trạng thái cuối) |
| 6 | Thực đơn / Món ăn | TD-* | 3 | Thủ công | Không (xoay vòng) |
| 7 | Nguyên liệu / Kho | NL-* | 3 | Tự động (derived) | Không (xoay vòng) |

### 10.2. Ma trận liên kết giữa các nhóm trạng thái

Các nhóm trạng thái có quan hệ với nhau. Khi một thực thể thay đổi trạng thái, nó có thể kéo theo thay đổi trạng thái của thực thể khác:

| Hành động | Nhóm ảnh hưởng | Chuyển đổi | Ghi chú |
|-----------|----------------|------------|---------|
| Xác nhận đặt bàn | Đặt bàn: DB-CXN → DB-DXN | Bàn: TB-TR → TB-DD | Tự động |
| Khách đến check-in | Đặt bàn: DB-DXN → DB-KDN | Bàn: TB-DD → TB-DPV | Tự động |
| Tạo đơn hàng cho bàn | Đơn hàng: (mới) → DH-HĐ | Bàn: phải đang TB-DPV | Điều kiện, không tự động |
| Thanh toán thành công | Thanh toán: TT-CTT → TT-DTT | Đơn hàng: DH-HĐ → DH-DTT | Tự động |
| | | Bàn: TB-DPV → TB-CD | |
| Hủy hóa đơn đã thanh toán | Thanh toán: TT-DTT → TT-DH | Đơn hàng: DH-DTT → DH-HĐ (khôi phục) | ⚠️ Do quản lý |
| Dọn bàn xong | Bàn: TB-CD → TB-TR | — | Đơn lẻ |
| Nhập kho (tăng tồn kho) | Nguyên liệu: tự động tính lại | — | Có thể kéo theo đổi trạng thái kho |
| Món hết nguyên liệu | Nguyên liệu: NL-CON → NL-SH → NL-HET | Món ăn: TD-DB → TD-HM (nếu có auto) | ⚠️ Cần xác nhận |

---

## 11. Các điểm cần làm rõ với khách hàng

### 11.1. Về trạng thái bàn

1. **Bàn ở trạng thái "Đã đặt" có được xếp khách trực tiếp không?**
   - Nếu khách đến trực tiếp và muốn ngồi bàn đã có đặt trước nhưng khách đặt chưa đến, nhân viên có quyền chuyển bàn đó sang `Đang phục vụ` không? Hay phải đợi hết giờ giữ bàn?
   - Đề xuất: Không cho phép. Bàn đã đặt phải được giữ nguyên.

2. **Thời gian giữ bàn tối đa ở trạng thái `Đã đặt` là bao lâu?**
   - Tài liệu hiện tại đề xuất 15 phút mặc định. Có cần cấu hình linh hoạt theo khung giờ (cao điểm/thấp điểm) không?

3. **Sau khi dọn bàn (`Cần dọn → Trống`), có cần kiểm tra chất lượng dọn dẹp không?**
   - Hay nhân viên chỉ cần xác nhận là bàn sẵn sàng?

### 11.2. Về trạng thái đặt bàn

4. **Có cần trạng thái "Chờ xác nhận" không?**
   - Nếu quy trình là: nhân viên nhận điện thoại → tạo đặt bàn → xác nhận luôn với khách → có thể bỏ qua bước "Chờ xác nhận" và mặc định là "Đã xác nhận"?

5. **Xử lý đặt bàn online?**
   - Nếu khách tự đặt qua web/QR, trạng thái ban đầu có phải là `Chờ xác nhận` và cần nhân viên gọi lại xác nhận không?

6. **Khách đến sớm hoặc đến muộn so với giờ đặt:**
   - Đến sớm: Có cho nhận bàn sớm không nếu bàn đang trống?
   - Đến muộn nhưng trong thời gian giữ bàn: Vẫn check-in bình thường?
   - Đến muộn quá giờ giữ bàn: Đã chuyển `Khách không đến`, nhưng khách vẫn đến — có cơ chế "phục hồi" không?

### 11.3. Về trạng thái món trong đơn hàng

7. **Trường hợp bếp không thể chế biến món (hết nguyên liệu):**
   - Cần một trạng thái riêng như "Không thể chế biến" hay chỉ cần gắn cờ và thông báo cho nhân viên phục vụ?
   - Nếu cần trạng thái riêng, nó nằm ở đâu trong luồng `MM-CCB → MM-DCB → MM-HT`?

8. **Nếu khách muốn đổi món khi món đang chế biến (MM-DCB):**
   - Quy trình xử lý ra sao? Cần quản lý phê duyệt?

### 11.4. Về trạng thái đơn hàng và thanh toán

9. **Khách gọi thêm món sau khi đã thanh toán:**
   - Tạo đơn hàng mới hay thêm vào đơn hàng cũ (nếu đơn hàng cũ vẫn còn)?

10. **Hủy hóa đơn đã thanh toán (TT-DTT → TT-DH):**
    - Trường hợp nào được phép hủy?
    - Có cần nhập mã PIN/xác thực lại không?
    - Hủy xong, tiền trả lại cho khách bằng hình thức nào?

11. **Có cần trạng thái "Thanh toán một phần" (TT-MP) không?**
    - Nếu khách muốn trả trước một phần và sau đó trả hết?
    - Hay chỉ hỗ trợ thanh toán một lần?

### 11.5. Về trạng thái thực đơn

12. **Có cần lịch trình tự động chuyển trạng thái món không?**
    - Ví dụ: Món sáng chỉ bán từ 6h-10h, tự động chuyển sang Ngừng bán sau 10h?

13. **Món "Hết món" có cần tự động chuyển về "Đang bán" khi nhập kho nguyên liệu không?**
    - Nếu có chức năng tự động trừ nguyên liệu, điều này khả thi. Nếu không, cần quản lý chuyển thủ công.

### 11.6. Về trạng thái nguyên liệu

14. **Có cần quản lý hạn sử dụng của nguyên liệu không?**
    - Nếu có, cần thêm trạng thái "Hết hạn" (Expired).

15. **Kiểm kê kho phát hiện chênh lệch:**
    - Chênh lệch dương (thừa) và chênh lệch âm (thiếu) có cần phân loại riêng không?
    - Ai được phê duyệt điều chỉnh chênh lệch?

---

## 12. Tổng kết

Tài liệu này đã định nghĩa **7 nhóm trạng thái** của hệ thống quản lý nhà hàng:

| Nhóm | Số trạng thái | Số chuyển đổi hợp lệ | Số chuyển đổi không hợp lệ |
|------|:-------------:|:--------------------:|:--------------------------:|
| Bàn | 5 | 8 | 6 |
| Đặt bàn | 5 | 5 | 4 |
| Món trong đơn hàng | 5 | 5 | 6 |
| Đơn hàng | 3 | 3 | 4 |
| Thanh toán | 3 | 3 | 4 |
| Thực đơn / Món ăn | 3 | 4 | 3 |
| Nguyên liệu / Kho | 3 | 4 (tự động) | 3 |
| **Tổng cộng** | **27** | **32** | **30** |

Tổng cộng **15 điểm** cần làm rõ với khách hàng được liệt kê tại mục 11.

---

*Tài liệu này là căn cứ để thiết kế luồng chuyển trạng thái, cấu trúc dữ liệu trong cơ sở dữ liệu và kiểm thử nghiệp vụ.*
*Mọi thay đổi về trạng thái hoặc luồng chuyển đổi cần được cập nhật vào tài liệu này trước khi triển khai.*
