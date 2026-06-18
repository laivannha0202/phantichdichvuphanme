import {
  IsString,
  IsOptional,
  MaxLength,
  IsIn,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStaffDto {
  @ApiPropertyOptional({ description: 'Họ tên nhân viên', example: 'Nguyễn Văn A (Updated)', maxLength: 100 })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  full_name?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại', example: '0912345678', maxLength: 20 })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ description: 'Chức vụ', example: 'Quản lý nhà hàng cao cấp', maxLength: 50 })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  position?: string;

  @ApiPropertyOptional({ description: 'Trạng thái', example: 'DANG_LAM', enum: ['DANG_LAM', 'NGHI_VIEC', 'TAM_NGHI'] })
  @IsString()
  @IsOptional()
  @IsIn(['DANG_LAM', 'NGHI_VIEC', 'TAM_NGHI'])
  status?: string;
}
