import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MenuCategoriesService } from './menu-categories.service';
import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu-category.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Menu Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('menu-categories')
export class MenuCategoriesController {
  constructor(private readonly menuCategoriesService: MenuCategoriesService) {}

  @Get()
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Lấy danh sách danh mục' })
  findAll() {
    return this.menuCategoriesService.findAll();
  }

  @Get(':id')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Lấy chi tiết danh mục' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuCategoriesService.findOne(id);
  }

  @Post()
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Tạo danh mục mới' })
  create(@Body() createMenuCategoryDto: CreateMenuCategoryDto) {
    return this.menuCategoriesService.create(createMenuCategoryDto);
  }

  @Patch(':id')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Cập nhật danh mục' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuCategoryDto: UpdateMenuCategoryDto,
  ) {
    return this.menuCategoriesService.update(id, updateMenuCategoryDto);
  }

  @Delete(':id')
  @Roles('QUAN_TRI_HE_THONG')
  @ApiOperation({ summary: 'Xóa danh mục' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuCategoriesService.remove(id);
  }
}
