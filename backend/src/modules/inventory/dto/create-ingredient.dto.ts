import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, MaxLength } from 'class-validator';

export class CreateIngredientDto {
  @ApiProperty({ description: 'Mã nguyên liệu', example: 'NL001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  ingredientCode!: string;

  @ApiProperty({ description: 'Tên nguyên liệu', example: 'Thịt bò' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiProperty({ description: 'Đơn vị tính', example: 'kg' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  unit!: string;

  @ApiPropertyOptional({ description: 'Tồn kho hiện tại', example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentStock?: number;

  @ApiPropertyOptional({ description: 'Tồn kho tối thiểu', example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minStock?: number;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  note?: string;
}