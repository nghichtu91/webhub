import { UsersModule } from '@modules/user/user.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './controllers';
import { PaymentEntity } from './entities';
import { PaymentService } from './services';
import { PaymentSubscriber } from './subscribers';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity]), HttpModule, UsersModule],
  providers: [PaymentService, PaymentSubscriber],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
