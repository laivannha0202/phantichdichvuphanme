import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Invoice } from '../../database/entities/invoice.entity';
import { Payment } from '../../database/entities/payment.entity';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { Table } from '../../database/entities/table.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { PayInvoiceDto } from './dto/pay-invoice.dto';

// Trạng thái order có thể tạo hóa đơn
const INVOICABLE_ORDER_STATUSES = ['HOAN_THANH'];

// Trạng thái hóa đơn
const INVOICE_STATUS = {
  CHUA_THANH_TOAN: 'CHUA_THANH_TOAN',
  DA_THANH_TOAN: 'DA_THANH_TOAN',
  DA_HUY: 'DA_HUY',
};

// Ma trận chuyển trạng thái hóa đơn
const VALID_INVOICE_TRANSITIONS: Record<string, string[]> = {
  CHUA_THANH_TOAN: ['DA_THANH_TOAN', 'DA_HUY'],
  DA_THANH_TOAN: ['DA_HUY'],
  DA_HUY: [],
};

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(InvoicesService.name);

  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
  ) {}

  // ==================== INVOICE ====================

  async findAll(status?: string) {
    const where: FindOptionsWhere<Invoice> = {};

    if (status) {
      where.status = status;
    }

    const invoices = await this.invoiceRepository.find({
      where,
      relations: ['order', 'order.table', 'payments'],
      order: { created_at: 'DESC' },
    });

    return { data: invoices, message: 'Lấy danh sách hóa đơn thành công' };
  }

  async findOne(id: number) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['order', 'order.table', 'order.items', 'order.items.menu_item', 'payments'],
    });

    if (!invoice) {
      throw new NotFoundException(`Không tìm thấy hóa đơn với id ${id}`);
    }

    return { data: invoice, message: 'Lấy chi tiết hóa đơn thành công' };
  }

  async create(createInvoiceDto: CreateInvoiceDto, userId: number) {
    const { order_id, tax_rate = 10, discount = 0, notes } = createInvoiceDto;

    // Kiểm tra order tồn tại
    const order = await this.orderRepository.findOne({
      where: { id: order_id },
      relations: ['items', 'items.menu_item'],
    });

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với id ${order_id}`);
    }

    // Kiểm tra order ở trạng thái có thể tạo hóa đơn
    if (!INVOICABLE_ORDER_STATUSES.includes(order.status)) {
      throw new BadRequestException(
        `Đơn hàng "${order.order_code}" ở trạng thái "${order.status}" không thể tạo hóa đơn. ` +
        `Chỉ tạo được hóa đơn cho đơn hàng trạng thái: ${INVOICABLE_ORDER_STATUSES.join(', ')}`,
      );
    }

    // Kiểm tra order đã có hóa đơn chưa
    const existingInvoice = await this.invoiceRepository.findOne({
      where: { order_id },
    });

    if (existingInvoice) {
      throw new ConflictException(
        `Đơn hàng "${order.order_code}" đã có hóa đơn mã "${existingInvoice.invoice_code}"`,
      );
    }

    // Tính subtotal từ các món đã hoàn thành
    const activeItems = order.items.filter(
      (item) => item.deleted_at === null && item.status !== 'DA_HUY',
    );

    if (activeItems.length === 0) {
      throw new BadRequestException('Đơn hàng không có món nào hợp lệ để tạo hóa đơn');
    }

    const subtotal = activeItems.reduce(
      (sum, item) => sum + Number(item.unit_price) * item.quantity,
      0,
    );

    // Tính tax và total
    const taxAmount = (subtotal * tax_rate) / 100;
    const total = subtotal + taxAmount - discount;

    // Tạo mã hóa đơn
    const invoiceCode = await this.generateInvoiceCode();

    // Tạo hóa đơn
    const invoice = this.invoiceRepository.create({
      order_id,
      invoice_code: invoiceCode,
      subtotal,
      tax_rate,
      tax_amount: taxAmount,
      discount,
      total,
      status: INVOICE_STATUS.CHUA_THANH_TOAN,
      notes: notes || null,
    });

    const savedInvoice = await this.invoiceRepository.save(invoice);

    // Load relations
    const result = await this.invoiceRepository.findOne({
      where: { id: savedInvoice.id },
      relations: ['order', 'order.table', 'payments'],
    });

    return { data: result, message: 'Tạo hóa đơn thành công', statusCode: 201 };
  }

  async pay(id: number, payDto: PayInvoiceDto, userId: number) {
    const { payment_method, amount, reference_no, notes } = payDto;

    // Tìm hóa đơn
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['order', 'order.table', 'payments'],
    });

    if (!invoice) {
      throw new NotFoundException(`Không tìm thấy hóa đơn với id ${id}`);
    }

    // Kiểm tra trạng thái hóa đơn
    if (invoice.status !== INVOICE_STATUS.CHUA_THANH_TOAN) {
      throw new BadRequestException(
        `Hóa đơn "${invoice.invoice_code}" ở trạng thái "${invoice.status}" không thể thanh toán`,
      );
    }

    // Kiểm tra số tiền thanh toán
    if (amount < Number(invoice.total)) {
      throw new BadRequestException(
        `Số tiền thanh toán (${amount}) không đủ. Tổng tiền hóa đơn: ${invoice.total}`,
      );
    }

    // Kiểm tra mã giao dịch cho chuyển khoản
    if (payment_method === 'CHUYEN_KHOAN' && !reference_no) {
      throw new BadRequestException('Thanh toán chuyển khoản cần mã giao dịch (reference_no)');
    }

    // Tạo phiếu thanh toán — dùng raw query để tránh TypeORM null issue
    const payId = id;
    await this.paymentRepository.query(
      'INSERT INTO payments (invoice_id, payment_method, amount, reference_no, notes) VALUES (?, ?, ?, ?, ?)',
      [payId, payment_method, amount, reference_no || null, notes || null],
    );

    const savedPayment = await this.paymentRepository.findOne({
      where: { invoice_id: payId },
      order: { id: 'DESC' as any },
    });
    const savedPaymentId = savedPayment?.id || 0;

    // Cập nhật trạng thái hóa đơn
    const allowedTransitions = VALID_INVOICE_TRANSITIONS[invoice.status];
    if (!allowedTransitions || !allowedTransitions.includes(INVOICE_STATUS.DA_THANH_TOAN)) {
      throw new BadRequestException(
        `Không thể chuyển trạng thái từ "${invoice.status}" sang "${INVOICE_STATUS.DA_THANH_TOAN}"`,
      );
    }

    invoice.status = INVOICE_STATUS.DA_THANH_TOAN;
    await this.invoiceRepository.update(id, { status: INVOICE_STATUS.DA_THANH_TOAN });

    // Cập nhật bàn sang DANG_DON (theo BR-PAY-13)
    if (invoice.order && invoice.order.table_id) {
      await this.tableRepository.update(invoice.order.table_id, { status: 'DANG_DON' });
      this.logger.log(
        `Table ${invoice.order.table_id} updated to DANG_DON after payment`,
      );
    }

    // Tính tiền thừa (nếu tiền mặt)
    const change = payment_method === 'TIEN_MAT' ? amount - Number(invoice.total) : 0;

    return {
      data: {
        payment_id: savedPaymentId,
        invoice_status: invoice.status,
        change,
      },
      message: 'Thanh toán hóa đơn thành công',
    };
  }

  async cancel(id: number, reason: string, userId: number) {
    // Tìm hóa đơn
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['order', 'order.table'],
    });

    if (!invoice) {
      throw new NotFoundException(`Không tìm thấy hóa đơn với id ${id}`);
    }

    // Kiểm tra trạng thái hóa đơn
    const allowedTransitions = VALID_INVOICE_TRANSITIONS[invoice.status];
    if (!allowedTransitions || !allowedTransitions.includes(INVOICE_STATUS.DA_HUY)) {
      throw new BadRequestException(
        `Không thể hủy hóa đơn ở trạng thái "${invoice.status}"`,
      );
    }

    // Cập nhật trạng thái hóa đơn
    await this.invoiceRepository.update(id, { status: INVOICE_STATUS.DA_HUY, notes: reason });

    return {
      data: { invoice_status: invoice.status },
      message: 'Hủy hóa đơn thành công',
    };
  }

  async getPayments(invoiceId: number) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException(`Không tìm thấy hóa đơn với id ${invoiceId}`);
    }

    const payments = await this.paymentRepository.find({
      where: { invoice_id: invoiceId },
      order: { created_at: 'DESC' },
    });

    return { data: payments, message: 'Lấy danh sách thanh toán thành công' };
  }

  // ==================== HELPER ====================

  private async generateInvoiceCode(): Promise<string> {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');

    // Đếm số hóa đơn trong ngày
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const count = await this.invoiceRepository.count({
      where: {
        created_at: MoreThanOrEqual(startOfDay) && LessThanOrEqual(endOfDay),
      },
    });

    const sequence = String(count + 1).padStart(3, '0');
    return `HD-${dateStr}-${sequence}`;
  }
}
