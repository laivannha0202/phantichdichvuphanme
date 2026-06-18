import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsOptional, Min, IsString } from 'class-validator';

export class ExportTransactionDto {
  @ApiProperty({ description: 'ID nguyên liệu', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  ingredientId!: number;

  @ApiProperty({ description: 'Số lượng xuất', example: 30 })
  @IsNumber()
  @Min(0.001)
  quantity!: number;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  note?: string;
}