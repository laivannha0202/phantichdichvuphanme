# Use Case chi tiết — Hệ thống quản lý nhà hàng

## 1. Mục đích tài liệu

Tài liệu này mô tả chi tiết các Use Case chính của hệ thống quản lý nhà hàng.
Mỗi Use Case trình bày actor thực hiện, mục tiêu, điều kiện trước, luồng chính, luồng thay thế, ngoại lệ và kết quả sau khi hoàn thành.

Tài liệu này dùng làm cơ sở cho:

- Thiết kế Use Case Diagram.
- Thiết kế giao diện.
- Viết tài liệu đặc tả yêu cầu phần mềm.
- Làm rõ nghiệp vụ trước khi chuyển sang thiết kế kỹ thuật hoặc lập trình.

---

## 2. Danh sách Use Case

| Mã Use Case | Tên Use Case                     | Actor chính                         |
|-------------|----------------------------------|--------------------------------------|
| UC-01       | Đăng nhập hệ thống               | Tất cả nhân viên                    |
| UC-02       | Quản lý bàn                      | Quản lý nhà hàng                    |
| UC-03       | Đặt bàn                          | Nhân viên phục vụ                   |
| UC-04       | Gọi món                          | Nhân viên phục vụ                   |
| UC-05       | Gửi món xuống bếp                | Nhân viên phục vụ                    |
| UC-06       | Cập nhật trạng thái chế biến món | Nhân viên bếp                       |
| UC-07       | Thanh toán hóa đơn               | Thu ngân                            |
| UC-08       | Quản lý thực đơn                 | Quản lý nhà hàng                    |
| UC-09       | Quản lý kho nguyên liệu          | Nhân viên kho                       |
| UC-10       | Xem báo cáo doanh thu            | Quản lý nhà hàng                    |
| UC-11       | Quản lý nhân viên và tài khoản   | Quản lý nhà hàng, Quản trị hệ thống |

---

## UC-01. Đăng nhập hệ thống

### 1. Thông tin chung

| Thuộc tính   | Nội dung                                                                              |
|--------------|---------------------------------------------------------------------------------------|
| Mã Use Case  | UC-01                                                                                 |
| Tên Use Case | Đăng nhập hệ thống                                                                    |
| Actor chính  | Quản lý, Nhân viên phục vụ, Thu ngân, Nhân viên bếp, Nhân viên kho, Quản trị hệ thống |
| Mục tiêu     | Cho phép người dùng truy cập hệ thống theo đúng vai trò được phân quyền               |
| Mức ưu tiên  | Must Have                                                                             |

### 2. Điều kiện

| Loại điều kiện  | Nội dung                                                                  |
|-----------------|---------------------------------------------------------------------------|
| Điều kiện trước | Người dùng đã có tài khoản hợp lệ trong hệ thống                          |
| Điều kiện sau   | Người dùng đăng nhập thành công và được chuyển đến giao diện đúng vai trò |
| Dữ liệu đầu vào | Tên đăng nhập, mật khẩu                                                   |
| Dữ liệu đầu ra  | Phiên đăng nhập, vai trò người dùng, màn hình chức năng tương ứng         |

### 3. Luồng chính

1. Người dùng mở màn hình đăng nhập.
2. Người dùng nhập tên đăng nhập và mật khẩu.
3. Hệ thống kiểm tra thông tin đăng nhập.
4. Hệ thống xác định vai trò của người dùng.
5. Hệ thống chuyển người dùng đến màn hình chức năng tương ứng.
6. Use Case kết thúc.

### 4. Luồng thay thế

| Mã       | Tình huống                    | Cách xử lý                                             |
|----------|-------------------------------|--------------------------------------------------------|
| UC-01-A1 | Người dùng nhập sai mật khẩu  | Hệ thống thông báo thông tin đăng nhập không hợp lệ    |
| UC-01-A2 | Tài khoản bị khóa             | Hệ thống thông báo tài khoản không được phép đăng nhập |
| UC-01-A3 | Người dùng bỏ trống thông tin | Hệ thống yêu cầu nhập đầy đủ tên đăng nhập và mật khẩu |

### 5. Ghi chú nghiệp vụ

- Người dùng chỉ được truy cập các chức năng phù hợp với vai trò.
- Hệ thống không hiển thị chức năng mà người dùng không có quyền sử dụng.
- Mọi thao tác quan trọng sau khi đăng nhập cần được ghi nhận người thực hiện.

---

## UC-02. Quản lý bàn

### 1. Thông tin chung

| Thuộc tính   | Nội dung                                                    |
|--------------|-------------------------------------------------------------|
| Mã Use Case  | UC-02                                                       |
| Tên Use Case | Quản lý bàn                                                 |
| Actor chính  | Quản lý nhà hàng                                            |
| Actor phụ    | Nhân viên phục vụ, Thu ngân                                 |
| Mục tiêu     | Quản lý danh sách bàn ăn, khu vực, số ghế và trạng thái bàn |
| Mức ưu tiên  | Must Have                                                   |

### 2. Điều kiện

| Loại điều kiện  | Nội dung                                             |
|-----------------|------------------------------------------------------|
| Điều kiện trước | Quản lý đã đăng nhập hệ thống                        |
| Điều kiện sau   | Thông tin bàn được cập nhật chính xác trong hệ thống |
| Dữ liệu đầu vào | Mã bàn, khu vực, số ghế, trạng thái bàn              |
| Dữ liệu đầu ra  | Danh sách bàn và trạng thái bàn hiện tại             |

### 3. Luồng chính

1. Quản lý truy cập chức năng quản lý bàn.
2. Hệ thống hiển thị danh sách bàn hiện có.
3. Quản lý chọn thao tác thêm, sửa, xóa hoặc xem bàn.
4. Quản lý nhập hoặc cập nhật thông tin bàn.
5. Hệ thống kiểm tra dữ liệu hợp lệ.
6. Hệ thống lưu thay đổi.
7. Hệ thống cập nhật lại danh sách bàn.
8. Use Case kết thúc.

### 4. Luồng thay thế

| Mã       | Tình huống                           | Cách xử lý                           |
|----------|--------------------------------------|--------------------------------------|
| UC-02-A1 | Mã bàn bị trùng                      | Hệ thống thông báo mã bàn đã tồn tại |
| UC-02-A2 | Bàn đang có khách hoặc đang được đặt | Hệ thống không cho phép xóa bàn      |
| UC-02-A3 | Thông tin số ghế không hợp lệ        | Hệ thống yêu cầu nhập lại số ghế     |

### 5. Ghi chú nghiệp vụ

- Không nên xóa cứng bàn đã phát sinh lịch sử đặt bàn hoặc đơn hàng.
- Nếu bàn không còn sử dụng, nên chuyển trạng thái sang ngừng sử dụng hoặc bảo trì.
- Nhân viên phục vụ và thu ngân có thể xem trạng thái bàn nhưng không được thay đổi thông tin cấu hình bàn.

---

## UC-03. Đặt bàn

### 1. Thông tin chung

| Thuộc tính   | Nội dung                                  |
|--------------|--------------------------------------------|
| Mã Use Case  | UC-03                                     |
| Tên Use Case | Đặt bàn                                   |
| Actor chính  | Nhân viên phục vụ                         |
| Actor phụ    | Khách hàng                                |
| Mục tiêu     | Ghi nhận thông tin đặt bàn cho khách hàng |
| Mức ưu tiên  | Must Have                                 |

### 2. Điều kiện

| Loại điều kiện  | Nội dung                                                                           |
|-----------------|------------------------------------------------------------------------------------|
| Điều kiện trước | Nhân viên phục vụ đã đăng nhập; có bàn phù hợp để đặt                              |
| Điều kiện sau   | Thông tin đặt bàn được lưu; trạng thái bàn được cập nhật nếu đặt bàn được xác nhận |
| Dữ liệu đầu vào | Tên khách, số điện thoại, thời gian đặt, số lượng khách, bàn đặt                   |
| Dữ liệu đầu ra  | Phiếu đặt bàn, trạng thái đặt bàn, trạng thái bàn                                  |

### 3. Luồng chính

1. Nhân viên phục vụ mở chức năng đặt bàn.
2. Hệ thống hiển thị danh sách bàn và trạng thái hiện tại.
3. Nhân viên nhập thông tin khách hàng.
4. Nhân viên chọn thời gian đặt và số lượng khách.
5. Hệ thống gợi ý hoặc hiển thị các bàn phù hợp.
6. Nhân viên chọn bàn cho khách.
7. Nhân viên xác nhận đặt bàn.
8. Hệ thống lưu thông tin đặt bàn.
9. Hệ thống cập nhật trạng thái đặt bàn.
10. Hệ thống cập nhật trạng thái bàn nếu đặt bàn được xác nhận.
11. Use Case kết thúc.

### 4. Luồng thay thế

| Mã       | Tình huống              | Cách xử lý                                        |
|----------|-------------------------|---------------------------------------------------|
| UC-03-A1 | Không còn bàn phù hợp   | Hệ thống thông báo không có bàn trống phù hợp     |
| UC-03-A2 | Khách đổi thời gian đặt | Nhân viên cập nhật lại thời gian đặt bàn          |
| UC-03-A3 | Khách hủy đặt bàn       | Nhân viên cập nhật trạng thái đặt bàn sang đã hủy |
| UC-03-A4 | Khách không đến         | Nhân viên cập nhật trạng thái khách không đến     |

### 5. Ghi chú nghiệp vụ

- Hủy đặt bàn là cập nhật trạng thái, không xóa dữ liệu.
- Cần lưu lịch sử đặt bàn để phục vụ báo cáo và tra cứu.
- Cần làm rõ thời gian giữ bàn khi khách đến muộn.

---

## UC-04. Gọi món

### 1. Thông tin chung

| Thuộc tính   | Nội dung                             |
|--------------|--------------------------------------|
| Mã Use Case  | UC-04                                |
| Tên Use Case | Gọi món                              |
| Actor chính  | Nhân viên phục vụ                    |
| Actor phụ    | Khách hàng                           |
| Mục tiêu     | Tạo đơn gọi món cho bàn đang phục vụ |
| Mức ưu tiên  | Must Have                            |

### 2. Điều kiện

| Loại điều kiện  | Nội dung                                                           |
|-----------------|--------------------------------------------------------------------|
| Điều kiện trước | Nhân viên phục vụ đã đăng nhập; bàn đang có khách hoặc đã nhận bàn |
| Điều kiện sau   | Đơn gọi món được tạo và gửi xuống bếp                              |
| Dữ liệu đầu vào | Bàn, danh sách món, số lượng, ghi chú món                          |
| Dữ liệu đầu ra  | Đơn gọi món, danh sách món cần chế biến, tạm tính hóa đơn          |

### 3. Luồng chính

1. Nhân viên phục vụ chọn bàn cần gọi món.
2. Hệ thống hiển thị thực đơn đang bán.
3. Nhân viên chọn món theo yêu cầu của khách.
4. Nhân viên nhập số lượng và ghi chú nếu có.
5. Hệ thống kiểm tra món còn bán hay đã hết.
6. Hệ thống thêm món vào đơn gọi món.
7. Hệ thống tính tạm tiền của đơn.
8. Nhân viên xác nhận gửi món.
9. Hệ thống lưu đơn gọi món.
10. Hệ thống gửi danh sách món xuống bếp.
11. Use Case kết thúc.

### 4. Luồng thay thế

| Mã       | Tình huống             | Cách xử lý                                              |
|----------|------------------------|---------------------------------------------------------|
| UC-04-A1 | Món đã hết             | Hệ thống không cho thêm món và thông báo món đã hết     |
| UC-04-A2 | Khách đổi số lượng món | Nhân viên cập nhật số lượng trước khi món được chế biến |
| UC-04-A3 | Khách hủy món          | Nhân viên hủy món nếu món chưa được chế biến            |
| UC-04-A4 | Khách gọi thêm món     | Nhân viên thêm món vào đơn hiện tại của bàn             |

### 5. Ghi chú nghiệp vụ

- Món đã gửi xuống bếp chỉ được sửa hoặc hủy nếu chưa bắt đầu chế biến.
- Hủy món là cập nhật trạng thái món sang đã hủy, không xóa khỏi lịch sử đơn hàng.
- Đơn gọi món cần liên kết với bàn để phục vụ thanh toán.

---

## UC-05. Gửi món xuống bếp

### 1. Thông tin chung

| Thuộc tính      | Nội dung                                                 |
|-----------------|----------------------------------------------------------|
| Mã Use Case     | UC-05                                                    |
| Tên Use Case    | Gửi món xuống bếp                                        |
| Actor chính     | Nhân viên phục vụ                                        |
| Actor hỗ trợ    | Hệ thống, Nhân viên bếp                                  |
| Mục tiêu        | Chuyển danh sách món đã gọi sang khu vực bếp để chế biến |
| Mức ưu tiên     | Must Have                                                |

### 2. Điều kiện

| Loại điều kiện  | Nội dung                                       |
|-----------------|------------------------------------------------|
| Điều kiện trước | Đơn gọi món đã được nhân viên phục vụ xác nhận |
| Điều kiện sau   | Bếp nhận được danh sách món cần chế biến       |
| Dữ liệu đầu vào | Mã đơn, bàn, món, số lượng, ghi chú            |
| Dữ liệu đầu ra  | Danh sách món trên màn hình bếp hoặc phiếu bếp |

### 3. Luồng chính

1. Nhân viên phục vụ xác nhận gửi món.
2. Hệ thống ghi nhận danh sách món trong đơn.
3. Hệ thống chuyển các món sang trạng thái chờ chế biến.
4. Hệ thống hiển thị món trên màn hình bếp.
5. Nhân viên bếp xem danh sách món cần chế biến.
6. Use Case kết thúc.

### 4. Luồng thay thế

| Mã       | Tình huống                  | Cách xử lý                                            |
|----------|-----------------------------|-------------------------------------------------------|
| UC-05-A1 | Bếp chưa nhận được món      | Hệ thống cần cho phép kiểm tra lại trạng thái gửi món |
| UC-05-A2 | Có ghi chú đặc biệt         | Hệ thống hiển thị ghi chú cùng tên món                |
| UC-05-A3 | Món thuộc khu bếp khác nhau | Hệ thống cần làm rõ có tách khu bếp hay không         |

### 5. Ghi chú nghiệp vụ

- Bếp cần xem món theo thứ tự thời gian gọi.
- Bếp không cần xem giá món nếu không phục vụ nghiệp vụ chế biến.
- Nếu có máy in bếp, hệ thống có thể in phiếu chế biến.

---

## UC-06. Cập nhật trạng thái chế biến món

### 1. Thông tin chung

| Thuộc tính   | Nội dung                         |
|--------------|----------------------------------|
| Mã Use Case  | UC-06                            |
| Tên Use Case | Cập nhật trạng thái chế biến món |
| Actor chính  | Nhân viên bếp                    |
| Actor phụ    | Nhân viên phục vụ                |
| Mục tiêu     | Theo dõi tiến độ chế biến món    |
| Mức ưu tiên  | Must Have                        |

### 2. Điều kiện

| Loại điều kiện  | Nội dung                               |
|-----------------|----------------------------------------|
| Điều kiện trước | Có món đang chờ chế biến               |
| Điều kiện sau   | Trạng thái món được cập nhật chính xác |
| Dữ liệu đầu vào | Món, trạng thái chế biến               |
| Dữ liệu đầu ra  | Trạng thái món mới                     |

### 3. Luồng chính

1. Nhân viên bếp mở danh sách món cần chế biến.
2. Hệ thống hiển thị món theo thứ tự thời gian gọi.
3. Nhân viên bếp chọn món cần cập nhật.
4. Nhân viên bếp chuyển trạng thái món sang đang chế biến.
5. Sau khi hoàn thành, nhân viên bếp chuyển trạng thái món sang hoàn thành.
6. Hệ thống thông báo hoặc cập nhật trạng thái cho nhân viên phục vụ.
7. Use Case kết thúc.

### 4. Luồng thay thế

| Mã       | Tình huống                    | Cách xử lý                                                                    |
|----------|-------------------------------|-------------------------------------------------------------------------------|
| UC-06-A1 | Bếp không thể chế biến món    | Nhân viên bếp báo món không thể chế biến để nhân viên phục vụ xử lý với khách |
| UC-06-A2 | Món bị hủy trước khi chế biến | Hệ thống không hiển thị món trong danh sách cần chế biến                      |
| UC-06-A3 | Món đã hoàn thành             | Hệ thống không cho chuyển lại trạng thái nếu không có quyền phù hợp           |

### 5. Ghi chú nghiệp vụ

- Nhân viên bếp chỉ cập nhật trạng thái chế biến, không sửa giá, số lượng hoặc thanh toán.
- Cần lưu thời điểm cập nhật trạng thái để phục vụ theo dõi tiến độ.

---

## UC-07. Thanh toán hóa đơn

### 1. Thông tin chung

| Thuộc tính   | Nội dung                                    |
|--------------|---------------------------------------------|
| Mã Use Case  | UC-07                                       |
| Tên Use Case | Thanh toán hóa đơn                          |
| Actor chính  | Thu ngân                                    |
| Actor phụ    | Khách hàng, Cổng thanh toán, Máy in hóa đơn |
| Mục tiêu     | Hoàn tất thanh toán cho đơn hàng của bàn    |
| Mức ưu tiên  | Must Have                                   |

### 2. Điều kiện

| Loại điều kiện  | Nội dung                                                           |
|-----------------|--------------------------------------------------------------------|
| Điều kiện trước | Bàn có đơn hàng cần thanh toán                                     |
| Điều kiện sau   | Hóa đơn được thanh toán; trạng thái đơn hàng và bàn được cập nhật |
| Dữ liệu đầu vào | Bàn, danh sách món, giảm giá, phụ phí, VAT, phương thức thanh toán |
| Dữ liệu đầu ra  | Hóa đơn, trạng thái thanh toán, trạng thái bàn                     |

### 3. Luồng chính

1. Thu ngân chọn bàn cần thanh toán.
2. Hệ thống hiển thị hóa đơn của bàn.
3. Hệ thống tự động tính tổng tiền dựa trên danh sách món đã gọi.
4. Thu ngân kiểm tra tổng tiền.
5. Thu ngân áp dụng giảm giá, phụ phí hoặc VAT nếu có.
6. Thu ngân chọn hình thức thanh toán.
7. Khách hàng thực hiện thanh toán.
8. Thu ngân xác nhận thanh toán thành công.
9. Hệ thống ghi nhận thanh toán.
10. Hệ thống cập nhật trạng thái đơn hàng.
11. Hệ thống cập nhật trạng thái bàn.
12. Thu ngân in hoặc xuất hóa đơn nếu cần.
13. Use Case kết thúc.

### 4. Luồng thay thế

| Mã       | Tình huống                       | Cách xử lý                                        |
|----------|----------------------------------|---------------------------------------------------|
| UC-07-A1 | Khách thanh toán thất bại        | Hệ thống giữ hóa đơn ở trạng thái chưa thanh toán |
| UC-07-A2 | Khách đổi phương thức thanh toán | Thu ngân chọn lại phương thức thanh toán          |
| UC-07-A3 | Cần hủy hóa đơn                  | Chỉ Quản lý nhà hàng được hủy hóa đơn             |
| UC-07-A4 | Khách yêu cầu in hóa đơn         | Thu ngân thực hiện in hóa đơn                     |

### 5. Ghi chú nghiệp vụ

- Thu ngân không tự tính tổng tiền thủ công; hệ thống tự động tính.
- Hủy hóa đơn là thao tác nhạy cảm, cần ghi nhật ký.
- Sau khi thanh toán, bàn có thể chuyển sang trạng thái cần dọn hoặc trống tùy quy trình nhà hàng.
- Cần làm rõ có tách hóa đơn hoặc gộp bàn hay không.

---

## UC-08. Quản lý thực đơn

### 1. Thông tin chung

| Thuộc tính   | Nội dung                                                |
|--------------|---------------------------------------------------------|
| Mã Use Case  | UC-08                                                   |
| Tên Use Case | Quản lý thực đơn                                        |
| Actor chính  | Quản lý nhà hàng                                        |
| Actor phụ    | Nhân viên phục vụ, Thu ngân, Nhân viên bếp              |
| Mục tiêu     | Quản lý món ăn, danh mục món, giá bán và trạng thái món |
| Mức ưu tiên  | Must Have                                               |

### 2. Điều kiện

| Loại điều kiện  | Nội dung                                         |
|-----------------|--------------------------------------------------|
| Điều kiện trước | Quản lý đã đăng nhập hệ thống                    |
| Điều kiện sau   | Thông tin thực đơn được cập nhật                 |
| Dữ liệu đầu vào | Tên món, giá bán, danh mục, hình ảnh, trạng thái |
| Dữ liệu đầu ra  | Danh sách thực đơn đang bán                      |

### 3. Luồng chính

1. Quản lý mở chức năng quản lý thực đơn.
2. Hệ thống hiển thị danh sách món.
3. Quản lý chọn thêm, sửa, xóa hoặc cập nhật trạng thái món.
4. Quản lý nhập thông tin món.
5. Hệ thống kiểm tra dữ liệu hợp lệ.
6. Hệ thống lưu thông tin món.
7. Hệ thống cập nhật danh sách thực đơn.
8. Use Case kết thúc.

### 4. Luồng thay thế

| Mã       | Tình huống                | Cách xử lý                                     |
|----------|---------------------------|------------------------------------------------|
| UC-08-A1 | Tên món bị trùng          | Hệ thống thông báo món đã tồn tại              |
| UC-08-A2 | Món đã phát sinh đơn hàng | Hệ thống không nên xóa cứng món                |
| UC-08-A3 | Món hết hàng              | Quản lý cập nhật trạng thái món sang hết món   |
| UC-08-A4 | Món ngừng bán             | Quản lý cập nhật trạng thái món sang ngừng bán |

### 5. Ghi chú nghiệp vụ

- Món ngừng bán hoặc hết món không nên hiển thị để gọi món.
- Không nên xóa cứng món đã có lịch sử bán hàng.
- Cần làm rõ có quản lý size, topping, combo hay không.

---

## UC-09. Quản lý kho nguyên liệu

### 1. Thông tin chung

| Thuộc tính   | Nội dung                                                   |
|--------------|------------------------------------------------------------|
| Mã Use Case  | UC-09                                                      |
| Tên Use Case | Quản lý kho nguyên liệu                                    |
| Actor chính  | Nhân viên kho                                              |
| Actor phụ    | Quản lý nhà hàng, Nhân viên bếp                            |
| Mục tiêu     | Quản lý nguyên liệu, nhập kho, xuất kho và kiểm kê tồn kho |
| Mức ưu tiên  | Should Have                                                |

### 2. Điều kiện

| Loại điều kiện  | Nội dung                                                                       |
|-----------------|--------------------------------------------------------------------------------|
| Điều kiện trước | Nhân viên kho đã đăng nhập hệ thống                                            |
| Điều kiện sau   | Số lượng nguyên liệu được cập nhật                                             |
| Dữ liệu đầu vào | Tên nguyên liệu, đơn vị tính, số lượng, tồn kho tối thiểu, thông tin nhập/xuất |
| Dữ liệu đầu ra  | Danh sách nguyên liệu, tồn kho hiện tại, cảnh báo tồn kho thấp                 |

### 3. Luồng chính

1. Nhân viên kho mở chức năng quản lý kho.
2. Hệ thống hiển thị danh sách nguyên liệu.
3. Nhân viên kho chọn thao tác thêm, sửa, nhập kho, xuất kho hoặc kiểm kê.
4. Nhân viên kho nhập thông tin nguyên liệu hoặc số lượng nhập/xuất.
5. Hệ thống kiểm tra dữ liệu hợp lệ.
6. Hệ thống cập nhật tồn kho.
7. Hệ thống lưu lịch sử nhập/xuất/kiểm kê.
8. Hệ thống cảnh báo nếu nguyên liệu dưới mức tồn kho tối thiểu.
9. Use Case kết thúc.

### 4. Luồng thay thế

| Mã       | Tình huống                      | Cách xử lý                                           |
|----------|---------------------------------|------------------------------------------------------|
| UC-09-A1 | Số lượng nhập/xuất không hợp lệ | Hệ thống yêu cầu nhập lại                            |
| UC-09-A2 | Xuất kho vượt quá tồn kho       | Hệ thống không cho xuất và thông báo lỗi             |
| UC-09-A3 | Nguyên liệu dưới mức tối thiểu  | Hệ thống hiển thị cảnh báo tồn kho thấp              |
| UC-09-A4 | Nguyên liệu hết hạn             | Cần làm rõ hệ thống có quản lý hạn sử dụng hay không |

### 5. Ghi chú nghiệp vụ

- Nên lưu lịch sử nhập kho, xuất kho và kiểm kê.
- Cần làm rõ có tự động trừ nguyên liệu khi bán món hay không.
- Cần làm rõ mỗi món có định mức nguyên liệu hay không.

---

## UC-10. Xem báo cáo doanh thu

### 1. Thông tin chung

| Thuộc tính   | Nội dung                                                         |
|--------------|------------------------------------------------------------------|
| Mã Use Case  | UC-10                                                            |
| Tên Use Case | Xem báo cáo doanh thu                                            |
| Actor chính  | Quản lý nhà hàng                                                 |
| Actor phụ    | Thu ngân                                                         |
| Mục tiêu     | Theo dõi doanh thu, hóa đơn, món bán chạy và hiệu quả kinh doanh |
| Mức ưu tiên  | Must Have                                                        |

### 2. Điều kiện

| Loại điều kiện  | Nội dung                                                              |
|-----------------|-----------------------------------------------------------------------|
| Điều kiện trước | Người dùng có quyền xem báo cáo                                       |
| Điều kiện sau   | Báo cáo được hiển thị hoặc xuất ra file                               |
| Dữ liệu đầu vào | Khoảng thời gian, loại báo cáo, bộ lọc                                |
| Dữ liệu đầu ra  | Báo cáo doanh thu, số hóa đơn, món bán chạy, doanh thu theo thời gian |

### 3. Luồng chính

1. Quản lý mở chức năng báo cáo.
2. Hệ thống hiển thị danh sách loại báo cáo.
3. Quản lý chọn loại báo cáo cần xem.
4. Quản lý chọn khoảng thời gian.
5. Hệ thống tổng hợp dữ liệu.
6. Hệ thống hiển thị báo cáo.
7. Quản lý xem hoặc xuất báo cáo nếu cần.
8. Use Case kết thúc.

### 4. Luồng thay thế

| Mã        | Tình huống                              | Cách xử lý                                 |
|-----------|-----------------------------------------|--------------------------------------------|
| UC-10-A1  | Không có dữ liệu trong khoảng thời gian | Hệ thống thông báo không có dữ liệu        |
| UC-10-A2  | Người dùng không có quyền xem báo cáo   | Hệ thống từ chối truy cập                  |
| UC-10-A3  | Xuất báo cáo thất bại                   | Hệ thống thông báo lỗi và cho phép thử lại |

### 5. Ghi chú nghiệp vụ

- Báo cáo doanh thu chỉ nên hiển thị cho người có quyền.
- Thu ngân có thể xem thống kê hóa đơn nếu được phân quyền.
- Cần làm rõ báo cáo có cần theo ca, theo nhân viên hoặc theo khu vực bàn hay không.

---

## UC-11. Quản lý nhân viên và tài khoản

### 1. Thông tin chung

| Thuộc tính   | Nội dung                                                       |
|--------------|----------------------------------------------------------------|
| Mã Use Case  | UC-11                                                          |
| Tên Use Case | Quản lý nhân viên và tài khoản                                 |
| Actor chính  | Quản lý nhà hàng, Quản trị hệ thống                            |
| Mục tiêu     | Quản lý thông tin nhân viên, tài khoản đăng nhập và phân quyền |
| Mức ưu tiên  | Should Have                                                    |

### 2. Điều kiện

| Loại điều kiện  | Nội dung                                                                |
|-----------------|-------------------------------------------------------------------------|
| Điều kiện trước | Người dùng có quyền quản lý nhân viên hoặc quản trị hệ thống            |
| Điều kiện sau   | Thông tin nhân viên hoặc tài khoản được cập nhật                        |
| Dữ liệu đầu vào | Họ tên, số điện thoại, chức vụ, trạng thái làm việc, tài khoản, vai trò |
| Dữ liệu đầu ra  | Danh sách nhân viên, danh sách tài khoản, quyền truy cập                |

### 3. Luồng chính

1. Quản lý hoặc Quản trị hệ thống mở chức năng quản lý nhân viên/tài khoản.
2. Hệ thống hiển thị danh sách nhân viên hoặc tài khoản.
3. Người dùng chọn thêm, sửa, khóa/mở khóa hoặc phân quyền.
4. Người dùng nhập thông tin cần cập nhật.
5. Hệ thống kiểm tra dữ liệu hợp lệ.
6. Hệ thống lưu thay đổi.
7. Hệ thống cập nhật danh sách nhân viên hoặc tài khoản.
8. Use Case kết thúc.

### 4. Luồng thay thế

| Mã       | Tình huống                                         | Cách xử lý                                                                    |
|----------|----------------------------------------------------|-------------------------------------------------------------------------------|
| UC-11-A1 | Tài khoản bị trùng tên đăng nhập                   | Hệ thống thông báo tên đăng nhập đã tồn tại                                   |
| UC-11-A2 | Người dùng không có quyền phân quyền               | Hệ thống từ chối thao tác                                                     |
| UC-11-A3 | Nhân viên nghỉ việc                                | Hệ thống chuyển trạng thái nhân viên sang ngừng hoạt động hoặc khóa tài khoản |
| UC-11-A4 | Người dùng cố xóa tài khoản đã có lịch sử thao tác | Hệ thống không nên xóa cứng, chỉ khóa hoặc ngừng hoạt động                    |

### 5. Ghi chú nghiệp vụ

- Quản lý nhà hàng quản lý hồ sơ nhân viên.
- Quản trị hệ thống quản lý tài khoản, quyền truy cập và cấu hình hệ thống.
- Cần làm rõ một nhân viên có thể có nhiều vai trò hay không.

---

## 3. Tổng kết

Các Use Case trên là nhóm chức năng cốt lõi của hệ thống quản lý nhà hàng.
Các chức năng như QR order, tích điểm khách hàng, mã giảm giá, quản lý nhiều chi nhánh hoặc tích hợp kế toán chuyên sâu có thể được xem là chức năng mở rộng và không thuộc phạm vi bắt buộc của phiên bản đầu tiên.
