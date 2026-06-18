import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const MENU_ITEM_STATUSES = ['DANG_BAN', 'HET_MON', 'NGUNG_BAN'];

export class UpdateMenuItemStatusDto {
  @ApiProperty({ description: 'Trạng thái mới', enum: MENU_ITEM_STATUSES, example: 'HET_MON' })
  @IsString()
  @IsNotEmpty()
  @IsIn(MENU_ITEM_STATUSES)
  status!: string;
}
