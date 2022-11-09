import { Logger } from '@nestjs/common';

import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

import { UserEntity } from '../entities/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  private readonly logger: Logger = new Logger(UserSubscriber.name);
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }
  listenTo(): typeof UserEntity {
    return UserEntity;
  }

  beforeInsert(event: InsertEvent<UserEntity>): void {
    this.logger.log(`BEFORE USER INSERTED ${JSON.stringify(event.entity)}`);
  }

  afterInsert(event: InsertEvent<UserEntity>): void {
    this.logger.log(`AFTER USER INSERTED ${JSON.stringify(event.entity)}`);
  }
}
