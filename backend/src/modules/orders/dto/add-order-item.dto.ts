import { IsInt, Min, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddOrderItemDto {
  @ApiProperty({ description: 'ID món ăn', example: 1 })
  @IsInt()
  @Min(1)
  menu_item_id!: number;

  @ApiProperty({ description: 'Số lượng', example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiPropertyOptional({ description: 'Ghi chú', example: 'Ít cay' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
