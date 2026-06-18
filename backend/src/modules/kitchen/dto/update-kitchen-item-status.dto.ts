import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class UpdateKitchenItemStatusDto {
  @ApiProperty({
    description: 'Trạng thái mới',
    example: 'DANG_CHE_BIEN',
    enum: ['DANG_CHE_BIEN', 'HOAN_THANH'],
  })
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  @IsString()
  @IsIn(['DANG_CHE_BIEN', 'HOAN_THANH'], {
    message: 'Trạng thái chỉ chấp nhận: DANG_CHE_BIEN hoặc HOAN_THANH',
  })
  status!: string;
}
