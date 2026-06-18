import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, Min, ValidateIf } from 'class-validator';

export class PayInvoiceDto {
  @ApiProperty({
    description: 'Phương thức thanh toán',
    example: 'TIEN_MAT',
    enum: ['TIEN_MAT', 'CHUYEN_KHOAN', 'THE'],
  })
  @IsString()
  payment_method!: string;

  @ApiProperty({ description: 'Số tiền thanh toán', example: 110000 })
  @IsNumber()
  @Min(0)
  amount!: number;

  @ApiPropertyOptional({ description: 'Mã giao dịch', example: 'GD-20260615-001' })
  @ValidateIf((o) => o.payment_method === 'CHUYEN_KHOAN')
  @IsString()
  reference_no?: string;

  @ApiPropertyOptional({ description: 'Ghi chú', example: 'Thanh toán tiền mặt' })
  @IsOptional()
  @IsString()
  notes?: string;
}
