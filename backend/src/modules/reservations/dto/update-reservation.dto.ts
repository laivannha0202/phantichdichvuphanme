import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  Max,
  Min,
  Matches,
} from 'class-validator';

export class UpdateReservationDto {
  @ApiPropertyOptional({ description: 'ID bàn', example: 1 })
  @IsOptional()
  @IsNumber()
  table_id?: number;

  @ApiPropertyOptional({ description: 'Tên khách hàng', example: 'Nguyễn Văn A' })
  @IsOptional()
  @IsString()
  @Max(100, { message: 'Tên khách không quá 100 ký tự' })
  customer_name?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại khách', example: '0901234567' })
  @IsOptional()
  @IsString()
  @Matches(/^(0|\+84)[0-9]{9,10}$/, {
    message: 'Số điện thoại không hợp lệ',
  })
  customer_phone?: string;

  @ApiPropertyOptional({ description: 'Số lượng khách', example: 4 })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Số lượng khách phải lớn hơn 0' })
  guest_count?: number;

  @ApiPropertyOptional({
    description: 'Thời gian đặt (ISO 8601)',
    example: '2026-06-16T18:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Thời gian đặt không hợp lệ' })
  reservation_time?: string;

  @ApiPropertyOptional({ description: 'Ghi chú', example: 'Khách yêu cầu bàn gần cửa sổ' })
  @IsOptional()
  @IsString()
  note?: string;
}
