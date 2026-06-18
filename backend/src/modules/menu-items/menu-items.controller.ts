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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { UpdateMenuItemStatusDto } from './dto/update-menu-item-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Menu Items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Get()
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'PHUC_VU', 'BEP')
  @ApiOperation({ summary: 'Lấy danh sách món ăn' })
  @ApiQuery({ name: 'category_id', required: false, description: 'Lọc theo danh mục' })
  @ApiQuery({ name: 'status', required: false, description: 'Lọc theo trạng thái' })
  findAll(
    @Query('category_id') categoryId?: string,
    @Query('status') status?: string,
  ) {
    return this.menuItemsService.findAll(
      categoryId ? parseInt(categoryId, 10) : undefined,
      status,
    );
  }

  @Get(':id')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'PHUC_VU', 'BEP')
  @ApiOperation({ summary: 'Lấy chi tiết món ăn' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuItemsService.findOne(id);
  }

  @Post()
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Tạo món ăn mới' })
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemsService.create(createMenuItemDto);
  }

  @Patch(':id')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Cập nhật món ăn' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.menuItemsService.update(id, updateMenuItemDto);
  }

  @Patch(':id/status')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'BEP')
  @ApiOperation({ summary: 'Cập nhật trạng thái món ăn' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuItemStatusDto: UpdateMenuItemStatusDto,
  ) {
    return this.menuItemsService.updateStatus(id, updateMenuItemStatusDto);
  }

  @Delete(':id')
  @Roles('QUAN_TRI_HE_THONG')
  @ApiOperation({ summary: 'Xóa món ăn' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuItemsService.remove(id);
  }
}
