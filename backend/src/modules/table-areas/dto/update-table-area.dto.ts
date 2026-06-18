import { IsString, IsNotEmpty, MaxLength, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTableAreaDto {
  @ApiPropertyOptional({ description: 'Tên khu vực', example: 'Tầng 1 (Updated)', maxLength: 100 })
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
