import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@user/user.module';
import { SessionSerializer } from './session.serializer';
import { JwtAuthController } from './controllers';
import { AuthService } from './services';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'jx1porttal',
      signOptions: {
        algorithm: 'HS256',
      },
    }),
  ],
  controllers: [JwtAuthController],
  providers: [AuthService, SessionSerializer],
})
export class AuthModule {}
