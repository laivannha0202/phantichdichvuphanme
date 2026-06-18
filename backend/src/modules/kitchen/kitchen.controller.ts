import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { KitchenService } from './kitchen.service';
import { UpdateKitchenItemStatusDto } from './dto/update-kitchen-item-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Kitchen')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('kitchen')
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  @Get('items')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'BEP')
  @ApiOperation({ summary: 'Lấy danh sách món cần chế biến (bếp)' })
  @ApiQuery({ name: 'status', required: false, description: 'Lọc theo trạng thái món' })
  findAllItems(@Query('status') status?: string) {
    return this.kitchenService.findAllItems(status);
  }

  @Get('items/pending')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'BEP')
  @ApiOperation({ summary: 'Lấy danh sách món chờ chế biến (CHO_CHE_BIEN)' })
  findPendingItems() {
    return this.kitchenService.findPendingItems();
  }

  @Patch('items/:itemId/status')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY', 'BEP')
  @ApiOperation({ summary: 'Cập nhật trạng thái món trong bếp' })
  updateItemStatus(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateDto: UpdateKitchenItemStatusDto,
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    return this.kitchenService.updateItemStatus(itemId, updateDto.status, userId);
  }
}
