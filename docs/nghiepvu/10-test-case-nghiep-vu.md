# Test case nghiệp vụ — Hệ thống quản lý nhà hàng

## 1. Mục đích tài liệu

Tài liệu này chuyển các **Acceptance Criteria (AC)** đã định nghĩa tại
[06-acceptance-criteria.md](./06-acceptance-criteria.md) thành các **Test Case nghiệp vụ**
cụ thể, có thể thực thi được.

Mục đích của tài liệu:

- **Căn cứ kiểm thử chức năng:** Mỗi test case kiểm tra một tình huống nghiệp vụ cụ thể,
  có thể thực hiện thủ công hoặc tự động hóa.
- **Căn cứ kiểm thử nghiệm thu (UAT):** Đối chiếu kết quả thực tế với kết quả mong đợi
  để xác nhận hệ thống đáp ứng yêu cầu nghiệp vụ.
- **Căn cứ demo:** Các test case ưu tiên cao được dùng làm kịch bản demo cho khách hàng.
- **Kiểm tra xuyên suốt trạng thái:** Bổ sung các test case chuyên biệt để kiểm tra luồng
  chuyển trạng thái giữa các thực thể (bàn, đặt bàn, món, đơn hàng, thanh toán, kho).

Tài liệu này kế thừa từ:

- [03-use-case-chi-tiet.md](./03-use-case-chi-tiet.md) — Use Case chi tiết
- [05-trang-thai-he-thong.md](./05-trang-thai-he-thong.md) — Trạng thái và luồng chuyển trạng thái
- [06-acceptance-criteria.md](./06-acceptance-criteria.md) — Tiêu chí nghiệm thu

---

## 2. Quy ước mã Test Case

Mỗi test case có mã duy nhất theo format:

```
TC-{MODULE}-{STT}
```

| Mã | Module | Số lượng |
|:---:|--------|:-------:|
| TC-AUTH | Đăng nhập và phân quyền | 5 |
| TC-TBL | Quản lý bàn | 5 |
| TC-RES | Đặt bàn | 7 |
| TC-ORD | Gọi món | 7 |
| TC-KIT | Gửi món xuống bếp và cập nhật trạng thái món | 7 |
| TC-PAY | Thanh toán | 10 |
| TC-MNU | Quản lý thực đơn | 6 |
| TC-INV | Quản lý kho nguyên liệu | 6 |
| TC-RPT | Báo cáo | 6 |
| TC-EMP | Quản lý nhân viên và tài khoản | 6 |

**Mức ưu tiên:**

| Mức | Ký hiệu | Ý nghĩa |
|:---:|:-------:|---------|
| Cao | **C** | Cần kiểm thử trước khi bàn giao; ảnh hưởng đến luồng nghiệp vụ chính |
| Trung bình | **TB** | Chức năng hoàn chỉnh nhưng có workaround hoặc ít ảnh hưởng đến luồng chính |
| Thấp | **TH** | Tình huống biên, ít xảy ra hoặc mỹ quan giao diện |

---

## 3. Test case theo module

### 3.A. Đăng nhập và phân quyền (TC-AUTH)

| Mã TC | Module | Mục tiêu kiểm thử | Điều kiện trước | Dữ liệu kiểm thử | Các bước thực hiện | Kết quả mong đợi | Liên kết Use Case | Liên kết AC | Mức ưu tiên | Ghi chú |
|:-----:|:------:|-------------------|-----------------|-----------------|--------------------|------------------|:-----------------:|:-----------:|:----------:|---------|
| TC-AUTH-01 | Đăng nhập | Đăng nhập thành công với tài khoản hợp lệ | Tài khoản đã được tạo trong hệ thống, chưa bị khóa | username: `admin`, password: `Admin@123` | 1. Mở màn hình đăng nhập<br>2. Nhập tên đăng nhập và mật khẩu hợp lệ<br>3. Nhấn nút Đăng nhập | Hệ thống xác thực thành công, chuyển đến màn hình chính tương ứng với vai trò của người dùng | UC-01 | AC-AUTH-01 | **C** | Kiểm thử với từng vai trò: Quản lý, Phục vụ, Thu ngân, Bếp, Kho, Quản trị |
| TC-AUTH-02 | Đăng nhập | Đăng nhập thất bại khi sai thông tin | Tài khoản tồn tại trong hệ thống | username: `admin`, password: `sai_mat_khau` | 1. Mở màn hình đăng nhập<br>2. Nhập sai mật khẩu<br>3. Nhấn nút Đăng nhập | Hệ thống hiển thị thông báo "Tên đăng nhập hoặc mật khẩu không đúng", không chuyển màn hình | UC-01-A1 | AC-AUTH-02 | **C** | Kiểm tra thêm với tên đăng nhập không tồn tại |
| TC-AUTH-03 | Phân quyền | Người dùng chỉ thấy chức năng theo vai trò | Có ít nhất một tài khoản cho mỗi vai trò (Quản lý, Phục vụ, Thu ngân, Bếp, Kho, Quản trị) | Đăng nhập lần lượt từng tài khoản | 1. Đăng nhập với từng vai trò<br>2. Quan sát menu/màn hình hiển thị<br>3. Đối chiếu với ma trận phân quyền | Mỗi vai trò chỉ thấy các chức năng được phép; chức năng không được phân quyền không hiển thị trên menu | UC-01 | AC-AUTH-03 | **C** | Cần có ma trận phân quyền từ file 02 để đối chiếu |
| TC-AUTH-04 | Phân quyền | Người dùng không có quyền bị từ chối thao tác | Có tài khoản Phục vụ; có chức năng thanh toán hiện hữu | Tài khoản Phục vụ | 1. Đăng nhập bằng tài khoản Phục vụ<br>2. Thử truy cập trực tiếp URL/chức năng thanh toán | Hệ thống từ chối, hiển thị thông báo "Bạn không có quyền thực hiện thao tác này". Nhật ký hoạt động ghi nhận sự kiện truy cập trái phép | UC-01 | AC-AUTH-04 | **C** | Kiểm tra cả giao diện lẫn thao tác truy cập trực tiếp nếu có |
| TC-AUTH-05 | Nhật ký | Thao tác quan trọng được ghi nhật ký | Có tài khoản Quản lý và Thu ngân | Thực hiện thanh toán, hủy hóa đơn, sửa thực đơn, nhập/xuất kho | 1. Thực hiện lần lượt các thao tác: thanh toán, hủy hóa đơn, sửa thực đơn, nhập kho, xuất kho<br>2. Kiểm tra nhật ký hoạt động | Nhật ký ghi nhận đầy đủ: thời gian, người thực hiện, hành động, đối tượng, dữ liệu trước/sau (nếu có) | UC-01 | AC-AUTH-05 | **TB** | Danh sách thao tác cần ghi nhật ký cần được thống nhất trước |

---

### 3.B. Quản lý bàn (TC-TBL)

| Mã TC | Module | Mục tiêu kiểm thử | Điều kiện trước | Dữ liệu kiểm thử | Các bước thực hiện | Kết quả mong đợi | Liên kết Use Case | Liên kết AC | Mức ưu tiên | Ghi chú |
|:-----:|:------:|-------------------|-----------------|-----------------|--------------------|------------------|:-----------------:|:-----------:|:----------:|---------|
| TC-TBL-01 | Bàn | Thêm bàn hợp lệ | Quản lý đã đăng nhập; chưa có bàn mã `B001` | Mã bàn: `B001`, Tên bàn: `Bàn đôi 1`, Khu vực: `Trong nhà`, Số ghế: `2` | 1. Vào Quản lý bàn → Thêm bàn<br>2. Nhập thông tin hợp lệ<br>3. Nhấn Lưu | Hệ thống lưu thành công, bàn `B001` xuất hiện trong danh sách với trạng thái Trống | UC-02 | AC-TBL-01 | **C** | Kiểm tra thêm trường hợp sửa và xem bàn |
| TC-TBL-02 | Bàn | Không tạo được mã bàn trùng | Đã tồn tại bàn mã `B001` | Mã bàn: `B001` (đã tồn tại) | 1. Vào Quản lý bàn → Thêm bàn<br>2. Nhập mã `B001`<br>3. Nhấn Lưu | Hệ thống thông báo "Mã bàn đã tồn tại", không lưu | UC-02-A1 | AC-TBL-02 | **C** | |
| TC-TBL-03 | Bàn | Không xóa được bàn đang có khách/đã đặt/cần dọn | Có bàn ở trạng thái Đang phục vụ, Đã đặt và Cần dọn | Bàn Đang phục vụ, bàn Đã đặt, bàn Cần dọn | 1. Vào Quản lý bàn<br>2. Chọn bàn đang phục vụ → Xóa<br>3. Lặp lại với bàn Đã đặt và Cần dọn | Hệ thống thông báo "Không thể xóa bàn đang được sử dụng" cho mỗi trường hợp | UC-02-A2 | AC-TBL-03 | **C** | Kiểm tra thêm: xóa bàn Trống và Bảo trì phải thành công |
| TC-TBL-04 | Bàn | Chuyển trạng thái bàn theo đúng sơ đồ | Có đủ các bàn để kiểm tra từng chuyển đổi | Danh sách chuyển đổi theo ma trận mục 3.3 của 05-trang-thai-he-thong.md | 1. Tạo đặt bàn → xác nhận → kiểm tra bàn chuyển Đã đặt<br>2. Check-in → kiểm tra bàn chuyển Đang phục vụ<br>3. Thanh toán → kiểm tra bàn chuyển Cần dọn<br>4. Dọn bàn → kiểm tra bàn chuyển Trống<br>5. Bảo trì → kiểm tra bàn chuyển Bảo trì → mở lại → Trống | Mỗi chuyển đổi thành công đúng quy tắc. Các chuyển đổi không hợp lệ bị từ chối | UC-02 | AC-TBL-04 | **C** | Xem thêm test case trạng thái tại mục 4 |
| TC-TBL-05 | Bàn | Bàn Bảo trì không được chọn để đặt hoặc gọi món | Có bàn ở trạng thái Bảo trì | Bàn Bảo trì | 1. Mở chức năng Đặt bàn → kiểm tra danh sách bàn<br>2. Mở chức năng Gọi món → kiểm tra danh sách bàn | Bàn Bảo trì không xuất hiện trong danh sách chọn bàn khi đặt hoặc gọi món | UC-02 | AC-TBL-05 | **C** | |

---

### 3.C. Đặt bàn (TC-RES)

| Mã TC | Module | Mục tiêu kiểm thử | Điều kiện trước | Dữ liệu kiểm thử | Các bước thực hiện | Kết quả mong đợi | Liên kết Use Case | Liên kết AC | Mức ưu tiên | Ghi chú |
|:-----:|:------:|-------------------|-----------------|-----------------|--------------------|------------------|:-----------------:|:-----------:|:----------:|---------|
| TC-RES-01 | Đặt bàn | Tạo đặt bàn thành công | Nhân viên phục vụ đã đăng nhập; có ít nhất một bàn Trống | Tên khách: `Nguyễn Văn A`, SĐT: `0909123456`, Thời gian: `+1h`, SL khách: `2`, Bàn: `B001` | 1. Mở Đặt bàn<br>2. Nhập thông tin khách<br>3. Chọn thời gian, số lượng khách<br>4. Chọn bàn trống<br>5. Xác nhận | Hệ thống lưu thành công, trạng thái đặt bàn là Chờ xác nhận (hoặc Đã xác nhận tùy quy trình) | UC-03 | AC-RES-01 | **C** | Kiểm tra thêm trường hợp đặt nhiều bàn cùng lúc |
| TC-RES-02 | Đặt bàn | Không đặt bàn trong quá khứ | Nhân viên phục vụ đã đăng nhập | Thời gian đặt nhỏ hơn thời gian hiện tại (ví dụ: `-1h`) | 1. Mở Đặt bàn<br>2. Nhập thời gian trong quá khứ<br>3. Xác nhận | Hệ thống thông báo "Không thể đặt bàn trong quá khứ" | UC-03 | AC-RES-02 | **C** | Kiểm tra cả trường hợp thời gian = hiện tại (phải cho phép) |
| TC-RES-03 | Đặt bàn | Không đặt bàn trùng thời gian | Bàn `B001` đã có đặt bàn trong khung giờ `14:00-16:00` ngày hiện tại | Đặt bàn `B001` cùng khung giờ `14:30` | 1. Mở Đặt bàn<br>2. Chọn bàn `B001`<br>3. Nhập thời gian `14:30` (trùng với đặt bàn hiện có)<br>4. Xác nhận | Hệ thống thông báo "Bàn đã được đặt trong khung giờ này" | UC-03-A1 | AC-RES-03 | **C** | Cần làm rõ khung giờ trùng được tính thế nào (ví dụ: ±2h so với giờ đặt) |
| TC-RES-04 | Đặt bàn | Xác nhận đặt bàn làm bàn chuyển Đã đặt | Đặt bàn ở trạng thái Chờ xác nhận cho bàn `B001` | Mã đặt bàn đang Chờ xác nhận | 1. Mở danh sách đặt bàn<br>2. Chọn đặt bàn → Xác nhận<br>3. Kiểm tra trạng thái bàn `B001` | Đặt bàn chuyển sang Đã xác nhận; bàn `B001` chuyển từ Trống → Đã đặt | UC-03 (bước 8-10) | AC-RES-04 | **C** | |
| TC-RES-05 | Đặt bàn | Check-in khách làm bàn chuyển Đang phục vụ | Đặt bàn ở trạng thái Đã xác nhận cho bàn `B001` | Mã đặt bàn đã xác nhận | 1. Mở danh sách đặt bàn<br>2. Chọn đặt bàn → Check-in<br>3. Kiểm tra trạng thái bàn `B001` | Đặt bàn chuyển sang Khách đã đến; bàn `B001` chuyển từ Đã đặt → Đang phục vụ | UC-03 (bước 9) | AC-RES-05 | **C** | Đây là bước khởi tạo đơn hàng cho bàn |
| TC-RES-06 | Đặt bàn | Hủy đặt bàn/khách không đến đưa bàn về Trống | Đặt bàn ở trạng thái Đã xác nhận cho bàn `B001` | Hai kịch bản: (a) Hủy đặt bàn, (b) Quá giờ giữ bàn | 1a. Chọn đặt bàn → Hủy → kiểm tra bàn `B001`<br>1b. Chờ quá thời gian giữ bàn → kiểm tra trạng thái đặt bàn và bàn | Bàn `B001` chuyển về Trống; đặt bàn chuyển sang Đã hủy hoặc Khách không đến | UC-03-A3, UC-03-A4 | AC-RES-06 | **TB** | Thời gian giữ bàn mặc định 15 phút, cần xác nhận với khách hàng |
| TC-RES-07 | Đặt bàn | Hủy đặt bàn vẫn lưu lịch sử | Có đặt bàn đã bị hủy | Mã đặt bàn đã hủy | 1. Tra cứu lịch sử đặt bàn<br>2. Tìm kiếm theo tên khách/SĐT/khoảng thời gian | Đặt bàn đã hủy vẫn xuất hiện trong lịch sử với trạng thái Đã hủy, đầy đủ thông tin | UC-03 | AC-RES-07 | **TB** | |

---

### 3.D. Gọi món (TC-ORD)

| Mã TC | Module | Mục tiêu kiểm thử | Điều kiện trước | Dữ liệu kiểm thử | Các bước thực hiện | Kết quả mong đợi | Liên kết Use Case | Liên kết AC | Mức ưu tiên | Ghi chú |
|:-----:|:------:|-------------------|-----------------|-----------------|--------------------|------------------|:-----------------:|:-----------:|:----------:|---------|
| TC-ORD-01 | Gọi món | Chỉ gọi món cho bàn Đang phục vụ | Có các bàn ở trạng thái: Trống, Đã đặt, Đang phục vụ, Cần dọn, Bảo trì | Bàn ở mỗi trạng thái liệt kê | 1. Mở Gọi món<br>2. Lần lượt chọn từng bàn<br>3. Kiểm tra khả năng gọi món | Chỉ bàn Đang phục vụ mới cho phép gọi món. Các bàn khác hiển thị thông báo "Bàn chưa sẵn sàng để gọi món" | UC-04 (điều kiện trước) | AC-ORD-01 | **C** | |
| TC-ORD-02 | Gọi món | Chỉ chọn món Đang bán | Bàn đang Đang phục vụ; có món Đang bán, Hết món, Ngừng bán trong dữ liệu hệ thống | Bàn `B001` đang phục vụ | 1. Mở Gọi món cho bàn `B001`<br>2. Quan sát danh sách món | Danh sách món hiển thị chỉ gồm các món Đang bán. Món Hết món (nếu hiển thị) có nhãn "Hết món" và không chọn được | UC-04 (bước 2) | AC-ORD-02 | **C** | |
| TC-ORD-03 | Gọi món | Không chọn món Hết món/Ngừng bán | Bàn đang phục vụ; có món ở trạng thái Hết món và Ngừng bán | Món Hết món, Món Ngừng bán | 1. Mở Gọi món cho bàn<br>2. Thử thêm món Hết món vào đơn<br>3. Thử thêm món Ngừng bán vào đơn | Hệ thống không cho thêm, thông báo "Món hiện không khả dụng" | UC-04-A1 | AC-ORD-03 | **C** | |
| TC-ORD-04 | Gọi món | Thêm món, sửa số lượng, ghi chú thành công | Bàn `B001` đang phục vụ; thực đơn có món Đang bán | Món: `Cơm tấm` x 2, ghi chú "Không hành" | 1. Chọn bàn `B001`<br>2. Chọn món `Cơm tấm`, nhập số lượng `2`, ghi chú "Không hành"<br>3. Xác nhận thêm | Món hiển thị trong đơn hàng với đúng số lượng, ghi chú và đơn giá tại thời điểm gọi | UC-04 (bước 3-6) | AC-ORD-04 | **C** | Kiểm tra thêm: sửa số lượng sau khi đã thêm |
| TC-ORD-05 | Gọi món | Chỉ sửa/hủy món khi Chờ chế biến | Bàn `B001` có món `Cơm tấm` đang Chờ chế biến | Món Chờ chế biến; món Đang chế biến | 1. Sửa số lượng món Chờ chế biến → thành công<br>2. Hủy món Chờ chế biến → thành công<br>3. Thử sửa/hủy món Đang chế biến → thất bại | Món Chờ chế biến cho phép sửa/hủy; món từ Đang chế biến trở lên không cho phép | UC-04-A2, UC-04-A3 | AC-ORD-05 | **C** | |
| TC-ORD-06 | Gọi món | Món hủy không tính vào tổng tiền | Bàn `B001` có đơn hàng gồm: `Cơm tấm` 50.000đ (đã hủy), `Canh chua` 30.000đ | Đơn hàng hiện tại | 1. Xem đơn hàng của bàn `B001`<br>2. Kiểm tra tổng tiền tạm tính | Tổng tiền = 30.000đ (không bao gồm món đã hủy) | UC-04 | AC-ORD-06 | **C** | |
| TC-ORD-07 | Gọi món | Giá món giữ theo thời điểm gọi | Bàn `B001` gọi món `Cơm tấm` giá 50.000đ; sau đó Quản lý tăng giá lên 55.000đ | Giá cũ: 50.000đ, giá mới: 55.000đ | 1. Kiểm tra giá `Cơm tấm` trong đơn hàng cũ<br>2. Tạo đơn hàng mới cho bàn khác → gọi `Cơm tấm` | Đơn hàng cũ giữ giá 50.000đ; đơn hàng mới áp dụng giá 55.000đ | UC-04 | AC-ORD-07 | **TB** | Kiểm tra thêm với đơn hàng đã thanh toán |

---

### 3.E. Gửi món xuống bếp và cập nhật trạng thái món (TC-KIT)

| Mã TC | Module | Mục tiêu kiểm thử | Điều kiện trước | Dữ liệu kiểm thử | Các bước thực hiện | Kết quả mong đợi | Liên kết Use Case | Liên kết AC | Mức ưu tiên | Ghi chú |
|:-----:|:------:|-------------------|-----------------|-----------------|--------------------|------------------|:-----------------:|:-----------:|:----------:|---------|
| TC-KIT-01 | Bếp | Gửi món xuống bếp thành công | Bàn `B001` đang phục vụ, có đơn hàng với món `Cơm tấm` (Chưa gửi bếp) | Món `Cơm tấm` x 2 | 1. Nhân viên phục vụ gửi món<br>2. Kiểm tra màn hình bếp | Món `Cơm tấm` hiển thị trên màn hình bếp với trạng thái Chờ chế biến, kèm số bàn, số lượng, ghi chú và thời gian | UC-05 | AC-KIT-01 | **C** | |
| TC-KIT-02 | Bếp | Món hiển thị theo thứ tự thời gian gọi (FIFO) | Bàn `B001` gọi 3 món cách nhau 2 phút | Món 1: `Cơm tấm` (T+0), Món 2: `Canh chua` (T+2), Món 3: `Bò lúc lắc` (T+4) | 1. Gửi lần lượt 3 món<br>2. Quan sát màn hình bếp | Món hiển thị theo đúng thứ tự: `Cơm tấm` → `Canh chua` → `Bò lúc lắc` từ trên xuống dưới | UC-06 (bước 2) | AC-KIT-02 | **TB** | |
| TC-KIT-03 | Bếp | Màn hình bếp không hiển thị giá món | Có món đã gửi xuống bếp | Bất kỳ món nào đang Chờ chế biến | 1. Nhân viên bếp mở danh sách món<br>2. Quan sát các cột thông tin | Màn hình bếp chỉ hiển thị: tên món, số lượng, ghi chú, số bàn, thời gian. Không hiển thị đơn giá hoặc thành tiền | UC-05 | AC-KIT-03 | **TB** | |
| TC-KIT-04 | Bếp | Bếp chuyển Chờ chế biến → Đang chế biến | Có món đang Chờ chế biến trên màn hình bếp | Món `Cơm tấm` | 1. Nhân viên bếp chọn món<br>2. Nhấn "Bắt đầu chế biến" | Trạng thái món chuyển từ Chờ chế biến → Đang chế biến | UC-06 (bước 4) | AC-KIT-04 | **C** | |
| TC-KIT-05 | Bếp | Bếp chuyển Đang chế biến → Hoàn thành | Có món đang Đang chế biến | Món `Cơm tấm` | 1. Nhân viên bếp chọn món đang chế biến<br>2. Nhấn "Hoàn thành" | Trạng thái món chuyển từ Đang chế biến → Hoàn thành | UC-06 (bước 5) | AC-KIT-05 | **C** | |
| TC-KIT-06 | Bếp | Phục vụ chuyển Hoàn thành → Đã phục vụ | Có món Hoàn thành, chờ mang lên bàn | Món `Cơm tấm` | 1. Nhân viên phục vụ chọn món Hoàn thành<br>2. Nhấn "Đã phục vụ" | Trạng thái món chuyển từ Hoàn thành → Đã phục vụ | UC-06 | AC-KIT-06 | **C** | |
| TC-KIT-07 | Bếp | Không cho chuyển ngược trạng thái món | Có món ở các trạng thái Đang chế biến, Hoàn thành, Đã phục vụ | Các món tương ứng | 1. Thử chuyển Đang chế biến → Chờ chế biến<br>2. Thử chuyển Hoàn thành → Đang chế biến<br>3. Thử chuyển Đã phục vụ → Hoàn thành | Hệ thống từ chối, thông báo "Không thể chuyển về trạng thái trước đó" | UC-06-A3 | AC-KIT-07 | **C** | |

---

### 3.F. Thanh toán (TC-PAY)

| Mã TC | Module | Mục tiêu kiểm thử | Điều kiện trước | Dữ liệu kiểm thử | Các bước thực hiện | Kết quả mong đợi | Liên kết Use Case | Liên kết AC | Mức ưu tiên | Ghi chú |
|:-----:|:------:|-------------------|-----------------|-----------------|--------------------|------------------|:-----------------:|:-----------:|:----------:|---------|
| TC-PAY-01 | Thanh toán | Thu ngân xem hóa đơn của bàn có đơn hàng | Bàn `B001` đang phục vụ, có đơn hàng với các món đã gọi | Bàn `B001` | 1. Thu ngân đăng nhập<br>2. Chọn bàn `B001` → Xem hóa đơn | Hệ thống hiển thị hóa đơn chi tiết: danh sách món, số lượng, đơn giá, thành tiền, tổng tiền | UC-07 (bước 1-2) | AC-PAY-01 | **C** | |
| TC-PAY-02 | Thanh toán | Hệ thống tự động tính tổng tiền | Bàn `B001` có hóa đơn với `Cơm tấm` 50.000đ x 2, `Canh chua` 30.000đ x 1 | Tổng = 130.000đ | 1. Mở hóa đơn của bàn `B001`<br>2. Kiểm tra trường tổng tiền | Trường tổng tiền là chỉ đọc, hiển thị 130.000đ do hệ thống tính | UC-07 (bước 3) | AC-PAY-02 | **C** | |
| TC-PAY-03 | Thanh toán | Món hủy không tính vào hóa đơn | Bàn `B001` có `Cơm tấm` đã hủy, `Canh chua` chưa hủy | Hóa đơn: `Canh chua` 30.000đ | 1. Mở hóa đơn<br>2. Kiểm tra danh sách món và tổng tiền | Món đã hủy không xuất hiện trong hóa đơn; tổng tiền không bao gồm món hủy | UC-07 | AC-PAY-03 | **C** | |
| TC-PAY-04 | Thanh toán | Giảm giá không lớn hơn tổng tiền | Bàn `B001` có tổng tiền 130.000đ | Giảm giá: 200.000đ | 1. Mở hóa đơn bàn `B001`<br>2. Nhập giảm giá `200.000đ` | Hệ thống thông báo "Giảm giá không thể lớn hơn tổng tiền", không cho thanh toán | UC-07 (bước 5) | AC-PAY-04 | **C** | Kiểm tra thêm: giảm giá = tổng tiền (cho phép, hóa đơn = 0) |
| TC-PAY-05 | Thanh toán | VAT tính theo cấu hình | Bàn `B001` có tổng tiền 100.000đ; cấu hình VAT = 10% | VAT 10% | 1. Mở hóa đơn bàn `B001`<br>2. Kiểm tra dòng VAT<br>3. Kiểm tra tổng thanh toán | VAT = 10.000đ; tổng thanh toán = 110.000đ | UC-07 (bước 5) | AC-PAY-05 | **TB** | Kiểm tra thêm các mức VAT 0%, 5%, 8% |
| TC-PAY-06 | Thanh toán | Thanh toán thành công → đơn hàng chuyển Đã thanh toán | Bàn `B001` có hóa đơn chưa thanh toán | Thanh toán tiền mặt 130.000đ | 1. Thu ngân xác nhận thanh toán<br>2. Kiểm tra trạng thái đơn hàng | Đơn hàng chuyển từ Đang hoạt động → Đã thanh toán | UC-07 (bước 10) | AC-PAY-06 | **C** | |
| TC-PAY-07 | Thanh toán | Thanh toán thành công → bàn chuyển Cần dọn | Bàn `B001` vừa thanh toán xong | Như TC-PAY-06 | 1. Sau thanh toán, kiểm tra trạng thái bàn `B001` | Bàn chuyển từ Đang phục vụ → Cần dọn | UC-07 (bước 11) | AC-PAY-07 | **C** | |
| TC-PAY-08 | Thanh toán | Hóa đơn đã thanh toán chỉ xem, không sửa | Có hóa đơn đã thanh toán của bàn `B001` | Hóa đơn đã thanh toán | 1. Thu ngân mở hóa đơn đã thanh toán<br>2. Thử thêm/sửa/xóa món | Hệ thống ở chế độ chỉ đọc, mọi nút thao tác bị vô hiệu hóa hoặc ẩn | UC-07 | AC-PAY-08 | **C** | |
| TC-PAY-09 | Thanh toán | Chỉ Quản lý mới hủy được hóa đơn | Có hóa đơn đã thanh toán; có tài khoản Thu ngân và Quản lý | Hóa đơn đã thanh toán | 1. Thu ngân thử hủy hóa đơn → từ chối<br>2. Quản lý thử hủy hóa đơn → thành công | Thu ngân: không có quyền, nút hủy bị ẩn/vô hiệu. Quản lý: thực hiện được | UC-07-A3 | AC-PAY-09 | **C** | Kiểm tra thêm: Quản lý hủy hóa đơn chưa thanh toán |
| TC-PAY-10 | Thanh toán | Hủy hóa đơn bắt buộc ghi lý do và ghi nhật ký | Quản lý có quyền hủy hóa đơn | Hóa đơn đã thanh toán, lý do: "Khách trả món, đã hoàn tiền" | 1. Quản lý chọn hủy hóa đơn<br>2. Không nhập lý do → hệ thống yêu cầu<br>3. Nhập lý do → xác nhận hủy<br>4. Kiểm tra nhật ký hoạt động | Hệ thống bắt buộc nhập lý do (không cho phép để trống). Nhật ký ghi nhận: thời gian, người hủy, mã hóa đơn, lý do | UC-07 | AC-PAY-10 | **C** | ⚠️ Thao tác rủi ro cao, cần kiểm thử kỹ |

---

### 3.G. Quản lý thực đơn (TC-MNU)

| Mã TC | Module | Mục tiêu kiểm thử | Điều kiện trước | Dữ liệu kiểm thử | Các bước thực hiện | Kết quả mong đợi | Liên kết Use Case | Liên kết AC | Mức ưu tiên | Ghi chú |
|:-----:|:------:|-------------------|-----------------|-----------------|--------------------|------------------|:-----------------:|:-----------:|:----------:|---------|
| TC-MNU-01 | Thực đơn | Thêm/sửa món hợp lệ | Quản lý đã đăng nhập; chưa có món tên `Cơm tấm` | Tên: `Cơm tấm`, Danh mục: `Món chính`, Giá: `50.000đ` | 1. Vào Quản lý thực đơn → Thêm món<br>2. Nhập thông tin hợp lệ<br>3. Nhấn Lưu | Hệ thống lưu thành công, món xuất hiện trong danh sách thực đơn với trạng thái Đang bán | UC-08 | AC-MNU-01 | **C** | Kiểm tra thêm: sửa tên, giá, danh mục món |
| TC-MNU-02 | Thực đơn | Không tạo món trùng tên | Đã tồn tại món `Cơm tấm` | Tên món: `Cơm tấm` | 1. Vào Quản lý thực đơn → Thêm món<br>2. Nhập tên `Cơm tấm`<br>3. Nhấn Lưu | Hệ thống thông báo "Tên món đã tồn tại" và không lưu | UC-08-A1 | AC-MNU-02 | **C** | |
| TC-MNU-03 | Thực đơn | Giá món phải lớn hơn 0 | Quản lý đã đăng nhập | Giá = 0; Giá = -5.000đ | 1. Thêm món mới với giá = 0 → kiểm tra<br>2. Thêm món với giá = -5.000đ → kiểm tra | Hệ thống thông báo "Giá bán phải lớn hơn 0" và không lưu | UC-08 (bước 4-5) | AC-MNU-03 | **C** | |
| TC-MNU-04 | Thực đơn | Món Đang bán hiển thị trong gọi món | Có món Đang bán, Hết món và Ngừng bán | Danh sách món | 1. Mở Gọi món cho bàn bất kỳ<br>2. Quan sát danh sách | Món Đang bán xuất hiện đầy đủ; món Ngừng bán không xuất hiện; món Hết món có thể ẩn hoặc hiển thị nhãn "Hết món" | UC-08 (bước 7) | AC-MNU-04 | **C** | |
| TC-MNU-05 | Thực đơn | Món Hết món/Ngừng bán không gọi được | Có món Hết món hoặc Ngừng bán | Món Hết món, Món Ngừng bán | 1. Mở Gọi món cho bàn<br>2. Thử thêm món Hết món hoặc Ngừng bán | Hệ thống không cho phép thêm, thông báo món không khả dụng | UC-08-A3, UC-08-A4 | AC-MNU-05 | **C** | |
| TC-MNU-06 | Thực đơn | Món đã phát sinh đơn hàng không xóa cứng | Có món đã xuất hiện trong đơn hàng (ví dụ `Cơm tấm`) | Món `Cơm tấm` đã có trong lịch sử đơn hàng | 1. Vào Quản lý thực đơn<br>2. Chọn món `Cơm tấm` → Xóa | Hệ thống không cho xóa cứng (nút xóa bị vô hiệu hoặc thông báo "Không thể xóa món đã phát sinh đơn hàng"). Hướng dẫn chuyển trạng thái sang Ngừng bán | UC-08-A2 | AC-MNU-06 | **TB** | |

---

### 3.H. Quản lý kho nguyên liệu (TC-INV)

| Mã TC | Module | Mục tiêu kiểm thử | Điều kiện trước | Dữ liệu kiểm thử | Các bước thực hiện | Kết quả mong đợi | Liên kết Use Case | Liên kết AC | Mức ưu tiên | Ghi chú |
|:-----:|:------:|-------------------|-----------------|-----------------|--------------------|------------------|:-----------------:|:-----------:|:----------:|---------|
| TC-INV-01 | Kho | Nhập kho với số lượng hợp lệ | Nhân viên kho đã đăng nhập; nguyên liệu `Thịt heo` tồn 10kg | Nhập 20kg `Thịt heo` | 1. Vào Quản lý kho → Nhập kho<br>2. Chọn `Thịt heo`, nhập số lượng 20kg<br>3. Xác nhận | Tồn kho mới = 10 + 20 = 30kg. Lịch sử nhập kho ghi nhận giao dịch | UC-09 (bước 4-5) | AC-INV-01 | **C** | Kiểm tra thêm: nhập số lượng = 0 hoặc âm → bị từ chối |
| TC-INV-02 | Kho | Xuất kho với số lượng hợp lệ | Nguyên liệu `Thịt heo` tồn 30kg | Xuất 5kg `Thịt heo` | 1. Vào Quản lý kho → Xuất kho<br>2. Chọn `Thịt heo`, nhập số lượng 5kg<br>3. Xác nhận | Tồn kho mới = 30 - 5 = 25kg. Lịch sử xuất kho ghi nhận giao dịch | UC-09 | AC-INV-02 | **C** | Kiểm tra thêm: xuất số lượng = 0 hoặc âm → bị từ chối |
| TC-INV-03 | Kho | Không xuất vượt tồn kho | Nguyên liệu `Thịt heo` tồn 25kg | Xuất 30kg `Thịt heo` | 1. Vào Quản lý kho → Xuất kho<br>2. Chọn `Thịt heo`, nhập số lượng 30kg<br>3. Xác nhận | Hệ thống thông báo "Số lượng xuất vượt quá tồn kho" và không cho xuất | UC-09-A2 | AC-INV-03 | **C** | |
| TC-INV-04 | Kho | Tồn kho cập nhật sau nhập/xuất/kiểm kê | Nguyên liệu `Thịt heo` tồn đầu kỳ 25kg | Nhập 10kg, xuất 5kg, kiểm kê chênh lệch +2kg | 1. Nhập 10kg → kiểm tra tồn = 35kg<br>2. Xuất 5kg → kiểm tra tồn = 30kg<br>3. Kiểm kê, chênh lệch +2kg → kiểm tra tồn = 32kg | Mỗi thao tác cập nhật tồn kho chính xác | UC-09 (bước 6-7) | AC-INV-04 | **C** | |
| TC-INV-05 | Kho | Cảnh báo khi tồn kho ≤ mức tối thiểu | Nguyên liệu `Hành lá` có mức tối thiểu = 2kg, tồn hiện tại = 3kg | Xuất 2kg `Hành lá` | 1. Xuất 2kg `Hành lá`<br>2. Kiểm tra tồn kho sau xuất = 1kg<br>3. Quan sát cảnh báo | Hệ thống hiển thị cảnh báo tồn kho thấp trên màn hình kho khi tồn = 1kg ≤ 2kg (mức tối thiểu) | UC-09-A3 | AC-INV-05 | **TB** | Cảnh báo có thể là màu sắc, icon, thông báo |
| TC-INV-06 | Kho | Trạng thái nguyên liệu tự động suy diễn | Nguyên liệu `Hành lá`, mức tối thiểu = 2kg, tồn hiện tại = 10kg | Còn hàng (10kg) → Sắp hết (1.5kg) → Hết hàng (0kg) | 1. Kiểm tra trạng thái ban đầu (Còn hàng)<br>2. Xuất đến tồn = 1.5kg → kiểm tra trạng thái (Sắp hết)<br>3. Xuất đến tồn = 0kg → kiểm tra trạng thái (Hết hàng) | Trạng thái tự động chuyển: Còn hàng → Sắp hết → Hết hàng dựa trên tồn kho và mức tối thiểu | UC-09 | AC-INV-06 | **TB** | Trạng thái do hệ thống tự động suy diễn, không gán thủ công |

---

### 3.I. Báo cáo (TC-RPT)

| Mã TC | Module | Mục tiêu kiểm thử | Điều kiện trước | Dữ liệu kiểm thử | Các bước thực hiện | Kết quả mong đợi | Liên kết Use Case | Liên kết AC | Mức ưu tiên | Ghi chú |
|:-----:|:------:|-------------------|-----------------|-----------------|--------------------|------------------|:-----------------:|:-----------:|:----------:|---------|
| TC-RPT-01 | Báo cáo | Xem báo cáo doanh thu theo khoảng thời gian | Có ít nhất 5 hóa đơn đã thanh toán trong tháng này; Quản lý đã đăng nhập | Khoảng thời gian: `01/06/2026 - 12/06/2026` | 1. Vào Báo cáo doanh thu<br>2. Chọn khoảng thời gian<br>3. Nhấn Xem | Hệ thống hiển thị: tổng doanh thu, số hóa đơn, tổng tiền hàng, tổng giảm giá, tổng VAT, doanh thu thuần trong khoảng thời gian đã chọn | UC-10 | AC-RPT-01 | **C** | |
| TC-RPT-02 | Báo cáo | Báo cáo chỉ tính hóa đơn đã thanh toán | Trong ngày có: 2 hóa đơn Đã thanh toán (tổng 500.000đ), 1 hóa đơn Chưa thanh toán (200.000đ), 1 hóa đơn Đã hủy | Ngày hiện tại | 1. Xem báo cáo trong ngày<br>2. Đối chiếu số liệu | Báo cáo chỉ tính 2 hóa đơn Đã thanh toán (500.000đ). Hóa đơn Chưa thanh toán và Đã hủy không được tính | UC-10 (bước 5-6) | AC-RPT-02 | **C** | |
| TC-RPT-03 | Báo cáo | Hóa đơn hủy không tính doanh thu | Trong tháng có 1 hóa đơn bị hủy (đã thanh toán rồi hủy) | Tháng hiện tại | 1. Xem báo cáo doanh thu tháng<br>2. Kiểm tra số liệu | Doanh thu không bao gồm hóa đơn đã hủy | UC-10 | AC-RPT-03 | **TB** | Nếu có báo cáo hóa đơn hủy riêng, kiểm tra thêm |
| TC-RPT-04 | Báo cáo | Báo cáo món bán chạy không tính món hủy | Có dữ liệu: `Cơm tấm` (bán 10, hủy 2), `Canh chua` (bán 5, hủy 0) | Khoảng thời gian phù hợp | 1. Xem báo cáo món bán chạy<br>2. Kiểm tra số lượng từng món | Số lượng món `Cơm tấm` = 10 (không tính 2 món hủy); `Canh chua` = 5 | UC-10 | AC-RPT-04 | **TB** | |
| TC-RPT-05 | Báo cáo | Dữ liệu xuất Excel/PDF khớp màn hình | Có báo cáo doanh thu đang hiển thị | Cùng khoảng thời gian | 1. Xem báo cáo trên màn hình, ghi nhận số liệu<br>2. Xuất Excel → so sánh số liệu<br>3. Xuất PDF → so sánh số liệu | Các chỉ số trên file Excel và PDF khớp chính xác với dữ liệu hiển thị trên màn hình | UC-10-A3 | AC-RPT-05 | **TB** | Sai lệch làm tròn số cần được ghi nhận |
| TC-RPT-06 | Báo cáo | Thu ngân không xem báo cáo doanh thu nếu không được phân quyền | Tài khoản Thu ngân không có quyền xem báo cáo doanh thu | Tài khoản Thu ngân | 1. Đăng nhập bằng tài khoản Thu ngân<br>2. Quan sát menu | Menu Báo cáo doanh thu không hiển thị hoặc bị vô hiệu hóa | UC-10-A2 | AC-RPT-06 | **C** | |

---

### 3.J. Quản lý nhân viên và tài khoản (TC-EMP)

| Mã TC | Module | Mục tiêu kiểm thử | Điều kiện trước | Dữ liệu kiểm thử | Các bước thực hiện | Kết quả mong đợi | Liên kết Use Case | Liên kết AC | Mức ưu tiên | Ghi chú |
|:-----:|:------:|-------------------|-----------------|-----------------|--------------------|------------------|:-----------------:|:-----------:|:----------:|---------|
| TC-EMP-01 | Nhân viên | Thêm nhân viên hợp lệ | Quản lý đã đăng nhập; chưa có nhân viên mã `NV001` | Họ tên: `Nguyễn Văn A`, SĐT: `0909123456`, Chức vụ: `Phục vụ` | 1. Vào Quản lý nhân viên → Thêm<br>2. Nhập thông tin hợp lệ<br>3. Nhấn Lưu | Hệ thống lưu thành công, nhân viên hiển thị trong danh sách | UC-11 | AC-EMP-01 | **C** | Kiểm tra thêm: tạo tài khoản đăng nhập kèm nhân viên |
| TC-EMP-02 | Nhân viên | Không tạo tài khoản trùng tên đăng nhập | Đã tồn tại tài khoản `admin` | Tên đăng nhập: `admin` | 1. Vào Quản lý tài khoản → Thêm<br>2. Nhập tên đăng nhập `admin`<br>3. Nhấn Lưu | Hệ thống thông báo "Tên đăng nhập đã tồn tại" và không lưu | UC-11-A1 | AC-EMP-02 | **C** | |
| TC-EMP-03 | Nhân viên | Sửa thông tin nhân viên | Có nhân viên `Nguyễn Văn A`, SĐT cũ `0909123456` | SĐT mới: `0909987654` | 1. Chọn nhân viên → Sửa<br>2. Cập nhật SĐT<br>3. Nhấn Lưu | Thông tin nhân viên được cập nhật, hiển thị SĐT mới | UC-11 | AC-EMP-03 | **TB** | Kiểm tra thêm: sửa chức vụ, trạng thái |
| TC-EMP-04 | Nhân viên | Nhân viên nghỉ việc không xóa cứng | Có nhân viên `Nguyễn Văn A` đang hoạt động, có lịch sử thao tác | Chuyển trạng thái nhân viên sang Ngừng hoạt động | 1. Chọn nhân viên → Ngừng hoạt động / Khóa tài khoản<br>2. Kiểm tra nhân viên còn trong danh sách (với trạng thái mới)<br>3. Thử đăng nhập bằng tài khoản nhân viên này | Nhân viên vẫn hiển thị trong danh sách với trạng thái Ngừng hoạt động. Tài khoản không đăng nhập được. Lịch sử thao tác cũ vẫn được giữ | UC-11-A3 | AC-EMP-04 | **TB** | |
| TC-EMP-05 | Nhân viên | Phân quyền tài khoản theo vai trò | Có tài khoản chưa được phân quyền | Gán vai trò `Thu ngân` cho tài khoản | 1. Vào Quản lý tài khoản<br>2. Chọn tài khoản → Phân quyền<br>3. Gán vai trò `Thu ngân`<br>4. Đăng nhập bằng tài khoản đó | Tài khoản chỉ thấy chức năng của Thu ngân, không thấy chức năng Quản lý/Kho/Bếp | UC-11 (bước 5-6) | AC-EMP-05 | **C** | |
| TC-EMP-06 | Nhân viên | Người không có quyền không quản lý tài khoản | Tài khoản Phục vụ không có quyền quản lý nhân viên | Tài khoản Phục vụ | 1. Đăng nhập tài khoản Phục vụ<br>2. Thử truy cập Quản lý nhân viên/tài khoản | Hệ thống từ chối, menu không hiển thị hoặc thông báo không có quyền | UC-11-A2 | AC-EMP-06 | **C** | |

---

## 4. Test case kiểm tra luồng chuyển trạng thái

Phần này kiểm tra các luồng chuyển trạng thái xuyên suốt giữa các thực thể.
Đây là các test case tích hợp, kiểm tra sự phối hợp giữa nhiều module.

### 4.1. Bàn — Luồng xoay vòng đầy đủ

| Mã TC | Luồng kiểm thử | Điều kiện trước | Các bước thực hiện | Kết quả mong đợi | Liên kết trạng thái | Mức ưu tiên |
|:-----:|----------------|-----------------|--------------------|------------------|:-------------------:|:----------:|
| TC-STT-01 | Trống → Đã đặt → Đang phục vụ → Cần dọn → Trống | Có bàn Trống `B001`; có tài khoản Phục vụ, Thu ngân | 1. Tạo và xác nhận đặt bàn cho `B001` → kiểm tra TB-DD<br>2. Check-in khách → kiểm tra TB-DPV<br>3. Gọi món, thanh toán → kiểm tra TB-CD<br>4. Dọn bàn → kiểm tra TB-TR | Bàn chuyển qua đủ 4 trạng thái, đúng thứ tự, không bỏ qua bước nào | TB-TR → TB-DD → TB-DPV → TB-CD → TB-TR | **C** |

### 4.2. Bàn — Chuyển đổi không hợp lệ

| Mã TC | Luồng kiểm thử | Điều kiện trước | Các bước thực hiện | Kết quả mong đợi | Liên kết trạng thái | Mức ưu tiên |
|:-----:|----------------|-----------------|--------------------|------------------|:-------------------:|:----------:|
| TC-STT-02 | Không chuyển Đang phục vụ → Trống (bỏ qua dọn) | Bàn `B001` đang phục vụ | 1. Thử thao tác chuyển trực tiếp Đang phục vụ → Trống | Hệ thống từ chối, yêu cầu dọn bàn trước | 🚫 TB-DPV → TB-TR | **C** |
| TC-STT-03 | Không gọi món cho bàn Cần dọn hoặc Bảo trì | Bàn `B001` Cần dọn, bàn `B002` Bảo trì | 1. Thử gọi món cho bàn Cần dọn<br>2. Thử gọi món cho bàn Bảo trì | Hệ thống từ chối, thông báo bàn chưa sẵn sàng | 🚫 TB-CD → gọi món, 🚫 TB-BT → gọi món | **C** |

### 4.3. Đặt bàn — Luồng đầy đủ

| Mã TC | Luồng kiểm thử | Điều kiện trước | Các bước thực hiện | Kết quả mong đợi | Liên kết trạng thái | Mức ưu tiên |
|:-----:|----------------|-----------------|--------------------|------------------|:-------------------:|:----------:|
| TC-STT-04 | Chờ xác nhận → Đã xác nhận → Khách đã đến | Có bàn Trống; Phục vụ đã đăng nhập | 1. Tạo đặt bàn → kiểm tra DB-CXN<br>2. Xác nhận đặt bàn → kiểm tra DB-DXN + bàn TB-DD<br>3. Check-in khách → kiểm tra DB-KDN + bàn TB-DPV | Đặt bàn chuyển 3 bước; bàn đồng bộ: Trống → Đã đặt → Đang phục vụ | DB-CXN → DB-DXN → DB-KDN + TB-TR → TB-DD → TB-DPV | **C** |

### 4.4. Đặt bàn — Hủy và không đến

| Mã TC | Luồng kiểm thử | Điều kiện trước | Các bước thực hiện | Kết quả mong đợi | Liên kết trạng thái | Mức ưu tiên |
|:-----:|----------------|-----------------|--------------------|------------------|:-------------------:|:----------:|
| TC-STT-05 | Đã xác nhận → Hủy đặt bàn | Có đặt bàn DB-DXN cho bàn `B001` | 1. Hủy đặt bàn (nhập lý do)<br>2. Kiểm tra trạng thái đặt bàn và bàn | Đặt bàn → DB-DH; bàn → TB-TR | DB-DXN → DB-DH + TB-DD → TB-TR | **C** |
| TC-STT-06 | Đã xác nhận → Khách không đến (quá giờ) | Có đặt bàn DB-DXN, cấu hình giữ bàn 15 phút | 1. Chờ quá 15 phút từ giờ đặt<br>2. Kiểm tra trạng thái (hệ thống tự động hoặc nhân viên cập nhật) | Đặt bàn → DB-KKD; bàn → TB-TR | DB-DXN → DB-KKD + TB-DD → TB-TR | **TB** | Thời gian giữ bàn cần xác nhận với khách hàng |

### 4.5. Món — Luồng chế biến đầy đủ

| Mã TC | Luồng kiểm thử | Điều kiện trước | Các bước thực hiện | Kết quả mong đợi | Liên kết trạng thái | Mức ưu tiên |
|:-----:|----------------|-----------------|--------------------|------------------|:-------------------:|:----------:|
| TC-STT-07 | Chờ chế biến → Đang chế biến → Hoàn thành → Đã phục vụ | Bàn `B001` có món `Cơm tấm` ở MM-CCB | 1. Bếp bắt đầu chế biến → MM-DCB<br>2. Bếp hoàn thành → MM-HT<br>3. Phục vụ mang lên bàn → MM-DPV | Món chuyển qua đủ 4 trạng thái đúng thứ tự | MM-CCB → MM-DCB → MM-HT → MM-DPV | **C** |

### 4.6. Món — Hủy và chuyển ngược

| Mã TC | Luồng kiểm thử | Điều kiện trước | Các bước thực hiện | Kết quả mong đợi | Liên kết trạng thái | Mức ưu tiên |
|:-----:|----------------|-----------------|--------------------|------------------|:-------------------:|:----------:|
| TC-STT-08 | Chờ chế biến → Đã hủy | Bàn `B001` có món `Cơm tấm` ở MM-CCB | 1. Phục vụ hủy món (khách yêu cầu)<br>2. Kiểm tra trạng thái món | Món → MM-DH; món không tính tiền | MM-CCB → MM-DH | **C** |
| TC-STT-09 | Không chuyển ngược trạng thái món | Món ở MM-DCB, MM-HT, MM-DPV | 1. Thử chuyển MM-DCB → MM-CCB<br>2. Thử chuyển MM-HT → MM-DCB<br>3. Thử chuyển MM-DPV → MM-HT | Cả 3 đều bị từ chối | 🚫 Các chuyển đổi ngược | **C** |

### 4.7. Đơn hàng và thanh toán

| Mã TC | Luồng kiểm thử | Điều kiện trước | Các bước thực hiện | Kết quả mong đợi | Liên kết trạng thái | Mức ưu tiên |
|:-----:|----------------|-----------------|--------------------|------------------|:-------------------:|:----------:|
| TC-STT-10 | Đang hoạt động → Đã thanh toán (thanh toán thành công) | Bàn `B001` có đơn hàng DH-HĐ, tổng tiền 130.000đ | 1. Thanh toán thành công<br>2. Kiểm tra đơn hàng → DH-DTT<br>3. Kiểm tra bàn → TB-CD<br>4. Kiểm tra thanh toán → TT-DTT | Đồng bộ 3 thực thể: đơn hàng, bàn, thanh toán | DH-HĐ → DH-DTT + TB-DPV → TB-CD + TT-CTT → TT-DTT | **C** |
| TC-STT-11 | Chưa thanh toán → Hủy (trước khi thanh toán) | Bàn `B001` có đơn hàng DH-HĐ, chưa thanh toán | 1. Quản lý hủy hóa đơn (nhập lý do)<br>2. Kiểm tra thanh toán → TT-DH<br>3. Kiểm tra đơn hàng → DH-HĐ (giữ nguyên, không hủy) | Hóa đơn chuyển TT-DH (Đã hủy); đơn hàng giữ nguyên DH-HĐ (Đang hoạt động); bàn vẫn ở trạng thái Đang phục vụ | TT-CTT → TT-DH | **TB** | Cần xác nhận với khách hàng: hủy hóa đơn chưa thanh toán có được phép không |
| TC-STT-12 | Đã thanh toán → Hủy hóa đơn (quản lý) | Bàn `B001` có hóa đơn TT-DTT | 1. Quản lý hủy hóa đơn (bắt buộc nhập lý do)<br>2. Kiểm tra thanh toán → TT-DH<br>3. Kiểm tra nhật ký hoạt động | Hóa đơn hủy, ghi nhật ký đầy đủ. Có cơ chế hoàn tiền (nếu có) | TT-DTT → TT-DH + ghi nhật ký hoạt động | **C** | ⚠️ Thao tác rủi ro cao |

### 4.8. Nguyên liệu — Trạng thái suy diễn

| Mã TC | Luồng kiểm thử | Điều kiện trước | Các bước thực hiện | Kết quả mong đợi | Liên kết trạng thái | Mức ưu tiên |
|:-----:|----------------|-----------------|--------------------|------------------|:-------------------:|:----------:|
| TC-STT-13 | Còn hàng → Sắp hết → Hết hàng (do xuất kho) | Nguyên liệu `Hành lá`: mức tối thiểu = 2kg, tồn = 10kg | 1. (Đang NL-CON) Xuất đến tồn = 1.5kg → kiểm tra NL-SH<br>2. Xuất đến tồn = 0kg → kiểm tra NL-HET | Trạng thái tự động chuyển khi tồn kho thay đổi | NL-CON → NL-SH → NL-HET | **TB** |
| TC-STT-14 | Hết hàng → Còn hàng (do nhập kho) | Nguyên liệu `Hành lá`: tồn = 0kg (NL-HET) | 1. Nhập 5kg → kiểm tra trạng thái | Trạng thái tự động chuyển NL-HET → NL-CON (vì 5 > 2) | NL-HET → NL-CON | **TB** |

---

## 5. Test case ưu tiên cho demo

Dưới đây là 10 test case được đề xuất để demo cho khách hàng.
Các test case này bao phủ luồng nghiệp vụ chính từ đăng nhập → quản lý bàn → đặt bàn →
gọi món → bếp → thanh toán → báo cáo.

| STT | Mã TC | Tên test case | Vai trò thực hiện | Luồng demo |
|:---:|:-----:|---------------|:------------------:|------------|
| 1 | TC-AUTH-01 | Đăng nhập theo vai trò | Quản lý, Phục vụ, Thu ngân, Bếp | Đăng nhập lần lượt 4 vai trò, quan sát sự khác biệt về giao diện và chức năng |
| 2 | TC-TBL-01 + TC-TBL-04 | Quản lý bàn và trạng thái | Quản lý | Thêm bàn mới → kiểm tra trạng thái Trống → chuyển qua các trạng thái |
| 3 | TC-RES-01 + TC-RES-04 | Tạo đặt bàn | Phục vụ | Tạo đặt bàn → xác nhận → bàn chuyển Đã đặt |
| 4 | TC-RES-05 | Check-in khách | Phục vụ | Khách đến → check-in → bàn chuyển Đang phục vụ |
| 5 | TC-ORD-01 + TC-ORD-04 | Gọi món | Phục vụ | Chọn bàn → chọn món → thêm số lượng, ghi chú → xác nhận |
| 6 | TC-KIT-01 | Gửi món xuống bếp | Phục vụ + Bếp | Phục vụ gửi món → màn hình bếp hiển thị món Chờ chế biến |
| 7 | TC-KIT-04 → TC-KIT-06 | Bếp cập nhật trạng thái món | Bếp + Phục vụ | Bếp bắt đầu → hoàn thành → Phục vụ xác nhận đã phục vụ |
| 8 | TC-PAY-01 → TC-PAY-06 → TC-PAY-07 | Thanh toán hóa đơn | Thu ngân | Xem hóa đơn → kiểm tra tổng tiền → thanh toán → kiểm tra đơn hàng và bàn |
| 9 | TC-PAY-07 (tiếp) | Bàn chuyển Cần dọn sau thanh toán | Thu ngân + Phục vụ | Quan sát bàn chuyển Đang phục vụ → Cần dọn; dọn bàn → Trống |
| 10 | TC-RPT-01 + TC-RPT-02 | Báo cáo doanh thu | Quản lý | Chọn khoảng thời gian → xem báo cáo → kiểm tra số liệu chỉ tính hóa đơn đã thanh toán |

### Gợi ý kịch bản demo hoàn chỉnh (ghép 10 test case)

1. **Quản lý** đăng nhập → thêm bàn `B001` (2 ghế), `B002` (4 ghế)
2. **Phục vụ** đăng nhập → tạo đặt bàn cho khách `Nguyễn Văn A` tại bàn `B001`, giờ `+15 phút`
3. **Phục vụ** xác nhận đặt bàn → bàn `B001` chuyển Đã đặt
4. **Phục vụ** check-in khách → bàn `B001` chuyển Đang phục vụ
5. **Phục vụ** gọi món: `Cơm tấm` x 2, `Canh chua` x 1 → gửi xuống bếp
6. **Bếp** đăng nhập → thấy món Chờ chế biến → bắt đầu → hoàn thành
7. **Phục vụ** xác nhận Đã phục vụ
8. **Thu ngân** đăng nhập → xem hóa đơn bàn `B001` → kiểm tra tổng tiền → thanh toán
9. Kiểm tra bàn `B001` chuyển Cần dọn → **Phục vụ** dọn bàn → bàn Trống
10. **Quản lý** đăng nhập → xem báo cáo doanh thu trong ngày → kiểm tra số liệu

---

## 6. Thống kê và ma trận bao phủ

### 6.1. Thống kê số lượng test case

| Nhóm | Mã prefix | Số TC từ AC | Số TC trạng thái | Tổng |
|:----:|:---------:|:----------:|:----------------:|:----:|
| Đăng nhập và phân quyền | AUTH | 5 | — | 5 |
| Quản lý bàn | TBL | 5 | — | 5 |
| Đặt bàn | RES | 7 | — | 7 |
| Gọi món | ORD | 7 | — | 7 |
| Gửi món xuống bếp và cập nhật trạng thái món | KIT | 7 | — | 7 |
| Thanh toán | PAY | 10 | — | 10 |
| Quản lý thực đơn | MNU | 6 | — | 6 |
| Quản lý kho nguyên liệu | INV | 6 | — | 6 |
| Báo cáo | RPT | 6 | — | 6 |
| Quản lý nhân viên và tài khoản | EMP | 6 | — | 6 |
| Trạng thái (State Transition) | STT | — | 14 | 14 |
| **Tổng cộng** | **11 nhóm** | **65** | **14** | **79** |

### 6.2. Phân bố mức ưu tiên

| Mức ưu tiên | Số lượng | Tỷ lệ |
|:-----------:|:--------:|:-----:|
| Cao (C) | 60 | 75.9% |
| Trung bình (TB) | 19 | 24.1% |
| Thấp (TH) | 0 | 0% |
| **Tổng** | **79** | **100%** |

> **Ghi chú:** Test case mức Thấp chưa được xác định ở giai đoạn này. Có thể bổ sung
> sau khi có kết quả kiểm thử lần đầu.

### 6.3. Ma trận bao phủ Acceptance Criteria

Tổng số **65 Acceptance Criteria** được bao phủ bởi **65 test case nghiệp vụ**
(tỷ lệ 1:1). Các test case trạng thái (TC-STT-*) bổ sung thêm để kiểm tra luồng
xuyên module và tích hợp.

### 6.4. Ma trận bao phủ Use Case

| Use Case | Số TC liên quan | Các mã TC |
|----------|:---------------:|-----------|
| UC-01 — Đăng nhập | 5 | TC-AUTH-01 → TC-AUTH-05 |
| UC-02 — Quản lý bàn | 5 | TC-TBL-01 → TC-TBL-05 |
| UC-03 — Đặt bàn | 7 | TC-RES-01 → TC-RES-07 |
| UC-04 — Gọi món | 7 | TC-ORD-01 → TC-ORD-07 |
| UC-05 — Gửi món xuống bếp | 3 | TC-KIT-01 → TC-KIT-03 |
| UC-06 — Cập nhật trạng thái chế biến | 4 | TC-KIT-04 → TC-KIT-07 |
| UC-07 — Thanh toán hóa đơn | 10 | TC-PAY-01 → TC-PAY-10 |
| UC-08 — Quản lý thực đơn | 6 | TC-MNU-01 → TC-MNU-06 |
| UC-09 — Quản lý kho nguyên liệu | 6 | TC-INV-01 → TC-INV-06 |
| UC-10 — Xem báo cáo doanh thu | 6 | TC-RPT-01 → TC-RPT-06 |
| UC-11 — Quản lý nhân viên và tài khoản | 6 | TC-EMP-01 → TC-EMP-06 |

---

## 7. Rủi ro kiểm thử cần lưu ý

### 7.1. Rủi ro cao

| STT | Rủi ro | Mô tả | Test case liên quan | Đề xuất giảm thiểu |
|:---:|--------|-------|:-------------------:|--------------------|
| 1 | **Đồng bộ trạng thái bàn - đặt bàn - đơn hàng - thanh toán** | Sai sót khi một thao tác kéo theo thay đổi nhiều thực thể (ví dụ: thanh toán cập nhật đơn hàng + bàn + thanh toán) | TC-STT-01, TC-STT-04, TC-STT-10 | Kiểm thử tích hợp xuyên module; kiểm tra từng thực thể sau mỗi thao tác |
| 2 | **Chuyển trạng thái không hợp lệ** | Người dùng có thể thao tác chuyển trạng thái sai (ví dụ: bỏ qua bước dọn bàn) | TC-STT-02, TC-STT-03, TC-STT-09 | Ràng buộc cứng ở phần xử lý hệ thống; không chỉ dựa vào giao diện |
| 3 | **Hủy hóa đơn ảnh hưởng tài chính** | Hủy hóa đơn đã thanh toán có thể gây sai lệch báo cáo doanh thu nếu không xử lý đúng | TC-PAY-10, TC-STT-12, TC-RPT-03 | Bắt buộc ghi lý do + nhật ký; có báo cáo riêng hóa đơn hủy |
| 4 | **Phân quyền không chặt** | Người dùng có thể thấy hoặc thao tác chức năng ngoài phạm vi | TC-AUTH-03, TC-AUTH-04, TC-RPT-06, TC-EMP-06 | Kiểm tra cả giao diện lẫn thao tác truy cập trực tiếp; không chỉ dựa vào ẩn nút trên giao diện |
| 5 | **Giá món thay đổi sau khi gọi** | Nếu giá món thay đổi không đúng thời điểm, đơn hàng cũ có thể bị ảnh hưởng | TC-ORD-07 | Lưu giá tại thời điểm gọi món (snapshot), không tra cứu giá hiện tại |

### 7.2. Rủi ro trung bình

| STT | Rủi ro | Mô tả | Test case liên quan |
|:---:|--------|-------|:-------------------:|
| 6 | **Xử lý đặt bàn trùng thời gian** | Khung giờ trùng chưa được định nghĩa rõ (có thể gây tranh chấp bàn) | TC-RES-03 |
| 7 | **Cảnh báo tồn kho thấp bị bỏ qua** | Cảnh báo tồn kho không rõ ràng hoặc dễ bị bỏ qua | TC-INV-05 |
| 8 | **Xuất Excel/PDF sai lệch số liệu** | Làm tròn số hoặc sai font có thể làm lệch số liệu | TC-RPT-05 |
| 9 | **Không có test tự động cho luồng tích hợp** | Nếu chỉ kiểm thử thủ công, khó phát hiện hồi quy khi sửa triển khai | Tất cả TC luồng trạng thái |
| 10 | **Dữ liệu kiểm thử chưa đầy đủ** | Thiếu dữ liệu biên (ví dụ: số lượng khách 0, thời gian đặt quá xa) | Nhiều TC |

### 7.3. Điểm cần xác nhận với khách hàng trước khi kiểm thử

1. **Thời gian giữ bàn mặc định:** 15 phút có phù hợp? Có cần cấu hình linh hoạt?
2. **Giới hạn giảm giá tối đa:** Có % giới hạn cho thu ngân không? Có cần quản lý phê duyệt?
3. **Món chưa chế biến khi thanh toán:** Xử lý thế nào? Hủy, cho mang về, hay chuyển đơn?
4. **Hủy hóa đơn có cần xác thực lại?** Nhập mật khẩu / PIN?
5. **Báo cáo hóa đơn hủy riêng:** Có cần báo cáo riêng để quản lý theo dõi?

---

## 8. Kết luận

- Tài liệu đã xây dựng **79 test case** từ **65 Acceptance Criteria** và **7 nhóm trạng thái**.
- Có **60 test case mức ưu tiên Cao** (75.9%) cần kiểm thử trước khi bàn giao.
- Có **10 test case ưu tiên demo** bao phủ luồng nghiệp vụ chính.
- Nhóm rủi ro cao nhất là: **thanh toán, trạng thái bàn, trạng thái món** và **phân quyền**.
- Kiến nghị: thực hiện kiểm thử tích hợp cho các luồng chuyển
  trạng thái xuyên module trước, sau đó kiểm thử đơn vị cho từng module riêng lẻ.

---

*Tài liệu này là căn cứ để thực hiện kiểm thử nghiệp vụ (Business Testing) và kiểm thử nghiệm thu (UAT).*
*Mỗi test case cần được cập nhật kết quả Pass/Fail sau khi kiểm thử.*
*Các test case Fail cần ghi rõ môi trường, dữ liệu đầu vào, kết quả thực tế và bước tái hiện.*
