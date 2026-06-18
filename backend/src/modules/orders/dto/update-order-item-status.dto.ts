import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const ORDER_ITEM_STATUSES = [
  'CHO_CHE_BIEN',
  'DANG_CHE_BIEN',
  'HOAN_THANH',
  'DA_PHUC_VU',
  'DA_HUY',
];

export class UpdateOrderItemStatusDto {
  @ApiProperty({
    description: 'Trạng thái mới',
    enum: ORDER_ITEM_STATUSES,
    example: 'DANG_CHE_BIEN',
  })
  @IsString()
  @IsIn(ORDER_ITEM_STATUSES)
  status!: string;
}
