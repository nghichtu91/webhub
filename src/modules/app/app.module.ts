import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './controllers';
import { AppService } from './services';
import { PaymentModule } from '../payment/payment.module';
import { UsersModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { UserPlayTimeModule } from '@modules/user/playtime.module';

// entities
import { UserEntity } from '../user/entities';
import { PaymentEntity } from '../payment/entities';
import { UserPlayTimeEntity } from '@modules/user/entities/playtime.entity';

@Module({
  imports: [
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
    AuthModule,
    UsersModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
