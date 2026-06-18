import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty({ description: 'ID đơn hàng', example: 3 })
  @IsNumber()
  order_id!: number;

  @ApiPropertyOptional({ description: 'Thuế suất (%)', example: 10, default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  tax_rate?: number;

  @ApiPropertyOptional({ description: 'Giảm giá', example: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @ApiPropertyOptional({ description: 'Ghi chú', example: 'Hóa đơn đặc biệt' })
  @IsOptional()
  notes?: string;
}
