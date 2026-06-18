import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AddOrderItemDto } from './dto/add-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { UpdateOrderItemStatusDto } from './dto/update-order-item-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ==================== ORDER ====================

  @Get()
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'PHUC_VU')
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng' })
  @ApiQuery({ name: 'status', required: false, description: 'Lọc theo trạng thái' })
  findAll(@Query('status') status?: string) {
    return this.ordersService.findAll(status);
  }

  @Get('open')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'PHUC_VU')
  @ApiOperation({ summary: 'Lấy danh sách đơn đang mở' })
  findOpenOrders() {
    return this.ordersService.findOpenOrders();
  }

  @Get(':id')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'PHUC_VU')
  @ApiOperation({ summary: 'Lấy chi tiết đơn hàng' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'PHUC_VU')
  @ApiOperation({ summary: 'Tạo đơn hàng mới' })
  create(@Body() createOrderDto: CreateOrderDto, @Request() req: any) {
    const userId = req.user?.id;
    return this.ordersService.create(createOrderDto, userId);
  }

  @Patch(':id/status')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'PHUC_VU')
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateDto);
  }

  @Delete(':id')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Hủy đơn hàng' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }

  // ==================== ORDER ITEM ====================

  @Post(':orderId/items')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'PHUC_VU')
  @ApiOperation({ summary: 'Thêm món vào đơn hàng' })
  addItem(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() addItemDto: AddOrderItemDto,
  ) {
    return this.ordersService.addItem(orderId, addItemDto);
  }

  @Patch(':orderId/items/:itemId')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'PHUC_VU')
  @ApiOperation({ summary: 'Sửa món trong đơn hàng' })
  updateItem(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateDto: UpdateOrderItemDto,
  ) {
    return this.ordersService.updateItem(orderId, itemId, updateDto);
  }

  @Patch(':orderId/items/:itemId/status')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'PHUC_VU')
  @ApiOperation({ summary: 'Cập nhật trạng thái món' })
  updateItemStatus(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateDto: UpdateOrderItemStatusDto,
  ) {
    return this.ordersService.updateItemStatus(orderId, itemId, updateDto);
  }

  @Delete(':orderId/items/:itemId')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'PHUC_VU')
  @ApiOperation({ summary: 'Hủy món trong đơn hàng' })
  removeItem(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.ordersService.removeItem(orderId, itemId);
  }
}
