import { Injectable } from '@nestjs/common';
import { SmsEntity } from '../entities/sms.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateDTO, ICreateSmsDTO } from '../dto/create.dto';

interface ISmsService {
  add(data: ICreateSmsDTO): Promise<SmsEntity>;
  delete(id: number): Promise<DeleteResult>;
}

@Injectable()
export class SmsService implements ISmsService {
  constructor(
    @InjectRepository(SmsEntity)
    private readonly smsRepo: Repository<SmsEntity>,
  ) {}

  delete(id: number): Promise<DeleteResult> {
    return this.smsRepo.delete({
      id: id,
    });
  }

  add(data: CreateDTO): Promise<SmsEntity> {
    const dataInserting = this.smsRepo.create(data);
    return this.smsRepo.save(dataInserting);
  }

  async findById(id: number) {
    const entities = await this.smsRepo.find({
      where: {
        id: id,
      },
    });
    return entities[0];
  }
}
