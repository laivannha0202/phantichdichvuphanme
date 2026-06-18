import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../../database/entities/invoice.entity';
import { Payment } from '../../database/entities/payment.entity';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { RevenueQueryDto } from './dto/revenue-query.dto';

interface RevenueSummaryRow {
  total_invoices: number;
  total_revenue: number;
  total_orders: number;
}

interface DailyRevenueRow {
  date: string;
  invoices: number;
  revenue: number;
}

interface TopItemRow {
  item_id: number;
  item_name: string;
  quantity_sold: number;
  revenue: number;
}

interface PaymentMethodRow {
  payment_method: string;
  transaction_count: number;
  total_amount: number;
}

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  /**
   * Tổng quan doanh thu
   */
  async getRevenueSummary(query: RevenueQueryDto) {
    const { fromDate, toDate } = this.resolveDateRange(query);

    const result = await this.invoiceRepository.query<RevenueSummaryRow[]>(
      `
      SELECT
        COUNT(DISTINCT i.id) AS total_invoices,
        COALESCE(SUM(i.total), 0) AS total_revenue,
        COUNT(DISTINCT o.id) AS total_orders
      FROM invoices i
      JOIN orders o ON i.order_id = o.id
      WHERE i.status = 'DA_THANH_TOAN'
        AND i.created_at >= ? AND i.created_at <= ?
    `,
      [fromDate, toDate],
    );

    const safeSummary = result[0] || {
      total_invoices: 0,
      total_revenue: 0,
      total_orders: 0,
    };
    const totalInvoices = Number(safeSummary.total_invoices) || 0;
    const totalRevenue = Number(safeSummary.total_revenue) || 0;
    const totalOrders = Number(safeSummary.total_orders) || 0;
    const averageInvoice =
      totalInvoices > 0 ? Math.round(totalRevenue / totalInvoices) : 0;

    return {
      data: {
        period: { fromDate, toDate },
        total_revenue: totalRevenue,
        total_invoices: totalInvoices,
        total_orders: totalOrders,
        average_invoice: averageInvoice,
      },
      message: 'Lấy tổng quan doanh thu thành công',
    };
  }

  /**
   * Doanh thu theo ngày
   */
  async getRevenueByDay(query: RevenueQueryDto) {
    const { fromDate, toDate } = this.resolveDateRange(query);

    const daily = await this.invoiceRepository.query<DailyRevenueRow[]>(
      `
      SELECT
        DATE(i.created_at) AS date,
        COUNT(DISTINCT i.id) AS invoices,
        COALESCE(SUM(i.total), 0) AS revenue
      FROM invoices i
      WHERE i.status = 'DA_THANH_TOAN'
        AND i.created_at >= ? AND i.created_at <= ?
      GROUP BY DATE(i.created_at)
      ORDER BY date
    `,
      [fromDate, toDate],
    );

    return {
      data: {
        period: { fromDate, toDate },
        daily: daily.map((row) => ({
          date: row.date,
          invoices: Number(row.invoices) || 0,
          revenue: Number(row.revenue) || 0,
        })),
      },
      message: 'Lấy doanh thu theo ngày thành công',
    };
  }

  /**
   * Top món bán chạy
   */
  async getTopItems(query: RevenueQueryDto) {
    const { fromDate, toDate } = this.resolveDateRange(query);
    const limit = query.limit || 10;

    const topItems = await this.invoiceRepository.query<TopItemRow[]>(
      `
      SELECT
        mi.id AS item_id,
        mi.name AS item_name,
        SUM(oi.quantity) AS quantity_sold,
        SUM(oi.unit_price * oi.quantity) AS revenue
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      JOIN orders o ON oi.order_id = o.id
      JOIN invoices i ON i.order_id = o.id
      WHERE i.status = 'DA_THANH_TOAN'
        AND oi.status != 'DA_HUY'
        AND i.created_at >= ? AND i.created_at <= ?
      GROUP BY mi.id, mi.name
      ORDER BY quantity_sold DESC
      LIMIT ?
    `,
      [fromDate, toDate, limit],
    );

    return {
      data: {
        period: { fromDate, toDate },
        items: topItems.map((row) => ({
          item_id: Number(row.item_id),
          item_name: row.item_name,
          quantity_sold: Number(row.quantity_sold) || 0,
          revenue: Number(row.revenue) || 0,
        })),
      },
      message: 'Lấy top món bán chạy thành công',
    };
  }

  /**
   * Doanh thu theo phương thức thanh toán
   */
  async getRevenueByPaymentMethod(query: RevenueQueryDto) {
    const { fromDate, toDate } = this.resolveDateRange(query);

    const methods = await this.invoiceRepository.query<PaymentMethodRow[]>(
      `
      SELECT
        p.payment_method,
        COUNT(*) AS transaction_count,
        COALESCE(SUM(p.amount), 0) AS total_amount
      FROM payments p
      JOIN invoices i ON p.invoice_id = i.id
      WHERE i.status = 'DA_THANH_TOAN'
        AND i.created_at >= ? AND i.created_at <= ?
      GROUP BY p.payment_method
      ORDER BY total_amount DESC
    `,
      [fromDate, toDate],
    );

    return {
      data: {
        period: { fromDate, toDate },
        methods: methods.map((row) => ({
          payment_method: row.payment_method,
          transaction_count: Number(row.transaction_count) || 0,
          total_amount: Number(row.total_amount) || 0,
        })),
      },
      message: 'Lấy doanh thu theo phương thức thanh toán thành công',
    };
  }

  /**
   * Resolve date range with defaults
   */
  private resolveDateRange(query: RevenueQueryDto): {
    fromDate: string;
    toDate: string;
  } {
    const toDate = query.toDate || this.formatDate(new Date());
    const fromDate =
      query.fromDate || this.formatDate(this.subtractDays(new Date(), 30));
    return { fromDate, toDate };
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private subtractDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }
}
