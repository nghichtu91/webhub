import { Logger } from '@nestjs/common';

import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

import { PaymentEntity } from '../entities/payment.entity';
import { TelegramService } from 'nestjs-telegram';
import { BOT_CHAT_ID } from '@config';

@EventSubscriber()
export class PaymentSubscriber
  implements EntitySubscriberInterface<PaymentEntity>
{
  private readonly logger: Logger = new Logger(PaymentSubscriber.name);
  constructor(
    dataSource: DataSource,
    private readonly telegramSevice: TelegramService,
  ) {
    dataSource.subscribers.push(this);
  }
  listenTo(): typeof PaymentEntity {
    return PaymentEntity;
  }

  beforeInsert(event: InsertEvent<PaymentEntity>): void {
    this.logger.log(`BEFORE PAYMENT INSERTED ${JSON.stringify(event.entity)}`);
  }

  afterInsert(event: InsertEvent<PaymentEntity>): void {
    const entity = event.entity;
    if (entity.status === 1) {
      const logMessage = `[${event.entity.gateway}] Tài khoản ${entity.userName} nạp ${entity.cardValue} vnd, nhận được ${entity.coin} xu!`;
      this.telegramSevice.sendMessage({
        text: logMessage,
        chat_id: BOT_CHAT_ID,
      });
      this.logger.log(logMessage);
    }
  }
}
