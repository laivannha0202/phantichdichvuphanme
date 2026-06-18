import {
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
  IsInt,
  IsIn,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Tên đăng nhập', example: 'nva_quanly_updated', maxLength: 50 })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  username?: string;

  @ApiPropertyOptional({ description: 'Mật khẩu mới (tối thiểu 8 ký tự)', example: 'NewPass@123', minLength: 8 })
  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({ description: 'ID vai trò', example: 2 })
  @IsInt()
  @IsOptional()
  role_id?: number;

  @ApiPropertyOptional({ description: 'ID nhân viên', example: 1 })
  @IsInt()
  @IsOptional()
  staff_id?: number;

  @ApiPropertyOptional({ description: 'Trạng thái', example: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'] })
  @IsString()
  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE'])
  status?: string;
}
