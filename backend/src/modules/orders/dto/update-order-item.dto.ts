import { IsInt, Min, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderItemDto {
  @ApiPropertyOptional({ description: 'Số lượng mới', example: 3, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({ description: 'Ghi chú mới', example: 'Ít cay, thêm chanh' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
