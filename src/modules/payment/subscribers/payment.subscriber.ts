import { Logger } from '@nestjs/common';

import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

import { PaymentEntity } from '../entities/payment.entity';

@EventSubscriber()
export class PaymentSubscriber
  implements EntitySubscriberInterface<PaymentEntity>
{
  private readonly logger: Logger = new Logger(PaymentSubscriber.name);
  constructor(dataSource: DataSource) {
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
      this.logger.log(
        `[${event.entity.gateway}] Tài khoản ${entity.userName} nạp ${entity.cardValue} vnd, nhận được ${entity.coin} xu!`,
      );
    }
    this.logger.log(`AFTER PAYMENT INSERTED ${JSON.stringify(event.entity)}`);
  }
}
