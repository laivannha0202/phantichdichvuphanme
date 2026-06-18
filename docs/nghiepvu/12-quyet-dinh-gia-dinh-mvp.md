# Quyết định và giả định MVP — Hệ thống quản lý nhà hàng

## 1. Mục đích tài liệu

Tài liệu này tổng hợp các **quyết định tạm thời (assumption)** và **giả định thiết kế**
được đưa ra dựa trên phân tích nghiệp vụ, cho phép nhóm kỹ thuật bắt đầu thiết kế kiến trúc
và triển khai mà không phải chờ toàn bộ 74 câu hỏi tại file 07 được trả lời.

Mục đích cụ thể:

- **Chốt giả định:** Xác định rõ quyết định nào đã có thể chốt dựa trên phân tích, quyết
  định nào bắt buộc phải có khách hàng xác nhận.
- **Phân loại mức độ an toàn:** Đánh giá rủi ro nếu giả định sai — giả định an toàn có thể
  sửa mà không ảnh hưởng kiến trúc; giả định rủi ro cao cần khách hàng xác nhận trước.
- **Kiểm soát scope:** Ngăn chặn việc tự ý thêm chức năng ngoài phạm vi MVP dựa trên giả
  định chưa được xác nhận.
- **Căn cứ cho thiết kế kỹ thuật:** Nhóm kỹ thuật dùng tài liệu này làm đầu vào cho thiết
  kế mô hình dữ liệu, phần xử lý hệ thống và giao diện.

Tài liệu này kế thừa từ:

- [07-cau-hoi-lam-ro.md](./07-cau-hoi-lam-ro.md) — 74 câu hỏi, 10 nhóm, tất cả trạng thái "Chưa trả lời"
- [08-pham-vi-mvp-va-backlog.md](./08-pham-vi-mvp-va-backlog.md) — MoSCoW, 34 Must Have, 14 Should Have
- [09-user-stories-va-sprint-goi-y.md](./09-user-stories-va-sprint-goi-y.md) — 48 US, 6 sprint

---

## 2. Phân loại quyết định

### 2.1. Ba loại quyết định

| Loại | Ý nghĩa | Số lượng | Hành động nếu sai |
|:----:|---------|:--------:|-------------------|
| **🔒 Tạm chốt** | Có thể quyết định ngay dựa trên phân tích. Rủi ro thấp. | 24 | Sửa local, không ảnh hưởng kiến trúc |
| **⚠️ Cần xác nhận** | Có đề xuất nhưng cần khách hàng đồng ý. Rủi ro trung bình. | 13 | Sửa module, ảnh hưởng trong phạm vi module |
| **🚫 Để sau MVP** | Chưa quyết định, để giai đoạn mở rộng. Rủi ro cao nếu quyết định sai. | 5 | — |

### 2.2. Quy tắc áp dụng

1. **Quyết định loại 🔒 có hiệu lực ngay** — nhóm kỹ thuật dùng làm căn cứ thiết kế.
2. **Quyết định loại ⚠️ phải được khách hàng xác nhận trước Sprint tương ứng.**
   Nếu khách hàng không phản hồi, mặc định áp dụng đề xuất và ghi nhận rủi ro.
3. **Quyết định loại 🚫 không được thiết kế, không được dự trù tài nguyên.**
   Nếu khách hàng yêu cầu, phải đánh giá lại scope và kế hoạch.

---

## 3. Quyết định theo nhóm

### 3.A. Phạm vi hệ thống (SCOPE) — 4 quyết định

| # | Câu hỏi (file 07) | Quyết định / Giả định | Loại | Căn cứ | Rủi ro nếu sai |
|:-:|:-----------------:|----------------------|:----:|--------|:--------------:|
| 1 | Q-SCOPE-01: Một hay nhiều chi nhánh? | **⚠️ Giả định một nhà hàng.** MVP chưa quản lý chi nhánh. Báo cáo chỉ phục vụ một nhà hàng. Cần khách hàng xác nhận nếu có nhu cầu mở rộng. | ⚠️ | Phân tích: yêu cầu không đề cập đa chi nhánh, 08-Won't Have. **Cần khách hàng xác nhận.** | Cao — phải bổ sung thông tin chi nhánh vào hầu hết các phần và thiết kế lại báo cáo |
| 2 | Q-SCOPE-02: QR order trong phiên bản đầu? | **🔒 Không.** Chức năng gọi món chỉ dành cho nhân viên phục vụ. Actor Khách hàng chưa có. | 🔒 | 08-Could Have, 08-mục 6.1 phân tích rủi ro | Trung bình — cần thêm actor và kênh gọi món mới |
| 3 | Q-SCOPE-04: Ứng dụng mobile riêng? | **🔒 Không.** Chỉ triển khai trên nền web cho nhân viên. | 🔒 | 08-Won't Have | Thấp — có thể thêm sau qua phần xử lý hệ thống |
| 4 | Q-SCOPE-06: Nhà hàng đã có quy trình vận hành hiện tại chưa? | **⚠️ Giả định có quy trình thủ công.** Đề xuất khảo sát trước Sprint 2. Nếu không khảo sát được, dùng tài liệu nghiệp vụ làm chuẩn. | ⚠️ | Chưa có thông tin | Trung bình — tài liệu có thể sai lệch so với thực tế |

### 3.B. Quản lý bàn (TBL) — 4 quyết định

| # | Câu hỏi (file 07) | Quyết định / Giả định | Loại | Căn cứ | Rủi ro nếu sai |
|:-:|:-----------------:|----------------------|:----:|--------|:--------------:|
| 5 | Q-TBL-01: Có những khu vực bàn nào? | **⚠️ Có khu vực.** MVP cần ghi nhận thông tin khu vực bàn. Mặc định Trong nhà, Ngoài trời, Phòng VIP. Cần khách hàng xác nhận danh sách. | ⚠️ | Phân tích: hầu hết nhà hàng đều có khu vực | Thấp — thêm/sửa khu vực không ảnh hưởng kiến trúc |
| 6 | Q-TBL-02: Có cần gộp bàn? | **🔒 Không.** Không hỗ trợ gộp bàn trong MVP. | 🔒 | 08-Won't Have | Trung bình — nếu cần phải thiết kế lại luồng đơn hàng và trạng thái bàn |
| 7 | Q-TBL-03: Sau thanh toán, bàn chuyển về đâu? | **🔒 Chuyển về "Cần dọn".** Nhân viên phục vụ xác nhận dọn xong → "Trống". | 🔒 | 04-BR-TBL quy tắc trạng thái | Thấp — có thể cấu hình luồng trạng thái |
| 8 | Q-TBL-06: Bàn đã đặt có được xếp khách trực tiếp? | **🔒 Không cho phép.** Bàn "Đã đặt" giữ nguyên, không xếp khách trực tiếp. | 🔒 | Phân tích: tránh xung đột | Trung bình — nếu sai, cần cơ chế ưu tiên và cảnh báo |

### 3.C. Đặt bàn (RES) — 5 quyết định

| # | Câu hỏi (file 07) | Quyết định / Giả định | Loại | Căn cứ | Rủi ro nếu sai |
|:-:|:-----------------:|----------------------|:----:|--------|:--------------:|
| 9 | Q-RES-01: Nhận đặt bàn qua kênh nào? | **🔒 Điện thoại + trực tiếp.** Nhân viên tạo đặt bàn. Không có kênh online. | 🔒 | 08-Must Have, 08-Could Have | Thấp — thêm kênh online là module riêng |
| 10 | Q-RES-03: Thời gian giữ bàn mặc định? | **⚠️ 15 phút mặc định, có thể thay đổi.** Cần ghi nhận thông tin cấu hình thời gian giữ bàn. | ⚠️ | Đề xuất BA dựa trên thực tế nhà hàng | Thấp — chỉ cần thay đổi số |
| 11 | Q-RES-06: Một lượt đặt nhiều bàn? | **⚠️ Mặc định một lượt đặt chọn một bàn.** Trường hợp đặt nhiều bàn cho khách đoàn cần khách hàng xác nhận trước khi đưa vào MVP. | ⚠️ | Cần khách hàng xác nhận nhu cầu đặt nhiều bàn cho khách đoàn | Trung bình — nếu không có nhu cầu, giữ nguyên thiết kế một bàn một lượt đặt |
| 12 | Q-RES-07: Có cần đặt cọc? | **🔒 Không.** Chưa có chức năng đặt cọc. | 🔒 | 08-Could Have | Trung bình — nếu cần, thêm trạng thái và chức năng thanh toán |
| 13 | Q-RES-09: Có trạng thái "Chờ xác nhận"? | **⚠️ MVP vẫn giữ trạng thái Chờ xác nhận để linh hoạt.** Trường hợp nhân viên tạo và xác nhận ngay thì hệ thống có thể chuyển nhanh từ Chờ xác nhận sang Đã xác nhận. Cần khách hàng xác nhận quy trình thực tế. | ⚠️ | Đề xuất giữ trạng thái để linh hoạt, cần khách hàng xác nhận quy trình thực tế | Thấp — thêm trạng thái không ảnh hưởng nhiều |

### 3.D. Gọi món (ORD) — 4 quyết định

| # | Câu hỏi (file 07) | Quyết định / Giả định | Loại | Căn cứ | Rủi ro nếu sai |
|:-:|:-----------------:|----------------------|:----:|--------|:--------------:|
| 14 | Q-ORD-01: Ai gọi món? | **🔒 Chỉ nhân viên phục vụ.** Không có QR order. | 🔒 | 08-Must Have, 08-Could Have | Thấp — thêm QR là module riêng |
| 15 | Q-ORD-02: Có ghi chú món? | **🔒 Có — ghi chú cho từng món.** Hiển thị trên màn hình bếp. | 🔒 | Phân tích: yêu cầu rõ ràng từ nghiệp vụ | Thấp — bỏ ghi chú dễ hơn thêm |
| 16 | Q-ORD-03: Gọi thêm món nhiều lần? | **🔒 Có — nhiều lần trong cùng đơn hàng.** | 🔒 | 04-BR-ORD-04 quy tắc nghiệp vụ | Cao — nếu sai, cấu trúc đơn hàng phải thay đổi |
| 17 | Q-ORD-06: Hủy món đến trạng thái nào? | **🔒 Chỉ hủy khi "Chờ chế biến".** Không hủy khi "Đang chế biến". | 🔒 | 04-BR-ORD quy tắc hủy món | Trung bình — nếu cho hủy khi đang chế biến, cần quy trình phức tạp hơn |

### 3.E. Bếp (KIT) — 3 quyết định

| # | Câu hỏi (file 07) | Quyết định / Giả định | Loại | Căn cứ | Rủi ro nếu sai |
|:-:|:-----------------:|----------------------|:----:|--------|:--------------:|
| 18 | Q-KIT-01: Bếp xem màn hình hay in phiếu? | **🔒 Màn hình điện tử là chính.** Chức năng in phiếu bếp là tùy chọn, có thể bổ sung khi khách hàng yêu cầu. | 🔒 | Phân tích: màn hình là xu hướng, in phiếu là tùy chọn | Thấp — in phiếu là thêm, không ảnh hưởng kiến trúc |
| 19 | Q-KIT-02: Có chia khu bếp? | **⚠️ Giả định có ít nhất 2 khu: Bếp nóng + Đồ uống.** Nếu có nhiều khu bếp, cần ghi nhận khu vực bếp để phân loại món. | ⚠️ | Phân tích: hầu hết nhà hàng có bếp nóng và pha chế riêng | Trung bình — nếu không có, đơn giản hóa thành 1 khu |
| 20 | Q-KIT-04: Thông báo món hoàn thành bằng cách nào? | **🔒 Pop-up + âm thanh trên trình duyệt.** Thông báo qua trình duyệt, không cần tích hợp thêm. | 🔒 | Đề xuất kỹ thuật — đơn giản, không cần tích hợp thêm | Thấp — có thể nâng cấp cơ chế sau |

### 3.F. Thanh toán (PAY) — 7 quyết định

| # | Câu hỏi (file 07) | Quyết định / Giả định | Loại | Căn cứ | Rủi ro nếu sai |
|:-:|:-----------------:|----------------------|:----:|--------|:--------------:|
| 21 | Q-PAY-01: Hình thức thanh toán nào? | **⚠️ Tiền mặt + Chuyển khoản + Thẻ (POS).** Không tích hợp cổng thanh toán online. | ⚠️ | Đề xuất dựa trên nhà hàng phổ biến | Cao — nếu cần thêm hình thức, ảnh hưởng chức năng thanh toán |
| 22 | Q-PAY-04: Có tách hóa đơn? | **🚫 Không đưa vào MVP.** Tách hóa đơn là nhu cầu phát sinh, cần khách hàng xác nhận trước khi triển khai. | 🚫 | 08-mục 6.3 rủi ro cao | Cao — tách hóa đơn ảnh hưởng toàn bộ luồng thanh toán |
| 23 | Q-PAY-05: Có gộp hóa đơn? | **🚫 Không đưa vào MVP.** Gộp hóa đơn là nhu cầu phát sinh, cần khách hàng xác nhận trước khi triển khai. | 🚫 | 08-mục 6.2 rủi ro | Cao — gộp hóa đơn thay đổi cấu trúc thanh toán |
| 24 | Q-PAY-06: Có thanh toán một phần? | **🚫 Không đưa vào MVP.** Thanh toán một phần là nhu cầu phát sinh, cần khách hàng xác nhận trước khi triển khai. | 🚫 | Phân tích: trường hợp hiếm | Trung bình — nếu cần, thêm trạng thái "Thanh toán một phần" |
| 25 | Q-PAY-07: VAT xử lý thế nào? | **⚠️ VAT theo cấu hình linh hoạt (0%, 5%, 8%, 10%).** Mặc định 0% nếu chưa có xác nhận. Không gắn VAT theo loại món. | ⚠️ | 04-BR-PAY-09 | Cao — sai VAT dẫn đến sai báo cáo thuế |
| 26 | Q-PAY-09: Ai được hủy hóa đơn? | **🔒 Chỉ Quản lý nhà hàng.** Thu ngân không được hủy. | 🔒 | Đề xuất BA | Trung bình — nếu thu ngân cũng được hủy, cần kiểm soát chặt hơn |
| 27 | Q-PAY-10: Hủy hóa đơn có cần xác thực lại? | **⚠️ Có — nhập lý do bắt buộc + xác nhận mật khẩu.** | ⚠️ | Đề xuất BA dựa trên an toàn tài chính | Trung bình — nếu không cần, bỏ bước xác thực |

### 3.G. Thực đơn (MNU) — 3 quyết định

| # | Câu hỏi (file 07) | Quyết định / Giả định | Loại | Căn cứ | Rủi ro nếu sai |
|:-:|:-----------------:|----------------------|:----:|--------|:--------------:|
| 28 | Q-MNU-01: Có size/topping/combo? | **🔒 Không.** Mỗi món một giá. Biến thể (size/topping) để giai đoạn sau. | 🔒 | 08-Could Have | Trung bình — thay đổi cấu trúc món |
| 29 | Q-MNU-04: Xóa món cứng? | **🔒 Không xóa cứng.** Chuyển trạng thái "Ngừng bán" thay vì xóa. | 🔒 | 04-BR-MNU | Thấp — an toàn cho dữ liệu |
| 30 | Q-MNU-06: Lịch trình tự động chuyển trạng thái món? | **🔒 Không.** Quản lý chuyển thủ công. | 🔒 | 08-Could Have | Thấp — thêm sau không ảnh hưởng |

### 3.H. Kho nguyên liệu (INV) — 4 quyết định

| # | Câu hỏi (file 07) | Quyết định / Giả định | Loại | Căn cứ | Rủi ro nếu sai |
|:-:|:-----------------:|----------------------|:----:|--------|:--------------:|
| 31 | Q-INV-01: Có quản lý kho trong phiên bản đầu? | **⚠️ Có — nếu khách hàng xác nhận.** Cần xây dựng chức năng quản lý kho cơ bản (nhập, xuất, kiểm kê thủ công). | ⚠️ | 08-Should Have | Trung bình — nếu không cần, giảm scope (từ 6 US xuống 0) |
| 32 | Q-INV-03: Tự động trừ kho theo món? | **🔒 Không.** Xuất kho thủ công. Tự động trừ là giai đoạn sau. | 🔒 | 08-mục 6.4 rủi ro | Thấp — dễ thêm sau hơn sửa |
| 33 | Q-INV-04: Có định mức nguyên liệu? | **🔒 Không.** Không xây dựng công thức định mức. | 🔒 | 08-Could Have | Thấp — thêm sau khi có tự động trừ kho |
| 34 | Q-INV-06: Quản lý nhà cung cấp? | **🔒 Không.** Nhập kho chỉ ghi tên nhà cung cấp dạng text. | 🔒 | 08-Could Have | Thấp — thêm thông tin nhà cung cấp sau |

### 3.I. Báo cáo (RPT) — 4 quyết định

| # | Câu hỏi (file 07) | Quyết định / Giả định | Loại | Căn cứ | Rủi ro nếu sai |
|:-:|:-----------------:|----------------------|:----:|--------|:--------------:|
| 35 | Q-RPT-01: Báo cáo theo khoảng thời gian nào? | **🔒 Khoảng thời gian tùy chọn (từ ngày → đến ngày).** Cả ngày, tháng, năm. | 🔒 | Phân tích: linh hoạt nhất | Thấp |
| 36 | Q-RPT-02: Báo cáo theo ca làm việc? | **🚫 Để sau MVP.** Chưa có chức năng quản lý ca. | 🚫 | 08-Could Have | — |
| 37 | Q-RPT-03: Báo cáo theo nhân viên? | **🚫 Để sau MVP.** Chưa có chức năng báo cáo theo nhân viên. | 🚫 | 08-Could Have | — |
| 38 | Q-RPT-07: Thu ngân xem báo cáo gì? | **🔒 Thu ngân xem thống kê hóa đơn.** Không xem báo cáo doanh thu tổng hợp. | 🔒 | 02-Actor và phân quyền | Trung bình — nếu sai, điều chỉnh phân quyền |

### 3.J. Phân quyền và tài khoản (AUTH) — 4 quyết định

| # | Câu hỏi (file 07) | Quyết định / Giả định | Loại | Căn cứ | Rủi ro nếu sai |
|:-:|:-----------------:|----------------------|:----:|--------|:--------------:|
| 39 | Q-AUTH-01: Một nhân viên nhiều vai trò? | **⚠️ Giả định một tài khoản một vai trò.** Không hỗ trợ nhiều vai trò trên cùng một tài khoản. Cần khách hàng xác nhận nếu có nhu cầu phân quyền linh hoạt hơn. | ⚠️ | Đề xuất BA — đơn giản, dễ kiểm soát. **Cần khách hàng xác nhận.** | Trung bình — nếu cần nhiều vai trò, phải điều chỉnh phân quyền |
| 40 | Q-AUTH-02: Quản lý và Quản trị có tách riêng? | **🔒 Tách riêng.** Hai vai trò khác nhau, phân quyền khác nhau. | 🔒 | 02-Actor và phân quyền | Thấp — gộp lại dễ hơn tách |
| 41 | Q-AUTH-05: Có audit log? | **🔒 Có — ghi nhật ký theo danh sách thao tác tại BR-AUTH-06.** | 🔒 | 04-BR-AUTH-06 | Thấp — thêm thao tác cần log không ảnh hưởng |
| 42 | Q-AUTH-06: Xác thực lại cho thao tác nhạy cảm? | **⚠️ Có — xác thực lại cho hủy hóa đơn và giảm giá vượt ngưỡng.** | ⚠️ | Đề xuất BA | Thấp — bỏ xác thực dễ hơn thêm |

---

## 4. Thống kê quyết định

| Loại | Số lượng | Tỷ lệ |
|:----:|:--------:|:-----:|
| **🔒 Tạm chốt** | 24 | 57,1% |
| **⚠️ Cần xác nhận** | 13 | 31,0% |
| **🚫 Để sau MVP** | 5 | 11,9% |
| **Tổng** | **42** | **100%** |

### 4.1. Quyết định theo mức rủi ro

| Mức rủi ro nếu sai | Số lượng | Quyết định |
|:------------------:|:--------:|:----------:|
| **Cao** | 6 | Q-SCOPE-01, Q-ORD-03, Q-PAY-01, Q-PAY-04, Q-PAY-05, Q-PAY-07 |
| **Trung bình** | 13 | Q-SCOPE-06, Q-TBL-02, Q-TBL-06, Q-RES-06, Q-RES-07, Q-ORD-06, Q-KIT-02, Q-PAY-06, Q-PAY-09, Q-PAY-10, Q-MNU-01, Q-INV-01, Q-AUTH-01 |
| **Thấp** | 23 | Còn lại |

### 4.2. Top quyết định rủi ro cao nhất (cần xác nhận trước)

| Mức độ | Quyết định | Ảnh hưởng |
|:------:|:----------:|:----------:|
| 🔴 Cực kỳ rủi ro | Q-SCOPE-01: Một nhà hàng | Toàn bộ mô hình dữ liệu, phần xử lý hệ thống, báo cáo |
| 🔴 Rủi ro cao | Q-PAY-01: Hình thức thanh toán | Chức năng thanh toán |
| 🔴 Rủi ro cao | Q-PAY-04: Tách hóa đơn | Luồng thanh toán |
| 🟡 Rủi ro trung bình | Q-AUTH-01: Multi-role | Phân quyền toàn bộ hệ thống |

---

## 5. Điểm cần khách hàng xác nhận bắt buộc

Dưới đây là các quyết định loại **⚠️** được sắp xếp theo thứ tự ưu tiên cần xác nhận.

### 5.1. Nhóm 1 — Phải xác nhận trước Sprint 1 (ảnh hưởng kiến trúc)

| # | Nội dung | Đề xuất | Ảnh hưởng nếu khách chọn khác |
|:-:|----------|:-------:|:------------------------------:|
| 1 | Hệ thống dùng cho một nhà hàng? | **⚠️ Giả định một nhà hàng** | Phải bổ sung thông tin chi nhánh vào hầu hết các phần → thiết kế lại |
| 2 | Một tài khoản một vai trò? | **⚠️ Giả định một vai trò** | Phải điều chỉnh phân quyền hỗ trợ nhiều vai trò |
| 3 | Có quy trình vận hành hiện tại không? | **⚠️ Giả định có** | Có thể phải điều chỉnh tài liệu |

### 5.2. Nhóm 2 — Phải xác nhận trước Sprint 3 (ảnh hưởng gọi món)

| # | Nội dung | Đề xuất | Ảnh hưởng nếu khách chọn khác |
|:-:|----------|:-------:|:------------------------------:|
| 4 | Có chia khu bếp theo loại món? | **⚠️ Có 2 khu: nóng + đồ uống** | Đơn giản hóa phân luồng nếu không có |
| 5 | Thời gian giữ bàn mặc định? | **⚠️ 15 phút, cấu hình được** | Chỉ cần đổi số |

### 5.3. Nhóm 3 — Phải xác nhận trước Sprint 5 (ảnh hưởng thanh toán)

| # | Nội dung | Đề xuất | Ảnh hưởng nếu khách chọn khác |
|:-:|----------|:-------:|:------------------------------:|
| 6 | Hình thức thanh toán? | **⚠️ Tiền mặt + CK + Thẻ** | Thêm/bớt phương thức |
| 7 | VAT cấu hình thế nào? | **⚠️ Linh hoạt 0-10%** | Chỉ cần đổi config |
| 8 | Hủy hóa đơn có cần xác thực lại? | **⚠️ Có — nhập mật khẩu** | Bỏ bước xác thực |
| 9 | Xác thực lại thao tác nhạy cảm? | **⚠️ Có** | Bỏ cơ chế xác thực |

### 5.4. Nhóm 4 — Phải xác nhận trước Sprint 6 (ảnh hưởng kho)

| # | Nội dung | Đề xuất | Ảnh hưởng nếu khách chọn khác |
|:-:|----------|:-------:|:------------------------------:|
| 10 | Có quản lý kho trong phiên bản đầu? | **⚠️ Có — cơ bản (Should Have)** | Giảm scope 6 US (INV), tách sang giai đoạn sau |

---

## 6. Tác động đến các tài liệu khác

### 6.1. Ma trận tác động

| Quyết định | Tác động đến | Mức thay đổi | File cần cập nhật |
|:----------:|:------------:|:------------:|:-----------------:|
| Q-SCOPE-01: Một nhà hàng | Mô hình dữ liệu, phần xử lý hệ thống, báo cáo | **Lớn** | 01-tong-quan, 03-UC, 04-quy-tac, 05-trang-thai |
| Q-ORD-03: Gọi thêm nhiều lần | Cấu trúc đơn hàng | **Lớn** | 04-quy-tac-nghiep-vu (BR-ORD) |
| Q-PAY-01: Hình thức thanh toán | Chức năng thanh toán | Trung bình | 03-UC-07, 06-AC |
| Q-KIT-02: Chia khu bếp | Phân luồng món đến bếp | Trung bình | 04-quy-tac-nghiep-vu (BR-KIT) |
| Q-MNU-01: Không có size/topping | Cấu trúc món | Trung bình | 04-quy-tac-nghiep-vu (BR-MNU) |
| Q-AUTH-01: Một vai trò | Phân quyền | **Lớn** | 02-actor-va-phan-quyen |
| Các quyết định còn lại | Local | Nhỏ | Không ảnh hưởng |

### 6.2. Hướng dẫn cập nhật

| File | Hành động |
|:----:|-----------|
| [01-tong-quan-yeu-cau-chuan-hoa.md](./01-tong-quan-yeu-cau-chuan-hoa.md) | Bổ sung cột "Quyết định" MoSCoW tham chiếu đến quyết định tại file này |
| [02-actor-va-phan-quyen.md](./02-actor-va-phan-quyen.md) | Không thay đổi — giữ nguyên 6 actor như hiện tại |
| [03-use-case-chi-tiet.md](./03-use-case-chi-tiet.md) | Bổ sung ghi chú cho các UC bị ảnh hưởng bởi quyết định |
| [06-acceptance-criteria.md](./06-acceptance-criteria.md) | Rà soát AC có mâu thuẫn với quyết định không |

---

## 7. Nguyên tắc khi khách hàng phản hồi

1. **Nếu khách hàng đồng ý với đề xuất:** Quyết định từ ⚠️ chuyển thành 🔒.
   Không cần cập nhật tài liệu, chỉ ghi nhận trạng thái.

2. **Nếu khách hàng chọn khác với đề xuất:**
   - Đánh giá mức ảnh hưởng (theo bảng 6.1).
   - Cập nhật các file bị tác động.
   - Điều chỉnh kế hoạch sprint nếu ảnh hưởng lớn.
   - Thông báo cho nhóm kỹ thuật.

3. **Nếu khách hàng không phản hồi sau 2 lần nhắc:**
   - Quyết định ⚠️ mặc định áp dụng đề xuất.
   - Ghi chú: "Áp dụng theo đề xuất do chưa nhận được phản hồi từ khách hàng."
   - Đánh dấu rủi ro trong kế hoạch dự phòng.

4. **Nếu khách hàng yêu cầu chức năng loại 🚫:**
   - Không tự ý thêm vào MVP.
   - Yêu cầu khách hàng cung cấp yêu cầu chi tiết (file 07).
   - Đánh giá lại scope và lập kế hoạch mở rộng.
   - Nếu khách hàng yêu cầu gấp, chuyển sang phiên bản mở rộng có thương lượng lại.

---

## 8. Kết luận

1. **24/42 quyết định (57,1%) có thể tạm chốt ngay** — nhóm kỹ thuật có thể bắt đầu thiết
   kế dựa trên các quyết định này. Các quyết định này chủ yếu dựa trên phân tích từ file
   08 (MoSCoW), file 04 (quy tắc nghiệp vụ) và các phân tích rủi ro.

2. **13 quyết định cần khách hàng xác nhận** — chủ yếu tập trung ở nhóm Thanh toán,
   Phạm vi hệ thống và Phân quyền. Các quyết định này ảnh hưởng đến thiết kế module và cần
   được xác nhận trước sprint tương ứng.

3. **5 quyết định để sau MVP** — gồm báo cáo theo ca (Q-RPT-02), báo cáo theo nhân viên
   (Q-RPT-03), tách hóa đơn (Q-PAY-04), gộp hóa đơn (Q-PAY-05) và thanh toán một phần
   (Q-PAY-06). Không thiết kế, không dự trù tài nguyên.

4. **6 quyết định có rủi ro cao nếu sai:** Q-SCOPE-01 (một nhà hàng), Q-ORD-03 (gọi thêm
   nhiều lần), Q-PAY-01 (hình thức thanh toán), Q-PAY-04 (tách hóa đơn), Q-PAY-05 (gộp
   hóa đơn), Q-PAY-07 (VAT). Các quyết định này cần được ưu tiên xác nhận.

5. **Tài liệu này sống động** — sẽ được cập nhật khi có phản hồi từ khách hàng. Mỗi lần
   cập nhật, ghi rõ ngày, nội dung thay đổi và người cập nhật.

---

## Phụ lục: Lịch trình xác nhận theo Sprint

| Sprint | Thời gian | Quyết định cần xác nhận trước | Ghi chú |
|:------:|:---------:|:-----------------------------:|---------|
| **1** | Tuần 1-2 | Q-SCOPE-01 (một nhà hàng), Q-AUTH-01 (một vai trò), Q-SCOPE-06 (quy trình hiện tại) | Ảnh hưởng kiến trúc tổng thể |
| **2** | Tuần 3-4 | Q-TBL-01 (khu vực bàn), Q-RES-03 (thời gian giữ bàn), Q-MNU-01 (size/topping) | Ảnh hưởng đến CRUD bàn, thực đơn |
| **3** | Tuần 5-6 | Q-KIT-02 (chia khu bếp) | Ảnh hưởng đến luồng gửi món |
| **4** | Tuần 7-8 | *(không có — Sprint 4 là kỹ thuật)* | — |
| **5** | Tuần 9-10 | Q-PAY-01, Q-PAY-07, Q-PAY-09, Q-PAY-10 (toàn bộ thanh toán còn lại) | Nhóm thanh toán cần xác nhận đầy đủ |
| **6** | Tuần 11-12 | Q-INV-01 (có kho không?) | Ảnh hưởng scope Sprint 6 |

---

## Phụ lục: Các câu hỏi chưa có quyết định (từ file 07)

Dưới đây là các câu hỏi từ file 07 chưa được đưa vào quyết định tại tài liệu này. Các câu
hỏi này không ảnh hưởng đến thiết kế MVP hoặc đã được xác định là "Để sau" trong MoSCoW.

| Mã câu hỏi | Lý do chưa có quyết định |
|:----------:|:-------------------------|
| Q-SCOPE-03 (tích điểm) | Could Have — để giai đoạn sau |
| Q-SCOPE-05 (kế toán) | Won't Have |
| Q-TBL-04 (ai dọn bàn) | Nhỏ, có thể quyết định trong lúc dev |
| Q-TBL-05 (ghi lý do bảo trì) | Nhỏ, quyết định trong lúc dev |
| Q-RES-02 (đặt bàn online) | Could Have — để giai đoạn sau |
| Q-RES-04 (đến muộn trong giờ giữ) | Đã có cơ chế check-in, không cần quyết định riêng |
| Q-RES-05 (khôi phục đặt bàn) | Có cơ chế thay thế (tạo đơn mới) |
| Q-RES-08 (gửi xác nhận SMS/email) | Could Have — để giai đoạn sau |
| Q-ORD-04 (chuyển bàn/gộp đơn) | Could Have — để giai đoạn sau |
| Q-ORD-05 (tách món theo khách) | Won't Have |
| Q-KIT-03 (báo món không chế biến được) | Should Have — đã có đề xuất, để Sprint 4 |
| Q-KIT-05 (thời gian chờ món) | Should Have — đã có đề xuất, để Sprint 4 |
| Q-KIT-06 (bếp xem giá món) | Đã chốt không hiển thị giá, không cần quyết định |
| Q-PAY-02 (ví điện tử) | Could Have — để giai đoạn sau |
| Q-PAY-03 (kết hợp nhiều hình thức) | Một hóa đơn một hình thức — đã chốt |
| Q-PAY-08 (ai được giảm giá, giới hạn) | Đã có trong phân quyền — sẽ xử lý khi dev |
| Q-PAY-11 (món chưa chế biến khi thanh toán) | Cần quy tắc xử lý — có thể quyết định trong Sprint 5 |
| Q-MNU-02 (hình ảnh món) | Có — đã có trong thiết kế, không cần quyết định riêng |
| Q-MNU-03 (ẩn hay hiển thị "Hết món") | Hiển thị "Hết món" — đã chốt |
| Q-MNU-05 (danh mục linh hoạt) | Có — đã có trong CRUD danh mục |
| Q-INV-02 (nhân viên kho độc lập?) | Sẽ quyết định khi có xác nhận Q-INV-01 |
| Q-INV-05 (hạn sử dụng) | Could Have — để giai đoạn sau |
| Q-INV-07 (cảnh báo tồn thấp gửi ai) | Sẽ quyết định khi triển khai INV-05 |
| Q-INV-08 (kiểm kê chênh lệch, ai duyệt) | Sẽ quyết định khi triển khai INV-04 |
| Q-RPT-04 (báo cáo theo khu vực) | Could Have — để giai đoạn sau |
| Q-RPT-05 (thống kê món bán chạy) | Should Have — đã có trong US-RPT-03 |
| Q-RPT-06 (xuất Excel/PDF) | Should Have — đã có trong US-RPT-04 |
| Q-RPT-08 (báo cáo hóa đơn hủy) | Should Have — để Sprint 6 |
| Q-AUTH-03 (ai tạo tài khoản) | Đã có trong phân quyền — sẽ quyết định khi xác nhận Q-AUTH-02 |
| Q-AUTH-04 (ai khóa/mở khóa) | Chỉ Quản trị — đã chốt |
| Q-AUTH-07 (quyền xem báo cáo riêng) | Should Have — để Sprint 6 |
| Q-AUTH-08 (phục vụ được giảm giá?) | Chỉ Thu ngân + Quản lý — đã chốt |

---

*Tài liệu này sống động — cập nhật khi có phản hồi từ khách hàng.*

*Ngày tạo: 2026-06-12*
*Người tạo: BA — Dựa trên phân tích file 07, 08, 09*
