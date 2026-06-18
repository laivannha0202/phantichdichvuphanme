# User Story và gợi ý chia Sprint — Hệ thống quản lý nhà hàng

## 1. Mục đích tài liệu

Tài liệu này chuyển các backlog nghiệp vụ đã được phân loại MoSCoW tại file
[08-pham-vi-mvp-va-backlog.md](./08-pham-vi-mvp-va-backlog.md) thành **User Story**
và gợi ý thứ tự triển khai theo **Sprint**.

Mục đích cụ thể:

- **Chuyển backlog thành User Story có ngữ cảnh:** Mỗi User Story viết theo góc nhìn
  actor, nêu rõ mục tiêu nghiệp vụ và giá trị mang lại.
- **Căn cứ để chia sprint:** Gom User Story có tính phụ thuộc thấp vào cùng sprint,
  ưu tiên sprint đầu xây nền tảng, sprint cuối làm báo cáo và mở rộng.
- **Căn cứ để giao việc và theo dõi tiến độ:** Mỗi User Story có thể gán cho một
  nhóm phát triển, ước lượng điểm, và theo dõi theo sprint.
- **Kết nối Use Case và Acceptance Criteria:** Liên kết User Story với Use Case và
  AC để nhóm phát triển biết cần kiểm tra gì sau khi hoàn thành.

Tài liệu này kế thừa từ:

- [03-use-case-chi-tiet.md](./03-use-case-chi-tiet.md) — Use Case chi tiết (11 UC)
- [06-acceptance-criteria.md](./06-acceptance-criteria.md) — Tiêu chí nghiệm thu (65 AC)
- [08-pham-vi-mvp-va-backlog.md](./08-pham-vi-mvp-va-backlog.md) — Phạm vi MVP và backlog
  nghiệp vụ (48 backlog items)

---

## 2. Quy ước viết User Story

### 2.1. Format User Story

```
Là [Actor], tôi muốn [Chức năng], để [Mục tiêu/Giá trị nghiệp vụ].
```

### 2.2. Mã User Story

```
US-{MODULE}-{STT}
```

| Tiền tố | Module |
|---------|--------|
| US-AUTH | Đăng nhập và phân quyền |
| US-TBL | Quản lý bàn |
| US-RES | Đặt bàn |
| US-ORD | Gọi món |
| US-KIT | Gửi món xuống bếp và bếp |
| US-PAY | Thanh toán |
| US-MNU | Quản lý thực đơn |
| US-INV | Quản lý kho nguyên liệu |
| US-RPT | Báo cáo |
| US-EMP | Quản lý nhân viên và tài khoản |

### 2.3. Actor viết tắt

| Actor | Mô tả |
|-------|-------|
| QT | Quản trị hệ thống |
| QL | Quản lý nhà hàng |
| PV | Nhân viên phục vụ |
| TN | Thu ngân |
| BP | Nhân viên bếp |
| KO | Nhân viên kho |
| NV | Tất cả nhân viên (đã đăng nhập) |

### 2.4. Tham chiếu

- **Backlog:** `BL-{MODULE}-{STT}` — tham chiếu đến file 08
- **Use Case:** `UC-{STT}` — tham chiếu đến file 03
- **Acceptance Criteria:** `AC-{MODULE}-{STT}` — tham chiếu đến file 06

---

## 3. User Story theo module

### 3.A. Đăng nhập và phân quyền (AUTH)

| Mã US | Backlog | Actor | User Story | MoSCoW | UC | AC | Ghi chú |
|:-----:|:------:|:-----:|-----------|:------:|:--:|:--:|---------|
| US-AUTH-01 | BL-AUTH-01 | NV | Là nhân viên, tôi muốn đăng nhập bằng tài khoản và mật khẩu, để truy cập hệ thống và sử dụng các chức năng theo quyền | Must | UC-01 | AC-AUTH-01, AC-AUTH-02 | Tài khoản được tạo sẵn qua dữ liệu mẫu hoặc giao diện quản trị |
| US-AUTH-02 | BL-AUTH-02 | QT | Là quản trị hệ thống, tôi muốn mỗi tài khoản chỉ có một vai trò và chỉ thấy chức năng phù hợp, để kiểm soát truy cập theo đúng nghiệp vụ | Must | UC-01 | AC-AUTH-03, AC-AUTH-04 | Một tài khoản một vai trò trong MVP |
| US-AUTH-03 | BL-AUTH-03 | QT | Là quản trị hệ thống, tôi muốn mọi thao tác quan trọng được ghi lại nhật ký (thời gian, người thực hiện, hành động), để truy vết và kiểm soát khi cần | Must | Xuyên suốt | AC-AUTH-05 | Xem và tra cứu nhật ký triển khai ở Sprint 6 |
| US-AUTH-04 | BL-AUTH-04 | NV | Là nhân viên, tôi muốn đăng xuất khỏi hệ thống, để kết thúc phiên làm việc an toàn | Must | UC-01 | — | Chưa có AC riêng |

### 3.B. Quản lý bàn (TBL)

| Mã US | Backlog | Actor | User Story | MoSCoW | UC | AC | Ghi chú |
|:-----:|:------:|:-----:|-----------|:------:|:--:|:--:|---------|
| US-TBL-01 | BL-TBL-01 | QL | Là quản lý nhà hàng, tôi muốn thêm, sửa, xem thông tin bàn (mã bàn, khu vực, số ghế), để quản lý danh sách bàn ăn trong nhà hàng | Must | UC-02 | AC-TBL-01, AC-TBL-02 | Không xóa cứng bàn đã phát sinh dữ liệu |
| US-TBL-02 | BL-TBL-02 | PV, TN | Là nhân viên phục vụ/thu ngân, tôi muốn xem danh sách bàn theo khu vực và trạng thái gần thời gian thực, để biết bàn nào trống, đang phục vụ hay cần dọn | Must | UC-02 | AC-TBL-04 | Cần filter theo khu vực |
| US-TBL-03 | BL-TBL-03 | Hệ thống | Là hệ thống, tôi muốn tự động cập nhật trạng thái bàn theo luồng nghiệp vụ (Trống ↔ Đã đặt ↔ Đang phục vụ ↔ Cần dọn ↔ Bảo trì), để đảm bảo trạng thái bàn luôn chính xác | Must | UC-02, UC-03, UC-07 | AC-TBL-04, AC-TBL-05 | Theo đúng sơ đồ trạng thái tại BR-TBL |
| US-TBL-04 | BL-TBL-04 | PV | Là nhân viên phục vụ, tôi muốn xác nhận đã dọn bàn để chuyển bàn từ Cần dọn về Trống, để sẵn sàng đón khách mới | Must | UC-02 | AC-TBL-04 | — |

### 3.C. Đặt bàn (RES)

| Mã US | Backlog | Actor | User Story | MoSCoW | UC | AC | Ghi chú |
|:-----:|:------:|:-----:|-----------|:------:|:--:|:--:|---------|
| US-RES-01 | BL-RES-01 | PV | Là nhân viên phục vụ, tôi muốn tạo đặt bàn (nhập tên khách, SĐT, thời gian, chọn bàn), để ghi nhận thông tin khách đặt trước | Must | UC-03 | AC-RES-01, AC-RES-02, AC-RES-03 | Chỉ đặt qua nhân viên, chưa có online |
| US-RES-02 | BL-RES-02 | PV | Là nhân viên phục vụ, tôi muốn xác nhận hoặc hủy đặt bàn, để cập nhật trạng thái đặt bàn và trả bàn về Trống nếu hủy | Must | UC-03 | AC-RES-04, AC-RES-06, AC-RES-07 | Hủy là cập nhật trạng thái, không xóa dữ liệu |
| US-RES-03 | BL-RES-03 | PV | Là nhân viên phục vụ, tôi muốn check-in khi khách đến, để chuyển bàn từ Đã đặt sang Đang phục vụ | Must | UC-03 | AC-RES-05 | — |
| US-RES-04 | BL-RES-04 | Hệ thống | Là hệ thống, tôi muốn tự động chuyển trạng thái đặt bàn sang Không đến khi quá giờ giữ bàn, để giải phóng bàn cho khách khác | Should | UC-03 | AC-RES-06 | Thời gian giữ bàn mặc định 15 phút, cần cấu hình |

### 3.D. Gọi món (ORD)

| Mã US | Backlog | Actor | User Story | MoSCoW | UC | AC | Ghi chú |
|:-----:|:------:|:-----:|-----------|:------:|:--:|:--:|---------|
| US-ORD-01 | BL-ORD-01 | PV | Là nhân viên phục vụ, tôi muốn tạo đơn gọi món cho bàn đang phục vụ (chỉ chọn món Đang bán), để ghi nhận yêu cầu của khách | Must | UC-04 | AC-ORD-01, AC-ORD-02, AC-ORD-03 | — |
| US-ORD-02 | BL-ORD-02 | PV | Là nhân viên phục vụ, tôi muốn sửa số lượng hoặc hủy món khi chưa chế biến, để điều chỉnh đơn hàng theo yêu cầu khách | Must | UC-04 | AC-ORD-04, AC-ORD-05 | Không hủy món đã chế biến |
| US-ORD-03 | BL-ORD-03 | PV | Là nhân viên phục vụ, tôi muốn thêm ghi chú cho từng món (không cay, ít đá...), để bếp chế biến đúng yêu cầu | Must | UC-04 | AC-ORD-04 | Hiển thị trên màn hình bếp |
| US-ORD-04 | BL-ORD-04 | Hệ thống | Là hệ thống, tôi muốn tự động tính tạm tiền đơn hàng dựa trên món đã gọi (không tính món hủy), để phục vụ và khách biết số tiền tạm tính | Must | UC-04 | AC-ORD-06, AC-ORD-07 | Giá giữ theo thời điểm gọi món |
| US-ORD-05 | BL-ORD-05 | PV | Là nhân viên phục vụ, tôi muốn gọi thêm món nhiều lần trong cùng một đơn, để phục vụ khách gọi thêm trong bữa ăn | Must | UC-04 | AC-ORD-04 | — |

### 3.E. Gửi món xuống bếp và bếp (KIT)

| Mã US | Backlog | Actor | User Story | MoSCoW | UC | AC | Ghi chú |
|:-----:|:------:|:-----:|-----------|:------:|:--:|:--:|---------|
| US-KIT-01 | BL-KIT-01 | PV | Là nhân viên phục vụ, tôi muốn gửi món xuống bếp sau khi xác nhận, để bếp biết món cần chế biến | Must | UC-05 | AC-KIT-01 | Gửi theo lô hoặc từng món |
| US-KIT-02 | BL-KIT-02 | BP | Là nhân viên bếp, tôi muốn xem danh sách món cần chế biến theo thứ tự thời gian (FIFO), kèm số bàn và ghi chú (không thấy giá), để chế biến đúng thứ tự và đúng yêu cầu | Must | UC-06 | AC-KIT-02, AC-KIT-03 | — |
| US-KIT-03 | BL-KIT-03 | BP | Là nhân viên bếp, tôi muốn cập nhật trạng thái chế biến (Chờ → Đang chế biến → Hoàn thành), để theo dõi tiến độ món ăn | Must | UC-06 | AC-KIT-04, AC-KIT-05, AC-KIT-07 | Không chuyển ngược trạng thái |
| US-KIT-04 | BL-KIT-04 | Hệ thống | Là hệ thống, tôi muốn thông báo cho nhân viên phục vụ khi món hoàn thành, để họ biết món đã sẵn sàng phục vụ | Must | UC-06 | — | Pop-up / âm thanh trên màn hình phục vụ |
| US-KIT-05 | BL-KIT-05 | PV | Là nhân viên phục vụ, tôi muốn xác nhận đã phục vụ món lên bàn, để cập nhật trạng thái món từ Hoàn thành → Đã phục vụ | Must | UC-06 | AC-KIT-06 | — |
| US-KIT-06 | BL-KIT-06 | BP | Là nhân viên bếp, tôi muốn báo món không thể chế biến kèm lý do, để nhân viên phục vụ xử lý với khách (đổi món hoặc hủy) | Should | UC-06 | — | Chưa có AC riêng |

### 3.F. Thanh toán (PAY)

| Mã US | Backlog | Actor | User Story | MoSCoW | UC | AC | Ghi chú |
|:-----:|:------:|:-----:|-----------|:------:|:--:|:--:|---------|
| US-PAY-01 | BL-PAY-01 | TN | Là thu ngân, tôi muốn xem hóa đơn chi tiết của bàn (món, số lượng, đơn giá, thành tiền), để kiểm tra trước khi thanh toán | Must | UC-07 | AC-PAY-01 | — |
| US-PAY-02 | BL-PAY-02 | Hệ thống | Là hệ thống, tôi muốn tự động tính tổng tiền hóa đơn (Σ món đã phục vụ + phụ phí - giảm giá + VAT), để thu ngân không nhập thủ công | Must | UC-07 | AC-PAY-02, AC-PAY-03 | Chỉ tính món Hoàn thành / Đã phục vụ |
| US-PAY-03 | BL-PAY-03 | TN | Là thu ngân, tôi muốn áp dụng giảm giá (%) hoặc số tiền có giới hạn, để hỗ trợ chương trình ưu đãi cho khách | Must | UC-07 | AC-PAY-04 | Cần giới hạn % tối đa |
| US-PAY-04 | BL-PAY-04 | Hệ thống | Là hệ thống, tôi muốn tự động tính VAT theo tỷ lệ cấu hình, để hóa đơn đúng quy định thuế | Must | UC-07 | AC-PAY-05 | — |
| US-PAY-05 | BL-PAY-05 | TN | Là thu ngân, tôi muốn ghi nhận thanh toán với một trong các hình thức (Tiền mặt / Chuyển khoản / Thẻ), để hoàn tất giao dịch | Must | UC-07 | AC-PAY-06, AC-PAY-07 | Một hóa đơn một hình thức trong MVP |
| US-PAY-06 | BL-PAY-06 | Hệ thống | Là hệ thống, tôi muốn tự động cập nhật trạng thái đơn hàng sang Đã thanh toán và bàn sang Cần dọn sau thanh toán, để luồng vận hành liên tục | Must | UC-07 | AC-PAY-06, AC-PAY-07 | — |
| US-PAY-07 | BL-PAY-07 | QL | Là quản lý nhà hàng, tôi muốn hủy hóa đơn đã thanh toán kèm lý do, để xử lý các trường hợp sai sót | Must | UC-07 | AC-PAY-08, AC-PAY-09, AC-PAY-10 | Hủy hóa đơn phải ghi lý do; việc có cần xác thực lại hay không cần khách hàng xác nhận |
| US-PAY-08 | BL-PAY-08 | TN | Là thu ngân, tôi muốn in hóa đơn sau thanh toán thành công, để giao cho khách | Should | UC-07 | — | Chưa có AC riêng |

### 3.G. Quản lý thực đơn (MNU)

| Mã US | Backlog | Actor | User Story | MoSCoW | UC | AC | Ghi chú |
|:-----:|:------:|:-----:|-----------|:------:|:--:|:--:|---------|
| US-MNU-01 | BL-MNU-01 | QL | Là quản lý nhà hàng, tôi muốn thêm, sửa thông tin món ăn (tên, giá, danh mục, hình ảnh, trạng thái), để cập nhật thực đơn cho nhà hàng | Must | UC-08 | AC-MNU-01, AC-MNU-02, AC-MNU-03 | Giá > 0, tên không trùng |
| US-MNU-02 | BL-MNU-02 | QL | Là quản lý nhà hàng, tôi muốn quản lý danh mục món (Món chính, Đồ uống, Tráng miệng, Khai vị), để phân loại thực đơn rõ ràng | Must | UC-08 | AC-MNU-01 | — |
| US-MNU-03 | BL-MNU-03 | QL | Là quản lý nhà hàng, tôi muốn cập nhật trạng thái món (Đang bán / Hết món / Ngừng bán), để kiểm soát món nào khả dụng cho gọi món | Must | UC-08 | AC-MNU-04, AC-MNU-05 | — |
| US-MNU-04 | BL-MNU-04 | QL | Là quản lý nhà hàng, tôi muốn xóa món nhưng chỉ chuyển trạng thái Ngừng bán (soft delete), để giữ lịch sử món đã phát sinh đơn hàng | Must | UC-08 | AC-MNU-06 | — |

### 3.H. Quản lý kho nguyên liệu (INV)

| Mã US | Backlog | Actor | User Story | MoSCoW | UC | AC | Ghi chú |
|:-----:|:------:|:-----:|-----------|:------:|:--:|:--:|---------|
| US-INV-01 | BL-INV-01 | KO | Là nhân viên kho, tôi muốn quản lý danh sách nguyên liệu (tên, đơn vị, tồn kho tối thiểu), để theo dõi các nguyên liệu trong kho | Should | UC-09 | AC-INV-01, AC-INV-02 | — |
| US-INV-02 | BL-INV-02 | KO | Là nhân viên kho, tôi muốn nhập kho với số lượng > 0, để cập nhật tồn kho khi có hàng về | Should | UC-09 | AC-INV-01, AC-INV-04 | — |
| US-INV-03 | BL-INV-03 | KO | Là nhân viên kho, tôi muốn xuất kho (kiểm tra tồn trước xuất, không xuất vượt tồn), để ghi nhận nguyên liệu xuất dùng | Should | UC-09 | AC-INV-02, AC-INV-03, AC-INV-04 | — |
| US-INV-04 | BL-INV-04 | KO | Là nhân viên kho, tôi muốn kiểm kê kho và điều chỉnh tồn kho thực tế (có ghi nhận chênh lệch), để đảm bảo số liệu tồn kho chính xác | Should | UC-09 | AC-INV-04 | Cần quản lý phê duyệt chênh lệch |
| US-INV-05 | BL-INV-05 | Hệ thống | Là hệ thống, tôi muốn cảnh báo khi tồn kho ≤ mức tối thiểu, để nhân viên kho biết cần nhập thêm nguyên liệu | Should | UC-09 | AC-INV-05, AC-INV-06 | Hiển thị trên màn hình kho |
| US-INV-06 | BL-INV-06 | KO | Là nhân viên kho, tôi muốn xem lịch sử nhập, xuất, kiểm kê, để tra cứu khi cần đối chiếu | Should | UC-09 | — | Chưa có AC riêng |

### 3.I. Báo cáo (RPT)

| Mã US | Backlog | Actor | User Story | MoSCoW | UC | AC | Ghi chú |
|:-----:|:------:|:-----:|-----------|:------:|:--:|:--:|---------|
| US-RPT-01 | BL-RPT-01 | QL | Là quản lý nhà hàng, tôi muốn xem báo cáo doanh thu theo ngày/tháng/năm (chỉ tính hóa đơn đã thanh toán, không tính hóa đơn hủy), để theo dõi kết quả kinh doanh | Must | UC-10 | AC-RPT-01, AC-RPT-02, AC-RPT-03 | — |
| US-RPT-02 | BL-RPT-02 | QL | Là quản lý nhà hàng, tôi muốn thống kê số hóa đơn đã thanh toán và đã hủy trong kỳ, để đánh giá tình hình hoạt động | Must | UC-10 | AC-RPT-02, AC-RPT-03 | — |
| US-RPT-03 | BL-RPT-03 | QL | Là quản lý nhà hàng, tôi muốn xem báo cáo món bán chạy (top món theo số lượng đã phục vụ), để điều chỉnh thực đơn | Should | UC-10 | AC-RPT-04 | Không tính món hủy |
| US-RPT-04 | BL-RPT-04 | QL | Là quản lý nhà hàng, tôi muốn xuất báo cáo ra Excel hoặc PDF, để lưu trữ và gửi cho cấp trên | Should | UC-10 | AC-RPT-05 | — |

### 3.J. Quản lý nhân viên và tài khoản (EMP)

| Mã US | Backlog | Actor | User Story | MoSCoW | UC | AC | Ghi chú |
|:-----:|:------:|:-----:|-----------|:------:|:--:|:--:|---------|
| US-EMP-01 | BL-EMP-01 | QL | Là quản lý nhà hàng, tôi muốn thêm, sửa thông tin nhân viên (họ tên, SĐT, chức vụ, trạng thái), để quản lý hồ sơ nhân viên | Should | UC-11 | AC-EMP-01, AC-EMP-03 | MVP có thể khởi tạo sẵn tài khoản mẫu |
| US-EMP-02 | BL-EMP-02 | QT | Là quản trị hệ thống, tôi muốn tạo tài khoản, phân quyền, khóa/mở khóa tài khoản cho nhân viên, để kiểm soát truy cập hệ thống | Should | UC-11 | AC-EMP-02, AC-EMP-05 | Một tài khoản một vai trò |
| US-EMP-03 | BL-EMP-03 | QL | Là quản lý nhà hàng, tôi muốn vô hiệu hóa nhân viên nghỉ việc (không xóa cứng, chuyển trạng thái ngừng hoạt động), để giữ lịch sử thao tác của nhân viên | Should | UC-11 | AC-EMP-04 | — |

---

## 4. Thống kê User Story

| Nhóm | Mã prefix | Must Have | Should Have | Tổng |
|:----:|:---------:|:---------:|:-----------:|:----:|
| Đăng nhập và phân quyền | AUTH | 4 | 0 | 4 |
| Quản lý bàn | TBL | 4 | 0 | 4 |
| Đặt bàn | RES | 3 | 1 | 4 |
| Gọi món | ORD | 5 | 0 | 5 |
| Bếp | KIT | 5 | 1 | 6 |
| Thanh toán | PAY | 7 | 1 | 8 |
| Quản lý thực đơn | MNU | 4 | 0 | 4 |
| Kho nguyên liệu | INV | 0 | 6 | 6 |
| Báo cáo | RPT | 2 | 2 | 4 |
| Nhân viên | EMP | 0 | 3 | 3 |
| **Tổng cộng** | | **34** | **14** | **48** |

---

## 5. Gợi ý chia Sprint

Các sprint được sắp xếp theo thứ tự ưu tiên và phụ thuộc nghiệp vụ.
Mỗi sprint kéo dài **2 tuần** (khuyến nghị).

### Sprint 1: Nền tảng và phân quyền

| Thông tin | Nội dung |
|-----------|----------|
| **Mục tiêu** | Xây dựng nền tảng xác thực và phân quyền. Nhân viên có thể đăng nhập, đăng xuất, và chỉ thấy chức năng đúng với vai trò. |
| **User Story chính** | US-AUTH-01 (đăng nhập), US-AUTH-02 (phân quyền), US-AUTH-04 (đăng xuất) |
| **Kết quả đầu ra** | Màn hình đăng nhập, cơ chế phân quyền theo vai trò, trang chủ theo từng vai trò, tài khoản quản trị được khởi tạo sẵn qua dữ liệu mẫu |
| **Phụ thuộc** | Không có phụ thuộc từ sprint trước. Tài khoản quản trị được khởi tạo sẵn qua dữ liệu mẫu để phục vụ đăng nhập |
| **Rủi ro** | Nếu chưa có ma trận phân quyền chi tiết, có thể phải điều chỉnh lại giao diện sau sprint này |

> **Lưu ý:** Sprint 1 sử dụng tài khoản quản trị được khởi tạo sẵn qua dữ liệu mẫu để phục vụ đăng nhập và phân quyền. US-EMP-02 (quản lý tài khoản) chỉ triển khai đầy đủ ở Sprint 6.

### Sprint 2: Bàn, thực đơn và đặt bàn

| Thông tin | Nội dung |
|-----------|----------|
| **Mục tiêu** | Quản lý bàn ăn và thực đơn. Nhân viên phục vụ có thể xem bàn, đặt bàn cho khách, và quản lý có thể cập nhật thực đơn. |
| **User Story chính** | US-TBL-01 → US-TBL-04 (quản lý bàn), US-MNU-01 → US-MNU-04 (thực đơn), US-RES-01 → US-RES-04 (đặt bàn) |
| **Kết quả đầu ra** | CRUD bàn, xem trạng thái bàn theo gần thời gian thực, quản lý thực đơn (món + danh mục), tạo/xác nhận/hủy đặt bàn |
| **Phụ thuộc** | Sprint 1 (phân quyền để kiểm soát ai được thao tác) |
| **Rủi ro** | Sơ đồ trạng thái bàn chưa được duyệt có thể gây thiết kế lại. Đặt bàn trùng thời gian cần xử lý kỹ |

### Sprint 3: Gọi món và gửi bếp

| Thông tin | Nội dung |
|-----------|----------|
| **Mục tiêu** | Nhân viên phục vụ có thể tạo đơn gọi món cho bàn đang phục vụ, thêm/sửa/hủy món (khi chưa chế biến), ghi chú món và gửi món xuống bếp. |
| **User Story chính** | US-ORD-01 → US-ORD-05 (gọi món), US-KIT-01 (gửi món xuống bếp) |
| **Kết quả đầu ra** | Giao diện gọi món, thêm/sửa/hủy món, ghi chú, tính tạm tiền, nút gửi món xuống bếp |
| **Phụ thuộc** | Sprint 2 (bàn và thực đơn) |
| **Rủi ro** | Quy tắc hủy món (món đang chế biến có hủy được không?) cần được làm rõ. Giá món lưu theo thời điểm gọi cần thiết kế cẩn thận |

### Sprint 4: Bếp và trạng thái món

| Thông tin | Nội dung |
|-----------|----------|
| **Mục tiêu** | Bếp xem được danh sách món cần chế biến (FIFO), cập nhật trạng thái, thông báo hoàn thành. Phục vụ xác nhận đã phục vụ món. |
| **User Story chính** | US-KIT-02 (xem danh sách), US-KIT-03 (cập nhật trạng thái), US-KIT-04 (thông báo), US-KIT-05 (phục vụ món), US-KIT-06 (báo món không chế biến được) |
| **Kết quả đầu ra** | Màn hình bếp (FIFO, không giá), cập nhật trạng thái chế biến, pop-up thông báo cho phục vụ, xác nhận đã phục vụ |
| **Phụ thuộc** | Sprint 3 (gửi món xuống bếp) |
| **Rủi ro** | US-KIT-06 (báo món không thể chế biến) là Should Have — có thể lược bỏ nếu thiếu thời gian. Thông báo gần thời gian thực cần kỹ thuật phù hợp |

### Sprint 5: Thanh toán và hóa đơn

| Thông tin | Nội dung |
|-----------|----------|
| **Mục tiêu** | Thu ngân xem hóa đơn, kiểm tra tổng tiền (tự động tính), áp dụng giảm giá/VAT, ghi nhận thanh toán, cập nhật trạng thái. Quản lý có thể hủy hóa đơn. |
| **User Story chính** | US-PAY-01 → US-PAY-07 (thanh toán bắt buộc), US-PAY-08 (in hóa đơn — Should Have) |
| **Kết quả đầu ra** | Màn hình thanh toán, tự động tính tiền, giảm giá, VAT, chọn hình thức thanh toán, cập nhật trạng thái, hủy hóa đơn (ghi lý do), in hóa đơn (nếu triển khai) |
| **Phụ thuộc** | Sprint 3 (gọi món), Sprint 4 (trạng thái món — chỉ tính tiền món đã phục vụ vào hóa đơn) |
| **Rủi ro** | **Quan trọng:** Không nên làm Sprint 5 trước khi Sprint 3 và 4 ổn định. Hóa đơn sai do dữ liệu gọi món chưa chính xác sẽ gây sai sót về tiền. |
| | US-PAY-08 (in hóa đơn) là Should Have — có thể lược bỏ nếu chưa có máy in hoặc chưa kịp triển khai |

### Sprint 6: Báo cáo, kho và nhân viên

| Thông tin | Nội dung |
|-----------|----------|
| **Mục tiêu** | Báo cáo doanh thu cơ bản, quản lý kho nguyên liệu (nhập, xuất, kiểm kê, cảnh báo tồn thấp), quản lý nhân viên chi tiết, và nhật ký hoạt động. |
| **User Story chính** | US-RPT-01 → US-RPT-04 (báo cáo), US-INV-01 → US-INV-06 (kho), US-EMP-01 → US-EMP-03 (nhân viên và tài khoản), US-AUTH-03 (nhật ký hoạt động) |
| **Kết quả đầu ra** | Báo cáo doanh thu theo ngày/tháng/năm, thống kê hóa đơn, báo cáo món bán chạy, xuất Excel/PDF, quản lý kho (nhập, xuất, kiểm kê, cảnh báo), quản lý nhân viên, tra cứu nhật ký |
| **Phụ thuộc** | Sprint 5 (dữ liệu thanh toán cho báo cáo), Sprint 1 (phân quyền cho kho và nhân viên) |
| **Rủi ro** | Sprint 6 có số lượng User Story lớn nhất (14 US) và nhiều Should Have. Nếu thời gian hạn chế, có thể tách kho (INV) hoặc nhân viên (EMP) sang giai đoạn sau. |
| | Báo cáo chỉ chính xác nếu dữ liệu thanh toán (Sprint 5) đã ổn định. Không làm báo cáo trước khi thanh toán được kiểm thử kỹ. |

---

## 6. Ma trận Sprint — User Story

| Sprint | User Story | Must/Should | Module |
|:------:|:----------:|:-----------:|:------:|
| **1** | US-AUTH-01, US-AUTH-02, US-AUTH-04 | Must | AUTH |
| **2** | US-TBL-01 → US-TBL-04 | Must | TBL |
|  | US-MNU-01 → US-MNU-04 | Must | MNU |
|  | US-RES-01 → US-RES-03 | Must | RES |
|  | US-RES-04 | Should | RES |
| **3** | US-ORD-01 → US-ORD-05 | Must | ORD |
|  | US-KIT-01 | Must | KIT |
| **4** | US-KIT-02 → US-KIT-05 | Must | KIT |
|  | US-KIT-06 | Should | KIT |
| **5** | US-PAY-01 → US-PAY-07 | Must | PAY |
|  | US-PAY-08 | Should | PAY |
| **6** | US-RPT-01, US-RPT-02 | Must | RPT |
|  | US-RPT-03, US-RPT-04 | Should | RPT |
|  | US-INV-01 → US-INV-06 | Should | INV |
|  | US-EMP-01, US-EMP-03 | Should | EMP |
|  | US-EMP-02 (phiên bản đầy đủ) | Should | EMP |
|  | US-AUTH-03 | Must | AUTH |

---

## 7. Rủi ro khi chia sprint

### 7.1. Rủi ro về thứ tự triển khai

| Rủi ro | Mô tả | Mức độ |
|--------|-------|:------:|
| **Thanh toán trước khi gọi món ổn định** | Nếu Sprint 5 (thanh toán) triển khai khi Sprint 3 (gọi món) chưa ổn định, dữ liệu hóa đơn sẽ sai vì món chưa được quản lý trạng thái chính xác | **Cao** |
| **Báo cáo trước khi thanh toán ổn định** | Báo cáo doanh thu phụ thuộc vào dữ liệu thanh toán. Nếu thanh toán còn lỗi (hủy hóa đơn chưa đúng, VAT sai), số liệu báo cáo sẽ không tin cậy | **Cao** |
| **Kho tự động trừ trước khi có định mức** | Dự kiến làm kho thủ công ở Sprint 6. Nếu triển khai tự động trừ kho theo món mà chưa có định mức nguyên liệu cho từng món, tồn kho sẽ sai ngay từ đầu | **Trung bình** |
| **Đặt bàn online / QR order quá sớm** | Đưa QR order vào sớm sẽ thêm actor Khách hàng, làm phức tạp luồng gọi món, xác thực và kiểm soát. Nên để sau MVP | **Trung bình** |
| **Gộp bàn / tách hóa đơn trong MVP** | Nếu làm gộp bàn hoặc tách hóa đơn ngay từ đầu, cấu trúc đơn hàng và hóa đơn sẽ phức tạp hơn nhiều. Nên chờ xác nhận từ khách hàng trước khi đưa vào thiết kế | **Cao** |

### 7.2. Rủi ro về tài nguyên và thời gian

| Rủi ro | Mô tả | Đề xuất xử lý |
|--------|-------|---------------|
| **Sprint 1 kéo dài do thiết kế kiến trúc** | Sprint đầu thường mất thời gian chuẩn bị môi trường, cơ sở dữ liệu, quy trình tích hợp và triển khai | Chuẩn bị sẵn cấu trúc dự án mẫu, dành 3–5 ngày cho chuẩn bị kỹ thuật |
| **Sprint 6 quá tải** | Sprint 6 có 14 User Story (nhiều nhất), cả Must và Should | Nếu quá tải, tách kho (INV) hoặc nhân viên (EMP) ra sprint riêng sau MVP |
| **Phụ thuộc giữa các sprint** | Sprint 3 chờ Sprint 2, Sprint 4 chờ Sprint 3, Sprint 5 chờ Sprint 4 | Cần có kế hoạch dự phòng nếu sprint trước trễ. Có thể cho UX/UI làm trước |
| **Thiếu dữ liệu mẫu để kiểm thử** | Nhân viên, bàn, thực đơn là dữ liệu đầu vào cho luồng chính | Chuẩn bị dữ liệu mẫu ngay từ Sprint 1 |

### 7.3. Rủi ro về nghiệp vụ chưa rõ

| Rủi ro | Mô tả | Câu hỏi liên quan (file 07) |
|--------|-------|:---------------------------:|
| **Thời gian giữ bàn chưa chốt** | RES-04 cần cấu hình thời gian giữ bàn — nếu chưa rõ, có thể để mặc định 15 phút | Q-RES-03 |
| **Giới hạn giảm giá chưa rõ** | PAY-03 cần giới hạn % giảm giá — nếu chưa rõ, để 0% mặc định | Q-PAY-08 |
| **VAT chưa rõ cách tính** | PAY-04 cần tỷ lệ VAT — có thể cấu hình linh hoạt (0%, 5%, 8%, 10%) | Q-PAY-07 |
| **Hủy hóa đơn có cần xác thực lại?** | US-PAY-07: cần khách hàng xác nhận có yêu cầu xác thực lại hay không | Q-PAY-10 |
| **Món chưa chế biến khi thanh toán xử lý thế nào?** | PAY-02 cần quy tắc: hủy, cho mang về, hay chuyển đơn mới? | Q-PAY-11 |
| **Một nhân viên có nhiều vai trò không?** | AUTH-02 (một vai trò) hay AUTH có mở rộng? | Q-AUTH-01 |

---

## 8. Lưu ý khi triển khai từng Sprint

### Sprint 1
- **Tài khoản khởi tạo:** Tạo sẵn tối thiểu 1 tài khoản cho mỗi vai trò (Quản trị, Quản lý, Phục vụ, Thu ngân, Bếp) để nhóm phát triển có thể kiểm thử xuyên suốt.
- **Phân quyền:** Ma trận phân quyền phải được duyệt trước khi triển khai Sprint 1. Nếu thay đổi sau sẽ ảnh hưởng đến cả 6 sprint còn lại.
- **Kiến trúc:** Sprint 1 là thời điểm quyết định kiến trúc tổng thể (cấu trúc phần xử lý hệ thống, mô hình dữ liệu, cơ chế xác thực). Nên dành thời gian cho thiết kế kỹ thuật trước khi triển khai.

### Sprint 2
- **Dữ liệu bàn:** Cần chuẩn bị sẵn dữ liệu mẫu cho các khu vực và bàn mẫu (khoảng 10–20 bàn) để kiểm thử luồng đặt bàn và gọi món ở sprint sau.
- **Thực đơn mẫu:** Tạo sẵn 5–10 món thuộc các danh mục khác nhau để kiểm thử gọi món ở Sprint 3.
- **Trạng thái bàn:** Đảm bảo sơ đồ trạng thái bàn đã được review kỹ (BR-TBL-06 đến BR-TBL-13). Sai sót ở bước này sẽ lan sang các sprint sau.

### Sprint 3
- **Giá món theo thời điểm gọi:** Cần thiết kế bảng `order_item` lưu giá tại thời điểm gọi món (AC-ORD-07). Đây là thiết kế quan trọng ảnh hưởng đến thanh toán.
- **Quy tắc hủy món:** Món Chờ chế biến mới được hủy (AC-ORD-05). Nếu cần hủy món Đang chế biến, cần quy trình đặc biệt (gọi bếp xác nhận trước).

### Sprint 4
- **FIFO:** Bếp xem món theo thứ tự thời gian gọi (AC-KIT-02). Thiết kế cần đảm bảo sắp xếp theo thời gian tạo, không phải thời gian cập nhật.
- **Không hiển thị giá:** (AC-KIT-03) — màn hình bếp tuyệt đối không hiển thị giá món.
- **Thông báo:** (US-KIT-04) — cần chọn cơ chế thông báo gần thời gian thực phù hợp. Với MVP, kiểm tra định kỳ 5–10 giây hoặc kết nối duy trì hai chiều là đủ.

### Sprint 5
- **Chỉ tính món Đã phục vụ:** Hệ thống chỉ tính món có trạng thái Hoàn thành hoặc Đã phục vụ vào hóa đơn. Món Đang chế biến hoặc Chờ chế biến không được tính.
- **Hủy hóa đơn:** Phải ghi lý do hủy bắt buộc. Việc có cần xác thực lại (nhập mật khẩu/PIN) hay không cần chờ khách hàng xác nhận. Trong MVP, tạm thời dùng cơ chế xác nhận "Bạn có chắc chắn muốn hủy hóa đơn này?" + ghi nhật ký.
- **In hóa đơn:** (US-PAY-08) — nếu triển khai, cần mẫu in hóa đơn và cấu hình máy in trước.

### Sprint 6
- **Kho và báo cáo là Should Have:** Nếu thời gian hạn chế, ưu tiên báo cáo (RPT) trước, sau đó đến kho (INV), cuối cùng là nhân viên (EMP).
- **Số liệu báo cáo:** Báo cáo chỉ chính xác khi dữ liệu thanh toán (Sprint 5) đã ổn định. Cần kiểm thử Sprint 5 kỹ trước khi chạy Sprint 6.
- **Nhật ký hoạt động:** US-AUTH-03 là Must Have nhưng có thể triển khai ghi nhật ký từ Sprint 1 và chỉ làm giao diện xem/tra cứu ở Sprint 6.

---

## 9. Kết luận

1. **48 User Story** được chuyển từ backlog nghiệp vụ, chia thành **10 nhóm module**.
   Trong đó **34 User Story Must Have** (bắt buộc MVP) và **14 User Story Should Have**.

2. **6 sprint đề xuất** sắp xếp theo thứ tự phụ thuộc nghiệp vụ:
   - **Sprint 1:** Nền tảng và phân quyền (nền tảng cho toàn bộ hệ thống)
   - **Sprint 2:** Bàn, thực đơn và đặt bàn (dữ liệu nền cho gọi món)
   - **Sprint 3:** Gọi món và gửi bếp (nghiệp vụ chính)
   - **Sprint 4:** Bếp và trạng thái món (khép kín luồng phục vụ → bếp)
   - **Sprint 5:** Thanh toán và hóa đơn (hoàn tất giao dịch)
   - **Sprint 6:** Báo cáo, kho và nhân viên (mở rộng và quản trị)

3. **Sprint 1 đến Sprint 5** nên tập trung vào **Must Have**. Sprint 6 bao gồm nhiều
   **Should Have** — nếu thời gian hạn chế, có thể tách kho và nhân viên sang giai
   đoạn sau.

4. **Rủi ro lớn nhất:** Thay đổi ma trận phân quyền sau Sprint 1, hoặc đưa tính năng
   phức tạp (gộp bàn, tách hóa đơn, QR order, thanh toán online) vào MVP trước khi
   được khách hàng xác nhận rõ ràng.

5. **Các câu hỏi tại file 07** (đặc biệt các câu hỏi liên quan đến thanh toán, phân
   quyền và kho) cần được trả lời **trước khi sprint tương ứng bắt đầu**, không nhất
   thiết phải trả lời hết ngay từ Sprint 1. Tuy nhiên, các câu hỏi về phân quyền
   (Q-AUTH-01, Q-AUTH-02) và phạm vi hệ thống (Q-SCOPE-01) nên được trả lời trước
   Sprint 1 vì ảnh hưởng đến kiến trúc tổng thể.

---

## Phụ lục: Bảng ánh xạ Sprint — Backlog gốc

| Sprint | Backlog gốc (từ file 08) |
|:------:|:-------------------------:|
| **1** | BL-AUTH-01, BL-AUTH-02, BL-AUTH-04 |
| **2** | BL-TBL-01 → BL-TBL-04, BL-MNU-01 → BL-MNU-04, BL-RES-01 → BL-RES-04 |
| **3** | BL-ORD-01 → BL-ORD-05, BL-KIT-01 |
| **4** | BL-KIT-02 → BL-KIT-06 |
| **5** | BL-PAY-01 → BL-PAY-08 |
| **6** | BL-RPT-01 → BL-RPT-04, BL-INV-01 → BL-INV-06, BL-EMP-01, BL-EMP-03, BL-EMP-02 (đầy đủ), BL-AUTH-03 |
