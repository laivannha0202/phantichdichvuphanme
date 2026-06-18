import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, MaxLength, IsIn } from 'class-validator';

export class UpdateSupplierDto {
  @ApiPropertyOptional({ description: 'Tên nhà cung cấp' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ description: 'Email' })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({ description: 'Địa chỉ' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ description: 'Trạng thái', enum: ['DANG_HOP_TAC', 'NGUNG_HOP_TAC'] })
  @IsOptional()
  @IsString()
  @IsIn(['DANG_HOP_TAC', 'NGUNG_HOP_TAC'])
  status?: string;
}