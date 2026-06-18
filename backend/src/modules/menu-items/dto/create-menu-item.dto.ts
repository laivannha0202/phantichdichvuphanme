import { IsString, IsNotEmpty, MaxLength, IsInt, Min, IsOptional, IsNumber, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const MENU_ITEM_STATUSES = ['DANG_BAN', 'HET_MON', 'NGUNG_BAN'];

export class CreateMenuItemDto {
  @ApiProperty({ description: 'ID danh mục', example: 1 })
  @IsInt()
  @Min(1)
  category_id!: number;

  @ApiProperty({ description: 'Tên món', example: 'Phở Bò', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({ description: 'Mô tả món', example: 'Phở bò truyền thống' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Giá bán', example: 65000, minimum: 0 })
  @IsNumber()
  @Min(0)
  price!: number;

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

  @ApiPropertyOptional({ description: 'Trạng thái', enum: MENU_ITEM_STATUSES, default: 'DANG_BAN' })
  @IsOptional()
  @IsString()
  @IsIn(MENU_ITEM_STATUSES)
  status?: string;
}
