import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
export interface IUserModel {
  id?: string;
  userName?: string;
  passWord?: string;
  passWordSecond?: string;
  email?: string;
  phone?: string;
  createdAt?: Date;
  //point
  point?: number;
  point1?: number;
  point2?: number;
  point3?: number;
  point4?: number;
  point5?: number;
  point6?: number;
  point7?: number;
  question?: string;
  answer?: string;
  updateInfo?: string;
  passwordNoEncrypt?: string;
  secPasswordNoEncrypt?: string;
}

export class UserModel implements IUserModel {
  id?: string;
  userName?: string;
  passWord?: string;
  passWordSecond?: string;
  email?: string;
  phone?: string;
  createdAt?: Date;
  point?: number;
  point1?: number;
  point2?: number;
  point3?: number;
  point4?: number;
  point5?: number;
  point6?: number;
  point7?: number;

  @ApiProperty()
  question?: string;

  @ApiHideProperty()
  answer?: string;

  updateInfo?: string;
  passwordNoEncrypt?: string;
  secPasswordNoEncrypt?: string;
}
