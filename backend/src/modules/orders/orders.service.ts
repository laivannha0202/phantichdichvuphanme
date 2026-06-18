import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Not, In } from 'typeorm';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { Table } from '../../database/entities/table.entity';
import { MenuItem } from '../../database/entities/menu-item.entity';
import { User } from '../../database/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AddOrderItemDto } from './dto/add-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { UpdateOrderItemStatusDto } from './dto/update-order-item-status.dto';

// Trạng thái order đang mở
const OPEN_ORDER_STATUSES = ['DANG_CHUAN_BI', 'DANG_PHUC_VU'];

// Trạng thái order item có thể sửa/xóa
const EDITABLE_ITEM_STATUSES = ['CHO_CHE_BIEN'];

// Ma trận chuyển trạng thái order
const VALID_ORDER_TRANSITIONS: Record<string, string[]> = {
  DANG_CHUAN_BI: ['DANG_PHUC_VU', 'DA_HUY'],
  DANG_PHUC_VU: ['HOAN_THANH', 'DA_HUY'],
  HOAN_THANH: [],
  DA_HUY: [],
};

// Ma trận chuyển trạng thái order item
const VALID_ITEM_TRANSITIONS: Record<string, string[]> = {
  CHO_CHE_BIEN: ['DANG_CHE_BIEN', 'DA_HUY'],
  DANG_CHE_BIEN: ['HOAN_THANH'],
  HOAN_THANH: ['DA_PHUC_VU'],
  DA_PHUC_VU: [],
  DA_HUY: [],
};

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ==================== ORDER ====================

  async findAll(status?: string) {
    const where: FindOptionsWhere<Order> = {};

    if (status) {
      where.status = status;
    }

    const orders = await this.orderRepository.find({
      where,
      relations: ['table', 'items', 'items.menu_item'],
      order: { created_at: 'DESC' },
    });

    return { data: orders, message: 'Lấy danh sách đơn hàng thành công' };
  }

  async findOpenOrders() {
    const orders = await this.orderRepository.find({
      where: { status: In(OPEN_ORDER_STATUSES) },
      relations: ['table', 'items', 'items.menu_item'],
      order: { created_at: 'DESC' },
    });

    return { data: orders, message: 'Lấy danh sách đơn đang mở thành công' };
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['table', 'items', 'items.menu_item', 'created_by'],
    });

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với id ${id}`);
    }

    return { data: order, message: 'Lấy chi tiết đơn hàng thành công' };
  }

  async findByTable(tableId: number) {
    // Kiểm tra bàn tồn tại
    const table = await this.tableRepository.findOne({ where: { id: tableId } });
    if (!table) {
      throw new NotFoundException(`Không tìm thấy bàn với id ${tableId}`);
    }

    // Tìm order đang mở của bàn
    const order = await this.orderRepository.findOne({
      where: {
        table_id: tableId,
        status: In(OPEN_ORDER_STATUSES),
      },
      relations: ['table', 'items', 'items.menu_item'],
      order: { created_at: 'DESC' },
    });

    return { data: order, message: 'Lấy order theo bàn thành công' };
  }

  async create(createOrderDto: CreateOrderDto, userId: number) {
    const { table_id, note } = createOrderDto;

    // Kiểm tra bàn tồn tại
    const table = await this.tableRepository.findOne({ where: { id: table_id } });
    if (!table) {
      throw new BadRequestException(`Không tìm thấy bàn với id ${table_id}`);
    }

    // Kiểm tra bàn có trạng thái CO_KHACH
    if (table.status !== 'CO_KHACH') {
      throw new BadRequestException(
        `Bàn "${table.name}" chưa sẵn sàng để gọi món. Trạng thái hiện tại: ${table.status}`,
      );
    }

    // Kiểm tra bàn đã có order đang mở chưa
    const existingOrder = await this.orderRepository.findOne({
      where: {
        table_id,
        status: In(OPEN_ORDER_STATUSES),
      },
    });

    if (existingOrder) {
      throw new BadRequestException(
        `Bàn "${table.name}" đã có đơn hàng đang mở (mã: ${existingOrder.order_code}). Vui lòng thêm món vào đơn hiện tại.`,
      );
    }

    // Tạo mã đơn
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.orderRepository.count();
    const orderCode = `ORD-${dateStr}-${String(count + 1).padStart(3, '0')}`;

    // Tạo order
    const order = this.orderRepository.create({
      table_id,
      order_code: orderCode,
      status: 'DANG_CHUAN_BI',
      note: note || null,
      created_by_user_id: userId,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Load relations
    const result = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['table', 'items'],
    });

    return { data: result, message: 'Tạo đơn hàng thành công', statusCode: 201 };
  }

  async updateStatus(id: number, updateDto: UpdateOrderStatusDto) {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với id ${id}`);
    }

    const { status: newStatus } = updateDto;
    const currentStatus = order.status;

    // Kiểm tra chuyển trạng thái hợp lệ
    const allowedTransitions = VALID_ORDER_TRANSITIONS[currentStatus];
    if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Không thể chuyển trạng thái từ "${currentStatus}" sang "${newStatus}". ` +
        `Trạng thái hợp lệ: ${allowedTransitions?.join(', ') || 'không có'}`,
      );
    }

    // Cập nhật trạng thái
    order.status = newStatus;

    // Nếu hoàn thành → set completed_at
    if (newStatus === 'HOAN_THANH') {
      order.completed_at = new Date();
    }

    // Nếu hủy → set cancelled_at
    if (newStatus === 'DA_HUY') {
      order.cancelled_at = new Date();
    }

    const saved = await this.orderRepository.save(order);

    // Nếu hoàn thành → cập nhật bàn sang DANG_DON
    if (newStatus === 'HOAN_THANH') {
      await this.tableRepository.update(order.table_id, { status: 'DANG_DON' });
    }

    return { data: saved, message: 'Cập nhật trạng thái đơn hàng thành công' };
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với id ${id}`);
    }

    if (order.status === 'HOAN_THANH') {
      throw new BadRequestException('Không thể xóa đơn hàng đã hoàn thành');
    }

    if (order.status === 'DA_HUY') {
      throw new BadRequestException('Đơn hàng đã bị hủy');
    }

    // Hủy order
    order.status = 'DA_HUY';
    order.cancelled_at = new Date();
    await this.orderRepository.save(order);

    return { data: null, message: 'Hủy đơn hàng thành công' };
  }

  // ==================== ORDER ITEM ====================

  async addItem(orderId: number, addItemDto: AddOrderItemDto) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với id ${orderId}`);
    }

    if (order.status === 'HOAN_THANH' || order.status === 'DA_HUY') {
      throw new BadRequestException(
        `Không thể thêm món vào đơn hàng đã ${order.status === 'HOAN_THANH' ? 'hoàn thành' : 'hủy'}`,
      );
    }

    // Kiểm tra menu_item tồn tại
    const menuItem = await this.menuItemRepository.findOne({
      where: { id: addItemDto.menu_item_id },
    });

    if (!menuItem) {
      throw new BadRequestException(`Không tìm thấy món ăn với id ${addItemDto.menu_item_id}`);
    }

    // Kiểm tra món còn bán không
    if (menuItem.status === 'NGUNG_BAN') {
      throw new BadRequestException(`Món "${menuItem.name}" đã ngừng bán`);
    }

    if (menuItem.status === 'HET_MON') {
      throw new BadRequestException(`Món "${menuItem.name}" hiện hết món`);
    }

    // Tạo order item
    const item = this.orderItemRepository.create({
      order_id: orderId,
      menu_item_id: addItemDto.menu_item_id,
      quantity: addItemDto.quantity,
      unit_price: Number(menuItem.price),
      note: addItemDto.note || null,
      status: 'CHO_CHE_BIEN',
    });

    const savedItem = await this.orderItemRepository.save(item);

    // Load relations
    const result = await this.orderItemRepository.findOne({
      where: { id: savedItem.id },
      relations: ['menu_item'],
    });

    return { data: result, message: 'Thêm món thành công', statusCode: 201 };
  }

  async updateItem(orderId: number, itemId: number, updateDto: UpdateOrderItemDto) {
    const item = await this.orderItemRepository.findOne({
      where: { id: itemId, order_id: orderId },
      relations: ['order'],
    });

    if (!item) {
      throw new NotFoundException(`Không tìm thấy món với id ${itemId} trong đơn ${orderId}`);
    }

    if (item.order.status === 'HOAN_THANH' || item.order.status === 'DA_HUY') {
      throw new BadRequestException(
        `Không thể sửa món trong đơn hàng đã ${item.order.status === 'HOAN_THANH' ? 'hoàn thành' : 'hủy'}`,
      );
    }

    if (!EDITABLE_ITEM_STATUSES.includes(item.status)) {
      throw new BadRequestException(
        `Không thể sửa món ở trạng thái "${item.status}". Chỉ sửa được khi "${EDITABLE_ITEM_STATUSES.join(', ')}"`,
      );
    }

    // Cập nhật
    if (updateDto.quantity !== undefined) {
      item.quantity = updateDto.quantity;
    }
    if (updateDto.note !== undefined) {
      item.note = updateDto.note;
    }

    const saved = await this.orderItemRepository.save(item);

    return { data: saved, message: 'Cập nhật món thành công' };
  }

  async updateItemStatus(
    orderId: number,
    itemId: number,
    updateDto: UpdateOrderItemStatusDto,
  ) {
    const item = await this.orderItemRepository.findOne({
      where: { id: itemId, order_id: orderId },
      relations: ['order'],
    });

    if (!item) {
      throw new NotFoundException(`Không tìm thấy món với id ${itemId} trong đơn ${orderId}`);
    }

    if (item.order.status === 'HOAN_THANH' || item.order.status === 'DA_HUY') {
      throw new BadRequestException(
        `Không thể cập nhật trạng thái món trong đơn hàng đã ${item.order.status === 'HOAN_THANH' ? 'hoàn thành' : 'hủy'}`,
      );
    }

    const { status: newStatus } = updateDto;
    const currentStatus = item.status;

    // Kiểm tra chuyển trạng thái hợp lệ
    const allowedTransitions = VALID_ITEM_TRANSITIONS[currentStatus];
    if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Không thể chuyển trạng thái từ "${currentStatus}" sang "${newStatus}". ` +
        `Trạng thái hợp lệ: ${allowedTransitions?.join(', ') || 'không có'}`,
      );
    }

    item.status = newStatus;
    const saved = await this.orderItemRepository.save(item);

    // Kiểm tra auto-complete order
    await this.checkAutoCompleteOrder(orderId);

    return { data: saved, message: 'Cập nhật trạng thái món thành công' };
  }

  async removeItem(orderId: number, itemId: number) {
    const item = await this.orderItemRepository.findOne({
      where: { id: itemId, order_id: orderId },
      relations: ['order'],
    });

    if (!item) {
      throw new NotFoundException(`Không tìm thấy món với id ${itemId} trong đơn ${orderId}`);
    }

    if (item.order.status === 'HOAN_THANH' || item.order.status === 'DA_HUY') {
      throw new BadRequestException(
        `Không thể xóa món trong đơn hàng đã ${item.order.status === 'HOAN_THANH' ? 'hoàn thành' : 'hủy'}`,
      );
    }

    if (!EDITABLE_ITEM_STATUSES.includes(item.status)) {
      throw new BadRequestException(
        `Không thể xóa món ở trạng thái "${item.status}". Chỉ xóa được khi "${EDITABLE_ITEM_STATUSES.join(', ')}"`,
      );
    }

    // Hủy item thay vì xóa
    item.status = 'DA_HUY';
    item.cancelled_at = new Date();
    await this.orderItemRepository.save(item);

    return { data: null, message: 'Hủy món thành công' };
  }

  // ==================== HELPER ====================

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
