import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Mật khẩu mới (tối thiểu 8 ký tự)', example: 'NewPass@123', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  new_password!: string;
}
