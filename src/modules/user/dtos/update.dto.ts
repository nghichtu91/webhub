import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { IUserModel } from './user.model';
export type IUpdateUserDTO = Pick<
  IUserModel,
  'phone' | 'point' | 'answer' | 'email' | 'point2' | 'question'
>;

export class UpdateUserDTO implements IUpdateUserDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
  })
  phone?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
  })
  point?: number;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  email?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
  })
  point2?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Câu hỏi bí mật.',
  })
  question?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Câu trả lời.',
  })
  answer?: string;
}
