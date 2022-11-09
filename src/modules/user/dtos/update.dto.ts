import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { IUserModel } from './user.model';
export type IUpdateUserDTO = Pick<IUserModel, 'phone'>;

export class UpdateUserDTO implements IUpdateUserDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Cập nhật số điện thoại.',
  })
  phone?: string;
}
