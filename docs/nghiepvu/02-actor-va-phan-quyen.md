# Actor và phân quyền — Hệ thống quản lý nhà hàng

## 1. Mục đích

Tài liệu này xác định danh sách actor, mô tả vai trò chi tiết và ma trận phân quyền cho từng module nghiệp vụ. Đây là cơ sở để thiết kế phân quyền (authorization) và giao diện người dùng.

## 2. Actor chính

| STT | Actor | Vai trò tổng quát |
|-----|-------|-------------------|
| 1 | Quản lý nhà hàng | Quản lý cấu hình hệ thống, nhân viên, thực đơn, bàn, kho và xem báo cáo |
| 2 | Nhân viên phục vụ | Tiếp nhận đặt bàn, tạo đơn gọi món, cập nhật phục vụ món và trạng thái bàn |
| 3 | Thu ngân | Kiểm tra hóa đơn, áp dụng giảm giá, ghi nhận thanh toán và in hóa đơn |
| 4 | Nhân viên bếp | Nhận món cần chế biến, cập nhật trạng thái chế biến món |
| 5 | Nhân viên kho | Quản lý nguyên liệu, nhập kho, xuất kho, kiểm kê tồn kho |
| 6 | Quản trị hệ thống | Quản lý tài khoản, phân quyền, sao lưu và cấu hình hệ thống |

## 3. Actor phụ / Hệ thống

| STT | Actor phụ | Mô tả tương tác |
|-----|-----------|----------------|
| 1 | Khách hàng | Tra cứu thực đơn, đặt bàn hoặc gọi món qua QR/web (nếu có). Không đăng nhập vào hệ thống quản lý |
| 2 | Nhà cung cấp | Nhận đơn đặt hàng nguyên liệu (nếu có tích hợp). Không đăng nhập vào hệ thống quản lý |
| 3 | Cổng thanh toán | Xử lý giao dịch thanh toán online, quét QR, ví điện tử. Tích hợp bên ngoài nếu hệ thống có hỗ trợ thanh toán online |
| 4 | Máy in hóa đơn | In hóa đơn thanh toán tại quầy |
| 5 | Máy in bếp | In phiếu chế biến tại khu vực bếp |

## 4. Mô tả chi tiết vai trò

### 4.1. Quản lý nhà hàng

- Quản lý danh sách bàn ăn (thêm, sửa, xóa).
- Quản lý thực đơn (thêm, sửa, xóa món, phân loại, cập nhật trạng thái).
- Quản lý nhân viên (thêm, sửa, xóa, xem danh sách).
- Xem tồn kho nguyên liệu, xem cảnh báo tồn kho thấp, xem báo cáo kho.
- Không trực tiếp nhập kho, xuất kho hoặc kiểm kê — các thao tác này do Nhân viên kho thực hiện.
- Xem và xuất báo cáo (doanh thu, hóa đơn, món bán chạy).
- Không can thiệp vào tài khoản người dùng và phân quyền cấp hệ thống.

### 4.2. Nhân viên phục vụ

- Xem danh sách bàn, xem trạng thái bàn.
- Tạo và quản lý đặt bàn.
- Tạo đơn gọi món cho bàn, thêm/sửa/hủy món trong đơn.
- Xem trạng thái chế biến của món đã gọi.
- Hỗ trợ phục vụ món lên bàn.
- Không thao tác trên thanh toán, báo cáo, thực đơn, kho và nhân viên.

### 4.3. Thu ngân

- Xem hóa đơn của từng bàn.
- Kiểm tra tổng tiền, áp dụng giảm giá, phụ phí, VAT và ghi nhận thanh toán.
- Ghi nhận thanh toán (tiền mặt, chuyển khoản, thẻ).
- In và xuất hóa đơn.
- Thu ngân không xem báo cáo doanh thu tổng hợp, nhưng có thể xem thống kê hóa đơn và xuất hóa đơn/báo cáo hóa đơn nếu được phân quyền.
- Không thao tác trên gọi món, bếp, thực đơn, kho, nhân viên.

### 4.4. Nhân viên bếp

- Xem danh sách món cần chế biến (sắp xếp theo thời gian).
- Cập nhật trạng thái chế biến (đang làm, hoàn thành).
- Không thao tác trên thanh toán, thực đơn, bàn, kho, nhân viên và báo cáo.

### 4.5. Nhân viên kho

- Xem danh sách nguyên liệu.
- Nhập kho, xuất kho nguyên liệu.
- Kiểm kê tồn kho.
- Nhận cảnh báo tồn kho thấp.
- Không thao tác trên bàn, đặt bàn, gọi món, thanh toán, thực đơn, nhân viên và báo cáo.

### 4.6. Quản trị hệ thống

- Quản lý tài khoản người dùng (thêm, sửa, xóa, khóa/mở khóa).
- Phân quyền cho từng tài khoản.
- Cấu hình hệ thống (thông tin nhà hàng, cài đặt chung).
- Sao lưu và phục hồi dữ liệu.
- Xem nhật ký hoạt động (audit log).
- Không can thiệp vào nghiệp vụ nhà hàng (bàn, món, đơn hàng, thanh toán, kho).

## 5. Ma trận phân quyền

**Ký hiệu:**
- **C** (Create) — Tạo
- **R** (Read) — Xem
- **U** (Update) — Sửa
- **D** (Delete) — Xóa
- **✓** — Được phép thực hiện (cho thao tác không thuộc CRUD như đăng nhập, in ấn)
- **--** — Không có quyền

### 5.1. Module quản lý bàn

| Chức năng | Quản lý | Phục vụ | Thu ngân | Bếp | Kho | Quản trị |
|-----------|:-------:|:-------:|:--------:|:---:|:---:|:--------:|
| Xem danh sách bàn | R | R | R | -- | -- | -- |
| Thêm bàn | C | -- | -- | -- | -- | -- |
| Sửa thông tin bàn | U | -- | -- | -- | -- | -- |
| Xóa bàn | D | -- | -- | -- | -- | -- |
| Xem trạng thái bàn | R | R | R | R | -- | -- |
| Cập nhật trạng thái bàn | U | U | U | -- | -- | -- |

### 5.2. Module đặt bàn

| Chức năng | Quản lý | Phục vụ | Thu ngân | Bếp | Kho | Quản trị |
|-----------|:-------:|:-------:|:--------:|:---:|:---:|:--------:|
| Xem danh sách đặt bàn | R | R | R | -- | -- | -- |
| Tạo đặt bàn | C | C | -- | -- | -- | -- |
| Xác nhận đặt bàn | U | U | -- | -- | -- | -- |
| Chỉnh sửa đặt bàn | U | U | -- | -- | -- | -- |
| Hủy đặt bàn | U | U | -- | -- | -- | -- |

> **Ghi chú:** Hủy đặt bàn là thao tác cập nhật trạng thái đặt bàn sang "đã hủy", không xóa dữ liệu khỏi hệ thống.

### 5.3. Module gọi món

| Chức năng | Quản lý | Phục vụ | Thu ngân | Bếp | Kho | Quản trị |
|-----------|:-------:|:-------:|:--------:|:---:|:---:|:--------:|
| Xem đơn gọi món | R | R | R | R | -- | -- |
| Tạo đơn gọi món | -- | C | -- | -- | -- | -- |
| Thêm món vào đơn | -- | C | -- | -- | -- | -- |
| Sửa số lượng món | -- | U | -- | -- | -- | -- |
| Hủy món (chưa chế biến) | -- | U | -- | -- | -- | -- |
| Xem trạng thái món | R | R | R | R | -- | -- |

> **Ghi chú:** Hủy món là thao tác cập nhật trạng thái món sang "đã hủy", không xóa món khỏi lịch sử đơn hàng.

### 5.4. Module bếp

| Chức năng | Quản lý | Phục vụ | Thu ngân | Bếp | Kho | Quản trị |
|-----------|:-------:|:-------:|:--------:|:---:|:---:|:--------:|
| Xem danh sách món cần chế biến | R | R | -- | R | -- | -- |
| Cập nhật trạng thái chế biến | -- | -- | -- | U | -- | -- |
| Xem món đã hoàn thành | R | R | -- | R | -- | -- |

### 5.5. Module thanh toán

| Chức năng | Quản lý | Phục vụ | Thu ngân | Bếp | Kho | Quản trị |
|-----------|:-------:|:-------:|:--------:|:---:|:---:|:--------:|
| Xem hóa đơn | R | R | R | -- | -- | -- |
| Xem tổng tiền / kiểm tra hóa đơn | -- | -- | R | -- | -- | -- |
| Áp dụng giảm giá, phụ phí, VAT | -- | -- | U | -- | -- | -- |
| Ghi nhận thanh toán | -- | -- | C | -- | -- | -- |
| In / xuất hóa đơn | -- | -- | ✓ | -- | -- | -- |
| Hủy hóa đơn (khi cần) | U | -- | -- | -- | -- | -- |

> **Ghi chú:** Hệ thống tự động tính tổng tiền dựa trên danh sách món đã gọi. Thu ngân có quyền xem tổng tiền để kiểm tra trước khi thanh toán.

### 5.6. Module quản lý thực đơn

| Chức năng | Quản lý | Phục vụ | Thu ngân | Bếp | Kho | Quản trị |
|-----------|:-------:|:-------:|:--------:|:---:|:---:|:--------:|
| Xem danh sách món | R | R | R | R | R | -- |
| Thêm món | C | -- | -- | -- | -- | -- |
| Sửa thông tin món | U | -- | -- | -- | -- | -- |
| Xóa món | D | -- | -- | -- | -- | -- |
| Phân loại món | U | -- | -- | -- | -- | -- |
| Cập nhật trạng thái món | U | -- | -- | -- | -- | -- |

### 5.7. Module quản lý nhân viên

| Chức năng | Quản lý | Phục vụ | Thu ngân | Bếp | Kho | Quản trị |
|-----------|:-------:|:-------:|:--------:|:---:|:---:|:--------:|
| Xem danh sách nhân viên | R | -- | -- | -- | -- | R |
| Thêm nhân viên | C | -- | -- | -- | -- | C |
| Sửa thông tin nhân viên | U | -- | -- | -- | -- | U |
| Xóa nhân viên | D | -- | -- | -- | -- | D |
| Đăng nhập / đăng xuất | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

> **Ghi chú:** Quản trị hệ thống quản lý tài khoản (account) — bao gồm tạo username, gán vai trò, khóa/mở khóa. Quản lý nhà hàng quản lý thông tin nhân sự (hồ sơ, chức vụ, lương). Hai quyền này có thể chồng lấn và cần làm rõ với khách hàng.

### 5.8. Module quản lý kho nguyên liệu

| Chức năng | Quản lý | Phục vụ | Thu ngân | Bếp | Kho | Quản trị |
|-----------|:-------:|:-------:|:--------:|:---:|:---:|:--------:|
| Xem danh sách nguyên liệu | R | -- | -- | R | R | -- |
| Thêm nguyên liệu | C | -- | -- | -- | C | -- |
| Sửa thông tin nguyên liệu | U | -- | -- | -- | U | -- |
| Xóa nguyên liệu | D | -- | -- | -- | D | -- |
| Nhập kho | -- | -- | -- | -- | C | -- |
| Xuất kho | -- | -- | -- | -- | C | -- |
| Kiểm kê tồn kho | R | -- | -- | -- | C | -- |
| Xem cảnh báo tồn kho thấp | R | -- | -- | -- | R | -- |

### 5.9. Module báo cáo

| Chức năng | Quản lý | Phục vụ | Thu ngân | Bếp | Kho | Quản trị |
|-----------|:-------:|:-------:|:--------:|:---:|:---:|:--------:|
| Báo cáo doanh thu | R | -- | -- | -- | -- | -- |
| Thống kê hóa đơn | R | -- | R | -- | -- | -- |
| Thống kê món bán chạy | R | -- | -- | -- | -- | -- |
| Thống kê doanh thu theo nhân viên | R | -- | -- | -- | -- | -- |
| Xuất báo cáo Excel / PDF | R | -- | R | -- | -- | -- |
| Xem nhật ký hoạt động | -- | -- | -- | -- | -- | R |

### 5.10. Module quản trị hệ thống

| Chức năng | Quản lý | Phục vụ | Thu ngân | Bếp | Kho | Quản trị |
|-----------|:-------:|:-------:|:--------:|:---:|:---:|:--------:|
| Quản lý tài khoản (CRUD) | -- | -- | -- | -- | -- | C/R/U/D |
| Phân quyền người dùng | -- | -- | -- | -- | -- | U |
| Cấu hình thông tin nhà hàng | U | -- | -- | -- | -- | U |
| Sao lưu dữ liệu | -- | -- | -- | -- | -- | C |
| Phục hồi dữ liệu | -- | -- | -- | -- | -- | C |

## 6. Ghi chú nghiệp vụ về phân quyền

### 6.1. Nguyên tắc chung

- Mỗi nhân viên có **một tài khoản** và được gán **một vai trò** duy nhất.
- Hệ thống không cho phép một tài khoản mang nhiều vai trò cùng lúc. Nếu cần, nhân viên phải đăng xuất và đăng nhập lại với vai trò khác (hoặc có tài khoản riêng biệt). Quyết định này cần làm rõ với khách hàng.
- Quyền mặc định là **từ chối (deny)** — chỉ cấp quyền khi có vai trò phù hợp.

### 6.2. Phân tách trách nhiệm (Segregation of Duties)

- **Nhân viên phục vụ** không được xóa hóa đơn hoặc áp dụng giảm giá.
- **Thu ngân** không được tạo đơn gọi món hoặc sửa thực đơn.
- **Nhân viên bếp** chỉ thao tác trên module bếp, không can thiệp thanh toán hay báo cáo.
- **Quản lý nhà hàng** và **Quản trị hệ thống** là hai vai trò riêng: quản lý làm nghiệp vụ, quản trị làm kỹ thuật. Trong mô hình đơn giản, một người có thể kiêm cả hai, nhưng về mặt phân quyền vẫn tách biệt.

### 6.3. Quyền đặc biệt

- Hủy hóa đơn là thao tác nhạy cảm, chỉ **Quản lý nhà hàng** mới có quyền này. Hệ thống phải ghi nhật ký (audit log) mỗi khi hóa đơn bị hủy.
- Cập nhật trạng thái bàn: nhân viên phục vụ cập nhật khi khách rời bàn (chuyển "đang phục vụ" → "cần dọn"), thu ngân cập nhật khi thanh toán xong ("cần dọn" → "trống").

## 7. Các điểm cần làm rõ với khách hàng

1. **Một nhân viên có thể kiêm nhiều vai trò không?** Ví dụ: một người vừa là phục vụ vừa là thu ngân trong ca tối. Nếu có, cần xử lý ra sao? (cấp nhiều vai trò cho một tài khoản hay tạo riêng tài khoản cho mỗi ca?)
2. **Quản trị hệ thống có tách biệt với Quản lý nhà hàng không?** Trong thực tế, nhà hàng nhỏ có thể giao quản trị cho chủ/quản lý. Nhà hàng lớn cần tách riêng.
3. **Có cần quyền "xem" riêng cho từng báo cáo không?** Hay tất cả báo cáo đều được gom chung một quyền?
4. **Nhân viên bếp có được xem giá món trên phiếu chế biến không?** Thông thường bếp chỉ cần tên món, số lượng, ghi chú — không cần giá.
5. **Nhân viên phục vụ có được áp dụng giảm giá trong một số trường hợp không?** (ví dụ: giảm giá khách quen, bù lỗi món) — quy trình này thường do quản lý quyết định.
