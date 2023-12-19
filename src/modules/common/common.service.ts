import { PaymentService } from '@modules/payment/services';
import { SmsService } from '@modules/sms/services';
import { UserService } from '@modules/user/services';
import { GiftcodeService } from '@modules/giftcode/services/giftcode.service';

import { forwardRef, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => PaymentService))
    private paymentService: PaymentService,

    @Inject(forwardRef(() => SmsService))
    private smsService: SmsService,
    
    @Inject(forwardRef(() => GiftcodeService))
    private giftcodeService: GiftcodeService,

  ) {}
}
