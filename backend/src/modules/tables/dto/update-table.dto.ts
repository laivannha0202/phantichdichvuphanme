import { IsString, IsNotEmpty, MaxLength, IsInt, Min, IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTableDto {
  @ApiPropertyOptional({ description: 'ID khu vực', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  table_area_id?: number;

  @ApiPropertyOptional({ description: 'Tên bàn', example: 'B01 (Updated)', maxLength: 50 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ description: 'Sức chứa', example: 4, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;
}
