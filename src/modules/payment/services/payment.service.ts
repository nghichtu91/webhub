import { GATEWAY_URL, PaymentStatus } from '@config';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { IPaymentResponse, IPaymentResponseB, PaymentModel } from '../dtos';
import { CreatePaymentDTO } from '../dtos/create.dto';
import { IPaymentUpdateDTO } from '../dtos/update.dto';
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

  checkCardMobi(data: any): Observable<AxiosResponse<IPaymentResponseB>> {
    return this.httpService.post<IPaymentResponseB>(GATEWAY_URL, data);
  }

  instert(data: CreatePaymentDTO) {
    const creating = this.paymentRepo.create(data);
    return this.paymentRepo.save(creating);
  }

  async getUserNameByTransId(trans_id: string): Promise<PaymentEntity> {
    const findUsers = await this.paymentRepo.find({
      where: {
        transactionCode: trans_id,
        status: parseInt(PaymentStatus.PENDING),
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

  update(trans_id: string, data: IPaymentUpdateDTO) {
    const createUpdate = this.paymentRepo.create(data);
    return this.paymentRepo.update(
      {
        transactionCode: trans_id,
      },
      createUpdate,
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
      SELECT ROW_NUMBER() OVER(ORDER BY id DESC) AS Numero,
             * FROM payment_card_log WHERE username =@2 AND (cardtype != 'ATM' OR cardtype !='atm')
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

  async staticByYear(year: number) {
    const sql = `SELECT DATEPART(Month, verifytime) label, SUM(cardvalue) as value FROM payment_card_log 
    where ([status] = 1 OR [status] = 2) AND YEAR([verifytime]) = @0
    GROUP BY DATEPART(Month, verifytime) ORDER BY label`;
    const t = await this.paymentRepo.query(sql, [year]);
    return t;
  }

  async staticByFormTo(form: string, to: string) {
    const sql = `SELECT cast(verifytime as date) AS date  , cardtype as type, SUM(cardvalue) as value FROM payment_card_log
    WHERE ([status] = 1 OR [status] = 2) AND verifytime >= @0 AND verifytime < @1
    GROUP BY  [cardtype], cast(verifytime as date)
    ORDER BY [cardtype]`;
    const t = await this.paymentRepo.query(sql, [form, to]);
    return t;
  }

  async count() {
    return this.paymentRepo.count();
  }

  /**
   *
   * @returns {Promise<number>}
   */
  async sumMomey(): Promise<number> {
    const { total = 0 } = await this.paymentRepo
      .createQueryBuilder('p')
      .select('Sum(p.cardvalue)', 'total')
      .where('p.status = 1 OR p.status = 2')
      .getRawOne<{ total: number }>();
    return total;
  }

  async sumMoneyToday(): Promise<number> {
    const { total = 0 } = await this.paymentRepo
      .createQueryBuilder('p')
      .select('Sum(p.cardvalue)', 'total')
      .where('(p.status = 1 OR p.status = 2)')
      .andWhere('cast(p.verifytime as date) = cast(getdate() as date)')
      .getRawOne<{ total: number }>();
    return total || 0;
  }
}
