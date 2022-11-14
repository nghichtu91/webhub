import { IPaymentModel } from './payment.model';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsNumber,
} from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { CardTypes } from '@config';

export type ICreatePaymentDTO = Pick<
  IPaymentModel,
  | 'cardType'
  | 'cardSeri'
  | 'cardValue'
  | 'comment'
  | 'cardPin'
  | 'transactionId'
  | 'transaction'
  | 'transactionCode'
  | 'userName'
  | 'gateway'
>;

export class CreatePaymentDTO implements ICreatePaymentDTO {
  @ApiProperty({ enum: CardTypes })
  cardType?: CardTypes;

  @ApiProperty()
  cardPin?: string;

  @ApiProperty()
  cardSeri?: string;

  @IsNumber()
  @ApiProperty()
  cardValue?: number;

  @ApiHideProperty()
  transactionId?: string;
  @ApiHideProperty()
  transaction?: string;
  @ApiHideProperty()
  transactionCode?: string;
  @ApiHideProperty()
  userName: string;
  @ApiHideProperty()
  gateway?: string;
}
