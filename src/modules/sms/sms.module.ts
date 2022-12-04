import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsController } from './controllers';
import { SmsEntity } from './entities/sms.entity';
import { SmsService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([SmsEntity])],
  providers: [SmsService],
  controllers: [SmsController],
  exports: [SmsService],
})
export class SmsModule {}
