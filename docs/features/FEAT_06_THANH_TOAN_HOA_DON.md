# FEAT_06: Thanh toán / Hoá đơn

## 1. Mục tiêu

Xây dựng tính năng thanh toán order, tạo hoá đơn (invoice), quản lý phiếu thanh toán (payment), và in hoá đơn.

## 2. Actor sử dụng

| Actor | Quyền hạn |
|-------|-----------|
| QUAN_TRI_HE_THONG | Xem tất cả, huỷ hoá đơn |
| QUAN_LY | Xem tất cả, huỷ hoá đơn |
| THU_NGAN | Tạo HĐ, thanh toán, in HĐ |
| PHUC_VU | Không có quyền trong feature này |
| BEP | Không có quyền trong feature này |
| KHO | Không có quyền trong feature này |

## 3. Phạm vi trong feature

- [ ] Tạo hoá đơn từ order
- [ ] Thanh toán hoá đơn (tiền mặt, chuyển khoản)
- [ ] Cập nhật trạng thái hoá đơn
- [ ] In hoá đơn
- [ ] Xem lịch sử thanh toán

## 4. Ngoài phạm vi

- Thanh toán online (VNPay, Momo)
- Chiết khấu / KM
- Hoá đơn điện tử (e-invoice)
- Xuất báo cáo doanh thu (sprint 5 — FEAT_08)

## 5. Tài liệu nguồn liên quan

- `docs/nghiepvu/03-use-case-chi-tiet.md` — UC-06 Thanh toán
- `docs/nghiepvu/04-quy-tac-nghiep-vu.md` — BR-PAY-xx
- `docs/nghiepvu/05-trang-thai-he-thong.md` — Invoice states
- `docs/nghiepvu/06-acceptance-criteria.md` — AC-PAY-xx
- `docs/nghiepvu/10-test-case-nghiep-vu.md` — TC-PAY-xx
- `docs/nghiepvu/09-user-stories-va-sprint-goi-y.md` — US-38..43

## 6. Quy tắc nghiệp vụ áp dụng

| Rule | Description |
|------|-------------|
| BR-PAY-01 | Hoá đơn chỉ tạo được từ order HOAN_THANH hoặc DA_PHUC_VU |
| BR-PAY-02 | Mỗi order chỉ có 1 hoá đơn |
| BR-PAY-03 | Tổng tiền = subtotal + tax_amount - discount |
| BR-PAY-04 | tax_amount = subtotal * tax_rate / 100 |
| BR-PAY-05 | Số tiền thanh toán ≥ tổng hoá đơn |
| BR-PAY-06 | Tiền thừa = amount - total (nếu tiền mặt) |
| BR-PAY-07 | Hoá đơn DA_THANH_TOAN không thể huỷ |
| BR-PAY-08 | Huỷ hoá đơn → order về trạng thái trước đó |
| BR-PAY-09 | Mã hoá đơn tự động tăng theo ngày |
| BR-PAY-10 | Thanh toán chuyển khoản cần reference_no |

## 7. Trạng thái/enum liên quan

| Status | Mô tả |
|--------|-------|
| CHUA_THANH_TOAN | Chưa thanh toán |
| DA_THANH_TOAN | Đã thanh toán |
| DA_HUY | Đã huỷ |

| Payment Method | Mô tả |
|----------------|-------|
| TIEN_MAT | Tiền mặt |
| CHUYEN_KHOAN | Chuyển khoản |
| THE | Thẻ (tương lai) |

## 8. Database cần dùng

### Table: `invoices`

```sql
id              INT PRIMARY KEY AUTO_INCREMENT
order_id        INT UNIQUE NOT NULL FOREIGN KEY → orders(id)
invoice_code    VARCHAR(50) UNIQUE NOT NULL
subtotal        DECIMAL(12,2) NOT NULL
tax_rate        DECIMAL(5,2) DEFAULT 10
tax_amount      DECIMAL(12,2) NOT NULL
discount        DECIMAL(12,2) DEFAULT 0
total           DECIMAL(12,2) NOT NULL
status          ENUM('CHUA_THANH_TOAN','DA_THANH_TOAN','DA_HUY') DEFAULT 'CHUA_THANH_TOAN'
notes           TEXT
created_at      DATETIME(3)
updated_at      DATETIME(3)
```

### Table: `payments`

```sql
id              INT PRIMARY KEY AUTO_INCREMENT
invoice_id      INT NOT NULL FOREIGN KEY → invoices(id)
payment_method  ENUM('TIEN_MAT','CHUYEN_KHOAN','THE') NOT NULL
amount          DECIMAL(12,2) NOT NULL
reference_no    VARCHAR(100)
notes           TEXT
created_at      DATETIME(3)
```

### Invoice Code Format

```
HĐ-YYYYMMDD-XXX
Ví dụ: HĐ-20250115-001, HĐ-20250115-002, ...
```

## 9. Backend cần implement

### Module Structure

```
backend/src/modules/
  invoices/
    invoice.module.ts
    invoice.controller.ts
    invoice.service.ts
    invoice.entity.ts
    dto/
      create-invoice.dto.ts
      pay-invoice.dto.ts
  payments/
    payment.module.ts
    payment.service.ts
    payment.entity.ts
```

### Key Logic

```typescript
async createInvoice(orderId: number, dto: CreateInvoiceDto) {
  const order = await this.orderRepo.findOne({ where: { id: orderId }, relations: ['items'] });
  if (order.status !== 'HOAN_THANH' && order.status !== 'DA_PHUC_VU') {
    throw new BadRequestException('Order chưa sẵn sàng thanh toán');
  }
  const existingInvoice = await this.invoiceRepo.findOne({ where: { order_id: orderId } });
  if (existingInvoice) {
    throw new BadRequestException('Order đã có hoá đơn');
  }
  const subtotal = order.items.reduce((sum, item) => sum + item.subtotal, 0);
  const taxAmount = subtotal * dto.tax_rate / 100;
  const total = subtotal + taxAmount - (dto.discount || 0);
  const invoice = this.invoiceRepo.create({
    order_id: orderId,
    invoice_code: await this.generateInvoiceCode(),
    subtotal, tax_rate: dto.tax_rate, tax_amount: taxAmount,
    discount: dto.discount || 0, total, status: 'CHUA_THANH_TOAN'
  });
  return this.invoiceRepo.save(invoice);
}
```

## 10. API contract dự kiến

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/invoices` | Tạo hoá đơn từ order | THU_NGAN, QUAN_LY |
| GET | `/api/invoices` | Danh sách hoá đơn | THU_NGAN, QUAN_LY |
| GET | `/api/invoices/:id` | Chi tiết hoá đơn | THU_NGAN, QUAN_LY |
| POST | `/api/invoices/:id/pay` | Thanh toán hoá đơn | THU_NGAN |
| POST | `/api/invoices/:id/cancel` | Huỷ hoá đơn | QUAN_LY |
| GET | `/api/invoices/:id/print` | In hoá đơn | THU_NGAN, QUAN_LY |
| GET | `/api/payments` | Lịch sử thanh toán | QUAN_LY |
| GET | `/api/payments/:id` | Chi tiết phiếu thanh toán | QUAN_LY |

### Request/Response Format

```json
// POST /api/invoices
{ "order_id": 1, "tax_rate": 10, "discount": 0 }
// Response 201
{
  "data": {
    "id": 1,
    "invoice_code": "HĐ-20250115-001",
    "order": { "id": 1, "table": { "name": "Bàn 1" } },
    "subtotal": 235000,
    "tax_rate": 10,
    "tax_amount": 23500,
    "discount": 0,
    "total": 258500,
    "status": "CHUA_THANH_TOAN"
  }
}
```

```json
// POST /api/invoices/1/pay
{ "payment_method": "TIEN_MAT", "amount": 258500, "notes": "Thanh toán tiền mặt" }
// Response 200
{ "data": { "payment_id": 1, "invoice_status": "DA_THANH_TOAN", "change": 0 } }
```

## 11. Frontend cần implement

### Pages

| Page | Path | Description |
|------|------|-------------|
| Payment | `/payment` | Danh sách hoá đơn chờ thanh toán |
| Invoice Detail | `/invoices/:id` | Chi tiết hoá đơn + in |
| Invoice List | `/invoices` | Lịch sử hoá đơn |
| Payment History | `/payments` | Lịch sử thanh toán |

### Components

| Component | Description |
|-----------|-------------|
| `InvoiceList` | Danh sách hoá đơn |
| `InvoiceDetail` | Chi tiết hoá đơn + order items |
| `PaymentForm` | Form thanh toán (TIEN_MAT, CHUYEN_KHOAN) |
| `InvoicePrint` | In hoá đơn (print-friendly) |
| `PaymentHistory` | Lịch sử phiếu thanh toán |
| `InvoiceStats` | Thống kê nhanh |

### UI Flow

```
Payment Page
├── Tabs (Chờ thanh toán, Đã thanh toán, Đã huỷ)
├── Invoice List
│   ├── Invoice Card (HĐ-20250115-001 - Bàn 1 - 258,500đ)
│   │   └── [Thanh toán] [In] [Chi tiết]
├── Invoice Detail Modal
│   ├── Order Items
│   ├── Subtotal: 235,000đ
│   ├── VAT (10%): 23,500đ
│   ├── Discount: 0đ
│   ├── Total: 258,500đ
│   └── Payment Methods
│       ├── Tiền mặt: Nhập số tiền → Tính tiền thừa
│       └── Chuyển khoản: Nhập mã GD
└── Print Invoice Button
```

## 12. Validation

| Rule | Description |
|------|-------------|
| order_id | Required, must exist, status = HOAN_THANH/DA_PHUC_VU |
| tax_rate | Optional, default 10, min 0, max 100 |
| discount | Optional, min 0 |
| payment_method | Required, must be TIEN_MAT/CHUYEN_KHOAN |
| amount | Required, min ≥ invoice total |
| reference_no | Required if payment_method = CHUYEN_KHOAN |

## 13. Permission/RBAC

| Endpoint | QUAN_TRI_HE_THONG | QUAN_LY | THU_NGAN | PHUC_VU | BEP | KHO |
|----------|:---:|:---:|:---:|:---:|:---:|:---:|
| POST /api/invoices | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /api/invoices | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /api/invoices/:id | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| POST /api/invoices/:id/pay | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| POST /api/invoices/:id/cancel | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/invoices/:id/print | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /api/payments | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## 14. Test case cần pass

### Unit Tests

| Test | Input | Expected |
|------|-------|----------|
| Create invoice success | Order HOAN_THANH | 201 + invoice |
| Create invoice wrong status | Order DANG_CHO | 400 |
| Create duplicate invoice | Order with invoice | 409 |
| Pay invoice success | TIEN_MAT, amount = total | 200 |
| Pay insufficient amount | amount < total | 400 |
| Calculate change | amount = 300000, total = 258500 | change = 41500 |
| Cancel invoice | CHUA_THANH_TOAN | 200 |
| Cancel paid invoice | DA_THANH_TOAN | 400 |
| Generate invoice code | Today = 2025-01-15 | HĐ-20250115-001 |

### Integration Tests

| Test | Steps | Expected |
|------|-------|----------|
| Full payment flow | Order → Invoice → Pay → Print | All pass |
| Cancel flow | Order → Invoice → Cancel | Invoice cancelled |

## 15. Verify commands

```bash
cd backend && npm run test -- --testPathPattern=invoice
cd backend && npm run test -- --testPathPattern=payment
cd frontend && npm run lint
cd backend && npx tsc --noEmit
cd frontend && npx tsc --noEmit
```

## 16. Bug checklist

- [ ] Tạo HĐ từ order DANG_CHO →报错 400
- [ ] Tạo HĐ trùng order →报错 409
- [ ] Thanh toán thiếu tiền →报错 400
- [ ] Tiền thừa tính đúng khi tiền mặt > tổng
- [ ] Mã HĐ tự động đúng format HĐ-YYYYMMDD-XXX
- [ ] Huỷ HĐ DA_THANH_TOAN →报错 400
- [ ] Huỷ HĐ → order về trạng thái trước
- [ ] Chuyển khoản cần reference_no
- [ ] In hoá đơn hiển thị đúng thông tin

## 17. Definition of Done

- [ ] Code implement đúng acceptance criteria
- [ ] Payment flow hoạt động đúng (full cycle)
- [ ] Invoice code auto-increment đúng
- [ ] Print invoice hoạt động đúng
- [ ] Unit test pass
- [ ] Integration test pass
- [ ] Không có regression
- [ ] Code review xong
- [ ] Commit message đúng format
- [ ] Documentation cập nhật
