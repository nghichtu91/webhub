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
import { ApiProperty } from '@nestjs/swagger';
import { CardTypes } from '@config';

export type ICreatePaymentDTO = Pick<
  IPaymentModel,
  'cardType' | 'cardSeri' | 'cardValue' | 'comment' | 'cardPin'
>;

export class CreatePaymentDTO implements ICreatePaymentDTO {
  // @IsNumber()
  // @ApiProperty()
  // coin: number;

  @ApiProperty({ enum: CardTypes })
  cardType?: CardTypes;

  @IsString()
  @ApiProperty()
  cardPin?: string;

  @IsString()
  @ApiProperty()
  cardSeri?: string;

  @IsNumber()
  @ApiProperty()
  cardValue?: number;
}
