import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentDTO } from '../dtos/create.dto';
import { PaymentEntity } from '../entities';

interface IPaymentService {
  checkCard?: any;
}

@Injectable()
export class PaymentService implements IPaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepo: Repository<PaymentEntity>,
  ) {}

  checkCard() {
    console.log('22');
  }

  create(data: CreatePaymentDTO) {
    const creating = this.paymentRepo.create(data);
    return this.paymentRepo.save(creating);
  }
}
