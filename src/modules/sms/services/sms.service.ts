import { Injectable } from '@nestjs/common';
import { SmsEntity } from '../entities/sms.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ICreateSmsDTO } from '../dto/create.dto';

interface ISmsService {
  add(data: ICreateSmsDTO): Promise<SmsEntity>;
  delete(code: number): Promise<DeleteResult>;
}

@Injectable()
export class SmsService implements ISmsService {
  constructor(
    @InjectRepository(SmsEntity)
    private readonly smsRepo: Repository<SmsEntity>,
  ) {}

  delete(code: number): Promise<DeleteResult> {
    return this.smsRepo.delete({
      code: code,
    });
  }

  add(data: ICreateSmsDTO): Promise<SmsEntity> {
    const dataInserting = this.smsRepo.create(data);
    return this.smsRepo.save(dataInserting);
  }
}
