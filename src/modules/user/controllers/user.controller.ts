import { Controller, Get, Res } from '@nestjs/common';
import { UserService } from '../services';
import { Response } from 'express';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/user')
  async profile(@Res() res: Response) {
    try {
      // const data: CreateUserDTO = {
      //   userName: 'thanhss2',
      //   passsWord: '123456789',
      //   email: 'thanh@gmail.com',
      // };
      // const t = await this.userService.create(data);
      // const t = await this.userService.findByUserName('thanhss');
      // console.log(t.userName);
    } catch (error) {
      console.log(error);
    }
    return res.render('login', {
      // messages: 'xin chào nhật thành',
    });
  }
}
