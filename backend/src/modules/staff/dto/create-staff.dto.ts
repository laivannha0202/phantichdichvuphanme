import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  IsInt,
  IsIn,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CreateStaffUserDto {
  @ApiProperty({ description: 'Tên đăng nhập', example: 'nva_quanly', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username!: string;

  @ApiProperty({ description: 'Mật khẩu (tối thiểu 8 ký tự)', example: 'User@123', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @ApiProperty({ description: 'ID vai trò', example: 2 })
  @IsInt()
  @IsNotEmpty()
  role_id!: number;
}

export class CreateStaffDto {
  @ApiProperty({ description: 'Họ tên nhân viên', example: 'Nguyễn Văn A', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  full_name!: string;

  @ApiPropertyOptional({ description: 'Số điện thoại', example: '0901234567', maxLength: 20 })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ description: 'Chức vụ', example: 'Quản lý nhà hàng', maxLength: 50 })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  position?: string;

  @ApiPropertyOptional({ description: 'Trạng thái', example: 'DANG_LAM', enum: ['DANG_LAM', 'NGHI_VIEC', 'TAM_NGHI'] })
  @IsString()
  @IsOptional()
  @IsIn(['DANG_LAM', 'NGHI_VIEC', 'TAM_NGHI'])
  status?: string;

  @ApiProperty({ description: 'Thông tin tài khoản', type: CreateStaffUserDto })
  @ValidateNested()
  @Type(() => CreateStaffUserDto)
  @IsNotEmpty()
  user!: CreateStaffUserDto;
}
