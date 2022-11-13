import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
