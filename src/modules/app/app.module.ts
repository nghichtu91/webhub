import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessControlModule } from 'nest-access-control';
import { AppController } from './controllers';
import { AppService } from './services';
import { PaymentModule } from '../payment/payment.module';
import { UsersModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { roles } from '@config';
import { PassportModule } from '@nestjs/passport';
// entities
import { UserEntity } from '../user/entities';
import { PaymentEntity } from '../payment/entities';
import { UserPlayTimeEntity } from '@modules/user/entities/playtime.entity';
import { ThrottlerModule } from '@nestjs/throttler';
// import * as TypeOrmConfig from '@config/databases/ormconfig';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: '103.92.24.185',
      username: 'sa',
      password: 'Long@Huy@JX1@bbz',
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
      logging: true,
      logger: 'simple-console',
      options: {
        encrypt: false,
      },
      entities: [UserEntity, PaymentEntity, UserPlayTimeEntity],
      database: 'account_tong',
    }),
    PassportModule,
    AccessControlModule.forRoles(roles),
    AuthModule,
    UsersModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
