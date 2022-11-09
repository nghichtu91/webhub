export interface IUserModel {
  id?: string;
  userName: string;
  passWord: string;
  passWordSecond: string;
  email?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
  //point
  point?: number;
  point1?: number;
  point2?: number;
  point3?: number;
  point4?: number;
  point5?: number;
  point6?: number;
  point7?: number;
}

export class UserModel implements IUserModel {
  id?: string;
  userName: string;
  passWord: string;
  passWordSecond: string;
  email?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
  point?: number;
  point1?: number;
  point2?: number;
  point3?: number;
  point4?: number;
  point5?: number;
  point6?: number;
  point7?: number;
}
