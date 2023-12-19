import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { GiftcodeEntity } from './entities/giftcode.entity';
import { GiftcodeLogEnity } from './entities/giftcodelog.entity';
import { GiftcodeControler } from './controllers/giftcode.controller';
import { GiftcodeService } from './services/giftcode.service';

@Module({
    imports: [
        WinstonModule.forRoot({
            transports: [
              new winston.transports.File({
                filename: 'giftcode.log',
              }),
            ],
          }),
          TypeOrmModule.forFeature([GiftcodeEntity, GiftcodeLogEnity]),
    ],
    providers: [GiftcodeService],
    controllers: [GiftcodeControler]
})
export class GiftcodeModule {}
