import { IsString, IsNotEmpty, MaxLength, IsInt, Min, IsOptional, IsNumber, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const MENU_ITEM_STATUSES = ['DANG_BAN', 'HET_MON', 'NGUNG_BAN'];

export class UpdateMenuItemDto {
  @ApiPropertyOptional({ description: 'ID danh mục', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  category_id?: number;

  @ApiPropertyOptional({ description: 'Tên món', example: 'Phở Bò (Updated)', maxLength: 200 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({ description: 'Mô tả món', example: 'Phở bò truyền thống' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Giá bán', example: 65000, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ description: 'Giá vốn', example: 30000, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost_price?: number;

  @ApiPropertyOptional({ description: 'URL ảnh', example: '/images/pho-bo.jpg', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  image_url?: string;

  @ApiPropertyOptional({ description: 'Trạng thái', enum: MENU_ITEM_STATUSES })
  @IsOptional()
  @IsString()
  @IsIn(MENU_ITEM_STATUSES)
  status?: string;
}
