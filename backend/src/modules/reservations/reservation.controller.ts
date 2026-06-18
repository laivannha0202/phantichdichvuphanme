import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Audit } from '../../common/interceptors/audit-log.interceptor';

@ApiTags('Reservations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'PHUC_VU')
  @ApiOperation({ summary: 'Tạo đặt bàn mới' })
  @Audit('RESERVATIONS', 'CREATE', 'Reservation')
  create(@Body() dto: CreateReservationDto, @Request() req: any) {
    const userId = req.user?.id;
    return this.reservationService.create(dto, userId);
  }

  @Get()
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'PHUC_VU', 'THU_NGAN')
  @ApiOperation({ summary: 'Lấy danh sách đặt bàn' })
  @ApiQuery({ name: 'status', required: false, description: 'Lọc theo trạng thái' })
  @ApiQuery({ name: 'table_id', required: false, description: 'Lọc theo bàn' })
  @ApiQuery({ name: 'date', required: false, description: 'Lọc theo ngày (YYYY-MM-DD)' })
  findAll(
    @Query('status') status?: string,
    @Query('table_id') tableId?: string,
    @Query('date') date?: string,
  ) {
    return this.reservationService.findAll({
      status,
      table_id: tableId ? parseInt(tableId, 10) : undefined,
      date,
    });
  }

  @Get(':id')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'PHUC_VU', 'THU_NGAN')
  @ApiOperation({ summary: 'Lấy chi tiết đặt bàn' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.findOne(id);
  }

  @Patch(':id')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'PHUC_VU')
  @ApiOperation({ summary: 'Cập nhật đặt bàn' })
  @Audit('RESERVATIONS', 'UPDATE', 'Reservation')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservationDto,
  ) {
    return this.reservationService.update(id, dto);
  }

  @Patch(':id/confirm')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'PHUC_VU')
  @ApiOperation({ summary: 'Xác nhận đặt bàn' })
  @Audit('RESERVATIONS', 'STATUS_CHANGE', 'Reservation')
  confirm(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.confirm(id);
  }

  @Patch(':id/check-in')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'PHUC_VU')
  @ApiOperation({ summary: 'Check-in (khách đến nhận bàn)' })
  checkIn(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.checkIn(id);
  }

  @Patch(':id/cancel')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Hủy đặt bàn' })
  @Audit('RESERVATIONS', 'STATUS_CHANGE', 'Reservation')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.cancel(id);
  }

  @Patch(':id/no-show')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Đánh dấu khách không đến' })
  noShow(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.noShow(id);
  }

  @Delete(':id')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Xóa đặt bàn (soft delete)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.remove(id);
  }
}
