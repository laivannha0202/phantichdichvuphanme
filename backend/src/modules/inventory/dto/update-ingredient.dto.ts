import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, MaxLength, IsIn } from 'class-validator';

export class UpdateIngredientDto {
  @ApiPropertyOptional({ description: 'Tên nguyên liệu' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({ description: 'Đơn vị tính' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  unit?: string;

  @ApiPropertyOptional({ description: 'Tồn kho tối thiểu' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minStock?: number;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ description: 'Trạng thái', enum: ['CON_HANG', 'SAP_HET', 'HET_HANG', 'NGUNG_SU_DUNG'] })
  @IsOptional()
  @IsString()
  @IsIn(['CON_HANG', 'SAP_HET', 'HET_HANG', 'NGUNG_SU_DUNG'])
  status?: string;
}