import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@user/user.module';
import { SessionSerializer } from './session.serializer';
import { JwtAuthController } from './controllers';
import { AuthService } from './services';
import { JwtRefreshStrategy, JwtAuthStrategy, LocalStrategy } from '@shared';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'jx1porttal',
      signOptions: {
        algorithm: 'HS256',
      },
    }),
  ],
  controllers: [JwtAuthController],
  providers: [
    AuthService,
    JwtRefreshStrategy,
    JwtAuthStrategy,
    LocalStrategy,
    SessionSerializer,
  ],
})
export class AuthModule {}
