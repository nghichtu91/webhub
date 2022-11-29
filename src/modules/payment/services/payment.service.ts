import { GATEWAY_URL, PaymentStatus } from '@config';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { IPaymentResponse, PaymentModel } from '../dtos';
import { CreatePaymentDTO } from '../dtos/create.dto';
import { PaymentEntity } from '../entities';

interface IPaymentService {
  checkCardMobi?: any;
}

@Injectable()
export class PaymentService implements IPaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepo: Repository<PaymentEntity>,
    private readonly httpService: HttpService,
  ) {}

  checkCardMobi(data: any): Observable<AxiosResponse<IPaymentResponse>> {
    return this.httpService.post<IPaymentResponse>(GATEWAY_URL, data);
  }

  create(data: CreatePaymentDTO) {
    const creating = this.paymentRepo.create(data);
    return this.paymentRepo.save(creating);
  }

  async getUserNameByTransId(trans_id: string): Promise<PaymentEntity> {
    const findUsers = await this.paymentRepo.find({
      where: {
        transactionCode: trans_id,
        status: PaymentStatus.PENDING,
      },
    });
    return findUsers[0];
  }

  updateStatus(trans_id: string, status: number, message?: string) {
    return this.paymentRepo.update(
      {
        transactionCode: trans_id,
      },
      {
        status: status,
        comment: message,
      },
    );
  }

  async getTotalByUserName(userName: string) {
    return await this.paymentRepo.count({
      where: {
        userName: userName,
      },
    });
  }

  async getPaymentsByUsername(
    userName: string,
    paged = 1,
    pageSize = 12,
  ): Promise<PaymentEntity[]> {
    const sql = `SELECT coin as coin, id, status, cardpin as cardPin, gateway_api as gateway, cardtype as cardType, content as comment, cardvalue as cardValue, cardseri as cardSeri FROM (
      SELECT ROW_NUMBER() OVER(ORDER BY id) AS Numero,
             * FROM payment_card_log WHERE username =@2
        ) AS TBL
WHERE Numero BETWEEN ((@0 - 1) * @1 + 1) AND (@0 * @1) 
ORDER BY id DESC`;

    return this.paymentRepo
      .query(sql, [paged, pageSize, userName])
      .then((s: PaymentModel[]) =>
        s.map((c) => {
          return this.paymentRepo.create(c);
        }),
      );
  }
}
