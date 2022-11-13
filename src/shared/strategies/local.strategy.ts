import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-local';

import { AuthService } from '@auth/services';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(_username: string, _password: string) {
    const user = await this.authService.validateUser(_username, _password);
    if (!user) {
      throw new UnauthorizedException();
    }
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { id, userName, ..._ } = user; // ignore other fields in session stored
    return { id, userName };
  }
}
