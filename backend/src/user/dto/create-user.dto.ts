import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  IsInt,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
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

  @ApiPropertyOptional({ description: 'ID nhân viên (nếu có)', example: 1 })
  @IsInt()
  @IsOptional()
  staff_id?: number;

  @ApiPropertyOptional({ description: 'Trạng thái', example: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'] })
  @IsString()
  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE'])
  status?: string;
}
