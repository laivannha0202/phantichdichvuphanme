import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { RevenueQueryDto } from './dto/revenue-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('revenue/summary')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Tổng quan doanh thu' })
  getRevenueSummary(@Query() query: RevenueQueryDto) {
    return this.reportsService.getRevenueSummary(query);
  }

  @Get('revenue/daily')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Doanh thu theo ngày' })
  getRevenueByDay(@Query() query: RevenueQueryDto) {
    return this.reportsService.getRevenueByDay(query);
  }

  @Get('revenue/top-items')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Top món bán chạy' })
  getTopItems(@Query() query: RevenueQueryDto) {
    return this.reportsService.getTopItems(query);
  }

  @Get('revenue/payment-methods')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Doanh thu theo phương thức thanh toán' })
  getRevenueByPaymentMethod(@Query() query: RevenueQueryDto) {
    return this.reportsService.getRevenueByPaymentMethod(query);
  }
}
