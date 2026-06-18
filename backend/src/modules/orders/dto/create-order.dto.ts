import { IsInt, Min, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ description: 'ID bàn', example: 1 })
  @IsInt()
  @Min(1)
  table_id!: number;

  @ApiPropertyOptional({ description: 'Ghi chú', example: 'Khách yêu cầu ít cay' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}
