import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './controllers';
import { AppService } from './services';
import { UsersModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { UserEntity } from '../user/entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: '103.92.24.185',
      username: 'sa',
      password: 'Long@Huy@JX1@bbz',
      synchronize: false,
      options: { encrypt: false },
      entities: [UserEntity],
      database: 'account_tong',
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
