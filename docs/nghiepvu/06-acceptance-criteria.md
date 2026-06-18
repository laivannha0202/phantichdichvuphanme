# Tiêu chí nghiệm thu (Acceptance Criteria) — Hệ thống quản lý nhà hàng

## 1. Mục đích tài liệu

Tài liệu này định nghĩa **tiêu chí nghiệm thu (Acceptance Criteria)** cho từng module
chức năng của hệ thống quản lý nhà hàng. Acceptance Criteria là các điều kiện cụ thể,
có thể kiểm chứng được, dùng để xác định một chức năng đã đáp ứng đúng yêu cầu nghiệp vụ
hay chưa.

Tài liệu này được sử dụng làm căn cứ cho:

- **Kiểm thử nghiệp vụ (Business Testing):** Kiểm tra chức năng có vận hành đúng quy
  trình nghiệp vụ đã mô tả hay không.
- **Kiểm thử chức năng (Functional Testing):** Xây dựng test case, test script dựa trên
  từng tiêu chí cụ thể.
- **Nghiệm thu (Acceptance):** Đối chiếu kết quả thực tế với tiêu chí để xác nhận bàn
  giao.

Tài liệu này kế thừa từ:

- [01-tong-quan-yeu-cau-chuan-hoa.md](./01-tong-quan-yeu-cau-chuan-hoa.md) — Yêu cầu chức năng
- [02-actor-va-phan-quyen.md](./02-actor-va-phan-quyen.md) — Actor và phân quyền
- [03-use-case-chi-tiet.md](./03-use-case-chi-tiet.md) — Use Case chi tiết
- [04-quy-tac-nghiep-vu.md](./04-quy-tac-nghiep-vu.md) — Quy tắc nghiệp vụ
- [05-trang-thai-he-thong.md](./05-trang-thai-he-thong.md) — Trạng thái và luồng chuyển trạng thái

---

## 2. Quy ước trình bày

Mỗi tiêu chí nghiệm thu có mã duy nhất theo format:

```
AC-{MODULE}-{STT}
```

| Tiền tố | Module |
|---------|--------|
| AC-AUTH | Đăng nhập và phân quyền |
| AC-TBL | Quản lý bàn |
| AC-RES | Đặt bàn |
| AC-ORD | Gọi món |
| AC-KIT | Gửi món xuống bếp và cập nhật trạng thái món |
| AC-PAY | Thanh toán |
| AC-MNU | Quản lý thực đơn |
| AC-INV | Quản lý kho nguyên liệu |
| AC-RPT | Báo cáo |
| AC-EMP | Quản lý nhân viên và tài khoản |

**Ký hiệu trạng thái nghiệm thu:**

| Ký hiệu | Ý nghĩa |
|---------|---------|
| ✔ | Pass — đáp ứng tiêu chí |
| ✘ | Fail — không đáp ứng tiêu chí |
| ⚠️ | Cần xác nhận thêm với khách hàng |
| N/A | Không áp dụng cho phiên bản hiện tại |

---

## 3. Tiêu chí nghiệm thu theo module

### 3.A. Đăng nhập và phân quyền (AC-AUTH)

| Mã AC | Nội dung nghiệm thu | Điều kiện kiểm tra | Kết quả mong đợi |
|-------|---------------------|--------------------|-----------------|
| AC-AUTH-01 | Đăng nhập đúng tài khoản và mật khẩu cho phép vào hệ thống | Nhập tên đăng nhập và mật khẩu hợp lệ, nhấn Đăng nhập | Hệ thống xác thực thành công, chuyển đến màn hình chính theo vai trò |
| AC-AUTH-02 | Đăng nhập sai tài khoản hoặc mật khẩu hiển thị thông báo lỗi | Nhập sai mật khẩu 1 lần / Nhập sai tên đăng nhập | Hệ thống hiển thị thông báo "Tên đăng nhập hoặc mật khẩu không đúng" |
| AC-AUTH-03 | Người dùng chỉ thấy chức năng đúng với vai trò được phân quyền | Đăng nhập với từng vai trò (Phục vụ, Thu ngân, Bếp, Kho, Quản lý, Quản trị) và quan sát menu/màn hình | Mỗi vai trò chỉ thấy các chức năng được phép theo ma trận phân quyền |
| AC-AUTH-04 | Người dùng không có quyền không thể thao tác chức năng bị cấm | Người dùng cố truy cập hoặc thao tác chức năng không được phân quyền | Hệ thống từ chối và ghi nhận vào nhật ký hoạt động |
| AC-AUTH-05 | Thao tác quan trọng được ghi nhận vào nhật ký hoạt động | Thực hiện thanh toán, hủy hóa đơn, sửa thực đơn, nhập/xuất kho | Hệ thống ghi nhận đầy đủ: thời gian, người thực hiện, hành động, đối tượng, dữ liệu trước/sau |

---

### 3.B. Quản lý bàn (AC-TBL)

| Mã AC | Nội dung nghiệm thu | Điều kiện kiểm tra | Kết quả mong đợi |
|-------|---------------------|--------------------|-----------------|
| AC-TBL-01 | Quản lý thêm/sửa/xem bàn thành công khi dữ liệu hợp lệ | Nhập mã bàn, tên bàn, khu vực, số ghế hợp lệ → Lưu | Hệ thống lưu thành công, hiển thị bàn mới/cập nhật trong danh sách |
| AC-TBL-02 | Không cho phép tạo mã bàn trùng | Tạo bàn mới với mã đã tồn tại | Hệ thống thông báo "Mã bàn đã tồn tại" và không lưu |
| AC-TBL-03 | Không cho phép xóa bàn đang có khách, đã đặt hoặc đang cần dọn | Chọn xóa bàn ở trạng thái Đã đặt / Đang phục vụ / Cần dọn | Hệ thống thông báo "Không thể xóa bàn đang được sử dụng" |
| AC-TBL-04 | Trạng thái bàn chuyển đúng theo sơ đồ trạng thái | Kiểm tra lần lượt các chuyển đổi: Trống→Đã đặt, Đã đặt→Đang phục vụ, Đang phục vụ→Cần dọn, Cần dọn→Trống, Trống→Bảo trì, Bảo trì→Trống | Mỗi chuyển đổi thành công đúng theo quy tắc BR-TBL-06 đến BR-TBL-13 |
| AC-TBL-05 | Bàn bảo trì không được chọn để đặt bàn hoặc gọi món | Đặt bàn hoặc xếp khách cho bàn ở trạng thái Bảo trì | Hệ thống không hiển thị bàn Bảo trì trong danh sách chọn |

---

### 3.C. Đặt bàn (AC-RES)

| Mã AC | Nội dung nghiệm thu | Điều kiện kiểm tra | Kết quả mong đợi |
|-------|---------------------|--------------------|-----------------|
| AC-RES-01 | Nhân viên tạo đặt bàn thành công khi thông tin hợp lệ | Nhập tên khách, SĐT, thời gian đặt, số lượng khách, chọn bàn trống → Xác nhận | Hệ thống lưu đặt bàn, trạng thái đặt bàn là Chờ xác nhận hoặc Đã xác nhận tùy quy trình |
| AC-RES-02 | Không cho phép đặt bàn trong quá khứ | Nhập thời gian đặt nhỏ hơn thời gian hiện tại | Hệ thống thông báo "Không thể đặt bàn trong quá khứ" |
| AC-RES-03 | Không cho phép đặt bàn trùng thời gian với bàn đã được đặt | Đặt bàn cho bàn đã có đặt bàn khác trong cùng khung giờ | Hệ thống thông báo "Bàn đã được đặt trong khung giờ này" |
| AC-RES-04 | Khi xác nhận đặt bàn, bàn chuyển sang Đã đặt | Nhân viên xác nhận đặt bàn (Chờ xác nhận → Đã xác nhận) | Trạng thái bàn chuyển từ Trống → Đã đặt |
| AC-RES-05 | Khi khách đến nhận bàn, bàn chuyển sang Đang phục vụ | Nhân viên check-in khách (Đã xác nhận → Khách đã đến) | Trạng thái bàn chuyển từ Đã đặt → Đang phục vụ |
| AC-RES-06 | Khi hủy đặt bàn hoặc khách không đến, bàn chuyển về Trống | Hủy đặt bàn hoặc quá giờ giữ bàn | Trạng thái bàn chuyển về Trống |
| AC-RES-07 | Hủy đặt bàn không xóa dữ liệu lịch sử | Hủy một đặt bàn, sau đó tra cứu lịch sử đặt bàn | Đặt bàn vẫn được lưu trong lịch sử hệ thống với trạng thái Đã hủy |

---

### 3.D. Gọi món (AC-ORD)

| Mã AC | Nội dung nghiệm thu | Điều kiện kiểm tra | Kết quả mong đợi |
|-------|---------------------|--------------------|-----------------|
| AC-ORD-01 | Chỉ gọi món được cho bàn đang phục vụ | Thử tạo đơn gọi món cho bàn Trống / Đã đặt / Cần dọn / Bảo trì | Hệ thống không cho phép, thông báo "Bàn chưa sẵn sàng để gọi món" |
| AC-ORD-02 | Chỉ chọn được món có trạng thái Đang bán | Mở thực đơn để gọi món cho bàn | Danh sách món hiển thị chỉ gồm các món Đang bán |
| AC-ORD-03 | Không thể chọn món Hết món hoặc Ngừng bán | Thử thêm món Hết món hoặc Ngừng bán vào đơn | Hệ thống không cho thêm, thông báo "Món hiện không khả dụng" |
| AC-ORD-04 | Nhân viên thêm món, sửa số lượng, ghi chú món đúng | Thêm món với số lượng và ghi chú → Kiểm tra đơn hàng | Món hiển thị trong đơn với đúng số lượng, ghi chú và đơn giá tại thời điểm gọi |
| AC-ORD-05 | Chỉ được sửa số lượng hoặc hủy món khi món chưa chế biến | Sửa/hủy món ở trạng thái Chờ chế biến → thành công; thử với món Đang chế biến → thất bại | Món Chờ chế biến cho phép sửa/hủy; món Đang chế biến trở lên không cho phép |
| AC-ORD-06 | Món đã hủy không được tính vào tổng tiền | Hủy một món trong đơn, kiểm tra tổng tiền tạm tính | Tổng tiền không bao gồm giá trị món đã hủy |
| AC-ORD-07 | Giá món trong đơn giữ theo thời điểm gọi món | Thay đổi giá món sau khi đã gọi, kiểm tra giá trong đơn cũ | Đơn hàng cũ giữ giá cũ, đơn hàng mới áp dụng giá mới |

---

### 3.E. Gửi món xuống bếp và cập nhật trạng thái món (AC-KIT)

| Mã AC | Nội dung nghiệm thu | Điều kiện kiểm tra | Kết quả mong đợi |
|-------|---------------------|--------------------|-----------------|
| AC-KIT-01 | Sau khi nhân viên phục vụ xác nhận gửi món, món xuất hiện ở màn hình bếp | Nhân viên phục vụ gửi món → Kiểm tra màn hình bếp | Món hiển thị trên màn hình bếp với trạng thái Chờ chế biến |
| AC-KIT-02 | Món hiển thị tại bếp theo thứ tự thời gian gọi (FIFO) | Gọi 3 món lần lượt, kiểm tra thứ tự trên màn hình bếp | Món gọi trước hiển thị trước, món gọi sau hiển thị sau |
| AC-KIT-03 | Bếp chỉ thấy thông tin cần chế biến, không thấy giá món | Nhân viên bếp mở danh sách món | Màn hình bếp hiển thị: tên món, số lượng, ghi chú, số bàn, thời gian — KHÔNG hiển thị giá món |
| AC-KIT-04 | Nhân viên bếp chuyển món từ Chờ chế biến sang Đang chế biến | Bếp chọn món → nhấn "Bắt đầu chế biến" | Trạng thái món chuyển từ Chờ chế biến → Đang chế biến |
| AC-KIT-05 | Nhân viên bếp chuyển món từ Đang chế biến sang Hoàn thành | Bếp chọn món → nhấn "Hoàn thành" | Trạng thái món chuyển từ Đang chế biến → Hoàn thành |
| AC-KIT-06 | Nhân viên phục vụ chuyển món từ Hoàn thành sang Đã phục vụ | Phục vụ chọn món → nhấn "Đã phục vụ" | Trạng thái món chuyển từ Hoàn thành → Đã phục vụ |
| AC-KIT-07 | Không cho phép chuyển ngược trạng thái món | Thử chuyển từ Hoàn thành → Đang chế biến / Đã phục vụ → Hoàn thành | Hệ thống từ chối, thông báo "Không thể chuyển về trạng thái trước đó" |

---

### 3.F. Thanh toán (AC-PAY)

| Mã AC | Nội dung nghiệm thu | Điều kiện kiểm tra | Kết quả mong đợi |
|-------|---------------------|--------------------|-----------------|
| AC-PAY-01 | Thu ngân xem được hóa đơn của bàn có đơn hàng | Thu ngân chọn bàn đang phục vụ → Xem hóa đơn | Hệ thống hiển thị hóa đơn chi tiết: danh sách món, số lượng, đơn giá, thành tiền |
| AC-PAY-02 | Hệ thống tự động tính tổng tiền, không nhập thủ công tổng tiền | Kiểm tra giao diện thanh toán | Trường tổng tiền là chỉ đọc (read-only), do hệ thống tính tự động |
| AC-PAY-03 | Món đã hủy không tính vào hóa đơn | Kiểm tra hóa đơn có món hủy | Tổng tiền không bao gồm món đã hủy |
| AC-PAY-04 | Giảm giá không được lớn hơn tổng tiền hóa đơn | Nhập số tiền giảm giá > tổng tiền | Hệ thống thông báo "Giảm giá không thể lớn hơn tổng tiền" |
| AC-PAY-05 | VAT tính theo cấu hình hoặc quy định hiện hành | Kiểm tra hóa đơn với VAT 0%, 5%, 8%, 10% | VAT được tính đúng trên tổng tiền sau giảm giá |
| AC-PAY-06 | Sau thanh toán thành công, đơn hàng chuyển sang Đã thanh toán | Thanh toán thành công → Kiểm tra trạng thái đơn hàng | Đơn hàng chuyển từ Đang hoạt động → Đã thanh toán |
| AC-PAY-07 | Sau thanh toán thành công, bàn chuyển sang Cần dọn | Thanh toán thành công → Kiểm tra trạng thái bàn | Bàn chuyển từ Đang phục vụ → Cần dọn |
| AC-PAY-08 | Hóa đơn đã thanh toán chỉ được xem, không được sửa bởi thu ngân | Thu ngân mở hóa đơn đã thanh toán → thử sửa | Hệ thống ở chế độ chỉ đọc, không cho phép sửa |
| AC-PAY-09 | Chỉ Quản lý nhà hàng được hủy hóa đơn | Thu ngân thử hủy hóa đơn → Quản lý thử hủy hóa đơn | Thu ngân: không có quyền. Quản lý: thực hiện được. |
| AC-PAY-10 | Hủy hóa đơn phải ghi lý do và ghi nhật ký hoạt động | Quản lý hủy hóa đơn, nhập lý do | Hệ thống yêu cầu nhập lý do bắt buộc; ghi nhận đầy đủ vào audit log |

---

### 3.G. Quản lý thực đơn (AC-MNU)

| Mã AC | Nội dung nghiệm thu | Điều kiện kiểm tra | Kết quả mong đợi |
|-------|---------------------|--------------------|-----------------|
| AC-MNU-01 | Quản lý thêm/sửa món thành công khi dữ liệu hợp lệ | Nhập tên món, danh mục, giá bán hợp lệ → Lưu | Hệ thống lưu thành công, món xuất hiện trong danh sách thực đơn |
| AC-MNU-02 | Không cho phép tạo món trùng tên | Tạo món mới với tên đã tồn tại | Hệ thống thông báo "Tên món đã tồn tại" và không lưu |
| AC-MNU-03 | Giá món phải lớn hơn 0 | Nhập giá món = 0 hoặc giá âm | Hệ thống thông báo "Giá bán phải lớn hơn 0" |
| AC-MNU-04 | Món Đang bán hiển thị trong danh sách gọi món | Kiểm tra thực đơn trên màn hình gọi món | Món Đang bán xuất hiện đầy đủ |
| AC-MNU-05 | Món Hết món hoặc Ngừng bán không được gọi | Thử thêm món Hết món / Ngừng bán vào đơn | Hệ thống không cho phép thêm |
| AC-MNU-06 | Món đã phát sinh đơn hàng không xóa cứng, chỉ chuyển sang Ngừng bán | Thử xóa món đã có trong đơn hàng | Hệ thống không cho xóa cứng; chuyển trạng thái món thành Ngừng bán |

---

### 3.H. Quản lý kho nguyên liệu (AC-INV)

| Mã AC | Nội dung nghiệm thu | Điều kiện kiểm tra | Kết quả mong đợi |
|-------|---------------------|--------------------|-----------------|
| AC-INV-01 | Nhân viên kho nhập kho với số lượng lớn hơn 0 | Nhập số lượng = 0 hoặc âm | Hệ thống thông báo "Số lượng nhập phải lớn hơn 0" |
| AC-INV-02 | Nhân viên kho xuất kho với số lượng lớn hơn 0 | Xuất số lượng = 0 hoặc âm | Hệ thống thông báo "Số lượng xuất phải lớn hơn 0" |
| AC-INV-03 | Không cho phép xuất kho vượt quá tồn kho | Xuất số lượng > tồn kho hiện tại | Hệ thống thông báo "Số lượng xuất vượt quá tồn kho" và không cho xuất |
| AC-INV-04 | Tồn kho được cập nhật sau nhập/xuất/kiểm kê | Nhập 50 → kiểm tra tồn kho; Xuất 30 → kiểm tra tồn kho | Tồn kho mới = tồn kho cũ ± số lượng nhập/xuất/chênh lệch kiểm kê |
| AC-INV-05 | Hệ thống cảnh báo khi tồn kho nhỏ hơn hoặc bằng mức tối thiểu | Xuất kho làm tồn kho giảm xuống ≤ mức tối thiểu | Hệ thống hiển thị cảnh báo tồn kho thấp trên màn hình kho |
| AC-INV-06 | Trạng thái nguyên liệu được tự động suy diễn theo tồn kho | Thay đổi tồn kho qua nhập/xuất → kiểm tra trạng thái | Trạng thái tự động chuyển: Còn hàng ↔ Sắp hết ↔ Hết hàng dựa trên tồn kho và mức tối thiểu |

---

### 3.I. Báo cáo (AC-RPT)

| Mã AC | Nội dung nghiệm thu | Điều kiện kiểm tra | Kết quả mong đợi |
|-------|---------------------|--------------------|-----------------|
| AC-RPT-01 | Quản lý xem được báo cáo doanh thu theo ngày, tháng, năm hoặc khoảng thời gian | Chọn khoảng thời gian → Xem báo cáo | Hệ thống hiển thị doanh thu, số hóa đơn, tổng tiền trong khoảng thời gian đã chọn |
| AC-RPT-02 | Báo cáo chỉ tính hóa đơn đã thanh toán thành công | Kiểm tra báo cáo trong ngày có 3 hóa đơn: 2 Đã thanh toán, 1 Chưa thanh toán | Báo cáo chỉ tính 2 hóa đơn đã thanh toán |
| AC-RPT-03 | Hóa đơn đã hủy không tính vào doanh thu | Kiểm tra báo cáo trong ngày có 1 hóa đơn bị hủy | Báo cáo không tính hóa đơn đã hủy vào doanh thu |
| AC-RPT-04 | Báo cáo món bán chạy không tính món đã hủy | Kiểm tra thống kê món bán chạy | Số lượng món bán chỉ tính món Đã phục vụ, không tính món Đã hủy |
| AC-RPT-05 | Dữ liệu xuất Excel/PDF phải khớp dữ liệu hiển thị | Xuất báo cáo ra Excel và PDF → so sánh với dữ liệu trên màn hình | Các chỉ số trên file xuất khớp chính xác với dữ liệu hiển thị |
| AC-RPT-06 | Thu ngân chỉ xem thống kê hóa đơn nếu được phân quyền, không xem báo cáo doanh thu tổng hợp | Thu ngân đăng nhập → thử xem báo cáo doanh thu | Thu ngân không thấy menu báo cáo doanh thu; chỉ thấy thống kê hóa đơn nếu được cấp quyền |

---

### 3.J. Quản lý nhân viên và tài khoản (AC-EMP)

| Mã AC | Nội dung nghiệm thu | Điều kiện kiểm tra | Kết quả mong đợi |
|-------|---------------------|--------------------|-----------------|
| AC-EMP-01 | Quản lý thêm nhân viên thành công khi dữ liệu hợp lệ | Nhập họ tên, số điện thoại, chức vụ, trạng thái làm việc hợp lệ | Hệ thống lưu nhân viên và hiển thị trong danh sách |
| AC-EMP-02 | Không cho tạo tài khoản trùng tên đăng nhập | Tạo tài khoản với tên đăng nhập đã tồn tại | Hệ thống thông báo tên đăng nhập đã tồn tại và không lưu |
| AC-EMP-03 | Quản lý sửa thông tin nhân viên thành công | Cập nhật thông tin nhân viên hợp lệ | Hệ thống lưu thay đổi và hiển thị thông tin mới |
| AC-EMP-04 | Nhân viên nghỉ việc không bị xóa cứng | Chuyển nhân viên sang trạng thái ngừng hoạt động hoặc khóa tài khoản | Nhân viên không còn đăng nhập được nhưng lịch sử thao tác vẫn được giữ |
| AC-EMP-05 | Quản trị hệ thống phân quyền tài khoản theo vai trò | Gán vai trò cho tài khoản | Tài khoản chỉ thấy chức năng đúng với vai trò được cấp |
| AC-EMP-06 | Người không có quyền không được quản lý tài khoản hoặc phân quyền | Đăng nhập bằng vai trò không phải Quản lý/Quản trị và thử thao tác | Hệ thống từ chối thao tác |

---

## 4. Bảng truy vết (Traceability Matrix)

Bảng dưới đây liên kết mỗi Acceptance Criteria với Use Case và Business Rule tương ứng.

### 4.A. Đăng nhập và phân quyền

| Mã AC | Liên kết Use Case | Liên kết Business Rule |
|-------|-------------------|------------------------|
| AC-AUTH-01 | UC-01 (luồng chính) | BR-AUTH-03 |
| AC-AUTH-02 | UC-01-A1 | — |
| AC-AUTH-03 | UC-01 (bước 4) | BR-AUTH-04 |
| AC-AUTH-04 | UC-01 (ghi chú) | BR-AUTH-02, BR-AUTH-05 |
| AC-AUTH-05 | N/A (xuyên suốt) | BR-AUTH-06, BR-AUTH-07 |

### 4.B. Quản lý bàn

| Mã AC | Liên kết Use Case | Liên kết Business Rule |
|-------|-------------------|------------------------|
| AC-TBL-01 | UC-02 (luồng chính) | BR-TBL-15 |
| AC-TBL-02 | UC-02-A1 | BR-TBL-14 |
| AC-TBL-03 | UC-02-A2 | BR-TBL-03 |
| AC-TBL-04 | UC-02 (bước 5–7) | BR-TBL-06 → BR-TBL-13 |
| AC-TBL-05 | UC-02 (ghi chú) | BR-TBL-04 |

### 4.C. Đặt bàn

| Mã AC | Liên kết Use Case | Liên kết Business Rule |
|-------|-------------------|------------------------|
| AC-RES-01 | UC-03 (luồng chính) | BR-RES-01, BR-RES-02 |
| AC-RES-02 | UC-03 (luồng thay thế) | BR-RES-09 |
| AC-RES-03 | UC-03-A1 | BR-RES-08 |
| AC-RES-04 | UC-03 (bước 8–10) | BR-RES-03, BR-TBL-06 |
| AC-RES-05 | UC-03 (bước 9) | BR-RES-04, BR-TBL-07 |
| AC-RES-06 | UC-03-A3, UC-03-A4 | BR-RES-05, BR-RES-06, BR-TBL-13 |
| AC-RES-07 | UC-03 (ghi chú) | BR-RES-07 |

### 4.D. Gọi món

| Mã AC | Liên kết Use Case | Liên kết Business Rule |
|-------|-------------------|------------------------|
| AC-ORD-01 | UC-04 (điều kiện trước) | BR-ORD-01 |
| AC-ORD-02 | UC-04 (bước 2) | BR-ORD-02 |
| AC-ORD-03 | UC-04-A1 | BR-ORD-02, BR-MNU-03, BR-MNU-04 |
| AC-ORD-04 | UC-04 (bước 3–6) | BR-ORD-04, BR-ORD-09 |
| AC-ORD-05 | UC-04-A2, UC-04-A3 | BR-ORD-05, BR-ORD-06 |
| AC-ORD-06 | UC-04 (ghi chú) | BR-ORD-12 |
| AC-ORD-07 | UC-04 (ghi chú) | BR-ORD-11 |

### 4.E. Gửi món xuống bếp và cập nhật trạng thái món

| Mã AC | Liên kết Use Case | Liên kết Business Rule |
|-------|-------------------|------------------------|
| AC-KIT-01 | UC-05 (luồng chính) | BR-KIT-01, BR-KIT-03 |
| AC-KIT-02 | UC-06 (bước 2) | BR-KIT-04 |
| AC-KIT-03 | UC-05 (ghi chú) | BR-KIT-05 |
| AC-KIT-04 | UC-06 (bước 4) | BR-KIT-10 |
| AC-KIT-05 | UC-06 (bước 5) | BR-KIT-11 |
| AC-KIT-06 | UC-06 (ghi chú) | BR-KIT-12 |
| AC-KIT-07 | UC-06-A3 | BR-KIT-14 |

### 4.F. Thanh toán

| Mã AC | Liên kết Use Case | Liên kết Business Rule |
|-------|-------------------|------------------------|
| AC-PAY-01 | UC-07 (bước 1–2) | BR-PAY-03 |
| AC-PAY-02 | UC-07 (bước 3) | BR-PAY-04 |
| AC-PAY-03 | UC-07 (ghi chú) | BR-PAY-04, BR-ORD-12 |
| AC-PAY-04 | UC-07 (bước 5) | BR-PAY-06 |
| AC-PAY-05 | UC-07 (bước 5) | BR-PAY-07 |
| AC-PAY-06 | UC-07 (bước 10) | BR-PAY-12 |
| AC-PAY-07 | UC-07 (bước 11) | BR-PAY-13 |
| AC-PAY-08 | UC-07 (ghi chú) | BR-PAY-14 |
| AC-PAY-09 | UC-07-A3 | BR-PAY-15 |
| AC-PAY-10 | UC-07 (ghi chú) | BR-PAY-16, BR-PAY-17 |

### 4.G. Quản lý thực đơn

| Mã AC | Liên kết Use Case | Liên kết Business Rule |
|-------|-------------------|------------------------|
| AC-MNU-01 | UC-08 (luồng chính) | BR-MNU-06 |
| AC-MNU-02 | UC-08-A1 | BR-MNU-07 |
| AC-MNU-03 | UC-08 (bước 4–5) | BR-MNU-08 |
| AC-MNU-04 | UC-08 (bước 7) | BR-MNU-02 |
| AC-MNU-05 | UC-08-A3, UC-08-A4 | BR-MNU-03, BR-MNU-04 |
| AC-MNU-06 | UC-08-A2 | BR-MNU-10 |

### 4.H. Quản lý kho nguyên liệu

| Mã AC | Liên kết Use Case | Liên kết Business Rule |
|-------|-------------------|------------------------|
| AC-INV-01 | UC-09 (bước 4–5) | BR-INV-02 |
| AC-INV-02 | UC-09 (bước 4–5) | BR-INV-05 |
| AC-INV-03 | UC-09-A2 | BR-INV-06 |
| AC-INV-04 | UC-09 (bước 6–7) | BR-INV-03, BR-INV-07 |
| AC-INV-05 | UC-09-A3 | BR-INV-09, BR-INV-10 |
| AC-INV-06 | UC-09 (ghi chú) | BR-INV-08 (suy diễn) |

### 4.I. Báo cáo

| Mã AC | Liên kết Use Case | Liên kết Business Rule |
|-------|-------------------|------------------------|
| AC-RPT-01 | UC-10 (luồng chính) | BR-RPT-02 |
| AC-RPT-02 | UC-10 (bước 5–6) | BR-RPT-01 |
| AC-RPT-03 | UC-10 (ghi chú) | BR-RPT-01 |
| AC-RPT-04 | UC-10 (ghi chú) | BR-RPT-06 |
| AC-RPT-05 | UC-10-A3 | BR-RPT-10 |
| AC-RPT-06 | UC-10-A2 | BR-RPT-11 |

### 4.J. Quản lý nhân viên và tài khoản

| Mã AC | Liên kết Use Case | Liên kết Business Rule |
|-------|-------------------|------------------------|
| AC-EMP-01 | UC-11 (luồng chính) | BR-AUTH-01, BR-AUTH-03 |
| AC-EMP-02 | UC-11 (luồng thay thế) | BR-AUTH-01 |
| AC-EMP-03 | UC-11 (luồng chính) | BR-AUTH-01 |
| AC-EMP-04 | UC-11 (luồng thay thế) | BR-AUTH-06, BR-AUTH-07 |
| AC-EMP-05 | UC-11 (bước 5–6) | BR-AUTH-04 |
| AC-EMP-06 | UC-11 (ghi chú) | BR-AUTH-02, BR-AUTH-05 |

---

## 5. Tổng hợp Acceptance Criteria

### 5.1. Thống kê số lượng

| Nhóm | Mã prefix | Số lượng AC |
|:----:|:---------:|:-----------:|
| Đăng nhập và phân quyền | AUTH | 5 |
| Quản lý bàn | TBL | 5 |
| Đặt bàn | RES | 7 |
| Gọi món | ORD | 7 |
| Gửi món xuống bếp và cập nhật trạng thái món | KIT | 7 |
| Thanh toán | PAY | 10 |
| Quản lý thực đơn | MNU | 6 |
| Quản lý kho nguyên liệu | INV | 6 |
| Báo cáo | RPT | 6 |
| Quản lý nhân viên và tài khoản | EMP | 6 |
| **Tổng cộng** | **10 nhóm** | **65** |

### 5.2. Ma trận bao phủ Use Case

| Use Case | Số AC liên quan | Các mã AC |
|----------|:---------------:|-----------|
| UC-01 — Đăng nhập | 5 | AC-AUTH-01 → AC-AUTH-05 |
| UC-02 — Quản lý bàn | 5 | AC-TBL-01 → AC-TBL-05 |
| UC-03 — Đặt bàn | 7 | AC-RES-01 → AC-RES-07 |
| UC-04 — Gọi món | 7 | AC-ORD-01 → AC-ORD-07 |
| UC-05 — Gửi món xuống bếp | 3 | AC-KIT-01 → AC-KIT-03 |
| UC-06 — Cập nhật trạng thái chế biến | 4 | AC-KIT-04 → AC-KIT-07 |
| UC-07 — Thanh toán hóa đơn | 10 | AC-PAY-01 → AC-PAY-10 |
| UC-08 — Quản lý thực đơn | 6 | AC-MNU-01 → AC-MNU-06 |
| UC-09 — Quản lý kho nguyên liệu | 6 | AC-INV-01 → AC-INV-06 |
| UC-10 — Xem báo cáo doanh thu | 6 | AC-RPT-01 → AC-RPT-06 |
| UC-11 — Quản lý nhân viên và tài khoản | 6 | AC-EMP-01 → AC-EMP-06 |

> **Ghi chú:** Mỗi Acceptance Criteria đều liên kết với ít nhất một Use Case
> và một hoặc nhiều Business Rule.

---

## 6. Các điểm cần làm rõ với khách hàng

Dưới đây là các câu hỏi phát sinh từ quá trình xây dựng Acceptance Criteria,
cần khách hàng xác nhận trước khi chuyển sang giai đoạn thiết kế và phát triển.

### 6.1. Thanh toán một phần

> **Hỏi:** Hệ thống có hỗ trợ thanh toán một phần không?
> Ví dụ: Khách thanh toán trước 50% tổng tiền, phần còn lại thanh toán sau.

- Nếu **Có**: Cần bổ sung trạng thái thanh toán, quy tắc tính tiền, luồng chuyển
  trạng thái bàn khi thanh toán một phần.
- Nếu **Không**: Luồng hiện tại (thanh toán một lần 100%) là đủ. Hệ thống chỉ ghi
  nhận một giao dịch thanh toán trên mỗi hóa đơn.
- **Đề xuất:** Không hỗ trợ thanh toán một phần trong phiên bản đầu. Đây là
  trường hợp hiếm gặp trong nhà hàng và làm tăng độ phức tạp xử lý trạng thái.

### 6.2. Tách hóa đơn / Gộp bàn

> **Hỏi:** Hệ thống có hỗ trợ tách hóa đơn (chia tiền cho nhiều khách trên cùng
> một bàn) hoặc gộp bàn (gộp nhiều bàn thành một đơn hàng) không?

- **Tách hóa đơn:** Khách một bàn nhưng muốn chia thành 2–3 hóa đơn riêng.
- **Gộp bàn:** Khách ngồi nhiều bàn nhưng gộp chung một hóa đơn.
- Nếu **Có**: Cần thiết kế lại luồng gọi món, luồng thanh toán và kiểm tra trạng
  thái bàn.
- **Đề xuất:** Không hỗ trợ trong phiên bản đầu (đã xác định là Won't Have tại
  tài liệu 01). Nhưng cần kiến trúc hệ thống đủ linh hoạt để bổ sung sau.

### 6.3. Tự động trừ kho theo món

> **Hỏi:** Khi món được gửi xuống bếp hoặc khi món hoàn thành, hệ thống có tự động
> trừ nguyên liệu tồn kho hay không?

- Nếu **Có**: Cần xây dựng định mức nguyên liệu cho từng món (công thức nấu ăn),
  đồng thời tự động suy diễn trạng thái món (Hết món) từ tồn kho.
- Nếu **Không**: Việc xuất kho hoàn toàn thủ công, không ảnh hưởng đến module
  gọi món.
- **Đề xuất:** Tự động trừ kho là Should Have. Phiên bản đầu nên làm xuất kho
  thủ công. Tích hợp tự động trừ kho sẽ triển khai ở giai đoạn sau, sau khi đã
  có dữ liệu định mức nguyên liệu hoàn chỉnh.

### 6.4. Đặt bàn online / QR Order

> **Hỏi:** Hệ thống có hỗ trợ khách hàng tự đặt bàn qua website/ứng dụng hoặc
> tự gọi món qua QR code không?

- **Đặt bàn online:** Khách tự chọn bàn, chọn thời gian, điền thông tin →
  hệ thống nhận và chờ nhân viên xác nhận.
- **QR Order:** Khách quét mã QR tại bàn → xem thực đơn → tự gọi món →
  món gửi thẳng xuống bếp.
- **Đề xuất:** Cả hai đều thuộc nhóm Could Have / Won't Have. Không triển khai
  trong phiên bản đầu. Hệ thống nên thiết kế module đặt bàn sao cho sau này có
  thể thêm kênh online mà không ảnh hưởng đến logic nghiệp vụ hiện tại.

### 6.5. Xác thực lại khi hủy hóa đơn

> **Hỏi:** Khi Quản lý nhà hàng thực hiện hủy hóa đơn, có cần xác thực lại
> (ví dụ: nhập mật khẩu, nhập mã PIN hoặc xác thực vân tay) không?

- Nếu **Có**: Hệ thống sẽ yêu cầu xác thực bổ sung trước khi cho phép hủy
  hóa đơn, tăng cường bảo mật cho thao tác nhạy cảm.
- Nếu **Không**: Hệ thống chỉ kiểm tra quyền (role = Quản lý nhà hàng) và ghi
  nhật ký, không yêu cầu xác thực lại.
- **Đề xuất:** **Nên có xác thực lại.** Hủy hóa đơn đã thanh toán ảnh hưởng
  trực tiếp đến doanh thu và báo cáo tài chính. Xác thực lại giúp đảm bảo
  người đang thao tác đúng là chủ tài khoản, không phải người khác mượn máy.
  Hình thức xác thực có thể là nhập lại mật khẩu hoặc mã PIN ngắn.

### 6.6. Các điểm khác cần xác nhận

| STT | Vấn đề | Mô tả | Mức độ ảnh hưởng |
|:---:|--------|-------|:-----------------:|
| 1 | Thời gian giữ bàn mặc định | 15 phút có phù hợp với mọi khung giờ? Có cần cấu hình linh hoạt? | AC-RES-06 |
| 2 | Món chưa chế biến khi thanh toán | Xử lý hủy, cho mang về hay chuyển sang đơn hàng mới? | AC-PAY-02, AC-PAY-03 |
| 3 | Giới hạn % giảm giá tối đa | Có giới hạn % giảm giá cho thu ngân không? Giảm giá vượt ngưỡng có cần quản lý phê duyệt? | AC-PAY-04 |
| 4 | Một nhân viên nhiều vai trò | Có cho phép cùng một người vừa phục vụ vừa thu ngân? Nếu có, xử lý ra sao? | AC-AUTH-03 |
| 5 | Báo cáo hóa đơn hủy riêng | Có cần báo cáo riêng về các hóa đơn bị hủy để quản lý theo dõi? | AC-RPT-03 |
| 6 | Kiểm kê kho — ai phê duyệt | Chênh lệch kiểm kê cần ai phê duyệt? Quy trình xử lý chênh lệch thế nào? | AC-INV-04 |

---

## 7. Hướng dẫn sử dụng tài liệu

### 7.1. Dành cho nhóm kiểm thử

- Mỗi AC có thể được chuyển đổi thành **một hoặc nhiều test case**.
- Ghi nhận kết quả kiểm thử cho từng AC: ✔ (Pass) / ✘ (Fail) / N/A.
- Nếu Fail, ghi rõ môi trường, dữ liệu đầu vào, kết quả thực tế và bước tái hiện.

### 7.2. Dành cho nhóm phát triển

- Sử dụng bảng truy vết (mục 4) để xác định scope ảnh hưởng khi sửa code.
- Mỗi pull request nên đối chiếu với AC liên quan để đảm bảo không vỡ tiêu chí.

### 7.3. Dành cho khách hàng / bên A

- Duyệt từng AC trong mục 3. Đánh dấu ✔ nếu đồng ý, ✘ nếu cần điều chỉnh.
- Các điểm tại mục 6 cần được trả lời trước khi chuyển sang giai đoạn phát triển.

---

*Tài liệu này là căn cứ cho kiểm thử nghiệm thu (Acceptance Testing).*
*Mọi thay đổi về nghiệp vụ cần được cập nhật vào tài liệu này trước khi cập nhật code.*
