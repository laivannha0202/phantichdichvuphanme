import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsDateString,
  Matches,
} from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ description: 'ID bàn', example: 1 })
  @IsNotEmpty({ message: 'ID bàn không được để trống' })
  @IsNumber()
  table_id!: number;

  @ApiProperty({ description: 'Tên khách hàng', example: 'Nguyễn Văn A' })
  @IsNotEmpty({ message: 'Tên khách không được để trống' })
  @IsString()
  @Max(100, { message: 'Tên khách không quá 100 ký tự' })
  customer_name!: string;

  @ApiProperty({ description: 'Số điện thoại khách', example: '0901234567' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsString()
  @Matches(/^(0|\+84)[0-9]{9,10}$/, {
    message: 'Số điện thoại không hợp lệ',
  })
  customer_phone!: string;

  @ApiProperty({ description: 'Số lượng khách', example: 4 })
  @IsNotEmpty({ message: 'Số lượng khách không được để trống' })
  @IsNumber()
  @Min(1, { message: 'Số lượng khách phải lớn hơn 0' })
  guest_count!: number;

  @ApiProperty({
    description: 'Thời gian đặt (ISO 8601)',
    example: '2026-06-16T18:00:00.000Z',
  })
  @IsNotEmpty({ message: 'Thời gian đặt không được để trống' })
  @IsDateString({}, { message: 'Thời gian đặt không hợp lệ' })
  reservation_time!: string;

  @ApiPropertyOptional({ description: 'Ghi chú', example: 'Khách yêu cầu bàn gần cửa sổ' })
  @IsOptional()
  @IsString()
  note?: string;
}
