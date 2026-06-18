import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserStatusDto {
  @ApiProperty({ description: 'Trạng thái mới', example: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'] })
  @IsString()
  @IsNotEmpty()
  @IsIn(['ACTIVE', 'INACTIVE'])
  status!: string;
}
