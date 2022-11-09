import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// import { jwtRefreshTokenExpiration, jwtTokenExpiration } from '@config';
import { CreateUserDTO } from '@modules/user/dtos';
import { UserEntity } from '@modules/user/entities';
import { IReqUser, ReqUser } from '@shared';
import { UserService } from '@user/services';
import parseDuration from 'parse-duration';
import { LoginInputDTO } from '../dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<UserEntity> {
    const users = await this.userService.findByUserName(username);
    const user = users[0];
    console.log(password);
    if (!!user && user.comparePassword(password)) {
      return user;
    }
    return null;
  }

  async jwtLogin(data: LoginInputDTO) {
    const { username, password } = data;
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    } else return this.getAuthToken(user);
  }

  // async jwtRefresh(data: IReqUser) {
  //   const user = await this.userService.findByUserName(data.username);
  //   if (!user) {
  //     throw new UnauthorizedException();
  //   } else return this.getAuthToken(user);
  // }

  async jwtRegister(data: CreateUserDTO) {
    const user = await this.userService.create(data);
    return this.getAuthToken(user);
  }

  getAuthToken(user: Partial<UserEntity>) {
    const subject = { id: user.id };

    const payload = {
      id: user.id,
      username: user.userName,
      roles: [],
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: parseDuration('100000', 's'),
      }),
      refreshToken: this.jwtService.sign(subject, {
        expiresIn: parseDuration('100000', 's'),
      }),
    }; // authToken
  }
}
