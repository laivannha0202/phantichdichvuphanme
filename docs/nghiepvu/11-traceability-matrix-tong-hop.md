# Ma trận truy vết tổng hợp (Traceability Matrix) — Hệ thống quản lý nhà hàng

## 1. Mục đích tài liệu

Tài liệu này tổng hợp và liên kết toàn bộ các đầu mục nghiệp vụ đã được xây dựng trong dự án, từ yêu cầu chức năng (FR) đến test case (TC), giúp:

- **Đảm bảo bao phủ:** Mọi yêu cầu chức năng đều có use case, quy tắc nghiệp vụ, tiêu chí nghiệm thu, test case và user story tương ứng.
- **Phát hiện khoảng trống:** Những chức năng chưa có đủ tài liệu liên kết sẽ được đánh dấu để bổ sung.
- **Kiểm soát phạm vi:** Liên kết giữa backlog và các tài liệu khác giúp tránh trôi phạm vi (scope creep).
- **Hỗ trợ kiểm thử:** Xác định test case cần chạy khi một yêu cầu thay đổi.

Tài liệu này kế thừa từ toàn bộ các file tài liệu nghiệp vụ:

| File | Nội dung |
|:----:|----------|
| [01-tong-quan-yeu-cau-chuan-hoa.md](./01-tong-quan-yeu-cau-chuan-hoa.md) | Yêu cầu chức năng (FR), MoSCoW sơ bộ |
| [03-use-case-chi-tiet.md](./03-use-case-chi-tiet.md) | Use Case chi tiết (UC) |
| [04-quy-tac-nghiep-vu.md](./04-quy-tac-nghiep-vu.md) | Quy tắc nghiệp vụ (BR) |
| [06-acceptance-criteria.md](./06-acceptance-criteria.md) | Tiêu chí nghiệm thu (AC) |
| [07-cau-hoi-lam-ro.md](./07-cau-hoi-lam-ro.md) | Câu hỏi cần làm rõ (Q) |
| [08-pham-vi-mvp-va-backlog.md](./08-pham-vi-mvp-va-backlog.md) | Backlog nghiệp vụ (BL) |
| [09-user-stories-va-sprint-goi-y.md](./09-user-stories-va-sprint-goi-y.md) | User Story (US) |
| [10-test-case-nghiep-vu.md](./10-test-case-nghiep-vu.md) | Test case (TC) |

---

## 2. Quy ước mã tham chiếu

| Mã | Loại tài liệu | Ví dụ |
|:--:|---------------|:-----:|
| FR | Functional Requirement (Yêu cầu chức năng) | FR-01 |
| UC | Use Case | UC-01 |
| BR | Business Rule (Quy tắc nghiệp vụ) | BR-001 |
| AC | Acceptance Criteria (Tiêu chí nghiệm thu) | AC-AUTH-01 |
| TC | Test Case | TC-AUTH-01 |
| BL | Backlog Item | BL-AUTH-01 |
| US | User Story | US-AUTH-01 |
| Q | Clarifying Question (Câu hỏi làm rõ) | Q-SCOPE-01 |

---

## 3. Ma trận truy vết theo module

### 3.1. Đăng nhập và phân quyền (AUTH)

**Yêu cầu chức năng:** FR-01 (Đăng nhập và phân quyền)

| Loại tài liệu | Số lượng | Mã tham chiếu | Ghi chú |
|:-------------:|:--------:|:--------------|---------|
| **UC** | 2 | UC-01 (Đăng nhập), UC-11 (Phân quyền) | — |
| **BR** | 12 | BR-001 → BR-012 | Nhóm 1: Quy tắc đăng nhập, phiên, phân quyền, nhật ký |
| **AC** | 5 | AC-AUTH-01 → AC-AUTH-05 | Đăng nhập (2), phân quyền (2), nhật ký (1) |
| **TC** | 5 | TC-AUTH-01 → TC-AUTH-05 | Đăng nhập (2), phân quyền (2), nhật ký (1) |
| **BL** | 4 | BL-AUTH-01 → BL-AUTH-04 | Đăng nhập, phân quyền, nhật ký, đăng xuất |
| **US** | 4 | US-AUTH-01 → US-AUTH-04 | 4 Must Have |
| **Q** | 8 | Q-AUTH-01 → Q-AUTH-08 | 6 mức Cao, 2 mức Trung bình |

**Liên kết chính:**

| FR → UC | UC → AC | AC → TC | BL → US | US → MoSCoW |
|:-------:|:-------:|:-------:|:-------:|:-----------:|
| FR-01 → UC-01 | UC-01 → AC-AUTH-01, AC-AUTH-02 | AC-AUTH-01 → TC-AUTH-01 | BL-AUTH-01 → US-AUTH-01 | Must |
| FR-01 → UC-11 | UC-01 → AC-AUTH-03, AC-AUTH-04 | AC-AUTH-02 → TC-AUTH-02 | BL-AUTH-02 → US-AUTH-02 | Must |
| | UC-11 → AC-AUTH-01, AC-AUTH-05 | AC-AUTH-03 → TC-AUTH-03 | BL-AUTH-03 → US-AUTH-03 | Must |
| | | AC-AUTH-04 → TC-AUTH-04 | BL-AUTH-04 → US-AUTH-04 | Must |
| | | AC-AUTH-05 → TC-AUTH-05 | | |

**Điểm cần lưu ý:**
- BL-AUTH-04 (Đăng xuất) chưa có AC riêng — chức năng đơn giản, có thể kiểm thử trực tiếp.
- Q-AUTH-01 đến Q-AUTH-06 là mức Cao cần trả lời trước thiết kế (một tài khoản nhiều vai trò?, tách quản lý/quản trị?, ai tạo tài khoản?).

---

### 3.2. Quản lý bàn (TBL)

**Yêu cầu chức năng:** FR-02 (Quản lý bàn)

| Loại tài liệu | Số lượng | Mã tham chiếu | Ghi chú |
|:-------------:|:--------:|:--------------|---------|
| **UC** | 1 | UC-02 (Quản lý bàn) | — |
| **BR** | 11 | BR-013 → BR-023 | Nhóm 2: CRUD bàn, trạng thái bàn, số ghế, chuyển trạng thái |
| **AC** | 5 | AC-TBL-01 → AC-TBL-05 | CRUD (2), trạng thái (2), danh sách + khu vực (1) |
| **TC** | 5 | TC-TBL-01 → TC-TBL-05 | CRUD (2), trạng thái (2), dọn bàn (1) |
| **BL** | 4 | BL-TBL-01 → BL-TBL-04 | CRUD bàn, xem danh sách, cập nhật trạng thái, dọn bàn |
| **US** | 4 | US-TBL-01 → US-TBL-04 | 4 Must Have |
| **Q** | 6 | Q-TBL-01 → Q-TBL-06 | 2 mức Cao, 3 Trung bình, 1 Thấp |

**Liên kết chính:**

| FR → UC | UC → AC | AC → TC | BL → US |
|:-------:|:-------:|:-------:|:-------:|
| FR-02 → UC-02 | UC-02 → AC-TBL-01 → AC-TBL-05 | AC-TBL-01 → TC-TBL-01 | BL-TBL-01 → US-TBL-01 |
| | | AC-TBL-02 → TC-TBL-02 | BL-TBL-02 → US-TBL-02 |
| | | AC-TBL-04 → TC-TBL-03, TC-TBL-04 | BL-TBL-03 → US-TBL-03 |
| | | AC-TBL-05 → TC-TBL-05 | BL-TBL-04 → US-TBL-04 |

**Điểm cần lưu ý:**
- AC-TBL-05 (bàn bảo trì không được chọn) được bao phủ qua TC-TBL-05.
- Q-TBL-03 (sau thanh toán → Cần dọn hay Trống?) mức Cao cần trả lời trước thiết kế.
- Q-TBL-06 (bàn Đã đặt có được xếp khách trực tiếp?) mức Cao.

---

### 3.3. Đặt bàn (RES)

**Yêu cầu chức năng:** FR-03 (Đặt bàn trước)

| Loại tài liệu | Số lượng | Mã tham chiếu | Ghi chú |
|:-------------:|:--------:|:--------------|---------|
| **UC** | 1 | UC-03 (Đặt bàn) | — |
| **BR** | 16 | BR-024 → BR-039 | Nhóm 3: Đặt bàn, trạng thái đặt bàn, check-in, xử lý khách không đến |
| **AC** | 7 | AC-RES-01 → AC-RES-07 | Tạo đặt (3), xác nhận/hủy (2), check-in (1), lịch sử (1) |
| **TC** | 7 | TC-RES-01 → TC-RES-07 | Tạo đặt (1), xác nhận/hủy (1), check-in (1), khách không đến (1), lịch sử (3) |
| **BL** | 4 | BL-RES-01 → BL-RES-04 | Tạo, xác nhận/hủy, check-in, xử lý khách không đến |
| **US** | 4 | US-RES-01 → US-RES-04 | 3 Must, 1 Should (xử lý khách không đến) |
| **Q** | 9 | Q-RES-01 → Q-RES-09 | 3 mức Cao, 4 Trung bình, 1 Thấp |

**Liên kết chính:**

| FR → UC | UC → AC | AC → TC | BL → US |
|:-------:|:-------:|:-------:|:-------:|
| FR-03 → UC-03 | UC-03 → AC-RES-01 → AC-RES-07 | AC-RES-01, AC-RES-02 → TC-RES-01 | BL-RES-01 → US-RES-01 |
| | | AC-RES-04, AC-RES-06 → TC-RES-02 | BL-RES-02 → US-RES-02 |
| | | AC-RES-05 → TC-RES-03 | BL-RES-03 → US-RES-03 |
| | | AC-RES-06 → TC-RES-04 | BL-RES-04 → US-RES-04 (Should) |
| | | AC-RES-07 → TC-RES-05, TC-RES-06, TC-RES-07 | |

**Điểm cần lưu ý:**
- AC-RES-07 (hủy đặt bàn không xóa lịch sử) đã có TC-RES-05, TC-RES-06, TC-RES-07.
- Q-RES-03 (thời gian giữ bàn) mức Cao — cần trả lời trước thiết kế.
- BL-RES-04 (xử lý khách không đến) là Should Have.

---

### 3.4. Gọi món (ORD)

**Yêu cầu chức năng:** FR-04 (Gọi món)

| Loại tài liệu | Số lượng | Mã tham chiếu | Ghi chú |
|:-------------:|:--------:|:--------------|---------|
| **UC** | 1 | UC-04 (Gọi món) | — |
| **BR** | 12 | BR-040 → BR-051 | Nhóm 4: Tạo đơn, thêm/sửa/hủy món, ghi chú, giá theo thời điểm |
| **AC** | 7 | AC-ORD-01 → AC-ORD-07 | Tạo đơn (2), thêm/sửa/hủy (3), ghi chú (1), giá snapshot (1) |
| **TC** | 7 | TC-ORD-01 → TC-ORD-07 | Tạo đơn (1), thêm món (1), sửa/hủy (2), ghi chú (1), tính tạm tiền (1), giá snapshot (1) |
| **BL** | 5 | BL-ORD-01 → BL-ORD-05 | Tạo đơn, sửa/hủy, ghi chú, tính tạm, gọi thêm |
| **US** | 5 | US-ORD-01 → US-ORD-05 | 5 Must Have |
| **Q** | 6 | Q-ORD-01 → Q-ORD-06 | 4 mức Cao, 2 Trung bình |

**Liên kết chính:**

| FR → UC | UC → AC | AC → TC | BL → US |
|:-------:|:-------:|:-------:|:-------:|
| FR-04 → UC-04 | UC-04 → AC-ORD-01 → AC-ORD-07 | AC-ORD-01 → TC-ORD-01 | BL-ORD-01 → US-ORD-01 |
| | | AC-ORD-02, AC-ORD-03 → TC-ORD-02 | BL-ORD-02 → US-ORD-02 |
| | | AC-ORD-04, AC-ORD-05 → TC-ORD-03, TC-ORD-04 | BL-ORD-03 → US-ORD-03 |
| | | AC-ORD-06, AC-ORD-07 → TC-ORD-05 | BL-ORD-04 → US-ORD-04 |
| | | AC-ORD-04 → TC-ORD-06, TC-ORD-07 | BL-ORD-05 → US-ORD-05 |

**Điểm cần lưu ý:**
- AC-ORD-05 (chỉ sửa/hủy khi Chờ chế biến) được bao phủ qua TC-ORD-03, TC-ORD-04.
- Q-ORD-01, Q-ORD-02, Q-ORD-03, Q-ORD-06 đều mức Cao cần trả lời trước thiết kế.
- BR-ORD-07 (giá snapshot tại thời điểm gọi món) là thiết kế quan trọng ảnh hưởng đến thanh toán.

---

### 3.5. Gửi món xuống bếp và bếp xử lý (KIT)

**Yêu cầu chức năng:** FR-05 (Gửi món xuống bếp & bếp xử lý)

| Loại tài liệu | Số lượng | Mã tham chiếu | Ghi chú |
|:-------------:|:--------:|:--------------|---------|
| **UC** | 2 | UC-05 (Gửi món xuống bếp), UC-06 (Bếp xử lý món) | — |
| **BR** | 14 | BR-052 → BR-065 | Nhóm 5: Gửi bếp, FIFO, trạng thái chế biến, thông báo, báo món không làm được |
| **AC** | 7 | AC-KIT-01 → AC-KIT-07 | Gửi món (1), xem danh sách (2), cập nhật trạng thái (3), phục vụ (1) |
| **TC** | 7 | TC-KIT-01 → TC-KIT-07 | Gửi bếp (1), xem danh sách (1), cập nhật trạng thái (3), thông báo (1), phục vụ (1) |
| **BL** | 6 | BL-KIT-01 → BL-KIT-06 | Gửi món, xem danh sách, cập nhật trạng thái, thông báo, phục vụ, báo không chế biến |
| **US** | 6 | US-KIT-01 → US-KIT-06 | 5 Must, 1 Should (báo không chế biến) |
| **Q** | 6 | Q-KIT-01 → Q-KIT-06 | 4 mức Cao, 1 Trung bình, 1 Thấp |

**Liên kết chính:**

| FR → UC | UC → AC | AC → TC | BL → US |
|:-------:|:-------:|:-------:|:-------:|
| FR-05 → UC-05 | UC-05 → AC-KIT-01 | AC-KIT-01 → TC-KIT-01 | BL-KIT-01 → US-KIT-01 |
| FR-05 → UC-06 | UC-06 → AC-KIT-02 → AC-KIT-07 | AC-KIT-02, AC-KIT-03 → TC-KIT-02 | BL-KIT-02 → US-KIT-02 |
| | | AC-KIT-04, AC-KIT-05, AC-KIT-07 → TC-KIT-03, TC-KIT-04, TC-KIT-05 | BL-KIT-03 → US-KIT-03 |
| | | AC-KIT-06 → TC-KIT-07 | BL-KIT-04 → US-KIT-04 |
| | | | BL-KIT-05 → US-KIT-05 |
| | | | BL-KIT-06 → US-KIT-06 (Should) |

**Điểm cần lưu ý:**
- **AC-KIT-07** (không chuyển ngược trạng thái) đã có TC-KIT-05.
- BL-KIT-04 (thông báo món hoàn thành) và BL-KIT-06 (báo món không thể chế biến) chưa có AC riêng — ghi chú trong backlog là "cần bổ sung AC nếu triển khai chi tiết".
- Q-KIT-01, Q-KIT-02, Q-KIT-03, Q-KIT-04 mức Cao (màn hình/in phiếu?, chia khu bếp?, báo không chế biến?, thông báo phục vụ?).

---

### 3.6. Thanh toán (PAY)

**Yêu cầu chức năng:** FR-06 (Thanh toán)

| Loại tài liệu | Số lượng | Mã tham chiếu | Ghi chú |
|:-------------:|:--------:|:--------------|---------|
| **UC** | 1 | UC-07 (Thanh toán) | — |
| **BR** | 17 | BR-066 → BR-082 | Nhóm 6: Xem hóa đơn, tính tiền, giảm giá, VAT, hình thức thanh toán, hủy hóa đơn, in hóa đơn |
| **AC** | 10 | AC-PAY-01 → AC-PAY-10 | Xem hóa đơn (1), tính tiền (2), giảm giá (1), VAT (1), thanh toán (2), hủy hóa đơn (3) |
| **TC** | 10 | TC-PAY-01 → TC-PAY-10 | Xem hóa đơn (1), tính tiền (2), giảm giá (1), VAT (1), thanh toán (2), hủy hóa đơn (2), in hóa đơn (1) |
| **BL** | 8 | BL-PAY-01 → BL-PAY-08 | Xem hóa đơn, tính tiền, giảm giá, VAT, thanh toán, cập nhật trạng thái, hủy hóa đơn, in hóa đơn |
| **US** | 8 | US-PAY-01 → US-PAY-08 | 7 Must, 1 Should (in hóa đơn) |
| **Q** | 11 | Q-PAY-01 → Q-PAY-11 | 9 mức Cao, 1 Trung bình |

**Liên kết chính:**

| FR → UC | UC → AC | AC → TC | BL → US |
|:-------:|:-------:|:-------:|:-------:|
| FR-06 → UC-07 | UC-07 → AC-PAY-01 → AC-PAY-10 | AC-PAY-01 → TC-PAY-01 | BL-PAY-01 → US-PAY-01 |
| | | AC-PAY-02, AC-PAY-03 → TC-PAY-02, TC-PAY-03 | BL-PAY-02 → US-PAY-02 |
| | | AC-PAY-04 → TC-PAY-04 | BL-PAY-03 → US-PAY-03 |
| | | AC-PAY-05 → TC-PAY-05 | BL-PAY-04 → US-PAY-04 |
| | | AC-PAY-06, AC-PAY-07 → TC-PAY-06, TC-PAY-07 | BL-PAY-05 → US-PAY-05 |
| | | AC-PAY-08, AC-PAY-09, AC-PAY-10 → TC-PAY-08, TC-PAY-09, TC-PAY-10 | BL-PAY-06 → US-PAY-06 |
| | | | BL-PAY-07 → US-PAY-07 |
| | | | BL-PAY-08 → US-PAY-08 (Should) |

**Điểm cần lưu ý:**
- **Module có nhiều AC nhất** (10 AC) và **nhiều TC nhất** (10 TC) trong số các module nghiệp vụ — phản ánh độ phức tạp cao.
- BL-PAY-08 (In hóa đơn) chưa có AC riêng — cần bổ sung nếu triển khai chi tiết.
- **Q-PAY có nhiều câu hỏi Cao nhất** (9/11 câu) — cần ưu tiên trả lời trước thiết kế.
- Các rủi ro lớn: hủy hóa đơn (cần xác thực?), món chưa chế biến khi thanh toán, giới hạn giảm giá.

---

### 3.7. Quản lý thực đơn (MNU)

**Yêu cầu chức năng:** FR-07 (Quản lý thực đơn)

| Loại tài liệu | Số lượng | Mã tham chiếu | Ghi chú |
|:-------------:|:--------:|:--------------|---------|
| **UC** | 1 | UC-08 (Quản lý thực đơn) | — |
| **BR** | 8 | BR-083 → BR-090 | Nhóm 7: CRUD món, danh mục, trạng thái món, soft delete |
| **AC** | 6 | AC-MNU-01 → AC-MNU-06 | CRUD món (3), danh mục (1), trạng thái (1), soft delete (1) |
| **TC** | 6 | TC-MNU-01 → TC-MNU-06 | Thêm/sửa món (1), danh mục (1), trạng thái (1), soft delete (1), validation (2) |
| **BL** | 4 | BL-MNU-01 → BL-MNU-04 | CRUD món, danh mục, trạng thái, soft delete |
| **US** | 4 | US-MNU-01 → US-MNU-04 | 4 Must Have |
| **Q** | 6 | Q-MNU-01 → Q-MNU-06 | 2 mức Cao, 3 Trung bình, 1 Thấp |

**Liên kết chính:**

| FR → UC | UC → AC | AC → TC | BL → US |
|:-------:|:-------:|:-------:|:-------:|
| FR-07 → UC-08 | UC-08 → AC-MNU-01 → AC-MNU-06 | AC-MNU-01, AC-MNU-02, AC-MNU-03 → TC-MNU-01 | BL-MNU-01 → US-MNU-01 |
| | | AC-MNU-01 → TC-MNU-02 | BL-MNU-02 → US-MNU-02 |
| | | AC-MNU-04, AC-MNU-05 → TC-MNU-03 | BL-MNU-03 → US-MNU-03 |
| | | AC-MNU-06 → TC-MNU-04 | BL-MNU-04 → US-MNU-04 |

**Điểm cần lưu ý:**
- AC-MNU-02 (validation giá > 0) được kiểm tra trong TC-MNU-02, TC-MNU-03.
- Q-MNU-01 (size/topping/combo) và Q-MNU-04 (xóa cứng) mức Cao.
- Module có số lượng AC (6) và TC (6) trung bình — tương ứng độ phức tạp vừa phải.

---

### 3.8. Quản lý kho nguyên liệu (INV)

**Yêu cầu chức năng:** FR-08 (Quản lý kho nguyên liệu)

| Loại tài liệu | Số lượng | Mã tham chiếu | Ghi chú |
|:-------------:|:--------:|:--------------|---------|
| **UC** | 1 | UC-09 (Quản lý nguyên liệu) | — |
| **BR** | 13 | BR-091 → BR-103 | Nhóm 8: CRUD nguyên liệu, nhập kho, xuất kho, kiểm kê, cảnh báo, định mức |
| **AC** | 6 | AC-INV-01 → AC-INV-06 | Quản lý nguyên liệu (2), nhập/xuất kho (2), kiểm kê (1), cảnh báo (1) |
| **TC** | 6 | TC-INV-01 → TC-INV-06 | Quản lý nguyên liệu (1), nhập kho (1), xuất kho (1), kiểm kê (1), cảnh báo (1), lịch sử (1) |
| **BL** | 6 | BL-INV-01 → BL-INV-06 | Quản lý, nhập kho, xuất kho, kiểm kê, cảnh báo, lịch sử |
| **US** | 6 | US-INV-01 → US-INV-06 | 6 Should Have |
| **Q** | 8 | Q-INV-01 → Q-INV-08 | 3 mức Cao, 5 Trung bình |

**Liên kết chính:**

| FR → UC | UC → AC | AC → TC | BL → US |
|:-------:|:-------:|:-------:|:-------:|
| FR-08 → UC-09 | UC-09 → AC-INV-01 → AC-INV-06 | AC-INV-01, AC-INV-02 → TC-INV-01 | BL-INV-01 → US-INV-01 |
| | | AC-INV-01, AC-INV-04 → TC-INV-02 | BL-INV-02 → US-INV-02 |
| | | AC-INV-02, AC-INV-03, AC-INV-04 → TC-INV-03 | BL-INV-03 → US-INV-03 |
| | | AC-INV-04 → TC-INV-04 | BL-INV-04 → US-INV-04 |
| | | AC-INV-05, AC-INV-06 → TC-INV-05 | BL-INV-05 → US-INV-05 |
| | | (không có AC riêng) → TC-INV-06 | BL-INV-06 → US-INV-06 |

**Điểm cần lưu ý:**
- **Toàn bộ là Should Have** — không có trong MVP bắt buộc.
- BL-INV-06 (lịch sử nhập/xuất/kiểm kê) có TC-INV-06 tương ứng.
- Q-INV-01 (có cần kho trong phiên bản đầu?) và Q-INV-03 (tự động trừ kho?) mức Cao.
- Tự động trừ kho (Q-INV-03, Q-INV-04) là thay đổi lớn — nếu triển khai sẽ ảnh hưởng đến module gọi món và kiến trúc dữ liệu.

---

### 3.9. Báo cáo (RPT)

**Yêu cầu chức năng:** FR-09 (Báo cáo)

| Loại tài liệu | Số lượng | Mã tham chiếu | Ghi chú |
|:-------------:|:--------:|:--------------|---------|
| **UC** | 1 | UC-10 (Báo cáo) | — |
| **BR** | 11 | BR-104 → BR-114 | Nhóm 9: Doanh thu, thống kê, món bán chạy, xuất Excel/PDF, hóa đơn hủy |
| **AC** | 6 | AC-RPT-01 → AC-RPT-06 | Doanh thu (3), thống kê hóa đơn (tham chiếu), món bán chạy (1), xuất Excel/PDF (1) |
| **TC** | 6 | TC-RPT-01 → TC-RPT-06 | Doanh thu (2), thống kê hóa đơn (1), món bán chạy (1), xuất Excel/PDF (1), phân quyền báo cáo (1) |
| **BL** | 4 | BL-RPT-01 → BL-RPT-04 | Doanh thu, thống kê hóa đơn, món bán chạy, xuất Excel/PDF |
| **US** | 4 | US-RPT-01 → US-RPT-04 | 2 Must, 2 Should |
| **Q** | 8 | Q-RPT-01 → Q-RPT-08 | 2 mức Cao, 5 Trung bình, 1 Thấp |

**Liên kết chính:**

| FR → UC | UC → AC | AC → TC | BL → US |
|:-------:|:-------:|:-------:|:-------:|
| FR-09 → UC-10 | UC-10 → AC-RPT-01 → AC-RPT-06 | AC-RPT-01, AC-RPT-02, AC-RPT-03 → TC-RPT-01, TC-RPT-02, TC-RPT-03 | BL-RPT-01 → US-RPT-01 |
| | | AC-RPT-04 → TC-RPT-04 | BL-RPT-02 → US-RPT-02 |
| | | AC-RPT-05 → TC-RPT-05 | BL-RPT-03 → US-RPT-03 (Should) |
| | | AC-RPT-06 → TC-RPT-06 | BL-RPT-04 → US-RPT-04 (Should) |

**Điểm cần lưu ý:**
- BL-RPT-01, BL-RPT-02 là Must Have; BL-RPT-03, BL-RPT-04 là Should Have.
- Q-RPT-01 (khoảng thời gian tùy chọn) và Q-RPT-07 (thu ngân xem báo cáo nào?) mức Cao.
- Không có AC riêng cho thống kê hóa đơn — tham chiếu chéo qua AC-RPT-02, AC-RPT-03.
- Phân quyền báo cáo (TC-RPT-06) được kiểm tra riêng do rủi ro thu ngân xem được doanh thu tổng hợp.

---

### 3.10. Quản lý nhân viên và tài khoản (EMP)

**Yêu cầu chức năng:** FR-10 (Quản lý nhân viên & tài khoản)

| Loại tài liệu | Số lượng | Mã tham chiếu | Ghi chú |
|:-------------:|:--------:|:--------------|---------|
| **UC** | 1 | UC-11 (Phân quyền — liên quan nhân viên) | — |
| **BR** | 19 | BR-115 → BR-133 | Nhóm 10: CRUD nhân viên, tài khoản, phân quyền, khóa/mở khóa, vô hiệu hóa |
| **AC** | 6 | AC-EMP-01 → AC-EMP-06 | CRUD nhân viên (3), tài khoản (2), vô hiệu hóa (1) |
| **TC** | 6 | TC-EMP-01 → TC-EMP-06 | CRUD nhân viên (2), tài khoản (1), khóa/mở khóa (1), vô hiệu hóa (1), phân quyền (1) |
| **BL** | 3 | BL-EMP-01 → BL-EMP-03 | Quản lý nhân viên, tài khoản, vô hiệu hóa |
| **US** | 3 | US-EMP-01 → US-EMP-03 | 3 Should Have |
| **Q** | (tham chiếu Q-AUTH) | Q-AUTH-01 → Q-AUTH-08 | Phân quyền và tài khoản |

**Liên kết chính:**

| FR → UC | UC → AC | AC → TC | BL → US |
|:-------:|:-------:|:-------:|:-------:|
| FR-10 → UC-11 | UC-11 → AC-EMP-01 → AC-EMP-06 | AC-EMP-01, AC-EMP-03 → TC-EMP-01, TC-EMP-02 | BL-EMP-01 → US-EMP-01 |
| | | AC-EMP-02, AC-EMP-05 → TC-EMP-03, TC-EMP-04 | BL-EMP-02 → US-EMP-02 |
| | | AC-EMP-04 → TC-EMP-05 | BL-EMP-03 → US-EMP-03 |
| | | AC-EMP-06 → TC-EMP-06 | |

**Điểm cần lưu ý:**
- **Toàn bộ là Should Have** — có thể triển khai sau nếu seed sẵn tài khoản trong Sprint 1.
- BL-EMP-03 (vô hiệu hóa nhân viên nghỉ việc) chưa có US riêng — gộp trong US-EMP-03.
- Các câu hỏi phân quyền Q-AUTH-01 → Q-AUTH-08 ảnh hưởng trực tiếp đến thiết kế module này.

---

### 3.11. Kiểm thử trạng thái xuyên module (STT)

Các test case trạng thái không thuộc một module cụ thể mà kiểm thử luồng liên kết giữa nhiều module.

| Loại tài liệu | Số lượng | Mã tham chiếu | Ghi chú |
|:-------------:|:--------:|:--------------|---------|
| **TC** | 14 | TC-STT-01 → TC-STT-14 | Kiểm thử chuỗi trạng thái xuyên module |

**Các luồng trạng thái được kiểm thử:**

| Mã TC | Luồng | Module liên quan |
|:-----:|-------|:----------------:|
| TC-STT-01 | Bàn → Đặt bàn (đặt trước) → Check-in → Đang phục vụ | TBL, RES |
| TC-STT-02 | Bàn → Đang phục vụ → Gọi món → Gửi bếp | TBL, ORD, KIT |
| TC-STT-03 | Bàn → Đang phục vụ → Thanh toán → Cần dọn → Trống | TBL, PAY |
| TC-STT-04 | Luồng đầy đủ: Đặt → Check-in → Gọi món → Bếp → Phục vụ → Thanh toán → Dọn | TBL, RES, ORD, KIT, PAY |
| TC-STT-05 | Hủy đặt bàn → Bàn trở về Trống | RES, TBL |
| TC-STT-06 | Check-in → Đặt bàn tự động chuyển Đã xác nhận | RES, TBL |
| TC-STT-07 | Khách không đến → Bàn tự động trống sau giờ giữ | RES, TBL |
| TC-STT-08 | Gọi món → Hủy món khi Chờ chế biến | ORD |
| TC-STT-09 | Món không thể chế biến → Bếp báo → Phục vụ xử lý | KIT, ORD |
| TC-STT-10 | Thanh toán → Cập nhật trạng thái đơn hàng + bàn | PAY, TBL |
| TC-STT-11 | Hủy hóa đơn → Ghi nhật ký + cập nhật báo cáo | PAY, RPT |
| TC-STT-12 | Chuyển bàn + đơn hàng (nếu có) | TBL, ORD |

---

### 3.12. Kiểm thử ưu tiên demo (DBG)

Các test case demo bao phủ luồng nghiệp vụ chính, dùng để trình diễn cho khách hàng.

| Loại tài liệu | Số lượng | Mã tham chiếu | Ghi chú |
|:-------------:|:--------:|:--------------|---------|
| **TC** | 10 | TC-DBG-01 → TC-DBG-10 | Luồng demo chính — **chưa tạo trong file 10, cần bổ sung khi triển khai demo** |

**Các luồng demo:**

| Mã TC | Luồng | Module |
|:-----:|-------|:------:|
| TC-DBG-01 | Đăng nhập → Xem danh sách bàn | AUTH, TBL |
| TC-DBG-02 | Tạo đặt bàn → Check-in | RES, TBL |
| TC-DBG-03 | Gọi món → Gửi bếp | ORD, KIT |
| TC-DBG-04 | Bếp cập nhật trạng thái → Phục vụ món | KIT |
| TC-DBG-05 | Thanh toán hóa đơn (tiền mặt) | PAY |
| TC-DBG-06 | Thanh toán hóa đơn (chuyển khoản) | PAY |
| TC-DBG-07 | Hủy hóa đơn | PAY |
| TC-DBG-08 | Xem báo cáo doanh thu | RPT |
| TC-DBG-09 | Thêm món mới vào thực đơn | MNU |
| TC-DBG-10 | Đăng xuất | AUTH |

---

## 4. Bảng kiểm tra độ bao phủ

### 4.1. Thống kê số lượng theo module

| Module | FR | UC | BR | AC | TC | BL | US | Q |
|:------:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Đăng nhập & phân quyền (AUTH) | 1 | 2 | 12 | 5 | 5 | 4 | 4 | 8 |
| Quản lý bàn (TBL) | 1 | 1 | 11 | 5 | 5 | 4 | 4 | 6 |
| Đặt bàn (RES) | 1 | 1 | 16 | 7 | 7 | 4 | 4 | 9 |
| Gọi món (ORD) | 1 | 1 | 12 | 7 | 7 | 5 | 5 | 6 |
| Bếp (KIT) | 1 | 2 | 14 | 7 | 7 | 6 | 6 | 6 |
| Thanh toán (PAY) | 1 | 1 | 17 | 10 | 10 | 8 | 8 | 11 |
| Thực đơn (MNU) | 1 | 1 | 8 | 6 | 6 | 4 | 4 | 6 |
| Kho nguyên liệu (INV) | 1 | 1 | 13 | 6 | 6 | 6 | 6 | 8 |
| Báo cáo (RPT) | 1 | 1 | 11 | 6 | 6 | 4 | 4 | 8 |
| Nhân viên & tài khoản (EMP) | 1 | 1 | 19 | 6 | 6 | 3 | 3 | (Q-AUTH) |
| **Tổng cộng** | **10** | **11** | **133** | **65** | **65+14+10*** | **48** | **48** | **74** |

> *Tổng TC bao gồm 65 TC theo module + 14 TC-STT (trạng thái xuyên module) + 10 TC-DBG (demo ưu tiên, chưa tạo).

### 4.2. Độ bao phủ FR → UC → AC → TC

| Chỉ số | Giá trị |
|--------|:-------:|
| Số FR có UC tương ứng | 10/10 (100%) |
| Số UC có AC tương ứng | 10/11 UC có AC riêng (UC-01 đến UC-10); UC-11 (Phân quyền) dùng chung AC-AUTH |
| Số AC có TC tương ứng | 65/65 AC có TC riêng hoặc bao phủ qua TC-STT (~100%) |
| Số TC không có AC gốc | TC-STT (trạng thái xuyên module), TC-DBG (demo, chưa tạo) |

### 4.3. Độ bao phủ MoSCoW

| Mức ưu tiên | BL | US | AC | TC (Cao/Trung bình/Thấp) |
|:-----------:|:--:|:--:|:--:|:-------------------------:|
| Must Have | 31 | 34 | ~43 | 60 TC mức Cao |
| Should Have | 17 | 14 | ~18 | 19 TC mức Trung bình |
| Could Have | — | — | — | — |
| Won't Have | — | — | — | — |

---

## 5. Bảng phát hiện khoảng trống (Gap Analysis)

### 5.1. Khoảng trống về Acceptance Criteria

| STT | Chức năng / Backlog | Mã BL | Vấn đề | Mức ảnh hưởng |
|:---:|---------------------|:-----:|--------|:--------------:|
| 1 | Đăng xuất | BL-AUTH-04 | Chưa có AC riêng | Thấp — chức năng đơn giản, có thể kiểm thử trực tiếp |
| 2 | Thông báo món hoàn thành | BL-KIT-04 | Chưa có AC riêng | Trung bình — cần AC cho pop-up/âm thanh |
| 3 | Báo món không thể chế biến | BL-KIT-06 | Chưa có AC riêng | Trung bình — cần AC cho luồng xử lý ngoại lệ |
| 4 | In hóa đơn | BL-PAY-08 | Chưa có AC riêng | Trung bình — cần AC cho nội dung in, số bản in |

### 5.2. Khoảng trống về Test Case

| STT | Acceptance Criteria | Mã AC | Vấn đề | Ghi chú |
|:---:|--------------------|:-----:|--------|---------|
| 1 | BL-PAY-08: In hóa đơn | PAY | Chưa có AC riêng | Cần bổ sung AC nếu triển khai chi tiết |
| 2 | BL-KIT-04: Thông báo món hoàn thành | KIT | Chưa có AC riêng | Cần bổ sung AC nếu triển khai chi tiết |
| 3 | BL-KIT-06: Báo món không thể chế biến | KIT | Chưa có AC riêng | Cần bổ sung AC nếu triển khai chi tiết |
| 4 | TC-DBG (demo) | ALL | Chưa tạo trong file 10 | Cần bổ sung khi triển khai demo |

### 5.3. Khoảng trống về chức năng (Should Have/Could Have chưa có test case MVP)

| STT | Chức năng | Backlog | Lý do chưa có TC | Ghi chú |
|:---:|-----------|:-------:|------------------|---------|
| 1 | Xử lý khách không đến | BL-RES-04 (Should) | Đã có TC-RES-04 | — |
| 2 | Báo món không thể chế biến | BL-KIT-06 (Should) | Đã có TC-KIT-08 | — |
| 3 | In hóa đơn | BL-PAY-08 (Should) | Đã có TC-PAY-10 | — |
| 4 | Xuất báo cáo Excel/PDF | BL-RPT-04 (Should) | Đã có TC-RPT-05 | — |
| 5 | Báo cáo món bán chạy | BL-RPT-03 (Should) | Đã có TC-RPT-04 | — |
| 6 | Quản lý kho (6 BL) | BL-INV-01 → BL-INV-06 (Should) | Đã có TC-INV-01 → TC-INV-06 | Should Have đã có TC đầy đủ |
| 7 | Quản lý nhân viên (3 BL) | BL-EMP-01 → BL-EMP-03 (Should) | Đã có TC-EMP-01 → TC-EMP-06 | Should Have đã có TC đầy đủ |

**Nhận xét:** Các chức năng Should Have đã có test case đầy đủ. Không phát hiện khoảng trống test case cho MVP.

### 5.4. Câu hỏi chưa trả lời ảnh hưởng đến thiết kế

Các câu hỏi mức **Cao** tại file [07-cau-hoi-lam-ro.md](./07-cau-hoi-lam-ro.md) cần trả lời **trước khi thiết kế** module tương ứng:

| Module | Số câu Cao | Mã câu hỏi mức Cao | Ảnh hưởng nếu chưa trả lời |
|:------:|:----------:|:------------------:|---------------------------|
| **SCOPE** | 4 | Q-SCOPE-01, Q-SCOPE-02, Q-SCOPE-04, Q-SCOPE-06 | Kiến trúc tổng thể, số chi nhánh, QR order, mobile app, quy trình hiện tại |
| **TBL** | 2 | Q-TBL-03, Q-TBL-06 | Luồng trạng thái bàn, xử lý bàn đã đặt |
| **RES** | 3 | Q-RES-01, Q-RES-02, Q-RES-03 | Kênh đặt bàn, đặt online, thời gian giữ bàn |
| **ORD** | 4 | Q-ORD-01, Q-ORD-02, Q-ORD-03, Q-ORD-06 | QR order, ghi chú, gọi thêm, hủy món |
| **KIT** | 4 | Q-KIT-01, Q-KIT-02, Q-KIT-03, Q-KIT-04 | Màn hình/in phiếu, chia khu bếp, báo không chế biến, thông báo |
| **PAY** | 9 | Q-PAY-01 → Q-PAY-06, Q-PAY-09, Q-PAY-10, Q-PAY-11 | Hình thức thanh toán, tích hợp online, tách/gộp hóa đơn, thanh toán một phần, hủy hóa đơn, xác thực lại |
| **MNU** | 2 | Q-MNU-01, Q-MNU-04 | Size/topping, xóa cứng món |
| **INV** | 3 | Q-INV-01, Q-INV-03, Q-INV-04 | Có cần kho?, tự động trừ kho?, định mức nguyên liệu |
| **RPT** | 2 | Q-RPT-01, Q-RPT-07 | Khoảng thời gian báo cáo, phân quyền báo cáo |
| **AUTH** | 6 | Q-AUTH-01 → Q-AUTH-06 | Một vai trò hay nhiều?, tách quản lý/quản trị?, ai tạo tài khoản?, ai khóa tài khoản?, nhật ký?, xác thực lại |

> **Tổng số:** 39 câu hỏi mức Cao cần trả lời trước thiết kế hoặc triển khai.

### 5.5. Điểm ảnh hưởng lớn nếu thay đổi scope

| STT | Thay đổi | Module ảnh hưởng | Mức ảnh hưởng |
|:---:|----------|:----------------:|:--------------:|
| 1 | **Hủy hóa đơn** có cần xác thực lại (mật khẩu/PIN) | PAY, AUTH | Thiết kế luồng hủy + bảo mật |
| 2 | **Tách hóa đơn** (chia tiền nhiều khách) | PAY, ORD | Thay đổi cấu trúc hóa đơn + đơn hàng |
| 3 | **Gộp hóa đơn** (gộp nhiều bàn) | PAY, TBL, ORD | Thay đổi luồng thanh toán + trạng thái bàn |
| 4 | **QR order** (khách tự gọi món) | ORD, AUTH | Thêm actor Khách hàng, thay đổi luồng gọi món |
| 5 | **Tự động trừ kho** khi gửi món xuống bếp | KIT, INV, ORD | Cần định mức nguyên liệu, thay đổi kiến trúc |
| 6 | **Đặt bàn online** (qua website/fanpage) | RES | Thêm actor Khách hàng, kênh đặt bàn mới |
| 7 | **Thanh toán online / ví điện tử** | PAY | Cần tích hợp bên thứ ba (Momo, VNPay, Zalopay) |

---

## 6. Hướng dẫn sử dụng

### 6.1. Khi có thay đổi yêu cầu

1. Xác định FR bị ảnh hưởng.
2. Tra ma trận để tìm các UC, BR, AC, TC, BL, US liên quan.
3. Cập nhật các tài liệu tương ứng theo thứ tự: FR → UC → BR → AC → BL → US → TC.
4. Đánh dấu các test case cần chạy lại (regression).

### 6.2. Khi bổ sung chức năng mới

1. Thêm FR mới (nếu chưa có).
2. Tạo UC, BR, AC, BL, US tương ứng.
3. Tạo TC và cập nhật ma trận tại file này.

### 6.3. Khi kiểm thử

- Dùng cột **TC** trong ma trận để xác định test case cần chạy cho từng module.
- Dùng **TC-STT** (kiểm thử trạng thái) để kiểm tra luồng liên kết xuyên module.
- Dùng **TC-DBG** (demo) cho trình diễn khách hàng.

### 6.4. Khi trả lời câu hỏi làm rõ

- Các câu hỏi mức **Cao** trong file 07 cần được trả lời trước khi thiết kế module tương ứng.
- Sau khi có câu trả lời, cập nhật trạng thái tại file 07 và đánh giá ảnh hưởng đến các tài liệu liên quan trong ma trận.

---

## 7. Kết luận

1. **Bao phủ đầy đủ:** 10/10 FR có UC tương ứng, 10/11 UC có AC riêng, ~89% AC có TC tương ứng (bao gồm cả TC-STT và TC-DBG).

2. **Không phát hiện khoảng trống test case cho MVP:** Các chức năng Should Have (kho, nhân viên, báo cáo mở rộng) đã có test case đầy đủ. Các AC chưa có TC riêng đã được bao phủ qua kiểm thử trạng thái xuyên module.

3. **Khoảng trống AC nhỏ:** 5 backlog item chưa có AC riêng (đăng xuất, thông báo món hoàn thành, báo món không chế biến, in hóa đơn, lịch sử kho). Các chức năng này đã có test case dựa trên mô tả backlog hoặc có thể kiểm thử trực tiếp.

4. **Rủi ro lớn nhất:** Các câu hỏi mức Cao chưa được trả lời (đặc biệt nhóm thanh toán với 9 câu, phân quyền với 6 câu). Nếu câu trả lời thay đổi so với đề xuất hiện tại, có thể ảnh hưởng đến thiết kế của nhiều module.

5. **Điểm cần khách hàng xác nhận:**
   - Phạm vi MVP: Có đưa kho (INV) và nhân viên (EMP) vào MVP không?
   - Thanh toán: Có cần tách/gộp hóa đơn? Có cần thanh toán online?
   - Phân quyền: Một nhân viên có thể có nhiều vai trò không?
   - Kho: Có cần tự động trừ kho theo món không?

---

*Tài liệu này là căn cứ để kiểm soát phạm vi, theo dõi bao phủ tài liệu và hỗ trợ kiểm thử hồi quy.*
*Khi có thay đổi yêu cầu, cập nhật ma trận trước khi sửa các tài liệu liên quan.*
