# Kiểm tra và đánh giá yêu cầu — BA Review

> **Mục đích:** Ghi nhận kết quả kiểm tra tài liệu yêu cầu ban đầu, chỉ ra điểm chưa rõ, điểm cần chỉnh sửa trước khi chuẩn hóa.
> **Không phải** tài liệu yêu cầu chính thức.

## 1. Nhận xét tổng quan

Tài liệu hiện tại có đủ các phần chính, nhưng mức độ chi tiết chưa đồng đều:

| Phần | Đánh giá |
|------|----------|
| Actor | Có nhưng còn hơi nhiều, một số actor chưa thật sự cần thiết |
| Yêu cầu chức năng | Đầy đủ nhưng còn viết theo kiểu mô tả chung |
| Yêu cầu phi chức năng | Có nhưng chưa đo lường được |
| MoSCoW | Tạm ổn nhưng cần ưu tiên sát với phiên bản đầu của hệ thống |
| Câu hỏi làm rõ | Tốt, nhưng nên gom theo nghiệp vụ và hỏi sát quy trình thực tế hơn |

Nhìn chung, tài liệu có thể dùng làm đầu vào, nhưng cần chuẩn hóa để đạt chuẩn tài liệu phân tích yêu cầu phần mềm.

## 2. Những điểm còn chung chung

### 2.1. Actor chưa phân biệt rõ vai trò

Danh sách actor hiện tại:

- Quản lý nhà hàng
- Nhân viên phục vụ
- Thu ngân
- Nhân viên bếp
- Nhân viên kho
- Khách hàng
- Nhà cung cấp

Vấn đề:

| Actor | Vấn đề |
|-------|--------|
| Khách hàng | Nếu khách chỉ gọi nhân viên đặt bàn/gọi món thì khách không phải actor chính của hệ thống |
| Nhà cung cấp | Nếu nhà cung cấp không đăng nhập vào hệ thống thì không nên để là actor chính |
| Nhân viên kho | Chỉ cần nếu hệ thống có module kho riêng |
| Quản lý nhà hàng | Cần ghi rõ quản lý làm gì: quản lý thực đơn, nhân viên, báo cáo, phân quyền |

Đề xuất: chia actor thành hai nhóm — **actor chính** (trực tiếp thao tác hệ thống) và **actor phụ / bên ngoài** (gián tiếp hoặc qua tích hợp).

### 2.2. Yêu cầu chức năng viết chưa đủ cấu trúc

Một số yêu cầu đang ở dạng mô tả chung, thiếu:

- Ai thực hiện?
- Thực hiện chức năng gì?
- Dữ liệu nào liên quan?
- Kết quả đầu ra là gì?

Cần viết lại theo cấu trúc đầy đủ hơn.

### 2.3. Một số yêu cầu bị trùng ý

| Yêu cầu | Vấn đề |
|---------|--------|
| Quản lý bàn | Gần giống "cập nhật trạng thái bàn" |
| Quản lý bếp | Có phần trùng với "gửi món xuống bếp" |
| Báo cáo doanh thu | Trùng với "thống kê doanh thu" |

Cần gom lại thành các nhóm nghiệp vụ rõ ràng, tránh trùng lặp.

### 2.4. Thiếu mã hóa yêu cầu theo module

Yêu cầu đang đánh số FR-01 đến FR-31 liên tục. Nên chuyển sang mã hóa theo module để dễ quản lý:

| Module | Mã yêu cầu |
|--------|-----------|
| Quản lý bàn | FR-TBL-* |
| Đặt bàn | FR-RES-* |
| Gọi món | FR-ORD-* |
| Thanh toán | FR-PAY-* |
| Quản lý thực đơn | FR-MNU-* |
| Quản lý bếp | FR-KIT-* |
| Quản lý kho | FR-INV-* |
| Báo cáo | FR-RPT-* |

## 3. Yêu cầu phi chức năng chưa đo lường được

Các NFR hiện tại dùng từ ngữ chung như "phản hồi nhanh", "dễ sử dụng" — đúng hướng nhưng thiếu tiêu chí kiểm tra. Cần viết lại thành dạng có thể kiểm chứng (verifiable).

## 4. Kết luận

- Tài liệu gốc có đủ các thành phần cơ bản.
- Cần chuẩn hóa: cấu trúc actor, mã hóa yêu cầu theo module, bổ sung tiêu chí đo lường cho NFR.
- Cần bổ sung câu hỏi làm rõ với khách hàng (xem file `01-tong-quan-yeu-cau-chuan-hoa.md`).
