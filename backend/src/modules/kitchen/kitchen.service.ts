import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { Table } from '../../database/entities/table.entity';

// Trạng thái order không hiển thị cho bếp
const HIDDEN_ORDER_STATUSES = ['DA_HUY', 'DA_THANH_TOAN'];

// Trạng thái item không hiển thị cho bếp
const HIDDEN_ITEM_STATUSES = ['DA_HUY', 'DA_PHUC_VU'];

// Ma trận chuyển trạng thái item trong bếp
const VALID_KITCHEN_ITEM_TRANSITIONS: Record<string, string[]> = {
  CHO_CHE_BIEN: ['DANG_CHE_BIEN'],
  DANG_CHE_BIEN: ['HOAN_THANH'],
};

@Injectable()
export class KitchenService {
  private readonly logger = new Logger(KitchenService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
  ) {}

  /**
   * Lấy tất cả món cần bếp xử lý
   * - Chỉ lấy order chưa DA_HUY và chưa DA_THANH_TOAN
   * - Chỉ lấy item chưa DA_HUY và chưa DA_PHUC_VU
   */
  async findAllItems(status?: string) {
    // Tìm orders đang hoạt động (không bị hủy, chưa thanh toán)
    const activeOrders = await this.orderRepository.find({
      where: {
        status: Not(In(HIDDEN_ORDER_STATUSES)),
      },
      relations: ['table'],
    });

    const orderIds = activeOrders.map((o) => o.id);

    if (orderIds.length === 0) {
      return { data: [], message: 'Không có món nào cần chế biến' };
    }

    // Tìm items thuộc các order đang hoạt động
    const whereCondition: any = {
      order_id: In(orderIds),
      status: Not(In(HIDDEN_ITEM_STATUSES)),
    };

    // Lọc theo status nếu có
    if (status) {
      whereCondition.status = status;
    }

    const items = await this.orderItemRepository.find({
      where: whereCondition,
      relations: ['order', 'order.table', 'menu_item'],
      order: { created_at: 'ASC' },
    });

    // Format data cho bếp
    const formattedItems = items.map((item) => ({
      id: item.id,
      order_id: item.order_id,
      order_code: item.order.order_code,
      table_name: item.order.table?.name || 'N/A',
      table_id: item.order.table_id,
      menu_item_name: item.menu_item?.name || 'N/A',
      quantity: item.quantity,
      note: item.note,
      status: item.status,
      created_at: item.created_at,
    }));

    return { data: formattedItems, message: 'Lấy danh sách món bếp thành công' };
  }

  /**
   * Lấy món đang chờ chế biến (CHO_CHE_BIEN)
   */
  async findPendingItems() {
    return this.findAllItems('CHO_CHE_BIEN');
  }

  /**
   * Cập nhật trạng thái món trong bếp
   * - CHO_CHE_BIEN → DANG_CHE_BIEN (Bắt đầu chế biến)
   * - DANG_CHE_BIEN → HOAN_THANH (Hoàn thành món)
   */
  async updateItemStatus(itemId: number, newStatus: string, userId?: number) {
    // Tìm item
    const item = await this.orderItemRepository.findOne({
      where: { id: itemId },
      relations: ['order'],
    });

    if (!item) {
      throw new NotFoundException(`Không tìm thấy món với id ${itemId}`);
    }

    // Kiểm tra order không bị hủy hoặc đã thanh toán
    if (HIDDEN_ORDER_STATUSES.includes(item.order.status)) {
      throw new BadRequestException(
        `Không thể cập nhật món trong đơn hàng đã ${item.order.status === 'DA_HUY' ? 'hủy' : 'thanh toán'}`,
      );
    }

    // Kiểm tra item không bị hủy hoặc đã phục vụ
    if (HIDDEN_ITEM_STATUSES.includes(item.status)) {
      throw new BadRequestException(
        `Không thể cập nhật món ở trạng thái "${item.status}"`,
      );
    }

    const currentStatus = item.status;

    // Kiểm tra chuyển trạng thái hợp lệ
    const allowedTransitions = VALID_KITCHEN_ITEM_TRANSITIONS[currentStatus];
    if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Không thể chuyển trạng thái từ "${currentStatus}" sang "${newStatus}". ` +
        `Trạng thái hợp lệ: ${allowedTransitions?.join(', ') || 'không có'}`,
      );
    }

    // Cập nhật trạng thái
    item.status = newStatus;
    await this.orderItemRepository.save(item);

    // Kiểm tra auto-complete order
    await this.checkAutoCompleteOrder(item.order_id);

    this.logger.log(
      `Item ${itemId} updated: ${currentStatus} → ${newStatus} by user ${userId || 'system'}`,
    );

    return {
      data: { id: item.id, status: item.status },
      message: `Cập nhật trạng thái món thành công: ${currentStatus} → ${newStatus}`,
    };
  }

  /**
   * Kiểm tra và tự động hoàn thành order khi tất cả items đã xong
   */
  private async checkAutoCompleteOrder(orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items'],
    });

    if (!order) return;

    // Lấy items còn sống (không bị xóa mềm)
    const activeItems = order.items.filter((item) => item.deleted_at === null);

    if (activeItems.length === 0) return;

    // Kiểm tra tất cả items đã hoàn thành hoặc đã phục vụ hoặc đã hủy
    const allDone = activeItems.every(
      (item) =>
        item.status === 'HOAN_THANH' ||
        item.status === 'DA_PHUC_VU' ||
        item.status === 'DA_HUY',
    );

    if (allDone && order.status !== 'HOAN_THANH' && order.status !== 'DA_HUY') {
      order.status = 'HOAN_THANH';
      order.completed_at = new Date();
      await this.orderRepository.save(order);

      // Cập nhật bàn sang DANG_DON
      await this.tableRepository.update(order.table_id, { status: 'DANG_DON' });

      this.logger.log(
        `Order ${order.order_code} auto-completed. Table ${order.table_id} → DANG_DON`,
      );
    }
  }
}
