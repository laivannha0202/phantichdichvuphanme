import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const TABLE_STATUSES = ['TRONG', 'DA_DAT', 'CO_KHACH', 'DANG_DON', 'BAO_TRI'];

export class UpdateTableStatusDto {
  @ApiProperty({ description: 'Trạng thái mới', enum: TABLE_STATUSES, example: 'CO_KHACH' })
  @IsString()
  @IsNotEmpty()
  @IsIn(TABLE_STATUSES)
  status!: string;
}
