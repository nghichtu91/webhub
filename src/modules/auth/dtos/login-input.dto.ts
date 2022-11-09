import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginInputDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    default: 'thanhss2',
  })
  username: string;

  @ApiProperty({
    default: '123456789',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
