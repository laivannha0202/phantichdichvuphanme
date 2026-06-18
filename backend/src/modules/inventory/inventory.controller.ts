import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { InventoryService } from './inventory.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ExportTransactionDto } from './dto/export-transaction.dto';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // ==================== SUPPLIERS ====================

  @Get('suppliers')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'KHO')
  @ApiOperation({ summary: 'Lấy danh sách nhà cung cấp' })
  async findAllSuppliers() {
    return this.inventoryService.findAllSuppliers();
  }

  @Get('suppliers/:id')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'KHO')
  @ApiOperation({ summary: 'Lấy chi tiết nhà cung cấp' })
  async findOneSupplier(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.findOneSupplier(id);
  }

  @Post('suppliers')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'KHO')
  @ApiOperation({ summary: 'Tạo nhà cung cấp mới' })
  async createSupplier(@Body() dto: CreateSupplierDto) {
    return this.inventoryService.createSupplier(dto);
  }

  @Patch('suppliers/:id')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'KHO')
  @ApiOperation({ summary: 'Cập nhật nhà cung cấp' })
  async updateSupplier(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSupplierDto,
  ) {
    return this.inventoryService.updateSupplier(id, dto);
  }

  // ==================== INGREDIENTS ====================

  @Get('ingredients')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'KHO')
  @ApiOperation({ summary: 'Lấy danh sách nguyên liệu' })
  async findAllIngredients() {
    return this.inventoryService.findAllIngredients();
  }

  @Get('ingredients/:id')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'KHO')
  @ApiOperation({ summary: 'Lấy chi tiết nguyên liệu' })
  async findOneIngredient(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.findOneIngredient(id);
  }

  @Post('ingredients')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'KHO')
  @ApiOperation({ summary: 'Tạo nguyên liệu mới' })
  async createIngredient(@Body() dto: CreateIngredientDto) {
    return this.inventoryService.createIngredient(dto);
  }

  @Patch('ingredients/:id')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'KHO')
  @ApiOperation({ summary: 'Cập nhật nguyên liệu' })
  async updateIngredient(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateIngredientDto,
  ) {
    return this.inventoryService.updateIngredient(id, dto);
  }

  // ==================== TRANSACTIONS ====================

  @Get('transactions')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'KHO')
  @ApiOperation({ summary: 'Lấy lịch sử giao dịch kho' })
  async findAllTransactions() {
    return this.inventoryService.findAllTransactions();
  }

  @Post('transactions/import')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'KHO')
  @ApiOperation({ summary: 'Nhập kho' })
  async importStock(
    @Body() dto: CreateTransactionDto,
    @CurrentUser() user: any,
  ) {
    return this.inventoryService.importStock(dto, user?.id);
  }

  @Post('transactions/export')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'KHO')
  @ApiOperation({ summary: 'Xuất kho' })
  async exportStock(
    @Body() dto: ExportTransactionDto,
    @CurrentUser() user: any,
  ) {
    return this.inventoryService.exportStock(dto, user?.id);
  }

  // ==================== DASHBOARD ====================

  @Get('low-stock')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'KHO')
  @ApiOperation({ summary: 'Lấy danh sách nguyên liệu sắp hết' })
  async getLowStock() {
    return this.inventoryService.getLowStock();
  }

  @Get('summary')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'KHO')
  @ApiOperation({ summary: 'Lấy tổng quan kho' })
  async getSummary() {
    return this.inventoryService.getSummary();
  }
}