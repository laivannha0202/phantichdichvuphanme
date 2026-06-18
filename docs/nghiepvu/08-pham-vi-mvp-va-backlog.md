# Phạm vi MVP và Backlog nghiệp vụ — Hệ thống quản lý nhà hàng

## 1. Mục đích tài liệu

Tài liệu này xác định phạm vi MVP (Minimum Viable Product) của hệ thống quản lý nhà hàng, phân loại chức năng theo phương pháp MoSCoW, và thiết lập backlog nghiệp vụ làm căn cứ để ưu tiên triển khai.

Mục đích cụ thể:

- **Chốt phạm vi phiên bản đầu:** Xác định rõ chức năng nào bắt buộc, chức năng nào để giai đoạn sau.
- **Phân loại ưu tiên:** Must / Should / Could / Won't — giúp nhóm phát triển tập trung vào đúng việc.
- **Thiết lập backlog:** Danh sách backlog nghiệp vụ liên kết với Use Case và Acceptance Criteria.
- **Kiểm soát phạm vi:** Tránh mở rộng không kiểm soát (scope creep) trong quá trình triển khai.
- **Căn cứ lập kế hoạch:** Dùng để chia sprint hoặc giao task cho nhóm phát triển.

Tài liệu này kế thừa từ:

- [01-tong-quan-yeu-cau-chuan-hoa.md](./01-tong-quan-yeu-cau-chuan-hoa.md) — Yêu cầu chức năng và MoSCoW sơ bộ
- [03-use-case-chi-tiet.md](./03-use-case-chi-tiet.md) — Use Case chi tiết (11 UC)
- [04-quy-tac-nghiep-vu.md](./04-quy-tac-nghiep-vu.md) — Quy tắc nghiệp vụ (133 BR)
- [06-acceptance-criteria.md](./06-acceptance-criteria.md) — Tiêu chí nghiệm thu (65 AC)
- [07-cau-hoi-lam-ro.md](./07-cau-hoi-lam-ro.md) — Câu hỏi cần làm rõ với khách hàng (74 câu)

---

## 2. Nguyên tắc xác định MVP

1. **MVP chỉ bao gồm nghiệp vụ cốt lõi** để nhà hàng vận hành được: từ lúc khách vào đến lúc thanh toán và báo cáo cơ bản.
2. **Luồng ưu tiên:** Bàn → Đặt bàn → Gọi món → Bếp → Thanh toán → Báo cáo cơ bản. Đây là xương sống của hệ thống.
3. **Chức năng chưa được khách hàng xác nhận** không tự động đưa vào MVP. Các câu hỏi tại file 07 phải được trả lời trước khi chốt scope cuối cùng.
4. **Chức năng phức tạp hoặc cần tích hợp bên thứ ba** (QR order, thanh toán online, tích điểm, nhiều chi nhánh) để giai đoạn sau.
5. **Kho và nhân viên** là Should Have — nên có nhưng không chặn vận hành nếu chưa có.
6. **Kiến trúc hệ thống phải đủ linh hoạt** để bổ sung Should Have / Could Have sau này mà không phải thiết kế lại mô hình dữ liệu hoặc phần xử lý hệ thống.

---

## 3. Phạm vi MVP đề xuất

### 3.A. Must Have (MVP bắt buộc)

Các chức năng sau là bắt buộc trong phiên bản đầu. Nếu thiếu một trong các chức năng này, hệ thống không thể vận hành nhà hàng.

| # | Nhóm chức năng | Lý do bắt buộc |
|---|---------------|----------------|
| 1 | Đăng nhập và phân quyền cơ bản | Bảo vệ hệ thống, mỗi vai trò chỉ dùng đúng chức năng |
| 2 | Quản lý bàn (CRUD + trạng thái) | Cốt lõi của vận hành — bàn là thực thể trung tâm |
| 3 | Đặt bàn cơ bản (qua nhân viên) | Ghi nhận khách đặt trước, quản lý lịch bàn |
| 4 | Gọi món tại bàn bởi nhân viên phục vụ | Nghiệp vụ chính của nhà hàng |
| 5 | Gửi món xuống bếp | Liên kết giữa phục vụ và bếp |
| 6 | Bếp xem món và cập nhật trạng thái chế biến | Theo dõi tiến độ món ăn |
| 7 | Thanh toán hóa đơn (tiền mặt, chuyển khoản, thẻ) | Hoàn tất giao dịch, ghi nhận doanh thu |
| 8 | Quản lý thực đơn (CRUD món, danh mục, trạng thái) | Dữ liệu đầu vào cho gọi món và thanh toán |
| 9 | Báo cáo doanh thu cơ bản (theo ngày/tháng/năm) | Quản lý cần theo dõi doanh thu |
| 10 | Nhật ký hoạt động cho thao tác quan trọng | Truy vết, kiểm soát, bảo mật |

**Tổng số Use Case thuộc Must Have:** 9 UC (UC-01 → UC-08, UC-10)

### 3.B. Should Have (nên có nếu đủ thời gian)

Các chức năng này quan trọng nhưng có thể triển khai sau Must Have nếu thời gian không cho phép.

| # | Nhóm chức năng | Lý do |
|---|---------------|-------|
| 1 | Quản lý kho nguyên liệu cơ bản (nhập, xuất, kiểm kê) | Kiểm soát nguyên liệu đầu vào, tránh thất thoát |
| 2 | Cảnh báo tồn kho thấp | Hỗ trợ vận hành, tránh hết nguyên liệu |
| 3 | Quản lý nhân viên và tài khoản chi tiết | Cần cho quản trị, nhưng bản đầu có thể seed sẵn tài khoản |
| 4 | Báo cáo món bán chạy | Hỗ trợ quản lý ra quyết định về thực đơn |
| 5 | In hóa đơn (phiếu thanh toán) | Nhu cầu thực tế khi giao hóa đơn cho khách |
| 6 | Xuất báo cáo Excel / PDF | Tiện lợi cho quản lý lưu trữ và báo cáo |

**Tổng số Use Case thuộc Should Have:** 2 UC (UC-09, UC-11) + mở rộng UC-10

### 3.C. Could Have (có thể bổ sung sau)

Các chức năng này hữu ích nhưng không ảnh hưởng đến vận hành cốt lõi.

| # | Nhóm chức năng | Ghi chú |
|---|---------------|---------|
| 1 | QR order cho khách tự gọi món | Thêm actor Khách hàng, tăng độ phức tạp module gọi món |
| 2 | Mã giảm giá / khuyến mãi | Cần khi nhà hàng có chương trình khuyến mãi |
| 3 | Tích điểm khách hàng thân thiết | Phù hợp giai đoạn mở rộng |
| 4 | Gộp bàn / chuyển bàn | Hữu ích nhưng phức tạp hóa luồng trạng thái bàn |
| 5 | Tách hóa đơn (chia tiền nhiều khách) | Làm phức tạp luồng thanh toán |
| 6 | Thanh toán online / ví điện tử | Cần tích hợp bên thứ ba (Momo, VNPay, Zalopay) |
| 7 | Quản lý hạn sử dụng nguyên liệu | Cần thêm trường dữ liệu và cảnh báo |
| 8 | Báo cáo theo ca, theo nhân viên, theo khu vực bàn | Mở rộng từ báo cáo cơ bản |

### 3.D. Won't Have (không làm trong phiên bản đầu)

Các chức năng này không thuộc phạm vi MVP. Không thiết kế, không phát triển, không dự trù tài nguyên.

| # | Nhóm chức năng | Lý do loại khỏi MVP |
|---|---------------|---------------------|
| 1 | Quản lý nhiều chi nhánh | Ảnh hưởng toàn bộ kiến trúc dữ liệu, báo cáo, phân quyền |
| 2 | Ứng dụng mobile riêng cho khách hàng | Tốn thời gian phát triển, chưa cần thiết |
| 3 | AI gợi ý món ăn | Không phải nghiệp vụ cốt lõi |
| 4 | Tự động đặt nguyên liệu với nhà cung cấp | Cần quy trình mua hàng và tích hợp phức tạp |
| 5 | Tích hợp kế toán chuyên sâu | Nên tách thành module riêng hoặc hệ thống khác |
| 6 | Đặt bàn online / qua website | Cần thêm kênh đặt bàn và xác thực khách hàng |

---

## 4. Bảng backlog nghiệp vụ

Bảng dưới đây liệt kê toàn bộ backlog nghiệp vụ cho MVP, phân loại theo nhóm module và mức ưu tiên MoSCoW.

### 4.A. Đăng nhập và phân quyền (AUTH)

| Mã backlog | Nhóm module | Tên chức năng | Mô tả ngắn | Actor chính | MoSCoW | Liên kết Use Case | Liên kết AC | Ghi chú |
|:----------:|:-----------:|--------------|------------|:-----------:|:------:|:-----------------:|:-----------:|---------|
| BL-AUTH-01 | Phân quyền | Đăng nhập hệ thống | Cho phép nhân viên đăng nhập bằng tài khoản và mật khẩu | Tất cả nhân viên | Must | UC-01 | AC-AUTH-01, AC-AUTH-02 | Tài khoản được tạo sẵn hoặc qua BL-EMP |
| BL-AUTH-02 | Phân quyền | Phân quyền theo vai trò | Mỗi tài khoản có một vai trò, chỉ thấy chức năng phù hợp | Quản trị hệ thống | Must | UC-01 | AC-AUTH-03, AC-AUTH-04 | Một tài khoản một vai trò trong MVP |
| BL-AUTH-03 | Phân quyền | Nhật ký hoạt động | Ghi lại thao tác quan trọng: thời gian, người thực hiện, hành động | Hệ thống (tự động) | Must | Xuyên suốt | AC-AUTH-05 | Danh sách thao tác theo BR-AUTH-06 |
| BL-AUTH-04 | Phân quyền | Đăng xuất | Kết thúc phiên làm việc | Tất cả nhân viên | Must | UC-01 | — | Chưa có AC riêng — cần bổ sung Acceptance Criteria nếu triển khai chi tiết. |

### 4.B. Quản lý bàn (TBL)

| Mã backlog | Nhóm module | Tên chức năng | Mô tả ngắn | Actor chính | MoSCoW | Liên kết Use Case | Liên kết AC | Ghi chú |
|:----------:|:-----------:|--------------|------------|:-----------:|:------:|:-----------------:|:-----------:|---------|
| BL-TBL-01 | Quản lý bàn | Thêm / sửa / xóa bàn | CRUD bàn ăn: mã bàn, khu vực, số ghế | Quản lý nhà hàng | Must | UC-02 | AC-TBL-01, AC-TBL-02 | Không xóa cứng bàn đã phát sinh dữ liệu |
| BL-TBL-02 | Quản lý bàn | Xem danh sách bàn và trạng thái | Hiển thị bàn theo khu vực, trạng thái gần thời gian thực | Nhân viên phục vụ, Thu ngân | Must | UC-02 | AC-TBL-04 | Cần filter theo khu vực |
| BL-TBL-03 | Quản lý bàn | Cập nhật trạng thái bàn | Tự động cập nhật theo luồng: Trống ↔ Đã đặt ↔ Đang phục vụ ↔ Cần dọn ↔ Bảo trì | Hệ thống | Must | UC-02, UC-03, UC-07 | AC-TBL-04, AC-TBL-05 | Theo đúng sơ đồ trạng thái tại BR-TBL |
| BL-TBL-04 | Quản lý bàn | Xác nhận dọn bàn | Chuyển bàn từ Cần dọn → Trống | Nhân viên phục vụ | Must | UC-02 | AC-TBL-04 | — |

### 4.C. Đặt bàn (RES)

| Mã backlog | Nhóm module | Tên chức năng | Mô tả ngắn | Actor chính | MoSCoW | Liên kết Use Case | Liên kết AC | Ghi chú |
|:----------:|:-----------:|--------------|------------|:-----------:|:------:|:-----------------:|:-----------:|---------|
| BL-RES-01 | Đặt bàn | Tạo đặt bàn | Nhập thông tin khách, chọn bàn, thời gian đặt | Nhân viên phục vụ | Must | UC-03 | AC-RES-01, AC-RES-02, AC-RES-03 | Chỉ đặt qua nhân viên, chưa có online |
| BL-RES-02 | Đặt bàn | Xác nhận / hủy đặt bàn | Cập nhật trạng thái đặt bàn; hủy thì trả bàn về Trống | Nhân viên phục vụ | Must | UC-03 | AC-RES-04, AC-RES-06, AC-RES-07 | Hủy chỉ là cập nhật trạng thái, không xóa |
| BL-RES-03 | Đặt bàn | Check-in khách đến | Xác nhận khách đã đến, chuyển bàn sang Đang phục vụ | Nhân viên phục vụ | Must | UC-03 | AC-RES-05 | — |
| BL-RES-04 | Đặt bàn | Xử lý khách không đến | Tự động chuyển trạng thái khi quá giờ giữ bàn | Hệ thống | Should | UC-03 | AC-RES-06 | Thời gian giữ bàn mặc định 15 phút, cần cấu hình |

### 4.D. Gọi món (ORD)

| Mã backlog | Nhóm module | Tên chức năng | Mô tả ngắn | Actor chính | MoSCoW | Liên kết Use Case | Liên kết AC | Ghi chú |
|:----------:|:-----------:|--------------|------------|:-----------:|:------:|:-----------------:|:-----------:|---------|
| BL-ORD-01 | Gọi món | Tạo đơn gọi món | Thêm món vào đơn cho bàn đang phục vụ | Nhân viên phục vụ | Must | UC-04 | AC-ORD-01, AC-ORD-02, AC-ORD-03 | Chỉ gọi món Đang bán |
| BL-ORD-02 | Gọi món | Sửa / hủy món trong đơn | Sửa số lượng hoặc hủy món khi chưa chế biến | Nhân viên phục vụ | Must | UC-04 | AC-ORD-04, AC-ORD-05 | Không hủy khi món đã chế biến |
| BL-ORD-03 | Gọi món | Ghi chú món | Nhập ghi chú cho từng món (không cay, ít đá, ...) | Nhân viên phục vụ | Must | UC-04 | AC-ORD-04 | Hiển thị trên màn hình bếp |
| BL-ORD-04 | Gọi món | Tính tạm tiền đơn hàng | Tự động tính tổng tiền dựa trên món đã gọi | Hệ thống | Must | UC-04 | AC-ORD-06, AC-ORD-07 | Không tính món đã hủy |
| BL-ORD-05 | Gọi món | Gọi thêm món nhiều lần | Cho phép thêm món vào đơn hiện tại khi bàn đang phục vụ | Nhân viên phục vụ | Must | UC-04 | AC-ORD-04 | BR-ORD-04 |

### 4.E. Gửi món xuống bếp và bếp (KIT)

| Mã backlog | Nhóm module | Tên chức năng | Mô tả ngắn | Actor chính | MoSCoW | Liên kết Use Case | Liên kết AC | Ghi chú |
|:----------:|:-----------:|--------------|------------|:-----------:|:------:|:-----------------:|:-----------:|---------|
| BL-KIT-01 | Bếp | Gửi món xuống bếp | Xác nhận gửi món, chuyển trạng thái món sang Chờ chế biến | Nhân viên phục vụ | Must | UC-05 | AC-KIT-01 | Gửi theo lô hoặc từng món |
| BL-KIT-02 | Bếp | Xem danh sách món cần chế biến | Hiển thị món theo FIFO, có số bàn, ghi chú, thời gian | Nhân viên bếp | Must | UC-06 | AC-KIT-02, AC-KIT-03 | Không hiển thị giá món |
| BL-KIT-03 | Bếp | Cập nhật trạng thái chế biến | Chuyển: Chờ chế biến → Đang chế biến → Hoàn thành | Nhân viên bếp | Must | UC-06 | AC-KIT-04, AC-KIT-05, AC-KIT-07 | Không chuyển ngược trạng thái |
| BL-KIT-04 | Bếp | Thông báo món hoàn thành | Thông báo cho nhân viên phục vụ khi món hoàn thành | Hệ thống | Must | UC-06 | — | Pop-up / âm thanh trên màn hình phục vụ. Chưa có AC riêng — cần bổ sung Acceptance Criteria nếu triển khai chi tiết. |
| BL-KIT-05 | Bếp | Phục vụ món lên bàn | Cập nhật trạng thái món từ Hoàn thành → Đã phục vụ | Nhân viên phục vụ | Must | UC-06 | AC-KIT-06 | — |
| BL-KIT-06 | Bếp | Báo món không thể chế biến | Bếp gắn cờ món không làm được, kèm lý do | Nhân viên bếp | Should | UC-06 | — | Thông báo đến phục vụ để xử lý với khách. Chưa có AC riêng — cần bổ sung Acceptance Criteria nếu triển khai chi tiết. |

### 4.F. Thanh toán (PAY)

| Mã backlog | Nhóm module | Tên chức năng | Mô tả ngắn | Actor chính | MoSCoW | Liên kết Use Case | Liên kết AC | Ghi chú |
|:----------:|:-----------:|--------------|------------|:-----------:|:------:|:-----------------:|:-----------:|---------|
| BL-PAY-01 | Thanh toán | Xem hóa đơn bàn | Hiển thị chi tiết món, số lượng, đơn giá, thành tiền | Thu ngân | Must | UC-07 | AC-PAY-01 | — |
| BL-PAY-02 | Thanh toán | Tự động tính tổng tiền | Tính tổng = Σ(món đã phục vụ) + phụ phí - giảm giá + VAT | Hệ thống | Must | UC-07 | AC-PAY-02, AC-PAY-03 | Chỉ tính món Hoàn thành / Đã phục vụ |
| BL-PAY-03 | Thanh toán | Áp dụng giảm giá | Giảm theo % hoặc số tiền, không vượt quá tổng tiền | Thu ngân | Must | UC-07 | AC-PAY-04 | Cần giới hạn % tối đa |
| BL-PAY-04 | Thanh toán | Áp dụng VAT | Tính VAT theo tỷ lệ cấu hình | Hệ thống | Must | UC-07 | AC-PAY-05 | — |
| BL-PAY-05 | Thanh toán | Ghi nhận thanh toán | Chọn hình thức: Tiền mặt / Chuyển khoản / Thẻ | Thu ngân | Must | UC-07 | AC-PAY-06, AC-PAY-07 | Một hóa đơn một hình thức |
| BL-PAY-06 | Thanh toán | Cập nhật trạng thái sau thanh toán | Đơn hàng → Đã thanh toán; Bàn → Cần dọn | Hệ thống | Must | UC-07 | AC-PAY-06, AC-PAY-07 | — |
| BL-PAY-07 | Thanh toán | Hủy hóa đơn | Hủy hóa đơn đã thanh toán, ghi lý do | Quản lý nhà hàng | Must | UC-07 | AC-PAY-08, AC-PAY-09, AC-PAY-10 | Có cần xác thực lại khi hủy hóa đơn hay không cần khách hàng xác nhận. |
| BL-PAY-08 | Thanh toán | In hóa đơn | In hóa đơn sau thanh toán thành công | Thu ngân | Should | UC-07 | — | Nội dung in theo BR-PAY-21. Chưa có AC riêng — cần bổ sung Acceptance Criteria nếu triển khai chi tiết. |

### 4.G. Quản lý thực đơn (MNU)

| Mã backlog | Nhóm module | Tên chức năng | Mô tả ngắn | Actor chính | MoSCoW | Liên kết Use Case | Liên kết AC | Ghi chú |
|:----------:|:-----------:|--------------|------------|:-----------:|:------:|:-----------------:|:-----------:|---------|
| BL-MNU-01 | Thực đơn | Thêm / sửa món ăn | CRUD món: tên, giá, danh mục, hình ảnh, trạng thái | Quản lý nhà hàng | Must | UC-08 | AC-MNU-01, AC-MNU-02, AC-MNU-03 | Giá > 0, tên không trùng |
| BL-MNU-02 | Thực đơn | Quản lý danh mục món | Thêm / sửa / xóa danh mục: Món chính, Đồ uống, Tráng miệng, Khai vị | Quản lý nhà hàng | Must | UC-08 | AC-MNU-01 | — |
| BL-MNU-03 | Thực đơn | Cập nhật trạng thái món | Chuyển: Đang bán / Hết món / Ngừng bán | Quản lý nhà hàng | Must | UC-08 | AC-MNU-04, AC-MNU-05, AC-MNU-06 | — |
| BL-MNU-04 | Thực đơn | Xóa món (soft delete) | Không xóa cứng món đã phát sinh đơn hàng | Quản lý nhà hàng | Must | UC-08 | AC-MNU-06 | Chỉ chuyển Ngừng bán |

### 4.H. Quản lý kho nguyên liệu (INV)

| Mã backlog | Nhóm module | Tên chức năng | Mô tả ngắn | Actor chính | MoSCoW | Liên kết Use Case | Liên kết AC | Ghi chú |
|:----------:|:-----------:|--------------|------------|:-----------:|:------:|:-----------------:|:-----------:|---------|
| BL-INV-01 | Kho | Quản lý danh sách nguyên liệu | CRUD nguyên liệu: tên, đơn vị, tồn kho tối thiểu | Nhân viên kho | Should | UC-09 | AC-INV-01, AC-INV-02 | — |
| BL-INV-02 | Kho | Nhập kho | Ghi nhận nhập kho, cập nhật tồn kho | Nhân viên kho | Should | UC-09 | AC-INV-01, AC-INV-04 | Số lượng > 0 |
| BL-INV-03 | Kho | Xuất kho | Ghi nhận xuất kho, kiểm tra tồn kho trước xuất | Nhân viên kho | Should | UC-09 | AC-INV-02, AC-INV-03, AC-INV-04 | Không xuất vượt tồn |
| BL-INV-04 | Kho | Kiểm kê kho | Điều chỉnh tồn kho thực tế, ghi nhận chênh lệch | Nhân viên kho | Should | UC-09 | AC-INV-04 | Quản lý phê duyệt chênh lệch |
| BL-INV-05 | Kho | Cảnh báo tồn kho thấp | Cảnh báo khi tồn kho ≤ mức tối thiểu | Hệ thống | Should | UC-09 | AC-INV-05, AC-INV-06 | Hiển thị trên màn hình kho |
| BL-INV-06 | Kho | Lịch sử nhập / xuất / kiểm kê | Xem và tra cứu lịch sử thao tác kho | Nhân viên kho | Should | UC-09 | — | Không xóa lịch sử. Chưa có AC riêng — cần bổ sung Acceptance Criteria nếu triển khai chi tiết. |

### 4.I. Báo cáo (RPT)

| Mã backlog | Nhóm module | Tên chức năng | Mô tả ngắn | Actor chính | MoSCoW | Liên kết Use Case | Liên kết AC | Ghi chú |
|:----------:|:-----------:|--------------|------------|:-----------:|:------:|:-----------------:|:-----------:|---------|
| BL-RPT-01 | Báo cáo | Báo cáo doanh thu theo ngày/tháng/năm | Tổng hợp doanh thu từ hóa đơn đã thanh toán | Quản lý nhà hàng | Must | UC-10 | AC-RPT-01, AC-RPT-02, AC-RPT-03 | Không tính hóa đơn hủy |
| BL-RPT-02 | Báo cáo | Thống kê số hóa đơn | Số hóa đơn đã thanh toán, đã hủy trong kỳ | Quản lý nhà hàng | Must | UC-10 | AC-RPT-02, AC-RPT-03 | — |
| BL-RPT-03 | Báo cáo | Báo cáo món bán chạy | Top món theo số lượng đã phục vụ | Quản lý nhà hàng | Should | UC-10 | AC-RPT-04 | Không tính món hủy |
| BL-RPT-04 | Báo cáo | Xuất báo cáo Excel / PDF | Xuất dữ liệu báo cáo ra file | Quản lý nhà hàng | Should | UC-10 | AC-RPT-05 | — |

### 4.J. Quản lý nhân viên và tài khoản (EMP)

| Mã backlog | Nhóm module | Tên chức năng | Mô tả ngắn | Actor chính | MoSCoW | Liên kết Use Case | Liên kết AC | Ghi chú |
|:----------:|:-----------:|--------------|------------|:-----------:|:------:|:-----------------:|:-----------:|---------|
| BL-EMP-01 | Nhân viên | Thêm / sửa thông tin nhân viên | CRUD hồ sơ nhân viên: họ tên, SĐT, chức vụ, trạng thái | Quản lý nhà hàng | Should | UC-11 | AC-EMP-01, AC-EMP-03 | MVP có thể seed sẵn tài khoản |
| BL-EMP-02 | Nhân viên | Tạo / khóa tài khoản đăng nhập | Tạo tài khoản, phân quyền, khóa/mở khóa | Quản trị hệ thống | Should | UC-11 | AC-EMP-02, AC-EMP-05 | Một tài khoản một vai trò |
| BL-EMP-03 | Nhân viên | Vô hiệu hóa nhân viên nghỉ việc | Không xóa cứng, chuyển trạng thái ngừng hoạt động | Quản lý nhà hàng | Should | UC-11 | AC-EMP-04 | — |

---

## 5. Đề xuất thứ tự triển khai

Dưới đây là thứ tự triển khai các giai đoạn dựa trên mức ưu tiên và sự phụ thuộc giữa các module.

### Giai đoạn 1: Nền tảng và phân quyền

| Thứ tự | Backlog | Chức năng | Phụ thuộc |
|:------:|:-------:|-----------|:---------:|
| 1 | BL-EMP-02 | Tạo tài khoản và phân quyền cơ bản | Không |
| 2 | BL-AUTH-01 | Đăng nhập | BL-EMP-02 |
| 3 | BL-AUTH-02 | Phân quyền theo vai trò (giao diện) | BL-AUTH-01 |
| 4 | BL-AUTH-04 | Đăng xuất | BL-AUTH-01 |

**Kết quả:** Hệ thống có người dùng, có đăng nhập, có phân quyền — nền tảng để xây dựng các module khác.

### Giai đoạn 2: Bàn, đặt bàn, gọi món

| Thứ tự | Backlog | Chức năng | Phụ thuộc |
|:------:|:-------:|-----------|:---------:|
| 5 | BL-MNU-01, BL-MNU-02 | Quản lý thực đơn — tạo món và danh mục | BL-AUTH-02 |
| 6 | BL-TBL-01, BL-TBL-02 | Quản lý bàn — CRUD và xem danh sách | BL-AUTH-02 |
| 7 | BL-TBL-03, BL-TBL-04 | Trạng thái bàn và chuyển đổi | BL-TBL-01 |
| 8 | BL-RES-01, BL-RES-02 | Đặt bàn — tạo và xác nhận/hủy | BL-TBL-03 |
| 9 | BL-ORD-01 → BL-ORD-05 | Gọi món — tạo đơn, thêm/sửa/hủy món, tính tạm | BL-TBL-03, BL-MNU-01 |

**Kết quả:** Nhân viên phục vụ có thể xếp bàn, đặt bàn, gọi món cho khách.

### Giai đoạn 3: Bếp và trạng thái món

| Thứ tự | Backlog | Chức năng | Phụ thuộc |
|:------:|:-------:|-----------|:---------:|
| 10 | BL-KIT-01 | Gửi món xuống bếp | BL-ORD-01 |
| 11 | BL-KIT-02 | Bếp xem danh sách món | BL-KIT-01 |
| 12 | BL-KIT-03, BL-KIT-05 | Cập nhật trạng thái chế biến | BL-KIT-02 |
| 13 | BL-KIT-04 | Thông báo món hoàn thành | BL-KIT-03 |
| 14 | BL-KIT-06 | Báo món không thể chế biến | BL-KIT-02 |

**Kết quả:** Luồng từ phục vụ → bếp → phục vụ được khép kín.

### Giai đoạn 4: Thanh toán và hóa đơn

| Thứ tự | Backlog | Chức năng | Phụ thuộc |
|:------:|:-------:|-----------|:---------:|
| 15 | BL-PAY-01, BL-PAY-02 | Xem hóa đơn, tự động tính tiền | BL-ORD-04, BL-TBL-03 |
| 16 | BL-PAY-03, BL-PAY-04 | Giảm giá và VAT | BL-PAY-02 |
| 17 | BL-PAY-05, BL-PAY-06 | Ghi nhận thanh toán, cập nhật trạng thái | BL-PAY-02 |
| 18 | BL-PAY-07 | Hủy hóa đơn | BL-PAY-05 |
| 19 | BL-PAY-08 | In hóa đơn (Should Have) | BL-PAY-05 |

**Kết quả:** Hoàn tất luồng vận hành chính: bàn → đặt → gọi → bếp → thanh toán.

### Giai đoạn 5: Báo cáo cơ bản

| Thứ tự | Backlog | Chức năng | Phụ thuộc |
|:------:|:-------:|-----------|:---------:|
| 20 | BL-RPT-01 | Báo cáo doanh thu | BL-PAY-05 |
| 21 | BL-RPT-02 | Thống kê hóa đơn | BL-PAY-05 |
| 22 | BL-RPT-03 | Báo cáo món bán chạy (Should Have) | BL-ORD-05 |
| 23 | BL-RPT-04 | Xuất Excel / PDF (Should Have) | BL-RPT-01 |

**Kết quả:** Quản lý có thể theo dõi doanh thu và hiệu quả kinh doanh.

### Giai đoạn 6: Kho, nhân viên và chức năng mở rộng

| Thứ tự | Backlog | Chức năng | Phụ thuộc |
|:------:|:-------:|-----------|:---------:|
| 24 | BL-INV-01 → BL-INV-06 | Quản lý kho nguyên liệu (Should Have) | BL-AUTH-02 |
| 25 | BL-EMP-01, BL-EMP-03 | Quản lý nhân viên (Should Have) | BL-AUTH-02 |
| 26 | BL-AUTH-03 | Nhật ký hoạt động (xem và tra cứu) | BL-AUTH-01 |

**Kết quả:** Hệ thống hoàn chỉnh với kho, nhân viên và nhật ký hoạt động.

---

## 6. Rủi ro nếu mở rộng phạm vi MVP

Dưới đây là các rủi ro được xác định nếu đưa chức năng Could Have hoặc Won't Have vào MVP.

### 6.1. QR Order (Could Have)

| Yếu tố | Rủi ro |
|---------|--------|
| Actor | Thêm actor Khách hàng — cần cơ chế xác thực và phiên làm việc riêng |
| Luồng gọi món | Khách tự tạo đơn, nhân viên không kiểm soát được nội dung đơn |
| Bếp | Không có nhân viên phục vụ trung gian để kiểm tra món trước khi gửi bếp |
| Thanh toán | Khách có thể thanh toán online hoặc tại bàn — cần tích hợp thêm |

### 6.2. Gộp bàn / Chuyển bàn (Could Have)

| Yếu tố | Rủi ro |
|---------|--------|
| Trạng thái bàn | Phá vỡ sơ đồ trạng thái hiện tại: một đơn hàng trên nhiều bàn |
| Gọi món | Cần chọn bàn chính và bàn phụ, hiển thị món gộp |
| Thanh toán | Một hóa đơn gộp nhiều bàn, cần xác định bàn nào chuyển Cần dọn |

### 6.3. Tách hóa đơn (Could Have)

| Yếu tố | Rủi ro |
|---------|--------|
| Cấu trúc đơn hàng | Phải thiết kế lại: một đơn hàng → nhiều hóa đơn con |
| Quy tắc tính tiền | Giảm giá, VAT, phụ phí phân bổ thế nào cho từng hóa đơn con? |
| Bếp | Món đã gọi gộp — làm sao tách khi thanh toán? |

### 6.4. Tự động trừ kho theo món (Could Have)

| Yếu tố | Rủi ro |
|---------|--------|
| Định mức nguyên liệu | Mỗi món cần công thức nấu — khối lượng dữ liệu lớn, dễ sai |
| Tồn kho âm | Nếu định mức sai hoặc chưa nhập kho kịp, tồn kho âm gây lỗi |
| Trạng thái món | Nếu hết nguyên liệu, món tự động Hết món — cần quy trình xử lý với bếp và khách |

### 6.5. Thanh toán online / Ví điện tử (Could Have)

| Yếu tố | Rủi ro |
|---------|--------|
| Tích hợp bên thứ ba | Phụ thuộc vào đối tác (Momo, VNPay...), cần đăng ký merchant |
| Bảo mật | Phải đảm bảo PCI DSS, xử lý webhook, xác thực giao dịch |
| Xử lý thất bại | Khi thanh toán online thất bại, hóa đơn giữ ở trạng thái nào? |

### 6.6. Nhiều chi nhánh (Won't Have)

| Yếu tố | Rủi ro |
|---------|--------|
| Mô hình dữ liệu | Tất cả bảng dữ liệu cần thêm trường chi nhánh — ảnh hưởng toàn bộ |
| Phân quyền | Cần quyền theo chi nhánh — phức tạp hóa ma trận phân quyền |
| Báo cáo | Cần báo cáo tổng hợp nhiều chi nhánh và báo cáo riêng từng chi nhánh |
| Kho | Kho riêng theo chi nhánh hay kho trung tâm? |

---

## 7. Các câu hỏi cần chốt trước MVP

Dưới đây là các câu hỏi ưu tiên **Cao** từ file [07-cau-hoi-lam-ro.md](./07-cau-hoi-lam-ro.md) có ảnh hưởng trực tiếp đến phạm vi MVP. Các câu hỏi này **cần được khách hàng trả lời trước khi bắt đầu phát triển**.

### 7.1. Phạm vi hệ thống

| Mã câu hỏi | Câu hỏi | Ảnh hưởng đến MVP |
|:----------:|---------|:-----------------:|
| Q-SCOPE-01 | **Một nhà hàng hay nhiều chi nhánh?** | Kiến trúc mô hình dữ liệu, báo cáo |
| Q-SCOPE-02 | **Có QR order trong phiên bản đầu không?** | Toàn bộ module gọi món |
| Q-SCOPE-04 | **Có ứng dụng mobile riêng không?** | Phạm vi phát triển |
| Q-SCOPE-06 | **Nhà hàng đã có quy trình vận hành hiện tại chưa?** | Đối chiếu nghiệp vụ |

### 7.2. Quản lý bàn và đặt bàn

| Mã câu hỏi | Câu hỏi | Ảnh hưởng đến MVP |
|:----------:|---------|:-----------------:|
| Q-TBL-03 | **Sau thanh toán bàn chuyển Cần dọn hay Trống?** | Luồng trạng thái bàn |
| Q-RES-01 | **Nhà hàng nhận đặt bàn qua những kênh nào?** | Module đặt bàn |
| Q-RES-03 | **Thời gian giữ bàn mặc định bao lâu?** | Xử lý tự động khách không đến |

### 7.3. Gọi món và bếp

| Mã câu hỏi | Câu hỏi | Ảnh hưởng đến MVP |
|:----------:|---------|:-----------------:|
| Q-ORD-01 | **Chỉ nhân viên gọi món hay khách tự gọi qua QR?** | Actor, luồng gửi món |
| Q-ORD-03 | **Có cho gọi thêm món nhiều lần trong cùng bàn không?** | Cấu trúc đơn hàng |
| Q-ORD-06 | **Món đang chế biến có được hủy không?** | Quy tắc hủy món |
| Q-KIT-01 | **Bếp xem màn hình hay in phiếu?** | Module bếp, tích hợp máy in |
| Q-KIT-02 | **Có chia khu bếp theo loại món không?** | Hiển thị và định tuyến món |
| Q-KIT-04 | **Món hoàn thành thông báo bằng cách nào?** | Thông báo gần thời gian thực |

### 7.4. Thanh toán

| Mã câu hỏi | Câu hỏi | Ảnh hưởng đến MVP |
|:----------:|---------|:-----------------:|
| Q-PAY-01 | **Hình thức thanh toán nào được hỗ trợ?** | Module thanh toán |
| Q-PAY-04 | **Có tách hóa đơn không?** | Luồng thanh toán |
| Q-PAY-05 | **Có gộp hóa đơn không?** | Luồng thanh toán |
| Q-PAY-06 | **Có thanh toán một phần không?** | Trạng thái thanh toán |
| Q-PAY-07 | **VAT xử lý thế nào?** | Công thức tính tiền |
| Q-PAY-08 | **Ai được giảm giá? Giới hạn %?** | Phân quyền thanh toán |
| Q-PAY-09 | **Ai được hủy hóa đơn?** | Phân quyền |
| Q-PAY-10 | **Hủy hóa đơn có cần xác thực lại?** | Bảo mật |
| Q-PAY-11 | **Xử lý món chưa chế biến khi thanh toán?** | Quy tắc tính tiền |

### 7.5. Phân quyền và nhân viên

| Mã câu hỏi | Câu hỏi | Ảnh hưởng đến MVP |
|:----------:|---------|:-----------------:|
| Q-AUTH-01 | **Một nhân viên có nhiều vai trò không?** | Thiết kế phân quyền |
| Q-AUTH-02 | **Quản lý và Quản trị có tách riêng không?** | Ma trận phân quyền |
| Q-AUTH-05 | **Có cần audit log cho mọi thao tác quan trọng?** | Nhật ký hoạt động |

### 7.6. Kho (nếu triển khai Should Have)

| Mã câu hỏi | Câu hỏi | Ảnh hưởng đến MVP |
|:----------:|---------|:-----------------:|
| Q-INV-01 | **Có quản lý kho trong phiên bản đầu không?** | Scope phát triển |
| Q-INV-03 | **Có tự động trừ kho theo món không?** | Kiến trúc tích hợp |
| Q-INV-04 | **Có định mức nguyên liệu cho từng món không?** | Dữ liệu cần chuẩn bị |

---

## 8. Kết luận

1. **MVP tập trung vào vận hành nhà hàng tại chỗ:** Luồng bàn → đặt bàn → gọi món → bếp → thanh toán → báo cáo cơ bản. Đây là 6 module Must Have giúp nhà hàng vận hành được ngay.

2. **9 Use Case Must Have** (UC-01 đến UC-08, UC-10) với **53 Acceptance Criteria** tương ứng. Đây là khối lượng công việc tối thiểu để hệ thống đi vào sử dụng.

3. **2 Use Case Should Have** (UC-09, UC-11) và các chức năng mở rộng của báo cáo và thanh toán — triển khai khi đủ thời gian và tài nguyên.

4. **Các chức năng mở rộng** (QR order, tích điểm, gộp/tách bàn, thanh toán online, nhiều chi nhánh) chỉ triển khai khi khách hàng xác nhận nhu cầu và có đủ nguồn lực.

5. **39 câu hỏi ưu tiên Cao** từ file 07 cần được trả lời trước khi phát triển. Các câu hỏi này ảnh hưởng trực tiếp đến kiến trúc hệ thống, luồng nghiệp vụ, dữ liệu và phân quyền.

6. **File này là căn cứ để chia sprint hoặc giao task cho nhóm phát triển.** Mỗi backlog item có thể chuyển thành user story với estimate tương ứng.

7. **Rủi ro lớn nhất của MVP:** Mở rộng phạm vi không kiểm soát. Cần tuân thủ nguyên tắc: chức năng chưa được khách hàng xác nhận không tự động đưa vào MVP.

---

## Phụ lục: Thống kê backlog

| Nhóm | Mã prefix | Must Have | Should Have | Could Have | Won't Have | Tổng |
|:----:|:---------:|:---------:|:-----------:|:----------:|:----------:|:----:|
| Phân quyền | AUTH | 4 | 0 | 0 | 0 | 4 |
| Quản lý bàn | TBL | 4 | 0 | 0 | 0 | 4 |
| Đặt bàn | RES | 3 | 1 | 0 | 0 | 4 |
| Gọi món | ORD | 5 | 0 | 0 | 0 | 5 |
| Bếp | KIT | 5 | 1 | 0 | 0 | 6 |
| Thanh toán | PAY | 7 | 1 | 0 | 0 | 8 |
| Thực đơn | MNU | 4 | 0 | 0 | 0 | 4 |
| Kho nguyên liệu | INV | 0 | 6 | 0 | 0 | 6 |
| Báo cáo | RPT | 2 | 2 | 0 | 0 | 4 |
| Nhân viên | EMP | 0 | 3 | 0 | 0 | 3 |
| **Tổng cộng** | | **34** | **14** | **0** | **0** | **48** |

> **Ghi chú:** Backlog chỉ liệt kê các mục thuộc Must Have và Should Have (cần triển khai trong hoặc gần MVP).
> Các nhóm Could Have và Won't Have được liệt kê riêng tại mục 3.C và 3.D để kiểm soát phạm vi.
