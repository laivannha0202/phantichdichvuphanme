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
import { TableAreasService } from './table-areas.service';
import { CreateTableAreaDto } from './dto/create-table-area.dto';
import { UpdateTableAreaDto } from './dto/update-table-area.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Table Areas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('table-areas')
export class TableAreasController {
  constructor(private readonly tableAreasService: TableAreasService) {}

  @Get()
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Lấy danh sách khu vực' })
  findAll() {
    return this.tableAreasService.findAll();
  }

  @Get(':id')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Lấy chi tiết khu vực' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tableAreasService.findOne(id);
  }

  @Post()
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Tạo khu vực mới' })
  create(@Body() createTableAreaDto: CreateTableAreaDto) {
    return this.tableAreasService.create(createTableAreaDto);
  }

  @Patch(':id')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Cập nhật khu vực' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTableAreaDto: UpdateTableAreaDto,
  ) {
    return this.tableAreasService.update(id, updateTableAreaDto);
  }

  @Delete(':id')
  @Roles('QUAN_TRI_HE_THONG')
  @ApiOperation({ summary: 'Xóa khu vực' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tableAreasService.remove(id);
  }
}
