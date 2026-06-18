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
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TablesService } from './tables.service';
import { OrdersService } from '../orders/orders.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { UpdateTableStatusDto } from './dto/update-table-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Tables')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tables')
export class TablesController {
  constructor(
    private readonly tablesService: TablesService,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
  ) {}

  @Get()
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Lấy danh sách bàn' })
  @ApiQuery({ name: 'table_area_id', required: false, description: 'Lọc theo khu vực' })
  @ApiQuery({ name: 'status', required: false, description: 'Lọc theo trạng thái' })
  findAll(
    @Query('table_area_id') tableAreaId?: string,
    @Query('status') status?: string,
  ) {
    return this.tablesService.findAll(
      tableAreaId ? parseInt(tableAreaId, 10) : undefined,
      status,
    );
  }

  @Get(':id')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Lấy chi tiết bàn' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tablesService.findOne(id);
  }

  @Post()
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Tạo bàn mới' })
  create(@Body() CreateTableDto: CreateTableDto) {
    return this.tablesService.create(CreateTableDto);
  }

  @Patch(':id')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Cập nhật bàn' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTableDto: UpdateTableDto,
  ) {
    return this.tablesService.update(id, updateTableDto);
  }

  @Patch(':id/status')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'PHUC_VU')
  @ApiOperation({ summary: 'Cập nhật trạng thái bàn' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTableStatusDto: UpdateTableStatusDto,
  ) {
    return this.tablesService.updateStatus(id, updateTableStatusDto);
  }

  @Delete(':id')
  @Roles('QUAN_TRI_HE_THONG')
  @ApiOperation({ summary: 'Xóa bàn' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tablesService.remove(id);
  }

  @Get(':id/order')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'PHUC_VU')
  @ApiOperation({ summary: 'Lấy order đang mở của bàn' })
  getOrder(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findByTable(id);
  }
}
