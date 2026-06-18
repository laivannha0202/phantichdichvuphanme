import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail, MaxLength } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({ description: 'Mã nhà cung cấp', example: 'NCC001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  supplierCode!: string;

  @ApiProperty({ description: 'Tên nhà cung cấp', example: 'Công ty TNHH Thực phẩm' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({ description: 'Số điện thoại', example: '0901234567' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ description: 'Email', example: 'info@company.vn' })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({ description: 'Địa chỉ', example: '123 Nguyễn Huệ, Quận 1' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  note?: string;
}