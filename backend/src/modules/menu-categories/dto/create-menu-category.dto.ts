import { IsString, IsNotEmpty, MaxLength, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMenuCategoryDto {
  @ApiProperty({ description: 'Tên danh mục', example: 'Món khai vị', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({ description: 'Thứ tự hiển thị', example: 1, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sort_order?: number;
}
