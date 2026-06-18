import { IsString, IsNotEmpty, MaxLength, IsOptional, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMenuCategoryDto {
  @ApiPropertyOptional({ description: 'Tên danh mục', example: 'Món khai vị (Updated)', maxLength: 100 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ description: 'Thứ tự hiển thị', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sort_order?: number;
}
