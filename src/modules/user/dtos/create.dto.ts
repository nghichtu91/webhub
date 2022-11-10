import { IUserModel } from './user.model';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { IsUserAlreadyExist } from '../validators/IsUserAlreadyExist';
import { ApiProperty, ApiQuery } from '@nestjs/swagger';

export type ICreateUserDTO = Omit<IUserModel, 'createAt' | 'updateAt'>;

export enum UserRole {
  Admin = 'Admin',
  Moderator = 'Moderator',
  User = 'User',
}

export class CreateUserDTO implements ICreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  @ApiProperty({ description: 'Tài khoản đăng nhập vào game' })
  @IsUserAlreadyExist({
    message: 'Tài khoản $value đã được sử dụng.',
  })
  @Matches(/^[a-z0-9_-]{3,16}$/, {
    message: 'Tài khoản chỉ dùng số và ký tự.',
  })
  userName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @ApiProperty({ description: 'Mật khẩu cấp 2' })
  passWordSecond: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @ApiProperty({ description: 'Mật khẩu vào game' })
  passWord: string;

  @IsOptional()
  @ApiProperty({ required: false })
  email?: string;

  @IsOptional()
  @ApiProperty()
  phone?: string;

  @IsOptional()
  @ApiProperty()
  question?: string;

  @IsOptional()
  @ApiProperty()
  answer?: string;
}
