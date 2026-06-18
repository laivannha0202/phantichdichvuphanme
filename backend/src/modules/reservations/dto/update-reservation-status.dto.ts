import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class UpdateReservationStatusDto {
  @ApiProperty({
    description: 'Trạng thái mới',
    example: 'DA_XAC_NHAN',
    enum: ['DA_XAC_NHAN', 'DA_NHAN_BAN', 'HOAN_THANH', 'KHONG_DEN', 'DA_HUY'],
  })
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  @IsString()
  @IsIn(['DA_XAC_NHAN', 'DA_NHAN_BAN', 'HOAN_THANH', 'KHONG_DEN', 'DA_HUY'], {
    message: 'Trạng thái không hợp lệ',
  })
  status!: string;
}
