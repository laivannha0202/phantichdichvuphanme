import { IsString, IsIn, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const ORDER_STATUSES = ['DANG_CHUAN_BI', 'DANG_PHUC_VU', 'HOAN_THANH', 'DA_HUY'];

export class UpdateOrderStatusDto {
  @ApiPropertyOptional({
    description: 'Trạng thái mới',
    enum: ORDER_STATUSES,
    example: 'DANG_PHUC_VU',
  })
  @IsString()
  @IsIn(ORDER_STATUSES)
  status!: string;

  @ApiPropertyOptional({ description: 'Ghi chú', example: 'Khách yêu cầu thêm nước' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}
