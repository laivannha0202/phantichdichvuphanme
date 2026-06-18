import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({ description: 'ID vai trò mới', example: 3 })
  @IsInt()
  @IsNotEmpty()
  role_id!: number;
}
