import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return result;
  }

  handleRequest(err: any, user: any, info: Error) {
    if (!!info && `${info?.message}` === 'No auth token') {
      throw err || new HttpException(`${info}`, HttpStatus.UNAUTHORIZED);
    }

    if (!user) return { roles: ['GUEST'] };
    else return user;
  }
}
