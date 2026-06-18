import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, IsIn } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ description: 'ID nguyên liệu', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  ingredientId!: number;

  @ApiPropertyOptional({ description: 'ID nhà cung cấp', example: 1 })
  @IsOptional()
  @IsNumber()
  supplierId?: number;

  @ApiProperty({ description: 'Loại giao dịch (tự động set bởi endpoint)', enum: ['NHAP_KHO', 'XUAT_KHO', 'DIEU_CHINH'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['NHAP_KHO', 'XUAT_KHO', 'DIEU_CHINH'])
  type?: string;

  @ApiProperty({ description: 'Số lượng', example: 50 })
  @IsNumber()
  @Min(0.001)
  quantity!: number;

  @ApiPropertyOptional({ description: 'Đơn giá', example: 250000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  unitPrice?: number;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  note?: string;
}