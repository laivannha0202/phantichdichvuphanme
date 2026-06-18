# Danh sách câu hỏi cần làm rõ với khách hàng — Hệ thống quản lý nhà hàng

## 1. Mục đích tài liệu

Tài liệu này tổng hợp các câu hỏi cần làm rõ với khách hàng (chủ nhà hàng / người yêu cầu) trước khi chuyển sang giai đoạn thiết kế và triển khai hệ thống.

Mục đích sử dụng:

- **Phỏng vấn khách hàng:** Dùng làm checklist để trao đổi trực tiếp, ghi nhận câu trả lời.
- **Chốt phạm vi:** Xác định rõ chức năng nào thuộc phiên bản đầu, chức năng nào để mở rộng sau.
- **Tránh hiểu sai nghiệp vụ:** Những tình huống chưa được mô tả chi tiết trong tài liệu nghiệp vụ cần được làm rõ trước khi thiết kế kỹ thuật.

> ⚠️ **Nguyên tắc:** Các câu hỏi chưa được trả lời **không được tự ý** đưa thành chức năng bắt buộc của hệ thống. Quyết định cuối cùng thuộc về khách hàng.

---

## 2. Quy ước trình bày

Mỗi câu hỏi có mã duy nhất theo format `Q-{NHÓM}-{STT}`:

| Tiền tố | Nhóm nghiệp vụ |
|---------|----------------|
| Q-SCOPE | Phạm vi hệ thống |
| Q-TBL | Quản lý bàn |
| Q-RES | Đặt bàn |
| Q-ORD | Gọi món |
| Q-KIT | Bếp |
| Q-PAY | Thanh toán |
| Q-MNU | Thực đơn |
| Q-INV | Kho nguyên liệu |
| Q-RPT | Báo cáo |
| Q-AUTH | Phân quyền và tài khoản |

**Mức ưu tiên:**

| Mức | Ý nghĩa |
|-----|---------|
| **Cao** | Cần trả lời trước khi thiết kế kỹ thuật. Ảnh hưởng đến kiến trúc hệ thống, luồng nghiệp vụ chính hoặc dữ liệu quan trọng. |
| **Trung bình** | Cần chốt trước khi làm chi tiết từng module. Không ảnh hưởng đến toàn bộ kiến trúc nhưng ảnh hưởng đến thiết kế module cụ thể. |
| **Thấp** | Có thể để giai đoạn mở rộng sau MVP. Không ảnh hưởng đến thiết kế hiện tại. |

**Trạng thái:**

| Trạng thái | Ý nghĩa |
|------------|---------|
| Chưa trả lời | Câu hỏi chưa được gửi hoặc chưa nhận được phản hồi |
| Đã trả lời | Đã có câu trả lời từ khách hàng |
| Không áp dụng | Câu hỏi không còn phù hợp do thay đổi phạm vi |

---

## 3. Danh sách câu hỏi

### 3.A. Phạm vi hệ thống (Q-SCOPE)

| Mã câu hỏi | Câu hỏi cần làm rõ | Lý do cần hỏi | Ảnh hưởng nếu chưa làm rõ | Mức ưu tiên | Đề xuất phiên bản đầu | Trạng thái |
|:-----------:|--------------------|---------------|---------------------------|:-----------:|:---------------------:|:----------:|
| Q-SCOPE-01 | Hệ thống dùng cho một nhà hàng hay nhiều chi nhánh? | Ảnh hưởng đến mô hình dữ liệu (có cần trường chi nhánh không), kiến trúc database, báo cáo tổng hợp | Thiết kế database, API và báo cáo không phù hợp; phải thiết kế lại nếu mở rộng sau | **Cao** | Một nhà hàng | Chưa trả lời |
| Q-SCOPE-02 | Phiên bản đầu có cần khách hàng tự gọi món qua QR code tại bàn không? | Ảnh hưởng đến kiến trúc module gọi món, actor (thêm actor "Khách hàng" đăng nhập vào hệ thống) | Nếu không hỏi trước, thiết kế module gọi món hiện tại sẽ không hỗ trợ kênh QR | **Cao** | Không — đề xuất để ngoài phạm vi phiên bản đầu, cần khách hàng xác nhận | Chưa trả lời |
| Q-SCOPE-03 | Phiên bản đầu có cần tích điểm khách hàng / mã giảm giá không? | Ảnh hưởng đến module thanh toán, cần thêm bảng dữ liệu khách hàng thân thiết, mã giảm giá | Thiếu module tích điểm sẽ khó thêm sau nếu không thiết kế database linh hoạt | Trung bình | Không — đề xuất để ngoài phạm vi phiên bản đầu, cần khách hàng xác nhận | Chưa trả lời |
| Q-SCOPE-04 | Có cần ứng dụng mobile riêng cho khách hàng không? | Ảnh hưởng đến phạm vi phát triển, công nghệ (native app hay web app) | Lãng phí nếu thiết kế API cho mobile khi chưa cần | **Cao** | Không — đề xuất để ngoài phạm vi phiên bản đầu, cần khách hàng xác nhận | Chưa trả lời |
| Q-SCOPE-05 | Có cần tích hợp kế toán chuyên sâu không? | Ảnh hưởng đến cấu trúc dữ liệu tài chính, xuất báo cáo theo chuẩn kế toán | Thiết kế báo cáo tài chính không phù hợp nếu sau này cần tích hợp | Thấp | Không — đề xuất để ngoài phạm vi phiên bản đầu, cần khách hàng xác nhận | Chưa trả lời |
| Q-SCOPE-06 | Nhà hàng đã có quy trình vận hành hiện tại chưa? Có tài liệu quy trình không? | Giúp BA đối chiếu và phát hiện thiếu sót trong tài liệu nghiệp vụ so với thực tế | Tài liệu nghiệp vụ có thể sai lệch so với vận hành thực tế | **Cao** | Cần khảo sát quy trình hiện tại | Chưa trả lời |

### 3.B. Quản lý bàn (Q-TBL)

| Mã câu hỏi | Câu hỏi cần làm rõ | Lý do cần hỏi | Ảnh hưởng nếu chưa làm rõ | Mức ưu tiên | Đề xuất phiên bản đầu | Trạng thái |
|:-----------:|--------------------|---------------|---------------------------|:-----------:|:---------------------:|:----------:|
| Q-TBL-01 | Nhà hàng có những khu vực bàn nào? (ví dụ: Trong nhà, Ngoài trời, Tầng 1, Tầng 2, Phòng VIP) | Ảnh hưởng đến thiết kế dữ liệu bàn: có cần trường khu vực hay không, filter bàn theo khu vực | Thiếu thông tin khu vực, nhân viên khó sắp xếp bàn phù hợp | Trung bình | Có khu vực — cần làm rõ danh sách khu vực | Chưa trả lời |
| Q-TBL-02 | Có cần chức năng gộp bàn (ghép hai bàn thành một để phục vụ khách đông) không? | Ảnh hưởng đến luồng trạng thái bàn, gọi món và thanh toán; đã xác định là Won't Have | Nếu phát sinh nghiệp vụ gộp bàn thực tế, hệ thống không đáp ứng được | Trung bình | Không — Won't Have, nhưng cần xác nhận lại | Chưa trả lời |
| Q-TBL-03 | Sau khi thanh toán, bàn chuyển về "Cần dọn" hay chuyển thẳng về "Trống"? | Hiện tại tài liệu ghi chuyển từ "Đang phục vụ" → "Cần dọn". Cần xác nhận quy trình | Thiết kế luồng trạng thái bàn sai nếu quy trình thực tế khác | **Cao** | Chuyển về "Cần dọn" — cần nhân viên dọn và xác nhận | Chưa trả lời |
| Q-TBL-04 | Ai xác nhận bàn đã dọn xong? Nhân viên phục vụ hay có nhân viên dọn riêng? | Ảnh hưởng đến phân quyền cập nhật trạng thái bàn "Cần dọn" → "Trống" | Phân quyền sai, người dùng không thao tác được hoặc thao tác sai | Trung bình | Nhân viên phục vụ xác nhận dọn xong | Chưa trả lời |
| Q-TBL-05 | Khi chuyển bàn sang trạng thái "Bảo trì", có cần ghi lý do bảo trì không? | Ảnh hưởng đến thiết kế giao diện: có trường lý do bắt buộc hay không | Không có lịch sử bảo trì, khó theo dõi tình trạng bàn | Thấp | Có ghi lý do bảo trì | Chưa trả lời |
| Q-TBL-06 | Bàn ở trạng thái "Đã đặt" có được xếp khách trực tiếp không nếu khách đặt chưa đến? | Ảnh hưởng đến luồng xử lý khi khách đến trực tiếp trong giờ cao điểm | Nhân viên không biết xử lý thế nào khi vừa có khách đặt vừa có khách đến | **Cao** | Không cho phép — bàn đã đặt phải giữ nguyên | Chưa trả lời |

### 3.C. Đặt bàn (Q-RES)

| Mã câu hỏi | Câu hỏi cần làm rõ | Lý do cần hỏi | Ảnh hưởng nếu chưa làm rõ | Mức ưu tiên | Đề xuất phiên bản đầu | Trạng thái |
|:-----------:|--------------------|---------------|---------------------------|:-----------:|:---------------------:|:----------:|
| Q-RES-01 | Nhà hàng nhận đặt bàn qua những kênh nào? (điện thoại, trực tiếp, online, fanpage?) | Ảnh hưởng đến actor và luồng tạo đặt bàn; quyết định module đặt bàn có cần kênh online không | Thiết kế module đặt bàn chỉ hỗ trợ nhân viên tạo, không hỗ trợ khách tự đặt | **Cao** | Điện thoại và trực tiếp | Chưa trả lời |
| Q-RES-02 | Có cần khách hàng tự đặt bàn trên website / fanpage không? | Nếu có, cần thêm actor "Khách hàng" và thiết kế kênh đặt bàn riêng | Phải thiết kế thêm module đặt bàn online, thay đổi kiến trúc | **Cao** | Không — Could Have, để giai đoạn sau | Chưa trả lời |
| Q-RES-03 | Thời gian giữ bàn mặc định là bao lâu? Có cấu hình theo khung giờ không? (cao điểm 10 phút, thấp điểm 30 phút) | Ảnh hưởng đến luồng chuyển trạng thái tự động "Đã xác nhận" → "Khách không đến" | Thời gian giữ bàn không phù hợp với thực tế vận hành | **Cao** | 15 phút mặc định, có thể cấu hình | Chưa trả lời |
| Q-RES-04 | Khách đến muộn nhưng trong thời gian giữ bàn thì xử lý thế nào? Vẫn check-in bình thường? | Cần xác nhận quy trình check-in muộn — liệu có vẫn giữ nguyên bàn? | Thiết kế luồng check-in không có phương án xử lý đến muộn | Trung bình | Vẫn check-in bình thường trong thời gian giữ bàn | Chưa trả lời |
| Q-RES-05 | Khách đến muộn quá giờ giữ bàn — đã chuyển "Khách không đến" nhưng khách vẫn đến — có cơ chế khôi phục không? | Ảnh hưởng đến thiết kế trạng thái đặt bàn và luồng phục hồi | Nếu không có, khách mất bàn và không có cách xử lý trên hệ thống | Trung bình | Không khôi phục đặt bàn đã kết thúc; nếu khách vẫn đến, nhân viên tạo lượt nhận bàn mới hoặc xếp bàn trực tiếp nếu còn bàn | Chưa trả lời |
| Q-RES-06 | Có cho phép một lượt đặt chọn nhiều bàn không? (ví dụ: khách đoàn 20 người đặt 3 bàn) | Ảnh hưởng đến thiết kế giao diện đặt bàn: chọn một bàn hay nhiều bàn | Nếu không hỗ trợ, khách đoàn phải đặt từng bàn riêng lẻ | Trung bình | Có — hỗ trợ chọn nhiều bàn cùng lúc | Chưa trả lời |
| Q-RES-07 | Có cần đặt cọc (deposit) khi đặt bàn không? | Ảnh hưởng đến module thanh toán, cần thêm trạng thái "Đã đặt cọc" | Nếu không hỗ trợ mà khách hàng yêu cầu, phải sửa cả module thanh toán | Trung bình | Không — có thể thêm ở giai đoạn sau | Chưa trả lời |
| Q-RES-08 | Có cần gửi xác nhận đặt bàn cho khách không? (SMS, email, Zalo?) | Ảnh hưởng đến module thông báo, tích hợp SMS/email/Zalo | Nếu cần, phải phát triển thêm module gửi thông báo | Thấp | Không — có thể thêm sau | Chưa trả lời |
| Q-RES-09 | Có cần trạng thái "Chờ xác nhận" cho đặt bàn không? Hay nhân viên tạo → xác nhận luôn? | Ảnh hưởng đến số trạng thái đặt bàn và luồng xử lý | Nếu không cần, có thể rút gọn trạng thái đặt bàn | Trung bình | Cần — nếu có đặt bàn online; không cần nếu chỉ đặt qua nhân viên | Chưa trả lời |

### 3.D. Gọi món (Q-ORD)

| Mã câu hỏi | Câu hỏi cần làm rõ | Lý do cần hỏi | Ảnh hưởng nếu chưa làm rõ | Mức ưu tiên | Đề xuất phiên bản đầu | Trạng thái |
|:-----------:|--------------------|---------------|---------------------------|:-----------:|:---------------------:|:----------:|
| Q-ORD-01 | Chỉ nhân viên phục vụ gọi món hay khách có thể tự gọi bằng QR? | Ảnh hưởng đến actor, giao diện, luồng gửi món | Nếu có QR, phải thiết kế thêm kênh gọi món cho khách | **Cao** | Chỉ nhân viên phục vụ; QR là Could Have | Chưa trả lời |
| Q-ORD-02 | Có cần ghi chú món (ví dụ: không cay, ít đá, chín kỹ) không? | Ảnh hưởng đến thiết kế giao diện gọi món: có trường ghi chú hay không | Nếu cần mà không có, bếp không biết yêu cầu đặc biệt của khách | **Cao** | Có — ghi chú cho từng món | Chưa trả lời |
| Q-ORD-03 | Có cần gọi thêm món nhiều lần trong cùng một bàn không? (gọi món lần 1, sau đó gọi thêm lần 2, lần 3) | Ảnh hưởng đến thiết kế đơn hàng: một đơn hay nhiều đơn cho một bàn | Nếu không hỗ trợ, mỗi lần gọi thêm phải tạo đơn hàng mới | **Cao** | Có — gọi thêm nhiều lần trong cùng đơn hàng | Chưa trả lời |
| Q-ORD-04 | Có cần chuyển bàn / gộp đơn khi khách đổi bàn không? (ví dụ: khách từ bàn A sang bàn B, mang theo món đã gọi) | Ảnh hưởng đến luồng xử lý đơn hàng và trạng thái bàn | Nếu không hỗ trợ, nhân viên phải hủy đơn cũ và tạo đơn mới | Trung bình | Không — có thể bổ sung sau | Chưa trả lời |
| Q-ORD-05 | Có cần tách món theo từng khách trong cùng bàn không? (ví dụ: tính tiền riêng cho từng người) | Ảnh hưởng đến luồng thanh toán và cấu trúc đơn hàng | Nếu không hỗ trợ, khách không thể tự thanh toán phần của mình | Trung bình | Không — tách hóa đơn là Won't Have | Chưa trả lời |
| Q-ORD-06 | Khi món đã gửi xuống bếp, đến trạng thái nào thì không được hủy nữa? | Hiện tại quy tắc cho phép hủy khi "Chờ chế biến". Cần xác nhận có cho hủy khi "Đang chế biến" không | Nếu cho hủy khi đang chế biến, cần quy trình xử lý với bếp và khách | **Cao** | Chỉ hủy khi "Chờ chế biến" — không hủy khi "Đang chế biến" | Chưa trả lời |

### 3.E. Bếp (Q-KIT)

| Mã câu hỏi | Câu hỏi cần làm rõ | Lý do cần hỏi | Ảnh hưởng nếu chưa làm rõ | Mức ưu tiên | Đề xuất phiên bản đầu | Trạng thái |
|:-----------:|--------------------|---------------|---------------------------|:-----------:|:---------------------:|:----------:|
| Q-KIT-01 | Bếp xem món trên màn hình hay in phiếu bếp? | Ảnh hưởng đến thiết kế module bếp: màn hình điện tử, máy in bếp hay cả hai | Nếu cần in phiếu, phải tích hợp thêm máy in và thiết kế mẫu in | **Cao** | Màn hình điện tử là chính; in phiếu là tùy chọn | Chưa trả lời |
| Q-KIT-02 | Có cần chia khu bếp theo loại món không? (ví dụ: bếp nóng, bếp lạnh, đồ uống, bánh) | Ảnh hưởng đến thiết kế hiển thị món: một màn hình chung hay nhiều màn hình theo khu vực | Nếu có nhiều khu bếp, món phải được định tuyến đúng khu vực | **Cao** | Cần làm rõ — nếu có thì thiết kế filter theo loại món | Chưa trả lời |
| Q-KIT-03 | Bếp có cần chức năng báo món không thể chế biến không? (ví dụ: hết nguyên liệu, máy hỏng) | Ảnh hưởng đến luồng xử lý ngoại lệ của món | Nếu không có, nhân viên phục vụ không biết món không thể chế biến | **Cao** | Có — cần nút "Không thể chế biến" kèm lý do | Chưa trả lời |
| Q-KIT-04 | Món hoàn thành có cần thông báo cho nhân viên phục vụ không? Bằng cách nào? (âm thanh, pop-up, đèn báo?) | Ảnh hưởng đến thiết kế thông báo real-time | Phục vụ không biết món đã hoàn thành để mang lên bàn | **Cao** | Có — thông báo trên màn hình hoặc âm thanh | Chưa trả lời |
| Q-KIT-05 | Bếp có cần xem thời gian chờ món quá lâu để ưu tiên chế biến không? | Ảnh hưởng đến thiết kế giao diện bếp: có cột thời gian chờ, cảnh báo món chờ lâu | Nếu không có, bếp khó ưu tiên món đã chờ lâu, khách phàn nàn | Trung bình | Có — hiển thị thời gian chờ và cảnh báo khi quá lâu | Chưa trả lời |
| Q-KIT-06 | Nhân viên bếp có cần xem giá món trên phiếu chế biến không? | Tài liệu hiện tại ghi không hiển thị giá. Cần xác nhận với thực tế | Nếu hiển thị giá, có thể gây hiểu lầm; nếu không, bếp không cần thông tin này | Thấp | Không hiển thị giá — bếp chỉ cần tên món, số lượng | Chưa trả lời |

### 3.F. Thanh toán (Q-PAY)

| Mã câu hỏi | Câu hỏi cần làm rõ | Lý do cần hỏi | Ảnh hưởng nếu chưa làm rõ | Mức ưu tiên | Đề xuất phiên bản đầu | Trạng thái |
|:-----------:|--------------------|---------------|---------------------------|:-----------:|:---------------------:|:----------:|
| Q-PAY-01 | Nhà hàng chấp nhận những hình thức thanh toán nào? (tiền mặt, chuyển khoản, thẻ tín dụng/ghi nợ, ví điện tử?) | Ảnh hưởng đến thiết kế module thanh toán: danh sách phương thức, tích hợp cổng thanh toán | Không đầy đủ phương thức thanh toán, thu ngân không ghi nhận đúng | **Cao** | Tiền mặt, chuyển khoản, thẻ | Chưa trả lời |
| Q-PAY-02 | Có cần tích hợp thanh toán online / quét mã QR / ví điện tử (Momo, VNPay, Zalopay) không? | Ảnh hưởng đến kiến trúc tích hợp bên thứ ba, bảo mật giao dịch | Nếu cần, phải phát triển thêm module tích hợp cổng thanh toán | **Cao** | Không — Could Have, để giai đoạn sau | Chưa trả lời |
| Q-PAY-03 | Có cho phép thanh toán kết hợp nhiều hình thức không? (ví dụ: tiền mặt + chuyển khoản trên cùng một hóa đơn) | Ảnh hưởng đến thiết kế bảng thanh toán: một dòng hay nhiều dòng thanh toán | Nếu không cho phép, khách chỉ được thanh toán bằng một hình thức duy nhất | Trung bình | Không — một hóa đơn một hình thức thanh toán | Chưa trả lời |
| Q-PAY-04 | Có cần tách hóa đơn (chia tiền cho nhiều người trên cùng một bàn) không? | Ảnh hưởng đến toàn bộ luồng thanh toán, cấu trúc hóa đơn | Nếu cần, phải thiết kế lại cách tính tiền và hiển thị hóa đơn | **Cao** | Không — đề xuất để ngoài phạm vi phiên bản đầu, cần khách hàng xác nhận | Chưa trả lời |
| Q-PAY-05 | Có cần gộp hóa đơn (gộp nhiều bàn vào một hóa đơn chung) không? | Ảnh hưởng đến luồng thanh toán và trạng thái bàn | Nếu cần, phải thiết kế chức năng chọn nhiều bàn và gộp đơn | **Cao** | Không — đề xuất để ngoài phạm vi phiên bản đầu, cần khách hàng xác nhận | Chưa trả lời |
| Q-PAY-06 | Có cần thanh toán một phần không? (khách trả trước 50%, sau đó trả hết) | Ảnh hưởng đến trạng thái thanh toán, cần thêm trạng thái mới | Nếu cần, thiết kế trạng thái thanh toán hiện tại không đáp ứng | **Cao** | Không — trường hợp hiếm gặp | Chưa trả lời |
| Q-PAY-07 | Có áp dụng VAT không? VAT cấu hình thế nào? (mặc định 0%, 5%, 8%, 10% hay theo từng loại món?) | Ảnh hưởng đến công thức tính tiền, báo cáo thuế | Tính VAT sai dẫn đến sai sót báo cáo tài chính và thuế | **Cao** | VAT theo cấu hình của nhà hàng hoặc theo quy định hiện hành; không mặc định cố định nếu chưa có xác nhận | Chưa trả lời |
| Q-PAY-08 | Ai được phép áp dụng giảm giá? Chỉ thu ngân hay quản lý cũng có thể? Có giới hạn % giảm giá tối đa không? | Ảnh hưởng đến phân quyền module thanh toán, kiểm soát tài chính | Nếu không giới hạn, nhân viên có thể lạm dụng giảm giá | **Cao** | Thu ngân được giảm trong giới hạn cấu hình; trường hợp vượt ngưỡng cần Quản lý phê duyệt | Chưa trả lời |
| Q-PAY-09 | Ai được phép hủy hóa đơn? Chỉ quản lý hay thu ngân cũng được hủy? | Ảnh hưởng đến phân quyền, bảo mật tài chính | Nếu thu ngân được hủy, cần kiểm soát chặt chẽ hơn | **Cao** | Chỉ quản lý nhà hàng được hủy hóa đơn | Chưa trả lời |
| Q-PAY-10 | Hủy hóa đơn có cần nhập lý do và xác thực lại (mật khẩu / mã PIN) không? | Ảnh hưởng đến thiết kế luồng hủy hóa đơn, bảo mật | Nếu không xác thực lại, người khác có thể lợi dụng phiên đăng nhập của quản lý | **Cao** | Có — nhập lý do bắt buộc + xác thực lại mật khẩu | Chưa trả lời |
| Q-PAY-11 | Khi còn món "Chờ chế biến" hoặc "Đang chế biến" mà khách yêu cầu thanh toán, xử lý thế nào? | Ảnh hưởng đến luồng thanh toán và quy tắc tính tiền | Nếu không có quy trình, nhân viên không biết xử lý khi gặp tình huống | **Cao** | Đề xuất 3 phương án: (1) Hủy món, không tính; (2) Cho mang về; (3) Chuyển sang đơn hàng mới | Chưa trả lời |

### 3.G. Thực đơn (Q-MNU)

| Mã câu hỏi | Câu hỏi cần làm rõ | Lý do cần hỏi | Ảnh hưởng nếu chưa làm rõ | Mức ưu tiên | Đề xuất phiên bản đầu | Trạng thái |
|:-----------:|--------------------|---------------|---------------------------|:-----------:|:---------------------:|:----------:|
| Q-MNU-01 | Có cần quản lý size (nhỏ/vừa/lớn), topping hoặc combo không? | Ảnh hưởng đến cấu trúc dữ liệu món ăn, cách tính giá | Nếu có, thiết kế bảng món ăn hiện tại không đủ linh hoạt | **Cao** | Không — đơn giản, mỗi món một giá | Chưa trả lời |
| Q-MNU-02 | Có cần hình ảnh cho từng món ăn không? | Ảnh hưởng đến thiết kế database (có trường image URL), giao diện hiển thị | Nếu cần, phải có chức năng upload và lưu trữ hình ảnh | Trung bình | Có — hỗ trợ upload hình ảnh cho món | Chưa trả lời |
| Q-MNU-03 | Món hết hàng sẽ ẩn hoàn toàn hay vẫn hiển thị với nhãn "Hết món"? | Ảnh hưởng đến giao diện thực đơn gọi món | Nếu ẩn, khách không biết món đó tồn tại; nếu hiển thị, cần thiết kế nhãn | Trung bình | Hiển thị với nhãn "Hết món" — khách biết món và có thể hỏi lại sau | Chưa trả lời |
| Q-MNU-04 | Món đã phát sinh đơn hàng có được xóa cứng không? | Ảnh hưởng đến integrity dữ liệu, báo cáo lịch sử bán hàng | Nếu xóa cứng, mất lịch sử bán hàng của món đó | **Cao** | Không xóa cứng — chuyển sang trạng thái "Ngừng bán" | Chưa trả lời |
| Q-MNU-05 | Có cần quản lý danh mục món linh hoạt không? (thêm, sửa, xóa danh mục) | Ảnh hưởng đến CRUD danh mục, có cần giao diện quản lý danh mục riêng | Nếu không linh hoạt, quản lý không thể tự thêm nhóm món mới | Trung bình | Có — quản lý được thêm/sửa/xóa danh mục | Chưa trả lời |
| Q-MNU-06 | Có cần lịch trình tự động chuyển trạng thái món không? (ví dụ: món sáng 6h-10h, tự động ngừng bán sau 10h) | Ảnh hưởng đến thiết kế lịch trình, scheduled task | Nếu cần, phải phát triển thêm module quản lý thời gian bán | Thấp | Không — quản lý chuyển thủ công | Chưa trả lời |

### 3.H. Kho nguyên liệu (Q-INV)

| Mã câu hỏi | Câu hỏi cần làm rõ | Lý do cần hỏi | Ảnh hưởng nếu chưa làm rõ | Mức ưu tiên | Đề xuất phiên bản đầu | Trạng thái |
|:-----------:|--------------------|---------------|---------------------------|:-----------:|:---------------------:|:----------:|
| Q-INV-01 | Có cần quản lý kho nguyên liệu trong phiên bản đầu không? | Đã xác định là Should Have; cần xác nhận khách hàng có muốn triển khai ngay không | Nếu không cần, có thể giảm scope phát triển đáng kể | **Cao** | Nên triển khai — kho là Should Have quan trọng | Chưa trả lời |
| Q-INV-02 | Nhân viên kho có độc lập với bếp không? Hay một người kiêm cả hai? | Ảnh hưởng đến phân quyền: có tách riêng vai trò nhân viên kho và nhân viên bếp không | Nếu kiêm nhiệm, cần xem xét gộp vai trò hoặc cho phép một tài khoản nhiều vai trò | Trung bình | Tách riêng — nhưng cần hỏi thực tế nhà hàng có đủ nhân sự không | Chưa trả lời |
| Q-INV-03 | Có cần tự động trừ nguyên liệu tồn kho khi món được gửi xuống bếp không? | Ảnh hưởng đến kiến trúc tích hợp giữa module gọi món và module kho | Nếu có, cần xây dựng định mức nguyên liệu cho từng món; độ phức tạp tăng cao | **Cao** | Không — xuất kho thủ công; tự động trừ là giai đoạn sau | Chưa trả lời |
| Q-INV-04 | Có cần định mức nguyên liệu cho từng món ăn không? (mỗi món cần bao nhiêu gram nguyên liệu A, B, C) | Điều kiện tiên quyết cho tự động trừ kho; ảnh hưởng đến cấu trúc dữ liệu | Nếu không có định mức, không thể tự động trừ kho và kiểm soát nguyên liệu theo món | **Cao** | Không — giai đoạn sau | Chưa trả lời |
| Q-INV-05 | Có cần quản lý hạn sử dụng của nguyên liệu không? | Ảnh hưởng đến thiết kế bảng nguyên liệu: có thêm trường hạn sử dụng, trạng thái hết hạn | Nếu không quản lý, rủi ro dùng nguyên liệu hết hạn chế biến món cho khách | Trung bình | Should Have — nên triển khai nếu khách hàng xác nhận cần; có thể để giai đoạn sau | Chưa trả lời |
| Q-INV-06 | Có cần quản lý nhà cung cấp trong phiên bản đầu không? | Ảnh hưởng đến thiết kế module nhập kho: có thêm bảng nhà cung cấp hay không | Nếu không, nhập kho chỉ cần ghi tên người bán dạng text | Trung bình | Không — chỉ ghi tên nhà cung cấp dạng text; quản lý nhà cung cấp là giai đoạn sau | Chưa trả lời |
| Q-INV-07 | Cảnh báo tồn kho thấp gửi đến ai? Nhân viên kho, quản lý hay cả hai? | Ảnh hưởng đến thiết kế thông báo và phân quyền xem cảnh báo | Nếu gửi sai người, cảnh báo không hiệu quả | Trung bình | Cả nhân viên kho và quản lý đều nhận cảnh báo | Chưa trả lời |
| Q-INV-08 | Khi kiểm kê kho phát hiện chênh lệch, quy trình xử lý thế nào? Cần ai phê duyệt? | Ảnh hưởng đến thiết kế luồng kiểm kê: có cần bước phê duyệt không | Nếu không có quy trình, kiểm kê không giải quyết được chênh lệch thực tế | Trung bình | Nhân viên kho kiểm kê, quản lý phê duyệt chênh lệch | Chưa trả lời |

### 3.I. Báo cáo (Q-RPT)

| Mã câu hỏi | Câu hỏi cần làm rõ | Lý do cần hỏi | Ảnh hưởng nếu chưa làm rõ | Mức ưu tiên | Đề xuất phiên bản đầu | Trạng thái |
|:-----------:|--------------------|---------------|---------------------------|:-----------:|:---------------------:|:----------:|
| Q-RPT-01 | Quản lý cần xem báo cáo theo ngày, tháng, năm hay theo khoảng thời gian tùy chọn? | Ảnh hưởng đến thiết kế bộ lọc báo cáo | Nếu chỉ hỗ trợ ngày/tháng/năm cố định, thiếu linh hoạt | **Cao** | Khoảng thời gian tùy chọn: từ ngày → đến ngày | Chưa trả lời |
| Q-RPT-02 | Có cần báo cáo theo ca làm việc không? (ví dụ: ca sáng 6h-14h, ca chiều 14h-22h) | Ảnh hưởng đến thiết kế báo cáo, có cần module quản lý ca hay không | Nếu cần, phải thiết kế thêm module quản lý ca và gán ca cho nhân viên | Trung bình | Should Have — nên triển khai nếu khách hàng xác nhận cần; có thể để giai đoạn sau | Chưa trả lời |
| Q-RPT-03 | Có cần báo cáo theo nhân viên không? (ví dụ: doanh thu theo từng nhân viên phục vụ, thu ngân) | Ảnh hưởng đến thiết kế báo cáo, cần lưu người thực hiện trên hóa đơn | Nếu cần, phải đảm bảo dữ liệu người thực hiện được lưu đầy đủ | Trung bình | Should Have — nên triển khai nếu khách hàng xác nhận cần; có thể để giai đoạn sau | Chưa trả lời |
| Q-RPT-04 | Có cần báo cáo theo khu vực bàn không? (ví dụ: doanh thu khu VIP so với khu thường) | Ảnh hưởng đến thiết kế báo cáo, cần gắn khu vực vào bàn và đơn hàng | Nếu cần, phải đảm bảo dữ liệu khu vực được lưu trong suốt luồng đơn hàng | Thấp | Should Have — nên triển khai nếu khách hàng xác nhận cần; có thể để giai đoạn sau | Chưa trả lời |
| Q-RPT-05 | Có cần thống kê món bán chạy / bán chậm không? | Tài liệu hiện tại đã có chức năng này, cần xác nhận nhu cầu | Nếu cần, thiết kế thống kê theo số lượng và doanh thu | Trung bình | Có — thống kê top món bán chạy, bottom món bán chậm | Chưa trả lời |
| Q-RPT-06 | Có cần xuất báo cáo ra Excel / PDF không? | Ảnh hưởng đến thiết kế tính năng export, thư viện xuất file | Nếu cần, phải phát triển thêm module xuất file | Trung bình | Có — xuất Excel và PDF | Chưa trả lời |
| Q-RPT-07 | Thu ngân được xem những loại báo cáo nào? | Tài liệu hiện đang mơ hồ: thu ngân có quyền R trên thống kê hóa đơn và xuất báo cáo | Nếu không rõ, thiết kế phân quyền báo cáo sai | **Cao** | Thu ngân xem thống kê hóa đơn; không xem báo cáo doanh thu tổng hợp | Chưa trả lời |
| Q-RPT-08 | Có cần báo cáo riêng về các hóa đơn bị hủy để quản lý theo dõi không? | Ảnh hưởng đến thiết kế báo cáo, có thêm một loại báo cáo mới | Nếu cần, phải thiết kế báo cáo hóa đơn hủy với chi tiết lý do | Trung bình | Có — giúp quản lý kiểm soát thất thoát | Chưa trả lời |

### 3.J. Phân quyền và tài khoản (Q-AUTH)

| Mã câu hỏi | Câu hỏi cần làm rõ | Lý do cần hỏi | Ảnh hưởng nếu chưa làm rõ | Mức ưu tiên | Đề xuất phiên bản đầu | Trạng thái |
|:-----------:|--------------------|---------------|---------------------------|:-----------:|:---------------------:|:----------:|
| Q-AUTH-01 | Một nhân viên có thể có nhiều vai trò không? (ví dụ: vừa phục vụ vừa thu ngân) | Ảnh hưởng đến thiết kế phân quyền: một tài khoản một vai trò hay nhiều vai trò | Nếu không hỗ trợ, nhân viên kiêm nhiệm phải có hai tài khoản | **Cao** | Một tài khoản một vai trò; nếu kiêm nhiệm thì tạo hai tài khoản | Chưa trả lời |
| Q-AUTH-02 | Quản lý nhà hàng và Quản trị hệ thống có tách riêng không? | Ảnh hưởng đến ma trận phân quyền, hai vai trò khác nhau nhưng có thể một người kiêm | Nếu không tách, quản lý có thể tự tạo tài khoản, mất kiểm soát bảo mật | **Cao** | Tách riêng — nhưng trong thực tế một người có thể kiêm cả hai | Chưa trả lời |
| Q-AUTH-03 | Ai được tạo tài khoản nhân viên? Chỉ quản trị hệ thống hay quản lý cũng được tạo? | Hiện tại ma trận phân quyền cho cả Quản lý và Quản trị đều có C trên module nhân viên | Nếu cả hai cùng tạo, dễ dẫn đến xung đột phân quyền | **Cao** | Quản lý tạo hồ sơ nhân viên; Quản trị tạo tài khoản và phân quyền | Chưa trả lời |
| Q-AUTH-04 | Ai được khóa / mở khóa tài khoản? | Ảnh hưởng đến phân quyền bảo mật: ai có quyền vô hiệu hóa tài khoản người khác | Nếu không rõ, có thể dẫn đến lạm dụng quyền khóa tài khoản | **Cao** | Chỉ Quản trị hệ thống được khóa/mở khóa | Chưa trả lời |
| Q-AUTH-05 | Có cần ghi nhật ký hoạt động (audit log) cho mọi thao tác quan trọng không? | Tài liệu đã đề xuất danh sách thao tác cần ghi log; cần xác nhận có đủ không | Nếu thiếu, không truy vết được khi có sự cố | **Cao** | Có — theo danh sách tại BR-AUTH-06 | Chưa trả lời |
| Q-AUTH-06 | Có cần xác thực lại (mật khẩu / PIN) khi thực hiện thao tác nhạy cảm như hủy hóa đơn không? | Ảnh hưởng đến thiết kế bảo mật, UX | Nếu không xác thực lại, người khác có thể lợi dụng phiên đăng nhập | **Cao** | Có — xác thực lại cho thao tác hủy hóa đơn và giảm giá vượt ngưỡng | Chưa trả lời |
| Q-AUTH-07 | Có cần quyền "xem" riêng cho từng loại báo cáo không? Hay gom chung một quyền "Xem báo cáo"? | Ảnh hưởng đến độ chi tiết của phân quyền module báo cáo | Nếu gom chung, không kiểm soát được ai xem báo cáo gì | Trung bình | Nên tách riêng: báo cáo doanh thu, thống kê hóa đơn, thống kê món | Chưa trả lời |
| Q-AUTH-08 | Nhân viên phục vụ có được áp dụng giảm giá trong một số trường hợp không? (khách quen, bù lỗi món) | Ảnh hưởng đến phân quyền module thanh toán | Nếu phục vụ được giảm giá, cần kiểm soát mức giảm và ghi nhận lý do | Trung bình | Không — chỉ thu ngân và quản lý được giảm giá | Chưa trả lời |

---

## 4. Thống kê

### 4.1. Số lượng câu hỏi theo nhóm

| Nhóm | Mã prefix | Số câu hỏi | Số câu ưu tiên Cao |
|:----:|:---------:|:-----------:|:------------------:|
| Phạm vi hệ thống | Q-SCOPE | 6 | 4 |
| Quản lý bàn | Q-TBL | 6 | 2 |
| Đặt bàn | Q-RES | 9 | 3 |
| Gọi món | Q-ORD | 6 | 4 |
| Bếp | Q-KIT | 6 | 4 |
| Thanh toán | Q-PAY | 11 | 9 |
| Thực đơn | Q-MNU | 6 | 2 |
| Kho nguyên liệu | Q-INV | 8 | 3 |
| Báo cáo | Q-RPT | 8 | 2 |
| Phân quyền và tài khoản | Q-AUTH | 8 | 6 |
| **Tổng cộng** | **10 nhóm** | **74** | **39** |

### 4.2. Phân bố mức ưu tiên

| Mức ưu tiên | Số lượng | Tỷ lệ |
|:-----------:|:--------:|:-----:|
| **Cao** | 39 | 52,7% |
| Trung bình | 27 | 36,5% |
| Thấp | 8 | 10,8% |

---

## 5. Kết luận

- **39 câu hỏi mức ưu tiên Cao** cần được trả lời **trước khi thiết kế hoặc triển khai**. Các câu hỏi này ảnh hưởng trực tiếp đến kiến trúc hệ thống, luồng nghiệp vụ chính, cấu trúc dữ liệu và phân quyền.

- **27 câu hỏi mức Trung bình** cần được chốt trước khi làm chi tiết từng module. Các câu hỏi này ảnh hưởng đến thiết kế module cụ thể nhưng không làm thay đổi kiến trúc tổng thể.

- **8 câu hỏi mức Thấp** có thể để giai đoạn mở rộng sau MVP. Các câu hỏi này chủ yếu liên quan đến tính năng nâng cao.

- **Nhóm thanh toán (Q-PAY)** có nhiều câu hỏi ưu tiên Cao nhất (9 câu), phản ánh độ phức tạp và rủi ro cao của module này. Cần ưu tiên làm rõ nhóm thanh toán trước.

- **Nhóm phân quyền (Q-AUTH)** có 6 câu hỏi ưu tiên Cao, liên quan đến bảo mật và kiểm soát truy cập — cần chốt sớm để tránh thiết kế sai phân quyền.

- **Nhóm kho (Q-INV)** và **nhóm báo cáo (Q-RPT)** cũng có nhiều câu hỏi cần làm rõ về phạm vi và chi tiết, do đây là các module Should Have có thể ảnh hưởng đến scope phát triển.

---

## 6. Hướng dẫn sử dụng

1. **Gửi cho khách hàng:** File này có thể dùng làm tài liệu phỏng vấn trực tiếp hoặc gửi qua email để khách hàng trả lời từng câu hỏi.

2. **Cập nhật trạng thái:** Sau khi khách hàng trả lời, cập nhật cột "Trạng thái" từ "Chưa trả lời" → "Đã trả lời" và ghi lại câu trả lời vào cột ghi chú (nếu cần thêm cột).

3. **Chuyển sang tài liệu thiết kế:** Câu trả lời cho các câu hỏi mức Cao sẽ là đầu vào trực tiếp cho thiết kế kiến trúc, database và giao diện.

---

*Tài liệu này là công cụ giao tiếp giữa BA và khách hàng. Các câu hỏi chưa trả lời không được phép đưa thành chức năng bắt buộc trong thiết kế.*
