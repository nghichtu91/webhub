import { StatusPayment } from '@config';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export type IPaymentCallbackDTO = {
  status: StatusPayment;
  message?: string;
  amount?: number;
  code?: string;
  serial?: string;
  request_id?: string;
  telco?: string;
};

export interface IPaymentResponse {
  trans_id?: string;
  request_id?: string;
  amount: number;
  value: number;
  declared_value: number;
  telco: 'VIETTEL';
  serial: string;
  code: string;
  status: number;
  message?: string;
}

export class PaymentCallbackDTO implements IPaymentCallbackDTO {
  @IsOptional()
  @ApiProperty()
  status: StatusPayment;

  @ApiProperty()
  @IsOptional()
  message?: string;

  @ApiProperty()
  @IsOptional()
  amount?: number;

  @ApiProperty()
  @IsOptional()
  code?: string;

  @ApiProperty()
  @IsOptional()
  serial?: string;

  @ApiProperty()
  @IsOptional()
  request_id?: string;

  @ApiProperty()
  @IsOptional()
  telco?: string;
}
