import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { PayInvoiceDto } from './dto/pay-invoice.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'THU_NGAN')
  @ApiOperation({ summary: 'Lấy danh sách hóa đơn' })
  @ApiQuery({ name: 'status', required: false, description: 'Lọc theo trạng thái' })
  findAll(@Query('status') status?: string) {
    return this.invoicesService.findAll(status);
  }

  @Get(':id')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'THU_NGAN')
  @ApiOperation({ summary: 'Lấy chi tiết hóa đơn' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.invoicesService.findOne(id);
  }

  @Post()
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'THU_NGAN')
  @ApiOperation({ summary: 'Tạo hóa đơn từ đơn hàng' })
  create(@Body() createInvoiceDto: CreateInvoiceDto, @Request() req: any) {
    const userId = req.user?.id;
    return this.invoicesService.create(createInvoiceDto, userId);
  }

  @Post(':id/pay')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'THU_NGAN')
  @ApiOperation({ summary: 'Thanh toán hóa đơn' })
  pay(
    @Param('id', ParseIntPipe) id: number,
    @Body() payDto: PayInvoiceDto,
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    return this.invoicesService.pay(id, payDto, userId);
  }

  @Post(':id/cancel')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Hủy hóa đơn' })
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason: string,
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    return this.invoicesService.cancel(id, reason, userId);
  }

  @Get(':id/payments')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'THU_NGAN')
  @ApiOperation({ summary: 'Lấy danh sách thanh toán của hóa đơn' })
  getPayments(@Param('id', ParseIntPipe) id: number) {
    return this.invoicesService.getPayments(id);
  }
}
