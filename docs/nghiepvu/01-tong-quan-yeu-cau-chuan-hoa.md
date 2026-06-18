# Tổng quan yêu cầu nghiệp vụ — Hệ thống quản lý nhà hàng

## 1. Actor

### 1.1. Actor chính

| Actor | Mô tả |
|-------|-------|
| Quản lý nhà hàng | Quản lý cấu hình hệ thống, nhân viên, thực đơn, bàn, kho và xem báo cáo |
| Nhân viên phục vụ | Tiếp nhận đặt bàn, tạo đơn gọi món, cập nhật phục vụ món và trạng thái bàn |
| Thu ngân | Kiểm tra hóa đơn, áp dụng giảm giá, ghi nhận thanh toán và in hóa đơn |
| Nhân viên bếp | Nhận món cần chế biến, cập nhật trạng thái chế biến món |
| Nhân viên kho | Quản lý nguyên liệu, nhập kho, xuất kho, kiểm kê tồn kho |
| Quản trị hệ thống | Quản lý tài khoản, phân quyền, sao lưu và cấu hình hệ thống |

### 1.2. Actor phụ

| Actor phụ | Ngữ cảnh sử dụng |
|-----------|-----------------|
| Khách hàng | Nếu khách tự đặt bàn / gọi món qua QR, web hoặc ứng dụng |
| Nhà cung cấp | Nếu hệ thống có chức năng gửi đơn nhập hàng cho nhà cung cấp |
| Cổng thanh toán | Nếu có thanh toán online, quét QR hoặc ví điện tử |
| Máy in hóa đơn / máy in bếp | Nếu hệ thống tích hợp in phiếu bếp hoặc in hóa đơn |

## 2. Yêu cầu chức năng

### 2.1. Module quản lý bàn

| Mã | Yêu cầu chức năng |
|----|-------------------|
| FR-TBL-01 | Quản lý có thể thêm, sửa, xóa và xem danh sách bàn ăn |
| FR-TBL-02 | Hệ thống lưu thông tin bàn gồm mã bàn, khu vực, số ghế và trạng thái bàn |
| FR-TBL-03 | Nhân viên có thể xem trạng thái bàn theo khu vực |
| FR-TBL-04 | Hệ thống cập nhật trạng thái bàn: trống, đã đặt, đang phục vụ, cần dọn, bảo trì |

### 2.2. Module đặt bàn

| Mã | Yêu cầu chức năng |
|----|-------------------|
| FR-RES-01 | Nhân viên có thể tạo thông tin đặt bàn cho khách |
| FR-RES-02 | Hệ thống lưu thông tin đặt bàn gồm tên khách, số điện thoại, thời gian đặt, số lượng khách và bàn được đặt |
| FR-RES-03 | Nhân viên có thể xác nhận, chỉnh sửa hoặc hủy đặt bàn |
| FR-RES-04 | Hệ thống tự động cập nhật trạng thái bàn khi đặt bàn được xác nhận hoặc hủy |

### 2.3. Module gọi món

| Mã | Yêu cầu chức năng |
|----|-------------------|
| FR-ORD-01 | Nhân viên phục vụ có thể tạo đơn gọi món cho một bàn |
| FR-ORD-02 | Nhân viên có thể thêm, sửa số lượng hoặc hủy món khi món chưa được chế biến |
| FR-ORD-03 | Hệ thống tính tạm tiền dựa trên danh sách món đã gọi |
| FR-ORD-04 | Hệ thống gửi món đã gọi đến bộ phận bếp |
| FR-ORD-05 | Hệ thống ghi nhận trạng thái món: chờ chế biến, đang chế biến, hoàn thành, đã phục vụ, đã hủy |

### 2.4. Module bếp

| Mã | Yêu cầu chức năng |
|----|-------------------|
| FR-KIT-01 | Nhân viên bếp có thể xem danh sách món cần chế biến |
| FR-KIT-02 | Danh sách món được sắp xếp theo thời gian gọi món |
| FR-KIT-03 | Nhân viên bếp có thể cập nhật trạng thái chế biến của từng món |
| FR-KIT-04 | Hệ thống thông báo cho nhân viên phục vụ khi món đã hoàn thành |

### 2.5. Module thanh toán

| Mã | Yêu cầu chức năng |
|----|-------------------|
| FR-PAY-01 | Thu ngân có thể xem hóa đơn của từng bàn |
| FR-PAY-02 | Hệ thống tự động tính tổng tiền dựa trên món đã gọi |
| FR-PAY-03 | Thu ngân có thể áp dụng giảm giá, phụ phí hoặc VAT |
| FR-PAY-04 | Hệ thống ghi nhận hình thức thanh toán: tiền mặt, chuyển khoản, thẻ |
| FR-PAY-05 | Sau khi thanh toán thành công, hệ thống cập nhật trạng thái đơn hàng và trạng thái bàn |
| FR-PAY-06 | Hệ thống cho phép in hoặc xuất hóa đơn |

### 2.6. Module quản lý thực đơn

| Mã | Yêu cầu chức năng |
|----|-------------------|
| FR-MNU-01 | Quản lý có thể thêm, sửa, xóa món ăn |
| FR-MNU-02 | Hệ thống lưu thông tin món gồm tên món, giá bán, danh mục, hình ảnh và trạng thái |
| FR-MNU-03 | Quản lý có thể phân loại món theo nhóm: món chính, đồ uống, tráng miệng |
| FR-MNU-04 | Quản lý có thể cập nhật trạng thái món: đang bán, hết món, ngừng bán |

### 2.7. Module quản lý nhân viên

| Mã | Yêu cầu chức năng |
|----|-------------------|
| FR-EMP-01 | Quản lý có thể thêm, sửa, xóa và xem danh sách nhân viên |
| FR-EMP-02 | Hệ thống lưu thông tin nhân viên gồm họ tên, số điện thoại, chức vụ, tài khoản và trạng thái làm việc |
| FR-EMP-03 | Hệ thống phân quyền tài khoản theo vai trò |
| FR-EMP-04 | Nhân viên có thể đăng nhập và đăng xuất hệ thống |

### 2.8. Module quản lý kho nguyên liệu

| Mã | Yêu cầu chức năng |
|----|-------------------|
| FR-INV-01 | Nhân viên kho có thể thêm, sửa, xóa và xem danh sách nguyên liệu |
| FR-INV-02 | Hệ thống ghi nhận nhập kho nguyên liệu |
| FR-INV-03 | Hệ thống ghi nhận xuất kho nguyên liệu |
| FR-INV-04 | Hệ thống cảnh báo khi nguyên liệu dưới mức tồn kho tối thiểu |
| FR-INV-05 | Hệ thống lưu lịch sử nhập, xuất và kiểm kê kho |

### 2.9. Module báo cáo

| Mã | Yêu cầu chức năng |
|----|-------------------|
| FR-RPT-01 | Quản lý có thể xem báo cáo doanh thu theo ngày, tháng, năm |
| FR-RPT-02 | Hệ thống thống kê số lượng hóa đơn đã thanh toán |
| FR-RPT-03 | Hệ thống thống kê món bán chạy |
| FR-RPT-04 | Hệ thống thống kê doanh thu theo nhân viên hoặc theo ca làm việc |
| FR-RPT-05 | Hệ thống cho phép xuất báo cáo ra Excel hoặc PDF |

## 3. Yêu cầu phi chức năng

| Mã | Nhóm | Yêu cầu phi chức năng |
|----|------|----------------------|
| NFR-01 | Hiệu năng | Các thao tác gọi món, cập nhật trạng thái bàn và thanh toán phải phản hồi trong vòng 3 giây trong điều kiện hoạt động bình thường |
| NFR-02 | Bảo mật | Người dùng phải đăng nhập trước khi sử dụng hệ thống |
| NFR-03 | Phân quyền | Người dùng chỉ được truy cập các chức năng phù hợp với vai trò được cấp |
| NFR-04 | Dễ sử dụng | Giao diện gọi món và thanh toán cần đơn giản, nhân viên mới có thể sử dụng sau thời gian hướng dẫn ngắn |
| NFR-05 | Tin cậy | Dữ liệu đơn hàng, hóa đơn và thanh toán không được mất khi hệ thống xử lý thành công |
| NFR-06 | Khả dụng | Hệ thống cần hoạt động ổn định trong giờ cao điểm của nhà hàng |
| NFR-07 | Sao lưu | Dữ liệu hệ thống cần được sao lưu định kỳ |
| NFR-08 | Tương thích | Hệ thống có thể sử dụng trên máy tính, tablet hoặc thiết bị POS |
| NFR-09 | Nhật ký hệ thống | Hệ thống cần ghi nhận lịch sử thao tác quan trọng như thanh toán, hủy món, sửa hóa đơn |
| NFR-10 | Bảo trì | Hệ thống cần có cấu trúc dễ nâng cấp thêm module như QR order, tích điểm, nhiều chi nhánh |

## 4. Ưu tiên yêu cầu theo MoSCoW

### 4.1. Must Have

| Nhóm yêu cầu | Lý do |
|--------------|-------|
| Đăng nhập và phân quyền | Đảm bảo mỗi nhân viên chỉ dùng đúng chức năng |
| Quản lý bàn | Cốt lõi của vận hành nhà hàng |
| Đặt bàn | Cần nếu nhà hàng có nhận khách đặt trước |
| Gọi món | Nghiệp vụ chính |
| Gửi món xuống bếp | Đảm bảo liên kết giữa phục vụ và bếp |
| Cập nhật trạng thái món | Giúp theo dõi tiến độ chế biến |
| Thanh toán hóa đơn | Bắt buộc để hoàn tất đơn hàng |
| Quản lý thực đơn | Là dữ liệu đầu vào cho gọi món và thanh toán |
| Báo cáo doanh thu cơ bản | Quản lý cần theo dõi doanh thu |

### 4.2. Should Have

| Nhóm yêu cầu | Lý do |
|--------------|-------|
| Quản lý kho nguyên liệu | Quan trọng nhưng có thể triển khai sau nếu MVP cần gọn |
| Cảnh báo tồn kho thấp | Hỗ trợ vận hành tốt hơn |
| Quản lý nhân viên chi tiết | Cần cho quản trị, nhưng bản đầu có thể chỉ cần tài khoản và vai trò |
| Báo cáo món bán chạy | Hỗ trợ quản lý ra quyết định |
| Xuất hóa đơn / in hóa đơn | Nên có trong thực tế vận hành |

### 4.3. Could Have

| Nhóm yêu cầu | Lý do |
|--------------|-------|
| Xuất báo cáo Excel / PDF | Tiện lợi nhưng không ảnh hưởng trực tiếp đến nghiệp vụ chính |
| Mã giảm giá | Có thể thêm khi nhà hàng có chương trình khuyến mãi |
| Tích điểm khách hàng | Phù hợp giai đoạn mở rộng |
| QR order cho khách tự gọi món | Tốt nhưng chưa bắt buộc |
| Gộp bàn / tách hóa đơn | Hữu ích nhưng có thể làm sau |

### 4.4. Won't Have (giai đoạn đầu)

| Nhóm yêu cầu | Lý do |
|--------------|-------|
| Quản lý nhiều chi nhánh | Phức tạp, chưa cần nếu chỉ triển khai cho một nhà hàng |
| Ứng dụng mobile riêng cho khách hàng | Tốn thời gian phát triển |
| AI gợi ý món ăn | Không phải nghiệp vụ cốt lõi |
| Tự động đặt nguyên liệu với nhà cung cấp | Cần quy trình mua hàng phức tạp hơn |
| Tích hợp kế toán chuyên sâu | Nên tách sang giai đoạn sau |

## 5. Câu hỏi cần làm rõ

> ⚠️ *Mục này chưa có nội dung từ tài liệu gốc. Cần phỏng vấn hoặc gửi câu hỏi cho khách hàng để hoàn thiện.*

Các nhóm câu hỏi dự kiến:

- **Đặt bàn:** Nhà hàng có nhận đặt bàn qua điện thoại hay chỉ qua hệ thống? Có xử lý đặt bàn online không?
- **Thanh toán:** Hình thức thanh toán nào được chấp nhận? Có tích hợp cổng thanh toán hay POS không?
- **Kho:** Nhân viên kho có độc lập với bếp không? Quy trình nhập/xuất kho hiện tại ra sao?
- **Báo cáo:** Quản lý cần những chỉ số nào ngoài doanh thu? Tần suất xem báo cáo?
- **Phân quyền:** Có bao nhiêu cấp quản lý? Ai được phép tạo tài khoản?
