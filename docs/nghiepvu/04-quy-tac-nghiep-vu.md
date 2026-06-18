# Quy tắc nghiệp vụ — Hệ thống quản lý nhà hàng

## 1. Mục đích

Tài liệu này định nghĩa **các quy tắc nghiệp vụ (business rules)** chi tiết cho từng module
của hệ thống quản lý nhà hàng. Đây là những ràng buộc, điều kiện, trạng thái và luật chuyển
đổi mà hệ thống phải thực thi. Tài liệu này là đầu vào cho thiết kế logic xử lý nghiệp vụ,
kiểm tra dữ liệu đầu vào và thiết kế luồng chuyển trạng thái.

**Phạm vi:** Chỉ bao gồm các quy tắc cho các module đã được xác định trong tài liệu
[01-tong-quan-yeu-cau-chuan-hoa.md](./01-tong-quan-yeu-cau-chuan-hoa.md).

---

## 2. Quy ước mã quy tắc

Mỗi quy tắc có mã duy nhất theo format `BR-{NHÓM}-{STT}`:

| Tiền tố | Nhóm quy tắc |
|---------|--------------|
| BR-TBL  | Quản lý bàn |
| BR-RES  | Đặt bàn |
| BR-ORD  | Gọi món |
| BR-KIT  | Gửi món xuống bếp và cập nhật trạng thái món |
| BR-PAY  | Thanh toán |
| BR-MNU  | Quản lý thực đơn |
| BR-INV  | Quản lý kho nguyên liệu |
| BR-RPT  | Báo cáo |
| BR-AUTH | Phân quyền và nhật ký hoạt động |

---

## 3. Quy tắc quản lý bàn (BR-TBL)

### 3.1. Trạng thái bàn

Hệ thống quản lý bàn qua **5 trạng thái** với các luật chuyển đổi như sau:

```
Trống ──→ Đã đặt ──→ Đang phục vụ ──→ Cần dọn ──→ Trống
  │                                                    │
  └────────────────── Bảo trì ←─────────────────────────┘
```

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-TBL-01 | Bàn có 5 trạng thái: `Trống`, `Đã đặt`, `Đang phục vụ`, `Cần dọn`, `Bảo trì`. Mỗi bàn luôn ở một và chỉ một trạng thái tại một thời điểm. |
| BR-TBL-02 | Chuyển đổi trạng thái bàn chỉ được thực hiện theo luồng quy định. Không cho phép chuyển trạng thái ngược hoặc nhảy trạng thái. |
| BR-TBL-03 | Bàn ở trạng thái `Đã đặt`, `Đang phục vụ` hoặc `Cần dọn` — không cho phép xóa bàn. |
| BR-TBL-04 | Bàn ở trạng thái `Bảo trì` — không cho phép đặt bàn, gọi món hoặc chọn bàn để phục vụ. |
| BR-TBL-05 | Bàn ở trạng thái `Trống` — cho phép nhận đặt bàn hoặc nhận khách trực tiếp. |

### 3.2. Chuyển đổi trạng thái bàn

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-TBL-06 | Chuyển `Trống` → `Đã đặt`: Khi một đặt bàn được xác nhận thành công cho bàn đó trong khoảng thời gian cụ thể. |
| BR-TBL-07 | Chuyển `Đã đặt` → `Đang phục vụ`: Khi khách đến nhận bàn và nhân viên xác nhận khách đã đến (check-in). |
| BR-TBL-08 | Chuyển `Trống` → `Đang phục vụ`: Khi khách đến trực tiếp (không đặt trước) và được xếp bàn. |
| BR-TBL-09 | Chuyển `Đang phục vụ` → `Cần dọn`: Khi khách yêu cầu thanh toán và rời bàn, hoặc khi thu ngân hoàn tất thanh toán. |
| BR-TBL-10 | Chuyển `Cần dọn` → `Trống`: Khi nhân viên phục vụ đã dọn dẹp bàn và xác nhận bàn sẵn sàng. |
| BR-TBL-11 | Chuyển `Trống` → `Bảo trì` hoặc `Cần dọn` → `Bảo trì`: Khi bàn cần sửa chữa, bảo trì theo quyết định của quản lý. |
| BR-TBL-12 | Chuyển `Bảo trì` → `Trống`: Khi bàn đã được sửa chữa xong và sẵn sàng hoạt động trở lại. |
| BR-TBL-13 | Chuyển `Đã đặt` → `Trống`: Khi đặt bàn bị hủy hoặc khách không đến và thời gian giữ bàn đã hết. |

### 3.3. Ràng buộc khác

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-TBL-14 | Mỗi bàn có một mã bàn duy nhất trong hệ thống. Mã bàn không được trùng. |
| BR-TBL-15 | Thông tin bàn gồm: mã bàn, tên bàn (hoặc số bàn), khu vực, số ghế tối đa, trạng thái. |
| BR-TBL-16 | Một bàn chỉ có thể phục vụ một nhóm khách tại một thời điểm. Không cho phép gộp hai đơn hàng khác nhau trên cùng một bàn trừ khi có chức năng gộp/tách bàn (Won't Have ở giai đoạn đầu). |
| BR-TBL-17 | Khi bàn đang ở trạng thái `Đang phục vụ`, hệ thống không cho phép đặt bàn trùng vào bàn đó cho đến khi bàn trở lại trạng thái `Trống`. |

---

## 4. Quy tắc đặt bàn (BR-RES)

### 4.1. Trạng thái đặt bàn

Đặt bàn có các trạng thái:

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-RES-01 | Mỗi đặt bàn có một trong các trạng thái sau: `Chờ xác nhận`, `Đã xác nhận`, `Khách đã đến`, `Khách không đến`, `Đã hủy`. |
| BR-RES-02 | Mỗi đặt bàn chứa: tên khách, số điện thoại, thời gian đặt dự kiến, số lượng khách, danh sách bàn được đặt, ghi chú (nếu có), trạng thái. |

### 4.2. Luồng trạng thái đặt bàn

```
Chờ xác nhận ──→ Đã xác nhận ──→ Khách đã đến
       │                │
       └── Đã hủy ←─────┴── Khách không đến
```

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-RES-03 | Chuyển `Chờ xác nhận` → `Đã xác nhận`: Khi nhân viên xác nhận đặt bàn với khách. Bàn được đặt sẽ chuyển sang trạng thái `Đã đặt`. |
| BR-RES-04 | Chuyển `Đã xác nhận` → `Khách đã đến`: Khi khách đến nhà hàng trong thời gian cho phép. Bàn được đặt chuyển sang trạng thái `Đang phục vụ`. |
| BR-RES-05 | Chuyển `Đã xác nhận` → `Khách không đến`: Khi quá thời gian giữ bàn mà khách chưa đến. Bàn được đặt chuyển về `Trống`. |
| BR-RES-06 | Chuyển `Chờ xác nhận` hoặc `Đã xác nhận` → `Đã hủy`: Khi khách yêu cầu hủy đặt bàn hoặc nhân viên hủy theo yêu cầu. Bàn được đặt chuyển về `Trống`. |
| BR-RES-07 | Hủy đặt bàn là cập nhật trạng thái, không xóa dữ liệu. Lịch sử đặt bàn phải được lưu để phục vụ tra cứu và báo cáo. |

### 4.3. Ràng buộc thời gian và bàn

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-RES-08 | Một bàn chỉ được đặt cho **một** đặt bàn trong cùng một khung giờ. Hệ thống phải kiểm tra chồng lấn thời gian trước khi xác nhận. |
| BR-RES-09 | Thời gian đặt bàn phải lớn hơn hoặc bằng thời gian hiện tại. Không cho phép đặt bàn trong quá khứ. |
| BR-RES-10 | Thời gian giữ bàn mặc định là **15 phút** kể từ thời gian đặt dự kiến. Quá thời gian này khách chưa đến, đặt bàn chuyển sang `Khách không đến`. Cấu hình này có thể thay đổi theo chính sách nhà hàng. |
| BR-RES-11 | Số lượng khách trong đặt bàn không được vượt quá tổng số ghế của (các) bàn được đặt. |
| BR-RES-12 | Nếu hệ thống hỗ trợ đặt nhiều bàn, một đặt bàn có thể chọn nhiều bàn khi số lượng khách vượt quá sức chứa một bàn (ví dụ khách đoàn đông). Các bàn này phải thuộc cùng khu vực hoặc liền kề. Việc đặt nhiều bàn cần có sự xác nhận của khách hàng về các bàn được sắp xếp. |

---

## 5. Quy tắc gọi món (BR-ORD)

### 5.1. Điều kiện gọi món

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-ORD-01 | Chỉ được gọi món cho bàn ở trạng thái `Đang phục vụ`. |
| BR-ORD-02 | Chỉ gọi được các món có trạng thái `Đang bán`. Món ở trạng thái `Hết món` hoặc `Ngừng bán` không được hiển thị để chọn. |
| BR-ORD-03 | Mỗi bàn có **một đơn hàng (order) đang hoạt động** tại một thời điểm. Khi đơn hàng đã thanh toán, nếu khách gọi thêm thì tạo đơn hàng mới. |

### 5.2. Thêm, sửa, hủy món

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-ORD-04 | Nhân viên phục vụ có thể thêm món vào đơn hàng bất kỳ lúc nào khi bàn đang ở trạng thái `Đang phục vụ`. |
| BR-ORD-05 | Nhân viên phục vụ có thể sửa số lượng món trong đơn hàng **chỉ khi món chưa được chế biến** (trạng thái món là `Chờ chế biến`). Khi món đã chuyển sang `Đang chế biến` hoặc xa hơn, không được sửa số lượng. |
| BR-ORD-06 | Nhân viên phục vụ có thể hủy món trong đơn hàng **chỉ khi món chưa được chế biến** (trạng thái món là `Chờ chế biến`). |
| BR-ORD-07 | Hủy món là cập nhật trạng thái món thành `Đã hủy`, không xóa món khỏi đơn hàng. Số lượng món hủy vẫn được ghi nhận trong lịch sử đơn hàng. |
| BR-ORD-08 | Khi thêm món vào đơn hàng, hệ thống phải kiểm tra món còn `Đang bán` hay không tại thời điểm thêm. Nếu món đã chuyển sang `Hết món` hoặc `Ngừng bán`, không cho phép thêm. |
| BR-ORD-09 | Ghi chú món (ví dụ: không cay, ít đá) được nhập kèm khi thêm món và phải được hiển thị trên phiếu bếp. |

### 5.3. Tính tiền tạm thời

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-ORD-10 | Hệ thống tự động tính tiền tạm thời dựa trên: tổng (số lượng × đơn giá) của các món có trạng thái khác `Đã hủy`. |
| BR-ORD-11 | Giá món trong đơn hàng là giá bán hiện tại tại thời điểm thêm món. Nếu sau đó giá món thay đổi, các món đã thêm trước đó không bị ảnh hưởng. |
| BR-ORD-12 | Món có trạng thái `Đã hủy` không được tính vào tổng tiền tạm thời và tổng tiền hóa đơn. |

---

## 6. Quy tắc gửi món xuống bếp (BR-KIT)

### 6.1. Kích hoạt gửi món

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-KIT-01 | Nhân viên phục vụ **phải xác nhận gửi món** sau khi đã thêm món vào đơn hàng. Chỉ sau khi xác nhận, món mới được chuyển xuống bếp. |
| BR-KIT-02 | Nhân viên phục vụ có thể gửi món theo lô: sau khi thêm nhiều món, xác nhận gửi một lần. Hoặc gửi từng món ngay sau khi thêm. |
| BR-KIT-03 | Sau khi gửi món, hệ thống ghi nhận trạng thái món là `Chờ chế biến`. |

### 6.2. Hiển thị tại bếp

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-KIT-04 | Món được hiển thị tại bếp theo thứ tự thời gian gọi — món gọi trước hiển thị trước (FIFO). |
| BR-KIT-05 | Màn hình bếp chỉ hiển thị: tên món, số lượng, ghi chú, số bàn, thời gian gọi. **Không hiển thị giá món** trên màn hình bếp. |
| BR-KIT-06 | Món đã hủy không được hiển thị trong danh sách món cần chế biến tại bếp. |
| BR-KIT-07 | Khi có món mới được gửi xuống bếp, hệ thống phải cập nhật danh sách món trên màn hình bếp trong thời gian thực (hoặc gần thời gian thực). |
| BR-KIT-08 | Nếu hệ thống có tích hợp máy in bếp, phiếu in phải gồm: số bàn, tên món, số lượng, ghi chú, thời gian. Mỗi lần gửi món in một phiếu riêng. |

---

## 7. Quy tắc cập nhật trạng thái món (BR-KIT — tiếp)

### 7.1. Luồng chuyển trạng thái của món trong đơn hàng

Mỗi món trong đơn hàng có 5 trạng thái:

```
Chờ chế biến ──→ Đang chế biến ──→ Hoàn thành ──→ Đã phục vụ
       │                                                │
       └────────── Đã hủy ←──────────────────────────────┘
```

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-KIT-09 | Một món trong đơn hàng có các trạng thái: `Chờ chế biến`, `Đang chế biến`, `Hoàn thành`, `Đã phục vụ`, `Đã hủy`. |
| BR-KIT-10 | Chuyển `Chờ chế biến` → `Đang chế biến`: Khi nhân viên bếp bắt đầu chế biến món. |
| BR-KIT-11 | Chuyển `Đang chế biến` → `Hoàn thành`: Khi nhân viên bếp hoàn thành chế biến món. |
| BR-KIT-12 | Chuyển `Hoàn thành` → `Đã phục vụ`: Khi nhân viên phục vụ mang món lên bàn cho khách. |
| BR-KIT-13 | Chuyển `Chờ chế biến` → `Đã hủy`: Khi nhân viên phục vụ hủy món trước khi chế biến (theo yêu cầu của khách). |
| BR-KIT-14 | Không cho phép chuyển ngược trạng thái. Ví dụ: món `Hoàn thành` không thể quay lại `Đang chế biến`. |
| BR-KIT-15 | Chỉ nhân viên bếp mới được cập nhật trạng thái `Đang chế biến` và `Hoàn thành`. Nhân viên phục vụ cập nhật trạng thái `Đã phục vụ`. |

### 7.2. Xử lý ngoại lệ

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-KIT-16 | Nếu bếp không thể chế biến món (ví dụ: hết nguyên liệu), nhân viên bếp gắn cờ "Không thể chế biến". Hệ thống thông báo cho nhân viên phục vụ để xử lý với khách (đổi món hoặc hủy món). |
| BR-KIT-17 | Khi một món được chuyển sang `Hoàn thành`, hệ thống phải thông báo cho nhân viên phục vụ của bàn đó. |
| BR-KIT-18 | Hệ thống lưu thời gian của mỗi lần chuyển trạng thái để phục vụ theo dõi thời gian chế biến (ví dụ: món chờ quá lâu). |

---

## 8. Quy tắc thanh toán (BR-PAY)

### 8.1. Điều kiện thanh toán

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-PAY-01 | Chỉ có thể thanh toán cho bàn ở trạng thái `Đang phục vụ`. Không thể thanh toán cho bàn `Trống`, `Đã đặt`, `Cần dọn` hoặc `Bảo trì`. |
| BR-PAY-02 | Trước khi thanh toán, đơn hàng của bàn phải có ít nhất một món không phải trạng thái `Đã hủy`. |
| BR-PAY-03 | Thu ngân có thể xem hóa đơn của bàn bất kỳ lúc nào (không cần đợi tất cả món hoàn thành) nhưng chỉ được thanh toán khi đã xác nhận đầy đủ với khách. |

### 8.2. Tính toán hóa đơn

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-PAY-04 | Hệ thống **tự động tính tổng tiền** (không cho phép nhập thủ công) theo công thức: Tổng tiền = Tổng tiền món + Phụ phí - Giảm giá + VAT. Trong đó: Tổng tiền món = Σ(số lượng × đơn giá) của các món đã phục vụ (trạng thái `Hoàn thành` hoặc `Đã phục vụ`). Các món `Đã hủy` và `Chờ chế biến` không được tính vào tổng tiền thanh toán. |
| BR-PAY-05 | Khi tính hóa đơn cuối cùng, chỉ tính các món có trạng thái `Hoàn thành` hoặc `Đã phục vụ`. Món `Chờ chế biến` và `Đang chế biến` không được tính. Các món này có thể được hủy hoặc chuyển sang đơn hàng mới nếu khách không muốn chờ. |
| BR-PAY-06 | Giảm giá được áp dụng theo phần trăm (%) hoặc số tiền cụ thể (VNĐ). Giảm giá không được lớn hơn tổng tiền hóa đơn. |
| BR-PAY-07 | VAT được tính dựa trên tổng tiền sau giảm giá. VAT được tính theo tỷ lệ cấu hình của nhà hàng hoặc theo quy định hiện hành. |
| BR-PAY-08 | Phụ phí (nếu có) được cộng vào tổng tiền trước khi tính VAT. |

### 8.3. Hình thức thanh toán

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-PAY-09 | Hệ thống hỗ trợ 3 hình thức thanh toán: `Tiền mặt`, `Chuyển khoản`, `Thẻ`. |
| BR-PAY-10 | Mặc định một hóa đơn sử dụng một hình thức thanh toán. Thanh toán kết hợp nhiều hình thức cần xác nhận với khách hàng. |
| BR-PAY-11 | Nếu hệ thống hỗ trợ thanh toán kết hợp nhiều hình thức, tổng các khoản thanh toán phải bằng chính xác tổng tiền hóa đơn. |

### 8.4. Sau thanh toán

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-PAY-12 | Sau khi thanh toán thành công, hệ thống chuyển trạng thái đơn hàng thành `Đã thanh toán`. |
| BR-PAY-13 | Sau khi thanh toán thành công, hệ thống chuyển trạng thái bàn từ `Đang phục vụ` → `Cần dọn`. |
| BR-PAY-14 | Hóa đơn sau khi thanh toán là dữ liệu **chỉ đọc (read-only)**. Thu ngân không được sửa hóa đơn đã thanh toán. |
| BR-PAY-15 | Nếu cần hủy hóa đơn đã thanh toán, chỉ **Quản lý nhà hàng** mới có quyền thực hiện. Hủy hóa đơn là thao tác nhạy cảm — xem chi tiết tại BR-AUTH-07. |

### 8.5. Hủy hóa đơn

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-PAY-16 | Hủy hóa đơn chỉ được thực hiện khi có lý do hợp lệ (ví dụ: nhập sai món, thanh toán nhầm). Lý do hủy phải được ghi lại. |
| BR-PAY-17 | Khi hủy hóa đơn, hệ thống tạo một bản ghi hủy hóa đơn chứa: mã hóa đơn gốc, người hủy, thời gian hủy, lý do hủy. Hóa đơn gốc không bị xóa. |
| BR-PAY-18 | Sau khi hủy hóa đơn, nếu bàn chưa có khách mới, hệ thống có thể khôi phục đơn hàng về trạng thái chưa thanh toán để xử lý lại. |
| BR-PAY-19 | Mỗi hóa đơn chỉ được hủy tối đa một lần. Không hủy hóa đơn đã hủy. |

### 8.6. In hóa đơn

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-PAY-20 | Hóa đơn thanh toán có thể được in ra sau khi thanh toán thành công. |
| BR-PAY-21 | Nội dung hóa đơn in gồm: tên nhà hàng, mã hóa đơn, số bàn, danh sách món (tên, số lượng, đơn giá, thành tiền), giảm giá, phụ phí, VAT, tổng tiền, hình thức thanh toán, thời gian thanh toán. |

---

## 9. Quy tắc quản lý thực đơn (BR-MNU)

### 9.1. Trạng thái món ăn

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-MNU-01 | Mỗi món ăn có một trong ba trạng thái: `Đang bán`, `Hết món`, `Ngừng bán`. |
| BR-MNU-02 | Món ở trạng thái `Đang bán`: cho phép hiển thị trong thực đơn, cho phép gọi món. |
| BR-MNU-03 | Món ở trạng thái `Hết món`: cho phép hiển thị trong thực đơn (có gắn nhãn "Hết món") hoặc ẩn tùy cấu hình. Không cho phép gọi món. |
| BR-MNU-04 | Món ở trạng thái `Ngừng bán`: không hiển thị trong thực đơn gọi món. Không cho phép gọi món. |
| BR-MNU-05 | Chỉ **Quản lý nhà hàng** mới được cập nhật trạng thái món. |

### 9.2. Thêm, sửa, xóa món

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-MNU-06 | Khi thêm món mới, các trường bắt buộc gồm: tên món, danh mục, giá bán, trạng thái (mặc định là `Đang bán`). |
| BR-MNU-07 | Tên món không được trùng với món đã tồn tại trong hệ thống. |
| BR-MNU-08 | Giá bán phải lớn hơn 0. |
| BR-MNU-09 | Khi sửa giá món, giá mới chỉ áp dụng cho các đơn hàng được tạo sau thời điểm sửa. Các đơn hàng đã tạo trước đó giữ giá cũ. |
| BR-MNU-10 | Không xóa cứng món đã phát sinh đơn hàng. Thay vào đó, chuyển trạng thái món sang `Ngừng bán`. |
| BR-MNU-11 | Món chưa phát sinh bất kỳ đơn hàng nào có thể bị xóa cứng khỏi hệ thống. |

### 9.3. Danh mục món

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-MNU-12 | Món ăn được phân loại theo danh mục. Các danh mục mặc định: `Món chính`, `Đồ uống`, `Tráng miệng`, `Khai vị`. |
| BR-MNU-13 | Quản lý có thể thêm, sửa, xóa danh mục. Khi xóa danh mục, các món trong danh mục đó phải được chuyển sang danh mục khác. |
| BR-MNU-14 | Một món thuộc về một và chỉ một danh mục. |

---

## 10. Quy tắc quản lý kho nguyên liệu (BR-INV)

### 10.1. Nhập kho

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-INV-01 | Khi nhập kho, hệ thống ghi nhận: tên nguyên liệu, số lượng nhập, đơn vị tính, giá nhập (nếu có), nhà cung cấp (nếu có), thời gian nhập, người nhập. |
| BR-INV-02 | Số lượng nhập phải lớn hơn 0. |
| BR-INV-03 | Sau khi nhập kho, hệ thống cập nhật tồn kho của nguyên liệu đó: `Tồn kho mới = Tồn kho cũ + Số lượng nhập`. |

### 10.2. Xuất kho

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-INV-04 | Khi xuất kho, hệ thống ghi nhận: tên nguyên liệu, số lượng xuất, đơn vị tính, mục đích xuất (ví dụ: chế biến, hao hụt), thời gian xuất, người xuất. |
| BR-INV-05 | Số lượng xuất phải lớn hơn 0. |
| BR-INV-06 | **Không cho phép xuất kho vượt quá tồn kho hiện tại.** Hệ thống kiểm tra trước khi xác nhận xuất. |
| BR-INV-07 | Sau khi xuất kho, hệ thống cập nhật tồn kho: `Tồn kho mới = Tồn kho cũ - Số lượng xuất`. |

### 10.3. Kiểm kê và cảnh báo

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-INV-08 | Nhân viên kho có thể thực hiện kiểm kê để điều chỉnh số lượng tồn kho thực tế so với hệ thống. Chênh lệch kiểm kê được ghi nhận với lý do. |
| BR-INV-09 | Mỗi nguyên liệu có một mức tồn kho tối thiểu (min stock level). Khi tồn kho ≤ mức tối thiểu, hệ thống phát cảnh báo. |
| BR-INV-10 | Cảnh báo tồn kho thấp được hiển thị trên màn hình kho và có thể gửi thông báo cho nhân viên kho và quản lý. |
| BR-INV-11 | Hệ thống lưu toàn bộ lịch sử nhập kho, xuất kho và kiểm kê. Dữ liệu lịch sử không được xóa. |

### 10.4. Liên kết với món ăn (Should Have / Could Have)

> ⚠️ *Các quy tắc dưới đây thuộc nhóm Should Have hoặc Could Have. Cần xác nhận với khách hàng trước khi triển khai.*

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-INV-12 | *(Có thể có)* Nếu mỗi món ăn có định mức nguyên liệu, hệ thống có thể tự động trừ nguyên liệu tồn kho khi món được xác nhận gửi xuống bếp. |
| BR-INV-13 | *(Có thể có)* Nếu tự động trừ nguyên liệu, khi nguyên liệu tồn kho không đủ để chế biến một món, hệ thống có thể chuyển trạng thái món đó sang `Hết món`. |

---

## 11. Quy tắc báo cáo (BR-RPT)

### 11.1. Báo cáo doanh thu

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-RPT-01 | Báo cáo doanh thu được tổng hợp từ các hóa đơn đã thanh toán thành công. Hóa đơn đã hủy không được tính vào doanh thu. |
| BR-RPT-02 | Báo cáo doanh thu có thể xem theo ngày, tháng, năm hoặc khoảng thời gian tùy chọn. |
| BR-RPT-03 | Số liệu trong báo cáo phải là số liệu **thực tế** tại thời điểm xem (real-time hoặc gần real-time). |

### 11.2. Thống kê hóa đơn

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-RPT-04 | Thống kê số lượng hóa đơn bao gồm: tổng số hóa đơn đã thanh toán, số hóa đơn bị hủy, tổng số hóa đơn trong kỳ. |
| BR-RPT-05 | Thống kê có thể lọc theo ca làm việc, theo nhân viên thu ngân, theo hình thức thanh toán. |

### 11.3. Thống kê món bán chạy

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-RPT-06 | Thống kê món bán chạy dựa trên tổng số lượng món đã phục vụ thành công (không tính món đã hủy). |
| BR-RPT-07 | Kết quả được sắp xếp theo thứ tự giảm dần của số lượng bán. |
| BR-RPT-08 | Thống kê có thể lọc theo danh mục món, theo khoảng thời gian. |

### 11.4. Xuất báo cáo

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-RPT-09 | Báo cáo có thể được xuất ra file Excel (.xlsx) hoặc PDF. |
| BR-RPT-10 | Dữ liệu xuất ra phải khớp chính xác với dữ liệu hiển thị trên màn hình. |
| BR-RPT-11 | Chỉ **Quản lý nhà hàng** và **Thu ngân** (đối với thống kê hóa đơn) mới có quyền xem và xuất báo cáo. |

---

## 12. Quy tắc phân quyền và nhật ký hoạt động (BR-AUTH)

### 12.1. Phân quyền truy cập

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-AUTH-01 | Mỗi tài khoản được gán **một vai trò duy nhất**. Hệ thống không hỗ trợ một tài khoản mang nhiều vai trò trong phiên bản đầu. |
| BR-AUTH-02 | Quyền mặc định là **từ chối (deny)**. Tài khoản chỉ được truy cập chức năng khi vai trò được cấp quyền tương ứng. |
| BR-AUTH-03 | Người dùng phải đăng nhập trước khi sử dụng bất kỳ chức năng nào của hệ thống. |
| BR-AUTH-04 | Hệ thống không hiển thị chức năng, nút bấm hoặc menu mà người dùng không có quyền sử dụng. |
| BR-AUTH-05 | Khi người dùng cố tình truy cập chức năng không được phân quyền, hệ thống từ chối và ghi nhận vào nhật ký hoạt động. |

### 12.2. Nhật ký hoạt động

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-AUTH-06 | Hệ thống phải ghi nhật ký hoạt động cho **tất cả các thao tác sau đây**: |
| | - Đăng nhập / đăng xuất (thành công và thất bại) |
| | - Tạo, sửa, xóa tài khoản và phân quyền |
| | - Tạo, sửa, hủy đặt bàn |
| | - Tạo, sửa, hủy món trong đơn hàng |
| | - Gửi món xuống bếp |
| | - Cập nhật trạng thái chế biến món |
| | - Thanh toán hóa đơn |
| | - Hủy hóa đơn |
| | - Thêm, sửa, xóa món ăn (thực đơn) |
| | - Nhập kho, xuất kho, kiểm kê |
| | - Xóa hoặc vô hiệu hóa bàn |
| BR-AUTH-07 | Mỗi bản ghi nhật ký hoạt động phải chứa tối thiểu: |
| | - Thời gian xảy ra (timestamp) |
| | - Người thực hiện (user ID) |
| | - Hành động (action) |
| | - Đối tượng bị tác động (target) |
| | - Dữ liệu trước khi thay đổi (old value) — nếu là thao tác sửa/xóa |
| | - Dữ liệu sau khi thay đổi (new value) — nếu là thao tác thêm/sửa |
| | - Địa chỉ IP hoặc thiết bị thực hiện (nếu có) |
| BR-AUTH-08 | Nhật ký hoạt động là dữ liệu **chỉ ghi (append-only)**, không được sửa hoặc xóa. |
| BR-AUTH-09 | Chỉ **Quản trị hệ thống** mới có quyền xem nhật ký hoạt động. |
| BR-AUTH-10 | Nhật ký hoạt động phải được lưu trữ tối thiểu **90 ngày** (hoặc theo quy định pháp luật hiện hành). |

### 12.3. Phân tách trách nhiệm

| Mã quy tắc | Nội dung |
|------------|----------|
| BR-AUTH-11 | Nhân viên phục vụ không được xóa hóa đơn hoặc áp dụng giảm giá. |
| BR-AUTH-12 | Thu ngân không được tạo đơn gọi món hoặc sửa thực đơn. |
| BR-AUTH-13 | Nhân viên bếp chỉ thao tác trên module bếp, không can thiệp thanh toán hay báo cáo. |
| BR-AUTH-14 | Quản lý nhà hàng không can thiệp vào tài khoản người dùng và phân quyền cấp hệ thống. |
| BR-AUTH-15 | Quản trị hệ thống không can thiệp vào nghiệp vụ nhà hàng (bàn, món, đơn hàng, thanh toán, kho). |

---

## 13. Tổng kết

### 13.1. Thống kê quy tắc

| Nhóm | Mã prefix | Số lượng quy tắc |
|------|-----------|:-----------------:|
| Quản lý bàn | BR-TBL | 17 |
| Đặt bàn | BR-RES | 12 |
| Gọi món | BR-ORD | 12 |
| Gửi món xuống bếp và cập nhật trạng thái món | BR-KIT | 18 |
| Thanh toán | BR-PAY | 21 |
| Quản lý thực đơn | BR-MNU | 14 |
| Quản lý kho nguyên liệu | BR-INV | 13 |
| Báo cáo | BR-RPT | 11 |
| Phân quyền và nhật ký hoạt động | BR-AUTH | 15 |
| **Tổng cộng** | | **133** |

### 13.2. Ma trận trạng thái bàn

| Từ \ Đến | Trống | Đã đặt | Đang phục vụ | Cần dọn | Bảo trì |
|----------|:-----:|:------:|:-------------:|:-------:|:-------:|
| Trống | — | BR-TBL-06 | BR-TBL-08 | — | BR-TBL-11 |
| Đã đặt | BR-TBL-13 | — | BR-TBL-07 | — | — |
| Đang phục vụ | — | — | — | BR-TBL-09 | — |
| Cần dọn | BR-TBL-10 | — | — | — | BR-TBL-11 |
| Bảo trì | BR-TBL-12 | — | — | — | — |

### 13.3. Ma trận trạng thái món trong đơn hàng

| Từ \ Đến | Chờ chế biến | Đang chế biến | Hoàn thành | Đã phục vụ | Đã hủy |
|----------|:-------------:|:--------------:|:-----------:|:-----------:|:------:|
| Chờ chế biến | — | BR-KIT-10 | — | — | BR-KIT-13 |
| Đang chế biến | — | — | BR-KIT-11 | — | — |
| Hoàn thành | — | — | — | BR-KIT-12 | — |
| Đã phục vụ | — | — | — | — | — |
| Đã hủy | — | — | — | — | — |

### 13.4. Ma trận trạng thái đặt bàn

| Từ \ Đến | Chờ xác nhận | Đã xác nhận | Khách đã đến | Khách không đến | Đã hủy |
|----------|:-------------:|:------------:|:-------------:|:----------------:|:------:|
| Chờ xác nhận | — | BR-RES-03 | — | — | BR-RES-06 |
| Đã xác nhận | — | — | BR-RES-04 | BR-RES-05 | BR-RES-06 |
| Khách đã đến | — | — | — | — | — |
| Khách không đến | — | — | — | — | — |
| Đã hủy | — | — | — | — | — |

---

## 14. Các điểm cần làm rõ với khách hàng

1. **Thời gian giữ bàn (BR-RES-10):** 15 phút là mặc định hay cần cấu hình linh hoạt theo khung giờ (ví dụ: giờ cao điểm giữ 10 phút, giờ thấp điểm giữ 30 phút)?

2. **Món chưa chế biến khi thanh toán (BR-PAY-05):** Khi khách yêu cầu thanh toán nhưng còn món `Chờ chế biến` hoặc `Đang chế biến`, quy trình xử lý ra sao?
   - Hủy món và không tính tiền?
   - Cho khách mang về?
   - Chuyển sang đơn hàng mới?

3. **Giảm giá (BR-PAY-06):** Ai được phép áp dụng giảm giá? Chỉ thu ngân hay quản lý cũng có thể? Có giới hạn % giảm giá tối đa không?

4. **Tự động trừ nguyên liệu (BR-INV-12, BR-INV-13):** Có cần mỗi món ăn có định mức nguyên liệu và tự động trừ kho khi chế biến không? Hay việc xuất kho hoàn toàn thủ công?

5. **Gộp bàn / tách hóa đơn (UC-07 ghi chú):** Mặc dù đã xác định là Won't Have ở giai đoạn đầu, nhưng nếu có phát sinh nghiệp vụ thực tế, cần xác nhận lại.

6. **Một nhân viên nhiều vai trò (BR-AUTH-01):** Quy tắc hiện tại là một tài khoản một vai trò. Nếu trong thực tế cùng một người cần làm cả phục vụ và thu ngân vào các ca khác nhau, cần xử lý thế nào? (tạo hai tài khoản riêng hay nâng cấp hệ thống cho phép nhiều vai trò?)

7. **Kiểm kê kho (BR-INV-08):** Khi kiểm kê phát hiện chênh lệch, quy trình xử lý chênh lệch như thế nào? Cần ai phê duyệt?

8. **Báo cáo doanh thu không bao gồm hóa đơn đã hủy (BR-RPT-01):** Có cần báo cáo riêng về các hóa đơn bị hủy để quản lý theo dõi không?
