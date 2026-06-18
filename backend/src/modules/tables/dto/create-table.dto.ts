import { IsString, IsNotEmpty, MaxLength, IsInt, Min, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const TABLE_STATUSES = ['TRONG', 'DA_DAT', 'CO_KHACH', 'DANG_DON', 'BAO_TRI'];

export class CreateTableDto {
  @ApiProperty({ description: 'ID khu vực', example: 1 })
  @IsInt()
  @Min(1)
  table_area_id!: number;

  @ApiProperty({ description: 'Tên bàn', example: 'B01', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string;

  @ApiProperty({ description: 'Sức chứa', example: 4, default: 4, minimum: 1 })
  @IsInt()
  @Min(1)
  capacity!: number;

  @ApiPropertyOptional({ description: 'Trạng thái', enum: TABLE_STATUSES, default: 'TRONG' })
  @IsOptional()
  @IsString()
  @IsIn(TABLE_STATUSES)
  status?: string;
}
