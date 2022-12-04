import { PaymentModule } from '@modules/payment/payment.module';
import { UsersModule } from '@modules/user/user.module';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [forwardRef(() => UsersModule), forwardRef(() => PaymentModule)],
})
export class CommonModule {}
